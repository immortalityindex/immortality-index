/**
 * functions/patch-genetics.js — ONE-TIME USE, DELETE AFTER INVOCATION
 * No secret guard — open for single use, then remove from repo.
 */

const PROJECT_ID = 'immortality-index';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getToken(env) {
  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);
  const enc = obj => btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const header  = enc({ alg: 'RS256', typ: 'JWT' });
  const payload = enc({ iss: sa.client_email, sub: sa.client_email, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600, scope: 'https://www.googleapis.com/auth/datastore' });
  const unsigned = `${header}.${payload}`;
  const keyStr = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g,'').replace(/\n/g,'');
  const keyData = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${unsigned}.${sigB64}` });
  return (await r.json()).access_token;
}

function toV(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toV) } };
  if (typeof v === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k,x]) => [k, toV(x)])) } };
  return { stringValue: String(v) };
}

async function fsPatch(docPath, data, token) {
  const fields = Object.fromEntries(Object.entries(data).map(([k,v]) => [k, toV(v)]));
  const mask = Object.keys(fields).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const r = await fetch(`${FS_BASE}/${docPath}?${mask}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) });
  if (!r.ok) throw new Error(`${docPath} → ${r.status}: ${await r.text()}`);
}

async function fsUpsert(docPath, data, token) {
  const fields = Object.fromEntries(Object.entries(data).map(([k,v]) => [k, toV(v)]));
  const r = await fetch(`${FS_BASE}/${docPath}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) });
  if (!r.ok) throw new Error(`${docPath} → ${r.status}: ${await r.text()}`);
}

export async function onRequest(context) {
  const { env } = context;
  if (!env.FIREBASE_SERVICE_ACCOUNT) {
    return new Response(JSON.stringify({ error: 'FIREBASE_SERVICE_ACCOUNT not set on this Pages project' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const token = await getToken(env);
    const now = new Date().toISOString();
    const results = [];

    await fsUpsert('obstacles/g-4.4', { id: 'g-4.4', track: 'genetics', phase: 4, order: 13, phaseLabel: 'Phase 4 — Intercellular Communication Layer', name: 'Programmable Detection of Somatic Identity Failure', shortName: 'Somatic Identity Detection', isBoss: false, theoreticalTarget: 'Demonstrate, in one somatic lineage, that a synthetic circuit can distinguish sustained co-loss of two lineage master regulators from normal physiological variation in living primary cells. The sensing logic — not any output modality — is the claim. Apoptosis is used as the proof-of-principle readout; the circuit must produce characterised false-positive and false-negative rates in primary human hepatocytes and in a living-tissue model. This is a pre-experimental capability: component biology is established; the integrated circuit has not been assembled.', milestones: [{ id: 'g-4.4.1', completed: false, evidence: '', name: 'M1 — AND-gate logic in established cell model (HepG2): circuit produces apoptotic signal only under dual LMR co-loss (HNF4A + FOXA2), not under single-LMR knockdown or intact conditions. ≥10-fold apoptotic signal above background in dual-knockdown only; iCasp9 safety override eliminates signal completely.' }, { id: 'g-4.4.2', completed: false, evidence: '', name: 'M2 — Temporal discrimination in primary human hepatocytes (≥3 donors): no statistically significant apoptosis during physiological LMR oscillation vs. vehicle control; ≥10-fold apoptotic signal above baseline under sustained dual-knockdown (≥48h confirmed by RT-qPCR); replicated in all three donors.' }, { id: 'g-4.4.3', completed: false, evidence: '', name: 'M3 — Immunological compatibility: de-immunised Npu DnaE intein retains assembly rate within 2-fold of wild-type with ≥80% reduction in predicted high-affinity HLA epitopes (IC₅₀ ≤500 nM) across representative supertypes — or validated humanised dimerisation alternative achieves equivalent AND-gate performance at M1 criteria.' }, { id: 'g-4.4.4', completed: false, evidence: '', name: 'M4 — Escape resistance characterised: circuit-evasive event frequency measured under long-term apoptotic selective pressure in primary hepatocytes over ≥90 days; anti-escape architecture (redundant LMR pairs or dual-payload design) validated to reduce evasion frequency ≥10-fold vs. single-circuit control.' }, { id: 'g-4.4.5', completed: false, evidence: '', name: 'M5 — In vivo circuit function: dual-vector AAV co-delivery achieves ≥15% hepatocyte co-transduction in murine model; circuit discriminates (no false-positive apoptosis in intact liver; confirmed activation in chemically-induced LMR-loss model); iCasp9 eliminates >99% of circuit-bearing cells within 4 hours on demand.' }], anchors: ['HNF4A / FOXA2 — hepatocyte lineage master regulators (Zaret & Carroll 2011)', 'Npu DnaE split-intein kinetics in mammalian cells (Zettler et al. 2009)', 'iCasp9 / AP20187 safety switch — clinical validation (Di Stasi et al. 2011)', 'AND-gate split-protein logic in mammalian cells — synNotch (Roybal et al. 2016)', 'Horvath DNA methylation clock — epigenetic aging correlate (Horvath 2013)', 'Somatic mutation accumulation in aging tissues (Martincorena et al. Science 2018)', 'Gap analysis: Programmable Detection of Somatic Identity Failure (docs/whitepaper.md)'], status: 'active', lastUpdated: now, milestonesUpdatedAt: now }, token);
    results.push('g-4.4 set');

    await fsUpsert('obstacles/g-4.5', { id: 'g-4.5', track: 'genetics', phase: 4, order: 14, phaseLabel: 'Phase 4 — Intercellular Communication Layer', name: 'Somatic Identity Triage and External Intervention Loop', shortName: 'Somatic Identity Triage', isBoss: false, theoreticalTarget: 'Building on confirmed detection capability (G-4.4), engineer a cell-autonomous fault-containment circuit that activates upon simultaneous detection of: (1) corruption in ≥2 of 3 independently checksummed domains of the synthetic identity tag (G-3.3), and (2) transcriptomic state divergence exceeding the pre-specified correction threshold. Upon activation, the circuit executes three coordinated outputs in parallel: metabolic shutdown to <20% of baseline ATP production, localised fibrotic self-encapsulation to prevent molecular exchange with neighbouring cells, and continuous secretion of a bio-orthogonal vascular tracking peptide at ≥10 fmol/mL.', milestones: [{ id: 'g-4.5.1', completed: false, evidence: '', name: 'In vitro human 3D organoid validation: dual-corruption trigger activates metabolic shutdown (<20% baseline ATP by luminescence assay), fibrotic encapsulation (Sirius Red staining), and bio-orthogonal peptide secretion (≥10 fmol/mL by LC-MS/MS) in ≥90% of triggered cells with <2% false-positive rate in uncorrupted neighbours.' }, { id: 'g-4.5.2', completed: false, evidence: '', name: 'Murine in vivo model: engineered cells confirm triage activation within 24h, fibrotic capsule at ≥85% of sites, vascular peptide ≥10 fmol/mL by systemic assay; host biological age unchanged at 90-day follow-up (no SASP-mediated bystander aging).' }, { id: 'g-4.5.3', completed: false, evidence: '', name: 'Large animal / NHP validation across ≥3 tissue compartments: independent triage activation in each, no cross-compartment corruption propagation, vascular peptide ≥10 fmol/mL by clinical-grade ELISA, host biological age within ±5% of baseline at 180-day follow-up.' }, { id: 'g-4.5.4', completed: false, evidence: '', name: 'Human Phase I safety and biomarker detection trial (n ≥ 12): vascular peptide ≥10 fmol/mL in serum by LC-MS/MS within 72h; no grade ≥2 adverse events (CTCAE v5.0); CRP ≤1.5× ULN at 30 days; no fibrotic lesion expansion beyond 5mm by MRI.' }], anchors: ['Byzantine fault tolerance — Lamport, Shostak, Pease (1982)', 'Synthetic gene circuit design — Collins Lab MIT / iGEM', 'Sirius Red collagen staining — standard fibrosis quantification assay', 'Bio-orthogonal chemistry — Bertozzi Lab Stanford', 'LC-MS/MS peptide quantification — clinical proteomics gold standard', 'CTCAE v5.0 — Common Terminology Criteria for Adverse Events (FDA/NCI)'], status: 'active', lastUpdated: now, milestonesUpdatedAt: now }, token);
    results.push('g-4.5 set');

    await fsUpsert('obstacles/g-4.6', { id: 'g-4.6', track: 'genetics', phase: 4, order: 15, phaseLabel: 'Phase 4 — Intercellular Communication Layer', name: 'Full Chromosomal Integration and Identity Verification', shortName: 'Full Chromosomal Integration', isBoss: false, theoreticalTarget: 'Demonstrate simultaneous, non-interfering co-expression of all 14 Track 01 subsystems — epigenetic reprogramming (G-1.1), senolytic clearance (G-1.2), vascular gene delivery (G-1.3), telomere maintenance (G-1.4), heterochromatin decoupling (G-2.1), precision editing (G-2.2), nuclear enclaves (G-3.1), cryptographic logic gates (G-3.2), identity tag binding (G-3.3), tunneling nanotube synthesis (G-4.1), P2P re-flashing (G-4.2), stem cell routing (G-4.3), somatic identity detection (G-4.4), and somatic identity triage (G-4.5) — within a single aged mammalian organism.', milestones: [{ id: 'g-4.6.1', completed: false, evidence: '', name: 'All 14 Track 01 subsystems co-delivered and co-expressed in a single aged murine model without mutual interference — confirmed by multi-omics profiling.' }, { id: 'g-4.6.2', completed: false, evidence: '', name: 'Systemic somatic identity verification: identity tag readable in ≥85% of sampled cells across ≥5 tissue types at 6-month timepoint.' }, { id: 'g-4.6.3', completed: false, evidence: '', name: 'Measurable multi-system functional rejuvenation — biological age reduction ≥20% by two independent epigenetic clocks (Horvath + GrimAge/DunedinPACE) in same organism.' }, { id: 'g-4.6.4', completed: false, evidence: '', name: 'Safety at 12-month follow-up: zero oncogenic events, ANA panel negative, karyotype stable by whole-genome sequencing.' }], anchors: ['Horvath epigenetic clock — whole-organism aging biomarker', 'Multi-omics integration — Snyder Lab Stanford', 'ANA (anti-nuclear antibody) panel — standard autoimmunity safety screen', 'Whole-genome sequencing for karyotype stability — Illumina / PacBio long-read', 'Biological age reduction in vivo — Sinclair Lab OSK eye rejuvenation (Nature 2020)', 'AAVS1 safe harbour locus — Porteus Lab Stanford'], status: 'active', lastUpdated: now, milestonesUpdatedAt: now }, token);
    results.push('g-4.6 set');

    await fsPatch('obstacles/g-5.1', { theoreticalTarget: 'Demonstrate indefinite maintenance of biological age homeostasis (Horvath clock equivalent ≤30 years) in a living human subject running the full integrated Track 01 protocol — all 14 genetic subsystems active simultaneously (G-1.1 through G-4.6) — over a minimum 5-year observation period. Annual safety panels (full oncology screen, karyotype by whole-genome sequencing, ANA panel) must remain clear throughout. Peer-reviewed publication confirms sustained multi-organ biological age maintenance with zero cumulative oncogenic events and no immune dysregulation.', milestonesUpdatedAt: now, lastUpdated: now }, token);
    results.push('g-5.1 updated');

    return new Response(JSON.stringify({ success: true, applied: results, at: now }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}