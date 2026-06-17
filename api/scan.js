const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ── Firebase Admin init ──────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    )
  });
}
const db = admin.firestore();

// ── Gemini init ──────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// ── Helper: sleep ────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Helper: ask Gemini to assess one obstacle ────────────────────────────────
async function assessObstacle(obstacle) {
  const prompt = `You are an expert in longevity research, synthetic biology, nanotechnology, and molecular medicine.

Assess the following research obstacle on the path to human immortality/extreme longevity:

Obstacle ID: ${obstacle.key}
Obstacle Name: ${obstacle.name}
Track: ${obstacle.track === 'genetics' ? 'Genetics / Epigenetic Reprogramming' : 'Nanotechnology / Medical Nanorobots'}
Current assessed progress: ${obstacle.progress}%
Current status: ${obstacle.status}

Based on your knowledge of published scientific literature up to your knowledge cutoff:
1. What is the actual state of research on this specific scientific challenge?
2. Has this obstacle been meaningfully addressed, partially addressed, or remains unsolved?
3. What is the most relevant peer-reviewed paper, preprint, or verified news article that directly addresses this obstacle?

Rules:
- ONLY increase progress if there is clear published evidence.
- Do NOT increase progress beyond the current value unless you can cite a specific source.
- If the obstacle is already at 100% and Completed, confirm or flag for review.
- Be conservative and scientific. Do not speculate.
- For article_url, only provide a URL if you are highly confident it is real and correct. Leave empty otherwise.

Respond ONLY with a single valid JSON object, no markdown, no code fences:
{
  "progress": <integer 0-100>,
  "status": "<Completed|Active|Boss Hurdle>",
  "article_title": "<specific paper or article title, or empty string>",
  "article_url": "<verified URL or empty string>",
  "reasoning": "<1-2 sentence scientific justification>"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

// ── Main handler ─────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // Allow Vercel cron (CRON_SECRET) or manual trigger with admin-secret header
  const cronAuth = req.headers['authorization'];
  const manualSecret = req.headers['x-admin-secret'] || req.query.secret;

  const validCron = process.env.CRON_SECRET && cronAuth === `Bearer ${process.env.CRON_SECRET}`;
  const validManual = process.env.ADMIN_SECRET && manualSecret === process.env.ADMIN_SECRET;

  if (!validCron && !validManual) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = [];
  const errors = [];

  try {
    // Load all obstacles from Firestore
    const snapshot = await db.collection('obstacles').get();
    const obstacles = [];
    snapshot.forEach((doc) => obstacles.push({ firestoreId: doc.id, ...doc.data() }));

    console.log(`[scan] Starting scan of ${obstacles.length} obstacles`);

    for (const obstacle of obstacles) {
      // Skip if admin has locked this obstacle from AI updates
      if (obstacle.ai_locked === true) {
        results.push({ id: obstacle.firestoreId, skipped: true, reason: 'ai_locked' });
        continue;
      }

      try {
        console.log(`[scan] Assessing: ${obstacle.name}`);
        const assessment = await assessObstacle(obstacle);

        // Only update if something meaningful changed
        const updates = {
          last_scanned: admin.firestore.FieldValue.serverTimestamp()
        };

        let changed = false;

        if (typeof assessment.progress === 'number' && assessment.progress !== obstacle.progress) {
          updates.progress = Math.min(100, Math.max(0, assessment.progress));
          changed = true;
        }

        if (assessment.status && assessment.status !== obstacle.status) {
          updates.status = assessment.status;
          changed = true;
        }

        if (assessment.article_title && assessment.article_title !== obstacle.article_title) {
          updates.article_title = assessment.article_title;
          changed = true;
        }

        if (assessment.article_url && assessment.article_url !== obstacle.article_url) {
          updates.article_url = assessment.article_url;
          changed = true;
        }

        if (changed) {
          updates.last_updated = admin.firestore.FieldValue.serverTimestamp();
          updates.ai_reasoning = assessment.reasoning || '';
        }

        await db.collection('obstacles').doc(obstacle.firestoreId).update(updates);

        results.push({
          id: obstacle.firestoreId,
          name: obstacle.name,
          changed,
          assessment: { progress: assessment.progress, status: assessment.status }
        });

      } catch (err) {
        console.error(`[scan] Error on ${obstacle.firestoreId}:`, err.message);
        errors.push({ id: obstacle.firestoreId, error: err.message });
      }

      // Rate-limit: Gemini free tier = 15 RPM → wait 5s between calls
      await sleep(5000);
    }

    console.log(`[scan] Complete. ${results.length} processed, ${errors.length} errors.`);

    return res.status(200).json({
      success: true,
      scanned: results.length,
      errors: errors.length,
      results,
      errors
    });

  } catch (err) {
    console.error('[scan] Fatal error:', err);
    return res.status(500).json({ error: err.message });
  }
};
