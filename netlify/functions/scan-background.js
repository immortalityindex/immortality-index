const admin = require('firebase-admin');
// Gemini 2.5 Flash via raw fetch — batch all milestones per obstacle (1 call/obstacle)

exports.handler = async (event, context) => {
  const manualSecret = event.headers['x-admin-secret'];
  const authHeader = event.headers['authorization'];
  const validManual = process.env.ADMIN_SECRET && manualSecret === process.env.ADMIN_SECRET;
  const validCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

  // Netlify scheduled invocations pass a body with next_run — allow these automatically
  let isScheduled = false;
  try { isScheduled = !!JSON.parse(event.body || '{}').next_run; } catch (_) {}

  let validToken = false;
  if (!validManual && !validCron && !isScheduled && authHeader?.startsWith('Bearer ')) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
      }
      await admin.auth().verifyIdToken(authHeader.replace('Bearer ', ''));
      validToken = true;
    } catch (_) {}
  }

  if (!validManual && !validCron && !isScheduled && !validToken) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  }
  const db = admin.firestore();
  const statusRef = db.collection('_meta').doc('scanStatus');
  const activeScanRef = db.collection('_meta').doc('activeScan');
  const now = new Date().toISOString();
  const scanId = now;

  const writeStatus = (data) => statusRef.set({ ...data, updatedAt: new Date().toISOString() });

  const isCancelled = async () => {
    const snap = await activeScanRef.get();
    if (!snap.exists) return false;
    return snap.data().scanId !== scanId;
  };

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    // gemini-2.5-flash has an actual free-tier quota (5 RPM); gemini-2.0-flash does not
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

    const snap = await db.collection('obstacles').get();
    const obstacles = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const totalMilestones = obstacles.reduce((s, o) => s + (o.milestones?.length || 0), 0);

    // Write scanId ONCE — cancels any previously running scans
    await activeScanRef.set({ scanId });

    await writeStatus({
      status: 'running',
      startedAt: now,
      currentObstacle: '',
      obstacleIndex: 0,
      totalObstacles: obstacles.length,
      milestonesScanned: 0,
      totalMilestones,
      milestonesUpdated: 0,
      obstaclesUpdated: 0,
      log: []
    });

    const delay = ms => new Promise(r => setTimeout(r, ms));
    let milestonesScanned = 0;
    let milestonesUpdated = 0;
    let obstaclesUpdated = 0;
    const log = [];

    for (let oi = 0; oi < obstacles.length; oi++) {
      const obs = obstacles[oi];
      const milestones = obs.milestones || [];

      // Skip obstacles where all milestones are already completed
      const toScan = milestones.filter(ms => !ms.completed);
      if (toScan.length === 0) {
        milestonesScanned += milestones.length;
        continue;
      }

      await writeStatus({
        status: 'running',
        startedAt: now,
        currentObstacle: obs.shortName || obs.name,
        obstacleIndex: oi + 1,
        totalObstacles: obstacles.length,
        milestonesScanned,
        totalMilestones,
        milestonesUpdated,
        obstaclesUpdated,
        log: log.slice(-20)
      });

      // Check cancellation before delay
      if (await isCancelled()) { console.log('Scan cancelled — newer scan detected'); return; }

      // 13s delay = 4.6 RPM, safely under the 5 RPM free-tier limit for gemini-2.5-flash
      await delay(13000);

      // Batch prompt: all unscanned milestones for this obstacle in one call
      const milestoneList = toScan
        .map((ms, i) => `${i + 1}. [${ms.id}] "${ms.name}"`)
        .join('\n');

      const prompt = `You are a scientific literature analyst specialising in longevity, genetics, and nanotechnology research.

Obstacle: "${obs.name}"

For EACH milestone below, assess whether it has been ACHIEVED in peer-reviewed scientific literature as of your knowledge cutoff.

ACHIEVED means: direct experimental evidence meeting the specific quantitative threshold described, published in a reputable journal.
NOT YET ACHIEVED means: theoretical goal, only partial evidence, preprints only, or incomplete clinical trials.

Milestones:
${milestoneList}

Respond ONLY as a JSON array — one object per milestone, in order:
[{"id": "...", "achieved": true/false, "confidence": "high"/"medium"/"low", "evidence": "One sentence citing specific paper/author/journal/year if achieved, otherwise null"}, ...]`;

      // Gemini call with retry on 429 (rate limit) and 503 (transient unavailable)
      // Note: Gemini uses the same 429 "quota" message for both RPM and RPD limits.
      // We retry all 429s — after 3×30s the RPM window resets and calls succeed.
      let geminiResp = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          geminiResp = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });
          if (geminiResp.ok) break;
          if ((geminiResp.status === 429 || geminiResp.status === 503) && attempt < 3) {
            console.log(`${geminiResp.status} on attempt ${attempt} for ${obs.id}, waiting 30s...`);
            await delay(30000);
            continue;
          }
          break;
        } catch (fetchErr) {
          if (attempt < 3) { await delay(5000); continue; }
        }
      }

      if (!geminiResp || !geminiResp.ok) {
        const errText = geminiResp ? (await geminiResp.text()).slice(0, 200) : 'fetch failed';
        log.push({ t: new Date().toISOString().slice(11,19), obs: obs.id, error: `Gemini ${geminiResp?.status}: ${errText}` });
        milestonesScanned += toScan.length;
        continue;
      }

      try {
        const geminiData = await geminiResp.json();
        const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          log.push({ t: new Date().toISOString().slice(11,19), obs: obs.id, error: 'No JSON array in response' });
          milestonesScanned += toScan.length;
          continue;
        }

        const results = JSON.parse(jsonMatch[0]);
        const updatedMilestones = [...milestones];
        let obsChanged = false;
        let obsConfirmed = 0;

        for (const result of results) {
          const idx = milestones.findIndex(ms => ms.id === result.id);
          if (idx === -1) continue;
          if (result.achieved && result.confidence !== 'low') {
            updatedMilestones[idx] = {
              ...milestones[idx],
              completed: true,
              evidence: result.evidence || '',
              confirmedAt: now,
              confidence: result.confidence
            };
            obsChanged = true;
            milestonesUpdated++;
            obsConfirmed++;
          }
          milestonesScanned++;
        }
        // Count any milestones not returned in the response
        milestonesScanned += Math.max(0, toScan.length - results.length);

        log.push({
          t: new Date().toISOString().slice(11,19),
          obs: obs.shortName || obs.id,
          scanned: toScan.length,
          confirmed: obsConfirmed
        });

        if (obsChanged) {
          await db.collection('obstacles').doc(obs.id).update({
            milestones: updatedMilestones,
            lastUpdated: now
          });
          obstaclesUpdated++;
        }
      } catch (parseErr) {
        log.push({ t: new Date().toISOString().slice(11,19), obs: obs.id, error: `Parse error: ${parseErr.message}` });
        milestonesScanned += toScan.length;
      }
    }

    await writeStatus({
      status: 'complete',
      startedAt: now,
      completedAt: new Date().toISOString(),
      totalObstacles: obstacles.length,
      milestonesScanned,
      totalMilestones,
      milestonesUpdated,
      obstaclesUpdated,
      log: log.slice(-50)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, scanned: obstacles.length, milestonesUpdated, obstaclesUpdated })
    };
  } catch (error) {
    await writeStatus({ status: 'error', error: error.message, startedAt: now });
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
