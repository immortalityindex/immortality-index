const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}
const db = admin.firestore();

exports.handler = async (event) => {
  const secret = event.queryStringParameters?.secret || event.headers['x-seed-secret'];
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const snap = await db.collection('obstacles').get();
  const toDelete = [];
  snap.forEach(doc => {
    const d = doc.data();
    // Legacy docs: no phase field, or no milestones array, or milestones is empty
    if (d.phase === undefined || !Array.isArray(d.milestones) || d.milestones.length === 0) {
      toDelete.push(doc.id);
    }
  });

  const batch = db.batch();
  toDelete.forEach(id => batch.delete(db.collection('obstacles').doc(id)));
  await batch.commit();

  return {
    statusCode: 200,
    body: JSON.stringify({ deleted: toDelete.length, ids: toDelete })
  };
};
