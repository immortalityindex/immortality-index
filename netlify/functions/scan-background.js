const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Auth: admin secret (manual trigger) OR Firebase ID token (from admin panel)
  const manualSecret = event.headers['x-admin-secret'];
  const authHeader = event.headers['authorization'];

  const validManual = process.env.ADMIN_SECRET && manualSecret === process.env.ADMIN_SECRET;
  const validCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

  // Also accept Firebase ID tokens from admin panel
  let validToken = false;
  if (!validManual && !validCron && authHeader?.startsWith('Bearer ')) {
    try {
      if (!admin.apps.length) {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({ credential: admin.credential.cert(sa) });
      }
      const token = authHeader.replace('Bearer ', '');
      await admin.auth().verifyIdToken(token);
      validToken = true;
    } catch (_) { /* invalid token */ }
  }

  if (!validManual && !validCron && !validToken) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    if (!admin.apps.length) {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(sa) });
    }
    const db = admin.firestore();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Fetch all obstacles
    const snap = await db.collection('obstacles').get();
    const obstacles = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const delay = ms => new Promise(r => setTimeout(r, ms));
    const now = new Date().toISOString();
    let updatedCount = 0;

    for (const obs of obstacles) {
      const milestones = obs.milestones || [];
      let obsChanged = false;
      const updatedMilestones = [...milestones];

      for (let i = 0; i < milestones.length; i++) {
        const ms = milestones[i];

        // Skip already-completed milestones (don't regress them)
        if (ms.completed) continue;

        const prompt = `You are a scientific literature analyst specialising in longevity, genetics, and nanotechnology research.

Obstacle: "${obs.name}"
Milestone ${i + 1}: "${ms.name}"

Your task: Determine whether this specific milestone has been ACHIEVED in peer-reviewed scientific literature as of your knowledge cutoff.

A milestone is ACHIEVED if:
- There is direct peer-reviewed experimental evidence (published in a reputable journal)
- The evidence demonstrates the specific quantitative threshold described
- The result has been independently replicated OR is from a major research institution

A milestone is NOT YET ACHIEVED if:
- It remains a theoretical goal
- Only partial/preliminary evidence exists below the described threshold
- Evidence exists only in preprints or conference abstracts
- The milestone requires future clinical trials not yet completed

Respond in this exact JSON format (no other text):
{"achieved": true/false, "confidence": "high"/"medium"/"low", "evidence": "One sentence citing specific paper, author, journal, year if achieved; otherwise null"}`;

        try {
          await delay(4000); // ~15 req/min rate limit compliance
          const result = await model.generateContent(prompt);
          const raw = result.response.text().trim();

          // Extract JSON from response
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (!jsonMatch) continue;

          const parsed = JSON.parse(jsonMatch[0]);

          if (parsed.achieved && parsed.confidence !== 'low') {
            updatedMilestones[i] = {
              ...ms,
              completed: true,
              evidence: parsed.evidence || '',
              confirmedAt: now,
              confidence: parsed.confidence
            };
            obsChanged = true;
          }
        } catch (err) {
          console.error(`Scan error for ${obs.id} ms${i}:`, err.message);
          // Continue with next milestone
        }
      }

      if (obsChanged) {
        await db.collection('obstacles').doc(obs.id).update({
          milestones: updatedMilestones,
          lastUpdated: now
        });
        updatedCount++;
      }

      // Brief pause between obstacles
      await delay(1000);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        scanned: obstacles.length,
        updated: updatedCount,
        timestamp: now
      })
    };
  } catch (error) {
    console.error('Scan failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
