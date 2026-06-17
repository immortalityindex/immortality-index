const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    )
  });
}

const db = admin.firestore();

const obstacles = [
  // ── GENETICS TRACK ──────────────────────────────────────────────────────────
  {
    id: 'genetics_1-1', track: 'genetics', key: '1.1 Proof of Concept',
    name: 'In Vivo Epigenetic Reprogramming Proof-of-Concept',
    progress: 100, status: 'Completed',
    article_title: 'Life Biosciences ER-100 Clinical Trial Activation',
    article_url: 'https://lifebiosciences.com', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_1-2', track: 'genetics', key: '1.2 Senescent Clearance',
    name: 'Systemic Senescent Clearance Engine (CAR-T/Senolytics)',
    progress: 45, status: 'Active',
    article_title: 'Baseline Research Monograph', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_1-3', track: 'genetics', key: '1.3 Full-Body Delivery',
    name: 'Full-Body Vascular Delivery Network (AAV/LNP)',
    progress: 27, status: 'Active',
    article_title: 'Baseline Research Monograph', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_1-4', track: 'genetics', key: '1.4 Telomere Maintenance',
    name: 'Stem Cell Telomere Maintenance Switch',
    progress: 10, status: 'Active',
    article_title: 'Baseline Research Monograph', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_2-1', track: 'genetics', key: '2.1 Chromatin Preparation',
    name: 'Heterochromatin Pioneer Decoupling',
    progress: 52, status: 'Active',
    article_title: 'Baseline Research Monograph', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_2-2', track: 'genetics', key: '2.2 Absolute Precision',
    name: 'Sub-Letter Nucleotide Absolute Precision (Prime/Base Editing)',
    progress: 65, status: 'Active',
    article_title: 'Baseline Research Monograph', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_3-1', track: 'genetics', key: '3.1 Membraneless Vaults',
    name: 'Synthetic Membraneless Nuclear Enclave Formation (LLPS)',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_3-2', track: 'genetics', key: '3.2 Cryptographic Logic',
    name: '12-Hour Cryptographic Logic Gate Wiring (AND/NAND)',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_3-3', track: 'genetics', key: '3.3 Protected Identity',
    name: 'Protected Corruptible Identity Tag Binding',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_4-1', track: 'genetics', key: '4.1 Tunneling Nanotubes',
    name: 'Intercellular Tunneling Nanotube Synthesis',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_4-2', track: 'genetics', key: '4.2 P2P Re-Flashing',
    name: 'Kinship Authentication & Direct P2P Re-Flashing',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_4-3', track: 'genetics', key: '4.3 Homing Matrix',
    name: 'Homing Matrix Stem Cell Routing',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'genetics_5-1', track: 'genetics', key: '5.1 Integration Boss',
    name: 'Global Megabase Chromosomal Integration',
    progress: 0, status: 'Boss Hurdle',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },

  // ── NANOTECH TRACK ──────────────────────────────────────────────────────────
  {
    id: 'nanotech_1-1', track: 'nanotech', key: '1.1 Propulsion',
    name: 'Remote Mechanical Micro-Propulsion',
    progress: 100, status: 'Completed',
    article_title: 'Magneto-Acoustic Wave-Guiding Standardization',
    article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_1-2', track: 'nanotech', key: '1.2 Processing',
    name: 'Sub-10 Attojoule Reversible Neuromorphic Processing',
    progress: 22, status: 'Active',
    article_title: 'Baseline Research Monograph', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_1-3', track: 'nanotech', key: '1.3 Acoustic Mesh',
    name: 'Low-Frequency Acoustic Wave-Guiding Mesh',
    progress: 30, status: 'Active',
    article_title: 'Baseline Research Monograph', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_2-1', track: 'nanotech', key: '2.1 DNA Molds',
    name: 'Scaffolded DNA Origami Assembly Molds',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_2-2', track: 'nanotech', key: '2.2 Molecular Assembly',
    name: 'True Digital-to-Physical Molecular Assembly (APM)',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_2-3', track: 'nanotech', key: '2.3 Hardened Vaults',
    name: 'Microscopic Radiation-Hardened Vault Hulls',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_3-1', track: 'nanotech', key: '3.1 Scar Debridement',
    name: 'Selective Enzyme Scar-Tissue Debridement',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_3-2', track: 'nanotech', key: '3.2 Floor Laying',
    name: 'Molecular Extracellular Floor Laying',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_3-3', track: 'nanotech', key: '3.3 Code Flashing',
    name: 'Near-Field Direct Code Flashing (P2P)',
    progress: 0, status: 'Active',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'nanotech_4-1', track: 'nanotech', key: '4.1 Integration Boss',
    name: 'Mass Swarm Cohesion Integration',
    progress: 0, status: 'Boss Hurdle',
    article_title: '', article_url: '', ai_locked: false,
    last_scanned: null, last_updated: admin.firestore.FieldValue.serverTimestamp()
  }
];

module.exports = async function handler(req, res) {
  // Protect with a seed secret so this can't be called accidentally
  const secret = req.query.secret || req.headers['x-seed-secret'];
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized. Provide ?secret=SEED_SECRET' });
  }

  try {
    const batch = db.batch();
    for (const obstacle of obstacles) {
      const { id, ...data } = obstacle;
      const ref = db.collection('obstacles').doc(id);
      batch.set(ref, data, { merge: false });
    }
    await batch.commit();
    return res.status(200).json({
      success: true,
      seeded: obstacles.length,
      message: 'Firestore seeded successfully'
    });
  } catch (err) {
    console.error('Seed error:', err);
    return res.status(500).json({ error: err.message });
  }
};
