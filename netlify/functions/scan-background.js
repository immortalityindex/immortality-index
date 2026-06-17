const admin = require('firebase-admin');
// Gemini via raw fetch (avoids HTTP-referrer API key restrictions)

exports.handler = async (event, context) => {
  const manualSecret = event.headers['x-admin-secret'];
  const authHeader = event.headers['authorization'];
  const validManual = process.env.ADMIN_SECRET && manualSecret === process.env.ADMIN_SECRET;
  const validCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

  let validToken = false;
  if (!validManual && !validCron && authHeader?.startsWith('Bearer ')) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
      }
      await admin.auth().verifyIdToken(authHeader.replace('Bearer ', ''));
      validToken = true;
    } catch (_) {}
  }

  if (!validManual && !validCron && !validToken) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  }
  const db = admin.firestore();
  const statusRef = db.collection('_meta').doc('scanStatus');
  const now = new Date().toISOString();

  const writeStatus = (data) => statusRef.set({ ...data, updatedAt: new Date().toISOString() });

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

    const snap = await db.collection('obstacles').get();
    const obstacles = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const totalMilestones = obstacles.reduce((s, o) => s + (o.milestones?.length || 0), 0);

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
      let obsChanged = false;
      const updatedMilestones = [...milestones];

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

      for (let i = 0; i < milestones.length; i++) {
        const ms = milestones[i];
        if (ms.completed) { milestonesScanned++; continue; }

        const prompt = `You are a scientific literature analyst specialising in longevity, genetics, and nanotechnology research.

Obstacle: "${obs.name}"
Milestone: "${ms.name}"

Has this specific milestone been ACHIEVED in peer-reviewed scientific literature as of your knowledge cutoff?

ACHIEVED means: direct experimental peer-reviewed evidence meeting the specific quantitative threshold described, published in a reputable journal.
NOT YET ACHIEVED means: theoretical goal, only partial evidence, only preprints, or clinical trials not yet completed.

Respond ONLY in this exact JSON format:
{"achieved": true/false, "confidence": "high"/"medium"/"low", "evidence": "One sentence citing specific paper, author, journal, year if achieved; otherwise null"}`;

        try {
          await delay(4000);
          const geminiResp = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Referer': 'https://immortality-index.netlify.app'
            },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });
          if (!geminiResp.ok) {
            const errText = await geminiResp.text();
            throw new Error(`Gemini ${geminiResp.status}: ${errText.slice(0,200)}`);
          }
          const geminiData = await geminiResp.json();
          const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (!jsonMatch) { milestonesScanned++; continue; }

          const parsed = JSON.parse(jsonMatch[0]);
          const entry = {
            t: new Date().toISOString().slice(11,19),
            obs: obs.shortName || obs.id,
            ms: ms.id,
            achieved: parsed.achieved,
            confidence: parsed.confidence,
            evidence: parsed.evidence
          };
          log.push(entry);

          if (parsed.achieved && parsed.confidence !== 'low') {
            updatedMilestones[i] = {
              ...ms,
              completed: true,
              evidence: parsed.evidence || '',
              confirmedAt: now,
              confidence: parsed.confidence
            };
            obsChanged = true;
            milestonesUpdated++;
          }
        } catch (err) {
          log.push({ t: new Date().toISOString().slice(11,19), obs: obs.id, ms: ms.id, error: err.message });
        }
        milestonesScanned++;
      }

      if (obsChanged) {
        await db.collection('obstacles').doc(obs.id).update({
          milestones: updatedMilestones,
          lastUpdated: now
        });
        obstaclesUpdated++;
      }

      await delay(500);
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
