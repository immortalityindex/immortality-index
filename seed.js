const admin = require('firebase-admin');

exports.handler = async (event, context) => {
  const secret = event.queryStringParameters?.secret || event.headers['x-seed-secret'];
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }
    const db = admin.firestore();

    const now = new Date().toISOString();

    const obstacles = [
      // ────────────────────────────────────────────────────────────────────────
      // TRACK 01 · GENETICS
      // ────────────────────────────────────────────────────────────────────────

      // PHASE 1 — REPROGRAMMING LAYER
      {
        id: 'g-1.1',
        track: 'genetics',
        phase: 1,
        phaseLabel: 'Phase 1 — Reprogramming Layer',
        order: 1,
        name: 'In Vivo Epigenetic Reprogramming Proof-of-Concept',
        shortName: 'Reprogramming PoC',
        isBoss: false,
        theoreticalTarget:
          'Demonstrate safe, reversible, partial epigenetic reprogramming in a living human subject that measurably reverses cellular age markers (Horvath DNA methylation clock) by ≥20 years without inducing pluripotency-associated oncogenesis or teratoma formation.',
        milestones: [
          {
            id: 'g-1.1.1',
            name: 'Non-oncogenic partial reprogramming protocol (OSK without c-Myc) validated in human organoids — independent lab replication confirmed',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.1.2',
            name: 'In vivo murine model shows ≥20% reversal on Horvath DNA methylation clock with zero tumor incidence over 12-month follow-up',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.1.3',
            name: 'Phase I human safety IND filing accepted — cyclic OSKM/OSK expression trialled in an isolated somatic tissue type (e.g., retinal ganglion cells)',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.1.4',
            name: 'Peer-reviewed evidence of functional tissue rejuvenation (>15% improvement in tissue-specific functional assay) in non-human primate without teratoma at 18 months',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Life Biosciences — ER-100 partial reprogramming platform',
          'Altos Labs — OSKM/OSK cyclic expression programme',
          'Turn Bio — mRNA-based transient reprogramming',
          'Yamanaka factors (Oct4, Sox2, Klf4, c-Myc)',
          'Horvath epigenetic clock / DNA methylation biomarkers',
          'David Sinclair Lab — OSK in vivo eye rejuvenation (Nature 2020)',
          'AgeX Therapeutics — iTR induced tissue regeneration'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-1.2',
        track: 'genetics',
        phase: 1,
        phaseLabel: 'Phase 1 — Reprogramming Layer',
        order: 2,
        name: 'Systemic Senescent Cell Clearance Engine',
        shortName: 'Senescent Clearance',
        isBoss: false,
        theoreticalTarget:
          'Achieve >95% clearance of p16/p21-positive senescent cells from all major organ systems in a living subject within a controlled therapeutic window, without triggering cytokine storm, excessive immunosuppression, or impairment of wound-healing capacity.',
        milestones: [
          {
            id: 'g-1.2.1',
            name: 'uPAR-targeting CAR-T cells demonstrate >80% senescent cell clearance in aged murine model with confirmed SASP reduction and no significant immunotoxicity',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.2.2',
            name: 'Combination senolytic protocol (Dasatinib + Quercetin + navitoclax) achieves systemic clearance in NHP model — biomarkers (p16, SA-β-gal, IL-6) reduced >60%',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.2.3',
            name: 'Phase II human clinical trial data confirms >70% reduction in senescence burden (p16 IHC, circulating SASP cytokines) with functional outcome improvement',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.2.4',
            name: 'Safe repeatable clearance protocol established — tissue regenerative recovery confirmed post-clearance with no long-term immune deficiency or wound-healing impairment',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Unity Biotechnology — UBX0101, UBX1967 senolytic trials',
          'CAR-T targeting uPAR (Amor et al. Nature 2020)',
          'Dasatinib + Quercetin — Mayo Clinic Phase I/II trials',
          'Navitoclax (ABT-263) — BCL-2 family senolytic',
          'UNITY/Oisin Biotechnologies — lipid nanoparticle senolytic delivery',
          'James Kirkland Lab Mayo Clinic — senolytic clinical research',
          'Cleara Biotech — p21-targeting senolytic approach'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-1.3',
        track: 'genetics',
        phase: 1,
        phaseLabel: 'Phase 1 — Reprogramming Layer',
        order: 3,
        name: 'Full-Body Vascular Gene Delivery Network',
        shortName: 'Vascular Delivery Network',
        isBoss: false,
        theoreticalTarget:
          'Establish a gene delivery infrastructure capable of transfecting >90% of all cell types across all organ systems — including CNS beyond the blood-brain barrier — with a single systemic administration, achieving <0.01% off-target genomic integration events.',
        milestones: [
          {
            id: 'g-1.3.1',
            name: 'Novel AI-designed AAV capsid (e.g., AAV-PHP.eB variant or Dyno-evolved capsid) validated for pan-organ biodistribution in large animal model (porcine/NHP)',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.3.2',
            name: 'Ionizable LNP formulation achieves >70% CNS transfection efficiency post-IV administration in primate model without hepatotoxicity (LFT within 2× ULN)',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.3.3',
            name: 'Multiplexed delivery vehicle carrying simultaneous epigenetic reprogramming factors + CRISPR machinery demonstrates functional co-delivery in 3+ distinct tissue types',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.3.4',
            name: 'Phase I/II human trial demonstrates systemic biodistribution with therapeutic expression levels in target tissues — off-target integration <0.01% confirmed by whole-genome sequencing',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Dyno Therapeutics — AI-evolved AAV capsid library',
          '4D Molecular Therapeutics — engineered capsids',
          'Precision BioSciences — ARCUS nuclease + AAV',
          'Moderna — CNS-targeting LNP platform',
          'Beam Therapeutics — base editing + AAV delivery',
          'BRAIN Initiative — BBB-crossing vector research',
          'Prevail Therapeutics — AAV9 CNS gene therapy'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-1.4',
        track: 'genetics',
        phase: 1,
        phaseLabel: 'Phase 1 — Reprogramming Layer',
        order: 4,
        name: 'Stem Cell Telomere Maintenance Switch',
        shortName: 'Telomere Maintenance',
        isBoss: false,
        theoreticalTarget:
          'Engineer a controllable, tissue-specific telomerase activation switch that maintains stem cell telomere length in the 8–12 kb range across all tissue compartments indefinitely, while remaining transcriptionally silent in non-stem somatic cells to prevent oncogenesis.',
        milestones: [
          {
            id: 'g-1.4.1',
            name: 'Tissue-specific TERT promoter construct validated for stem-cell-only expression in organoid systems — zero detectable TERT expression in differentiated progeny cells',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.4.2',
            name: 'ALT (Alternative Lengthening of Telomeres) pathway upregulation demonstrated as backup elongation mechanism in TERT-negative cells — no associated genome instability',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.4.3',
            name: '24-month telomere maintenance confirmed in NHP HSC and tissue stem cell populations — qPCR and FISH confirm 8–12 kb range maintenance without malignant transformation',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-1.4.4',
            name: 'Clinical-grade TERT gene therapy vector demonstrates safe telomere maintenance in human HSC transplantation model — 12-month follow-up with no oncogenic signal',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Sierra Sciences — Bill Andrews TERT activation research',
          'BioViva — TERT gene therapy (Liz Parrish self-experiment, n=1)',
          'Telomere-to-Telomere (T2T) Consortium — complete human telomere sequencing',
          'Geron Corporation — hTERT immortalisation studies',
          'TA Sciences — TA-65 telomerase activator (cycloastragenol)',
          'Roger Reddel Lab — ALT pathway biology (Cancer Research Institute)'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // PHASE 2 — GENOME FIDELITY LAYER
      {
        id: 'g-2.1',
        track: 'genetics',
        phase: 2,
        phaseLabel: 'Phase 2 — Genome Fidelity Layer',
        order: 5,
        name: 'Heterochromatin Pioneer Decoupling',
        shortName: 'Heterochromatin Decoupling',
        isBoss: false,
        theoreticalTarget:
          'Develop precision molecular tools to selectively open age-collapsed heterochromatin domains at designated genomic loci without triggering global chromatin instability, transposon activation, or senescence response — enabling downstream repair machinery to access previously inaccessible DNA damage sites.',
        milestones: [
          {
            id: 'g-2.1.1',
            name: 'Pioneer transcription factor cocktail (e.g., FOXA1, GATA3, TP53) opens targeted heterochromatin in aged human fibroblasts with <5% off-target loci disruption — ATAC-seq confirmed',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-2.1.2',
            name: 'Single-cell epigenomic profiling confirms selective H3K9me3 demethylation at target sites without LINE-1 retrotransposon activation or satellite repeat derepression',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-2.1.3',
            name: 'Synthetic chromatin remodeling complex (engineered SWI/SNF or NuRD-based) delivered via mRNA achieves locus-specific opening in vivo in murine aged hepatocytes',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-2.1.4',
            name: 'Coupled Prime Editor accesses and corrects target mutation within newly opened heterochromatin domain in NHP — editing efficiency >10× improvement vs. baseline closed chromatin',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'ENCODE Project — heterochromatin accessibility maps across tissue types',
          'Pioneer factor biology — FOXA1/GATA3 breast tissue reprogramming studies',
          'CUT&RUN / CUT&TAG — locus-specific H3K9me3 profiling',
          '10x Genomics — single-cell ATAC-seq chromatin accessibility',
          'Bhanu Lab — pioneer factor structural biology',
          'Aurora Biosciences — chromatin-targeted therapeutics'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-2.2',
        track: 'genetics',
        phase: 2,
        phaseLabel: 'Phase 2 — Genome Fidelity Layer',
        order: 6,
        name: 'Sub-Letter Nucleotide Absolute Precision Editing',
        shortName: 'Absolute Precision Editing',
        isBoss: false,
        theoreticalTarget:
          'Achieve a genome-wide editing fidelity of ≤1 unintended nucleotide change per 10¹² base pairs edited in a single therapeutic intervention across all cell types — enabling safe simultaneous correction of thousands of age-associated somatic mutations.',
        milestones: [
          {
            id: 'g-2.2.1',
            name: 'Prime Editing v4+ demonstrates <1 unintended edit per 10⁹ bp in human iPSC lines — independently replicated in ≥3 labs with CIRCLE-seq or DISCOVER-seq off-target validation',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-2.2.2',
            name: 'High-fidelity evolved Cas12 variant (PAM-flexible) achieves <1 off-target per 10¹⁰ bp in therapeutic in vivo murine model — whole-genome sequencing confirmed in 100+ animals',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-2.2.3',
            name: 'Single-cell whole-genome sequencing of edited cells confirms zero detectable off-target mutations in 1,000-cell sample at clinical-grade editing concentrations',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-2.2.4',
            name: 'Simultaneous multi-locus editing (≥50 sites) at clinical scale with aggregate fidelity maintained at ≤1 error per 10¹² bp — validated in NHP therapeutic model',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'David Liu Lab / Beam Therapeutics — Prime Editing v3/v4',
          'Editas Medicine — high-fidelity Cas9 eSpCas9, HiFi Cas9',
          'Inscripta — CRISPR-Cas14 small nuclease platform',
          'DISCOVER-Seq — unbiased off-target detection (Concordet/Haeussler)',
          'CIRCLE-seq — in vitro off-target profiling',
          'Andrew Anzalone — PE3/PE3b prime editing optimisation',
          'Sherlock Biosciences — CRISPR diagnostics precision'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // PHASE 3 — SYNTHETIC BIOLOGY LAYER
      {
        id: 'g-3.1',
        track: 'genetics',
        phase: 3,
        phaseLabel: 'Phase 3 — Synthetic Biology Layer',
        order: 7,
        name: 'Synthetic Membraneless Nuclear Enclave Formation',
        shortName: 'Nuclear Enclave Formation',
        isBoss: false,
        theoreticalTarget:
          'Engineer stable, synthetic biomolecular condensates within the nucleus that serve as isolated, high-fidelity processing zones for reprogramming factor delivery and genomic repair operations — achieving 3–5× enhanced editing efficiency while remaining completely traceless post-operation.',
        milestones: [
          {
            id: 'g-3.1.1',
            name: 'Synthetic IDR (intrinsically disordered region) protein constructs nucleate stable condensates within human cell nuclei with >6-hour persistence — FRAP and live-cell imaging confirmed',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.1.2',
            name: 'Condensate-enclosed CRISPR/repair machinery demonstrates 3–5× enhanced editing efficiency vs. dispersed delivery in human primary cell lines — replicated in ≥2 independent labs',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.1.3',
            name: 'Dissolution trigger (small molecule or optogenetic light signal) achieves complete, traceless condensate clearance from nucleus — no residual IDR protein detectable at 48h by super-resolution imaging',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.1.4',
            name: 'In vivo delivery of condensate-forming synthetic proteins via ionizable LNP demonstrates functional nuclear enclave formation in hepatocytes in murine model — histology and proteomics confirmed',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Mittag Lab — liquid-liquid phase separation (LLPS) biology',
          'Richard Young Lab / Whitehead Institute — transcriptional condensates',
          'Dewpoint Therapeutics — condensate-targeted drug discovery',
          'Phase Genomics — condensate genomic organisation',
          'Boija et al. Cell 2018 — condensates in transcription activation',
          'Sabari et al. Science 2018 — coactivator condensates at super-enhancers'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-3.2',
        track: 'genetics',
        phase: 3,
        phaseLabel: 'Phase 3 — Synthetic Biology Layer',
        order: 8,
        name: '12-Hour Cryptographic Logic Gate Wiring',
        shortName: 'Cryptographic Logic Gates',
        isBoss: false,
        theoreticalTarget:
          'Construct a synthetic genetic circuit that verifies cellular identity against an internal cryptographic checksum, executes a precisely timed (12-hour window) reprogramming/repair cascade, and autonomously terminates all activity with complete circuit self-degradation — leaving zero residual synthetic components in the cell.',
        milestones: [
          {
            id: 'g-3.2.1',
            name: 'Multi-input synthetic toggle switch (orthogonal transcription factors + miRNA sensors) implements Boolean AND/NOT logic in human cells with <2% leakage across 72 hours',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.2.2',
            name: 'Ribocomputing circuit (RNA-based logic gates) achieves 12-hour autonomous operational window with built-in degradation timer governed by RNA decay rates — validated in HEK293T and primary cells',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.2.3',
            name: 'Cryptographic identity verification layer (cell-type-specific promoter + epigenetic signature reader dCas9 construct) integrated — circuit activation blocked in >99% of off-target cell types',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.2.4',
            name: 'Full circuit (verify → execute → self-degrade) demonstrated in ex vivo human primary cells — zero residual circuit component detectable by mass spectrometry and RNA-seq at 36 hours post-initiation',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Collins Lab MIT — genetic toggle switch and logic circuit design',
          'Wyss Institute for Biologically Inspired Engineering — synthetic biology',
          'Ribocomputing (Green et al. Nature 2017) — RNA-based logic gates',
          'Synlogic Therapeutics — engineered living medicines with circuit control',
          'Gardner, Cantor, Collins (Nature 2000) — bistable genetic toggle switch',
          'GenoFAB — synthetic biology circuit design software platform'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-3.3',
        track: 'genetics',
        phase: 3,
        phaseLabel: 'Phase 3 — Synthetic Biology Layer',
        order: 9,
        name: 'Protected Corruptible Identity Tag Binding',
        shortName: 'Identity Tag Binding',
        isBoss: false,
        theoreticalTarget:
          'Establish a stable, self-replicating, tamper-evident epigenetic identity code embedded within the cell\'s chromatin architecture that persists through cell division, resists transcriptional noise, and enables binary authentication of "reprogrammed" vs. "corrupted" cellular identity states.',
        milestones: [
          {
            id: 'g-3.3.1',
            name: 'Synthetic CpG methylation pattern (designer methylome at non-coding locus) stably inherited through ≥20 cell divisions in human iPSC-derived cells without drift — bisulfite sequencing confirmed',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.3.2',
            name: 'dCas9-based identity reader protein distinguishes authentic identity methylation signature from corrupted/erased pattern with >99% specificity — validated against 50+ perturbation conditions',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.3.3',
            name: 'Identity tag demonstrated to survive partial OSK reprogramming event without erasure — methylation pattern maintained at >90% fidelity in daughter cells post-reprogramming',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-3.3.4',
            name: 'Autonomous error-correction loop (methylation writer + reader feedback) restores tag integrity after deliberate 30% partial corruption — recovery confirmed within 6 hours in cell culture',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Ryan Lister Lab — whole-genome bisulfite sequencing, methylome mapping',
          'Albert Keung Lab — synthetic epigenetic memory circuits',
          'dCas9-DNMT3A — targeted CpG methylation writing (Vojta et al. 2016)',
          'dCas9-TET1 — targeted demethylation (Liu et al. 2016)',
          'IHEC Roadmap Epigenomics — reference methylome datasets',
          'EpiBeat — epigenetic engineering tools'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // PHASE 4 — INTERCELLULAR COMMUNICATION LAYER
      {
        id: 'g-4.1',
        track: 'genetics',
        phase: 4,
        phaseLabel: 'Phase 4 — Intercellular Communication Layer',
        order: 10,
        name: 'Intercellular Tunneling Nanotube Synthesis',
        shortName: 'Tunneling Nanotube Synthesis',
        isBoss: false,
        theoreticalTarget:
          'Induce on-demand formation of synthetic tunneling nanotubes (TNTs) between designated cell pairs within living tissue, capable of transferring functional organelles (healthy mitochondria, repair proteins) from donor to damaged target cells with directional control and confirmed metabolic rescue.',
        milestones: [
          {
            id: 'g-4.1.1',
            name: 'Chemically-induced TNT formation between designated cell pairs in 2D culture achieved with >60% efficiency — M-Sec/RalA pathway stimulation or synthetic linker protein approach validated',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.1.2',
            name: 'Directed mitochondrial transfer through synthetic TNTs confirmed in aged/damaged cells — recipient cell shows metabolic recovery: ≥30% increase in ATP output and restored mitochondrial membrane potential',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.1.3',
            name: 'TNT formation demonstrated in 3D tissue organoid with directional control via external magnetic field guidance on magnetically-labelled organelle cargo',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.1.4',
            name: 'In vivo proof of synthetic TNT formation between injected donor cells and cardiac or neural target tissue in murine model — cargo delivery confirmed by live fluorescence imaging',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Islam et al. Nature 2012 — mitochondrial transfer restores aerobic respiration',
          'M-Sec (TNFAIP2) — TNT inducer protein (Hase et al. J Cell Biol 2009)',
          'Frankel Lab UCLA — TNT biogenesis mechanisms',
          'MitoCeption — mitochondria transfer protocol (Caicedo et al. 2015)',
          'Creative Medical Technology — clinical mitochondria transfer research',
          'Connelly Lab — F-actin nanotube formation in immune synapses'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-4.2',
        track: 'genetics',
        phase: 4,
        phaseLabel: 'Phase 4 — Intercellular Communication Layer',
        order: 11,
        name: 'Kinship Authentication & Direct P2P Re-Flashing',
        shortName: 'P2P Re-Flashing',
        isBoss: false,
        theoreticalTarget:
          'Implement a biological peer-to-peer protocol where each reprogrammed cell maintains a shielded "golden copy" of its operational genetic/epigenetic program, continuously verifies its active expression profile against this master checksum, and upon detecting corruption beyond a defined threshold, receives a corrected copy from an adjacent authenticated peer cell via near-field molecular communication.',
        milestones: [
          {
            id: 'g-4.2.1',
            name: 'Shielded heterochromatin-encoded master checksum locus established — demonstrably resistant to Tet1/DNMT perturbation and survives through ≥50 cell generations without drift >2%',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.2.2',
            name: 'Continuous self-verification circuit (ncRNA sensor + ADAR editing reporter) detects >5% deviation from master program and initiates SOS signalling cascade within <30 minutes of corruption event',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.2.3',
            name: 'Near-field molecular communication channel (TNT + gap junction hybrid) transfers corrected epigenetic/mRNA payload from verified neighbour to corrupted receiver — functional restoration confirmed within 2-hour window',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.2.4',
            name: 'Identity leeway algorithm (tolerates ±3% natural epigenetic drift before triggering repair) validated in 100-cell culture network — no false-positive repair cascades over 30-day experiment',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Gap junction connexin channels — endogenous near-field cell-cell communication',
          'ADAR A-to-I editing sensors — RNA-based deviation detection',
          'ncRNA-based cellular state monitoring (Rinn Lab)',
          'Exosome-mediated mRNA transfer between cells (Valadi et al. Nature 2007)',
          'Synthetic lateral inhibition circuits (Elowitz Lab Caltech)',
          'Biological near-field communication theory (Nakano & Eckford)'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-4.3',
        track: 'genetics',
        phase: 4,
        phaseLabel: 'Phase 4 — Intercellular Communication Layer',
        order: 12,
        name: 'Homing Matrix Stem Cell Routing',
        shortName: 'Stem Cell Routing',
        isBoss: false,
        theoreticalTarget:
          'Engineer a tissue-specific chemokine/receptor guidance system that routes exogenously administered engineered stem cells with >85% delivery efficiency to precise anatomical niches (bone marrow, hippocampal subgranular zone, intestinal crypts) with <5% ectopic engraftment.',
        milestones: [
          {
            id: 'g-4.3.1',
            name: 'CXCR4-overexpressing engineered MSCs demonstrate >70% homing efficiency to SDF-1-rich bone marrow niches in murine model vs. <30% for unmodified cells — bioluminescence imaging confirmed',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.3.2',
            name: 'Orthogonal chemokine receptor pair (non-native ligand/receptor not found in host) engineered into stem cells — achieves tissue-specific routing independent of endogenous SDF-1 gradients',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.3.3',
            name: 'Multiplexed routing system (2–3 receptor/ligand pairs) delivers distinct stem cell populations to different target niches simultaneously in single administration — zero cross-contamination between targets',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-4.3.4',
            name: 'Engineered stem cell engraftment confirmed at target sites by single-cell sequencing at 6-month follow-up — stable integration with <5% ectopic engraftment systemwide',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'CXCR4/SDF-1 (CXCL12) axis — Lapidot Lab Weizmann Institute',
          'AMD3100 (plerixafor) stem cell mobilisation research',
          'Mesoblast — MSC homing therapy clinical programmes',
          'ExCellThera — HSC expansion and homing enhancement',
          'BioCardia — cardiac stem cell targeted delivery',
          'Mandal et al. — CXCR4 overexpression in HSC transplantation'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // PHASE 5 — SYSTEM-LEVEL INTEGRATION BOTTLENECK (SLIB)
      {
        id: 'g-5.1',
        track: 'genetics',
        phase: 5,
        phaseLabel: 'Phase 5 — System-Level Integration Bottleneck (SLIB)',
        order: 13,
        name: 'Somatic Identity Triage and External Intervention Loop',
        shortName: 'SLIB: Somatic Identity Triage',
        isBoss: true,
        theoreticalTarget:
          'Engineer a cell-autonomous fault-containment circuit in permanent somatic cells that activates upon simultaneous detection of: (1) corruption in ≥2 of 3 independently checksummed domains of the synthetic identity tag (G-3.3), and (2) transcriptomic state divergence exceeding the pre-specified correction threshold. Upon activation, the circuit executes three coordinated outputs in parallel: metabolic shutdown to <20% of baseline ATP production, localised fibrotic self-encapsulation to prevent molecular exchange with neighbouring cells, and continuous secretion of a bio-orthogonal vascular tracking peptide at ≥10 fmol/mL. This converts irreparably corrupted cells into inert, self-labelled units that halt somatic identity contamination and emit a persistent retrieval beacon for Track 02 nanorobotic systems — closing the Byzantine fault isolation loop before cascade propagation can occur.',
        milestones: [
          {
            id: 'g-5.1.1',
            name: 'In vitro human 3D organoid validation: dual-corruption trigger activates metabolic shutdown (<20% baseline ATP by luminescence assay), fibrotic encapsulation (Sirius Red staining), and bio-orthogonal peptide secretion (≥10 fmol/mL by LC-MS/MS) in ≥90% of triggered cells with <2% false-positive rate in uncorrupted neighbours',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-5.1.2',
            name: 'Murine in vivo model: engineered cells with dual-corruption trigger confirm triage activation within 24h, fibrotic capsule at ≥85% of sites, vascular peptide ≥10 fmol/mL by systemic assay; host biological age unchanged at 90-day follow-up (no SASP-mediated bystander aging)',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-5.1.3',
            name: 'Large animal / NHP validation across ≥3 tissue compartments: independent triage activation in each, no cross-compartment corruption propagation, vascular peptide ≥10 fmol/mL by clinical-grade ELISA, host biological age within ±5% of baseline at 180-day follow-up',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-5.1.4',
            name: 'Human Phase I safety and biomarker detection trial (n ≥ 12): vascular peptide ≥10 fmol/mL in serum by LC-MS/MS within 72h; no grade ≥2 adverse events (CTCAE v5.0); CRP ≤1.5× ULN at 30 days; no fibrotic lesion expansion beyond 5mm by MRI',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Byzantine fault tolerance — Lamport, Shostak, Pease (1982)',
          'Synthetic gene circuit design — Collins Lab MIT / iGEM',
          'Sirius Red collagen staining — standard fibrosis quantification assay',
          'Bio-orthogonal chemistry — Bertozzi Lab Stanford (bioorthogonal peptide labelling)',
          'LC-MS/MS peptide quantification — clinical proteomics gold standard',
          'CTCAE v5.0 — Common Terminology Criteria for Adverse Events (FDA/NCI)'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'g-5.2',
        track: 'genetics',
        phase: 5,
        phaseLabel: 'Phase 5 — System-Level Integration Bottleneck (SLIB)',
        order: 14,
        name: 'Full Chromosomal Integration and Identity Verification',
        shortName: 'SLIB: Chromosomal Integration',
        isBoss: true,
        theoreticalTarget:
          'Demonstrate simultaneous, non-interfering co-expression of all Track 01 subsystems — epigenetic reprogramming (G-1.1), senolytic clearance (G-1.2), vascular gene delivery (G-1.3), telomere maintenance (G-1.4), heterochromatin decoupling (G-2.1), precision editing (G-2.2), nuclear enclaves (G-3.1), cryptographic logic gates (G-3.2), identity tag binding (G-3.3), tunneling nanotube synthesis (G-4.1), P2P re-flashing (G-4.2), stem cell routing (G-4.3), and somatic identity triage (G-5.1) — within a single aged mammalian organism. Confirm systemic somatic identity integrity (synthetic identity tag readable in ≥85% of sampled cells across ≥5 tissue types), measurable biological age reduction of ≥20% by two independent epigenetic clocks, and 12-month safety with zero oncogenic events, stable karyotype by whole-genome sequencing, and ANA panel negative throughout.',
        milestones: [
          {
            id: 'g-5.2.1',
            name: 'All Track 01 subsystems co-delivered and co-expressed in a single aged murine model without mutual interference confirmed by multi-omics profiling',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-5.2.2',
            name: 'Systemic somatic identity verification: identity tag readable in ≥85% of sampled cells across ≥5 tissue types at 6-month timepoint',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-5.2.3',
            name: 'Measurable multi-system functional rejuvenation — biological age reduction ≥20% by two independent epigenetic clocks in same organism',
            completed: false,
            evidence: ''
          },
          {
            id: 'g-5.2.4',
            name: 'Safety at 12-month follow-up: zero oncogenic events, ANA panel negative, karyotype stable by whole-genome sequencing',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Horvath epigenetic clock — whole-organism aging biomarker',
          'Multi-omics integration — Synder Lab Stanford / TOF-SIMS proteomics',
          'ANA (anti-nuclear antibody) panel — standard autoimmunity safety screen',
          'Whole-genome sequencing for karyotype stability — Illumina / PacBio long-read',
          'Biological age reduction in vivo — David Sinclair Lab OSK eye rejuvenation (Nature 2020)',
          'AAVS1 safe harbour locus — Porteus Lab Stanford'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // ────────────────────────────────────────────────────────────────────────
      // TRACK 02 · NANOTECH
      // ────────────────────────────────────────────────────────────────────────

      // PHASE 1 — PROPULSION & PROCESSING LAYER
      {
        id: 'n-1.1',
        track: 'nanotech',
        phase: 1,
        phaseLabel: 'Phase 1 — Propulsion & Processing Layer',
        order: 1,
        name: 'Remote Mechanical Micro-Propulsion',
        shortName: 'Micro-Propulsion',
        isBoss: false,
        theoreticalTarget:
          'Demonstrate a sub-5-micron autonomous propulsion unit capable of navigating against physiological blood flow under remote guidance, achieving positional accuracy within 50 microns of a target site — powered entirely by external field energy harvesting with no onboard chemical fuel.',
        milestones: [
          {
            id: 'n-1.1.1',
            name: 'Helical magneto-acoustic micro-swimmer (≤3 µm) navigates in microfluidic channels simulating capillary flow at ≥0.5 cm/s against-flow velocity — independently replicated in ≥2 labs',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.1.2',
            name: '3D in vitro vascular phantom navigation: unit reaches designated target site within ±50 µm accuracy under rotating magnetic field guidance from 10 cm external source with real-time imaging feedback',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.1.3',
            name: 'In vivo biodistribution study in murine model: >60% of administered units reach target organ within 4 hours of IV administration without vascular occlusion events',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.1.4',
            name: 'Acoustic + magnetic hybrid steering demonstrated for CNS penetration — units cross validated in vitro blood-brain barrier model (TEER >200 Ω·cm²) without compromising barrier integrity',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'ETH Zurich — Bradley Nelson group magnetically guided micro-robots',
          'Max Planck Institute for Intelligent Systems — Metin Sitti group bio-inspired micro-robots',
          'Martel Lab Polytechnique Montreal — magnetotactic bacteria-propelled nanorobots',
          'Joseph Wang Lab UCSD — catalytic/acoustic nano-motors',
          'Cardiobots — endovascular navigation research',
          'Feringa Group — light-driven molecular motors (Nobel 2016)'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'n-1.2',
        track: 'nanotech',
        phase: 1,
        phaseLabel: 'Phase 1 — Propulsion & Processing Layer',
        order: 2,
        name: 'Sub-10 Attojoule Reversible Neuromorphic Processing',
        shortName: 'Attojoule Neuromorphic Processing',
        isBoss: false,
        theoreticalTarget:
          'Develop a molecular-scale computing unit performing onboard pattern recognition at ≤10 attojoules per logic operation using reversible computation principles — enabling operation on ambient thermal/biochemical energy without significant heat dissipation in surrounding tissue.',
        milestones: [
          {
            id: 'n-1.2.1',
            name: 'Adiabatic CMOS logic circuit (sub-100 nm) demonstrates ≤50 aJ per operation at physiological temperature with reversible gate architecture — thermodynamic efficiency >80% of Landauer limit',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.2.2',
            name: 'Molecular memristor array (MoS₂ or organic polymer-based) achieves ≤10 aJ per state transition with >10⁶ switching endurance cycles — retention >10 years at 37°C projected',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.2.3',
            name: 'Neuromorphic spike-based processing unit at ≤10 aJ/spike performs binary biomarker classification (target vs. non-target cell surface receptor pattern) with >95% accuracy in bench test',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.2.4',
            name: 'Integrated nano-computing module (10 aJ processing + local molecular memory) validated in full biological simulation pipeline: detect → decide → signal → execute therapeutic action',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'IBM Research — NorthPole neuromorphic chip (0.4 µJ/inference)',
          'Intel Loihi 2 — spike-based neural processing (1000× energy efficiency gain)',
          'Landauer principle — kT ln 2 = 2.9 zJ minimum energy per irreversible bit operation at 37°C',
          'HP Labs / UCSB — memristor crossbar array research',
          'Tour Lab Rice University — molecular electronics single-molecule switches',
          'Sandia National Laboratories — ultra-low power CMOS design'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'n-1.3',
        track: 'nanotech',
        phase: 1,
        phaseLabel: 'Phase 1 — Propulsion & Processing Layer',
        order: 3,
        name: 'Low-Frequency Acoustic Wave-Guiding Mesh',
        shortName: 'Acoustic Mesh Network',
        isBoss: false,
        theoreticalTarget:
          'Establish an intra-body communication network using low-frequency acoustic waves (20–200 kHz) enabling bidirectional data transmission between distributed nanorobotic units at ≥1 kbps bandwidth through soft tissue, with ≤0.5°C tissue temperature rise and no cavitation effects.',
        milestones: [
          {
            id: 'n-1.3.1',
            name: 'In vitro tissue phantom (gelatin/agar) demonstrates acoustic signal propagation at 100 kHz with <3 dB loss per cm — no detectable cavitation (hydrophone + passive cavitation detector validated)',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.3.2',
            name: 'Miniaturised piezoelectric transducer (≤50 µm) transmits and receives 1 kbps data through 10 cm of simulated soft tissue with <1% bit error rate',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.3.3',
            name: 'Mesh network of 100+ acoustic nodes self-organises and maintains synchronised communication — temperature elevation <0.2°C confirmed by MR thermometry in ex vivo tissue',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-1.3.4',
            name: 'In vivo demonstration in small animal: external interrogator receives telemetry from internal acoustic nodes through skin/tissue barrier — signal integrity maintained through 48-hour implant period',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'DARPA N-Zero programme — near-zero power acoustic wake-up receivers',
          'Bhave Lab Cornell — resonant micro-acoustic transducers (FBAR)',
          'Ghovanloo Lab Georgia Tech — ultrasonic body area network',
          'IEEE EMBC — acoustic intrabody communication research track',
          'Verasonics — programmable ultrasound research systems',
          'IntraSense — implantable acoustic body sensor platform'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // PHASE 2 — ASSEMBLY LAYER
      {
        id: 'n-2.1',
        track: 'nanotech',
        phase: 2,
        phaseLabel: 'Phase 2 — Assembly Layer',
        order: 4,
        name: 'Scaffolded DNA Origami Assembly Molds',
        shortName: 'DNA Origami Molds',
        isBoss: false,
        theoreticalTarget:
          'Fabricate a library of ≥50 distinct, dimensionally stable DNA origami scaffolds (2–100 nm scale) serving as precision positioning molds for assembling functional nanoelectronic, nanomechanical, and nanophotonic components — with structural fidelity maintained in physiological ionic conditions (150 mM NaCl, 37°C) for ≥72 hours.',
        milestones: [
          {
            id: 'n-2.1.1',
            name: '3D DNA origami cages (20–50 nm) achieve >90% correct folding yield in physiological buffer conditions — <5% structural collapse over 72 hours confirmed by cryo-EM at molecular resolution',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.1.2',
            name: 'DNA origami mold positions ≥2 distinct nanocomponents (gold nanoparticle + quantum dot) with <2 nm positional accuracy — STORM/PAINT super-resolution microscopy validated',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.1.3',
            name: 'Enzymatic ligation enables stable covalent bonding of DNA-nanocomponent assembly — assembled structure survives 1000× dilution and physiological shear forces (microfluidic stress test)',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.1.4',
            name: 'Automated DNA origami design pipeline (caDNAno / DAEDALUS / MagicDNA) produces functional mold designs in <48 hours from specification — validated library of 50 distinct molds completed',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Paul Rothemund — scaffolded DNA origami (Nature 2006)',
          'William Shih Lab Harvard — 3D wireframe and box origami',
          'Hendrik Dietz Lab TU Munich — rigid multi-layer 3D origami',
          'Wyss Institute — DNA nanotechnology programme',
          'Shawn Douglas — caDNAno design software',
          'Nanotemper Technologies — MST and DLS characterisation of DNA nanostructures'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'n-2.2',
        track: 'nanotech',
        phase: 2,
        phaseLabel: 'Phase 2 — Assembly Layer',
        order: 5,
        name: 'True Digital-to-Physical Molecular Assembly',
        shortName: 'Digital-to-Physical Assembly',
        isBoss: false,
        theoreticalTarget:
          'Demonstrate digital-to-physical molecular assembly where a computational blueprint is translated into a functional molecular structure (≥50 precisely positioned atoms) through controlled mechanosynthesis or programmable matter — without requiring manual SPM operation per bond.',
        milestones: [
          {
            id: 'n-2.2.1',
            name: 'STM automation achieves ≥10 atomic placements per minute with <0.1 Å positioning error under closed-loop control — demonstrated for ≥3 distinct atomic species on a clean surface',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.2.2',
            name: 'ML-guided AFM-based mechanosynthesis places ≥5 distinct atom types in pre-specified 2D pattern (20+ atoms total) using machine-learning tip control — no manual intervention per bond',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.2.3',
            name: 'Molecular assembler prototype (DNA-enzyme hybrid ribozyme) catalyses sequential covalent bond formation according to digital sequence input in aqueous environment — 10+ bond cascade demonstrated',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.2.4',
            name: 'End-to-end pipeline: computational design → automated synthesis → functional validation completed for a simple molecular machine (rotary motor or molecular switch) with <24h cycle time',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Don Eigler IBM Almaden — first atomic manipulation (Fe on Cu, 1990)',
          'K. Eric Drexler — Nanosystems mechanosynthesis theory (1992)',
          'Zyvex Technologies — molecular assembly platform commercialisation',
          'Philip Moriarty Lab Nottingham — STM/AFM automation and ML control',
          'Robert Freitas — Nanomedicine Vol. I & II (mechanosynthesis design)',
          'NIST Center for Nanoscale Science and Technology — atomic fabrication'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'n-2.3',
        track: 'nanotech',
        phase: 2,
        phaseLabel: 'Phase 2 — Assembly Layer',
        order: 6,
        name: 'Microscopic Radiation-Hardened Vault Hulls',
        shortName: 'Radiation-Hardened Hulls',
        isBoss: false,
        theoreticalTarget:
          'Engineer sub-10-micron structural enclosures for nanoelectronic components that maintain functional integrity after: (a) 10 Gy ionising radiation, (b) 1,000+ thermal cycles between 20–42°C, and (c) 10,000 hours of continuous operation in physiological fluid — using diamondoid, CNT, or fullerene-based composite architectures.',
        milestones: [
          {
            id: 'n-2.3.1',
            name: 'Carbon nanotube composite hull (≤5 µm diameter) withstands 10 Gy gamma irradiation with <5% structural degradation — enclosed component function maintained (AFM quantified pre/post irradiation)',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.3.2',
            name: 'CVD-deposited diamondoid coating on sub-10-µm substrate demonstrates hardness ≥50 GPa and <1 nm water/ion penetration over 30-day physiological fluid immersion (SIMS depth profiling)',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.3.3',
            name: 'Fullerene (C60/C70) reinforced polymer composite hull survives 1,000 thermal cycles (20–42°C) without delamination — enclosed nanoelectronics remain functional by I-V characterisation',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-2.3.4',
            name: 'Complete vault (≤8 µm OD) protects functional molecular computing element through simulated 10-year operational lifetime under accelerated aging protocol (Arrhenius model, 85°C/85% RH)',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Adamant Namiki — CVD diamondoid deposition on micro-substrates',
          'Robert Freitas — diamondoid mechanosynthesis hull designs (Nanomedicine)',
          'Nanocomp Technologies — CNT structural composite sheets',
          'NASA JPL — C60 fullerene radiation hardness characterisation',
          'Graphene Flagship (EU) — graphene radiation shielding for space and medical',
          'Lawrence Berkeley National Lab — radiation effects on nanostructured materials'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // PHASE 3 — TISSUE INTERFACE LAYER
      {
        id: 'n-3.1',
        track: 'nanotech',
        phase: 3,
        phaseLabel: 'Phase 3 — Tissue Interface Layer',
        order: 7,
        name: 'Selective Enzyme Scar-Tissue Debridement',
        shortName: 'Scar Tissue Debridement',
        isBoss: false,
        theoreticalTarget:
          'Deploy targeted enzymatic nanocarriers that selectively degrade pathological fibrotic ECM (excess collagen I/III, fibronectin, TGF-β-driven crosslinks) with ≥80% specificity for fibrotic vs. healthy ECM, without disrupting structural collagen in load-bearing tissues or triggering uncontrolled MMP cascades.',
        milestones: [
          {
            id: 'n-3.1.1',
            name: 'Fibrosis-selective MMP nanocarrier (MMP-1/MMP-14 loaded liposome with fibrotic ECM-responsive release trigger) demonstrates >5:1 selectivity for fibrotic collagen degradation vs. healthy collagen in 3D co-culture',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.1.2',
            name: 'Injectable collagenase nanoparticle reduces hepatic fibrosis score by ≥50% in CCl4-induced mouse fibrosis model — no elevation of systemic MMP activity markers in serum',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.1.3',
            name: 'Ultrasound-triggered MMP release system achieves spatially-confined debridement (±500 µm target radius) in ex vivo porcine cardiac scar tissue model — confirmed by histology',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.1.4',
            name: 'Safety confirmed: proteomics panel (>200 ECM proteins) shows no degradation of basement membrane or healthy parenchymal ECM at 2× therapeutic dose in NHP model',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Christopher Overall Lab UBC — MMP biology and substrate specificity',
          'Fibrocor Therapeutics — targeted anti-fibrotic drug development',
          'Galecto Biotech — galectin-3 inhibitors for fibrosis',
          'Fibrogen — FG-3019 anti-fibrotic antibody (CTGF inhibitor)',
          'NanoMedics — MMP-responsive nanoparticle platforms',
          'Michael Bhattacharya Lab — nanofiber ECM drug delivery'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'n-3.2',
        track: 'nanotech',
        phase: 3,
        phaseLabel: 'Phase 3 — Tissue Interface Layer',
        order: 8,
        name: 'Molecular Extracellular Floor Laying',
        shortName: 'ECM Floor Laying',
        isBoss: false,
        theoreticalTarget:
          'Execute programmable de novo synthesis and spatial deposition of a complete, biomimetic ECM scaffold in a defined tissue volume (≥1 cm³) using nanorobotic units — replicating native tissue collagen fibre orientation, proteoglycan distribution, and integrin-binding motif density to within 15% of native composition.',
        milestones: [
          {
            id: 'n-3.2.1',
            name: 'Nanorobot-dispensed recombinant collagen + fibronectin mixture self-assembles into aligned fibrils matching native tissue orientation (±20°) in defined 3D volume under magneto-acoustic guidance',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.2.2',
            name: 'Integrin-binding peptide (RGD, IKVAV, YIGSR) functionalised nanoscaffold demonstrates >85% stem cell attachment efficiency and directed differentiation in target lineage within 7 days',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.2.3',
            name: 'Proteoglycan (heparan sulphate, hyaluronic acid) layer deposited in correct zonal gradients — growth factor sequestration capacity matches native tissue within 20% (ELISA quantified)',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.2.4',
            name: 'Full synthetic ECM construct in 1 cm³ volume supports viable, organised tissue formation (H&E histology confirmed) after 4-week cell culture — recapitulates native tissue architecture',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Organovo — bioprinted liver tissue for drug testing (first commercial bioprinted tissue)',
          'Aspect Biosystems — microfluidic bioprinting for complex tissue',
          'Wake Forest Institute for Regenerative Medicine — Anthony Atala bioprinting',
          'Integra LifeSciences — clinical ECM scaffolds (wound healing)',
          'Spiber Inc — recombinant spider silk structural proteins for scaffolding',
          'MatTek Corporation — EpiDerm 3D human tissue models'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },
      {
        id: 'n-3.3',
        track: 'nanotech',
        phase: 3,
        phaseLabel: 'Phase 3 — Tissue Interface Layer',
        order: 9,
        name: 'Near-Field Direct Code Flashing',
        shortName: 'Nano P2P Code Flashing',
        isBoss: false,
        theoreticalTarget:
          'Implement a nanorobotic peer-to-peer data recovery network where corrupted units receive a complete overwrite of their operational molecular logic stack from a cryptographically verified neighbouring unit — with identity authentication preventing injection of malicious code from compromised peers.',
        milestones: [
          {
            id: 'n-3.3.1',
            name: 'Near-field molecular communication channel (synthetic gap junction + DNA strand displacement relay) transfers ≥1 kilobit of molecular information between adjacent unit pair in <5 minutes with <0.1% error rate',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.3.2',
            name: 'Cryptographic verification protocol (molecular hash based on unique unit identity tag — DNA barcode + toehold switch) prevents code acceptance from units with mismatched identity — 3 verification rounds demonstrated',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.3.3',
            name: 'Corrupted unit successfully receives and overwrites damaged operational RNA program from verified neighbour — restored unit passes functional validation test within 30 minutes of re-flashing',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-3.3.4',
            name: 'Network-level resilience: 20% of units deliberately corrupted in simulated 100-unit swarm — self-healing protocol restores full swarm function within 2 hours without external intervention',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Winfree Lab Caltech — DNA strand displacement cascades for molecular computation',
          'Lucks Lab Northwestern — RNA-based toehold switches and logic (Pardee et al. Cell 2016)',
          'Molecular beacons — Tyagi & Kramer (Nature Biotechnology 1996)',
          'Qian Lab Caltech — DNA computing with error correction',
          'Molecular Communication textbook — Nakano, Eckford, Haraguchi',
          'NTT Research — molecular communication theory and experiment'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      },

      // PHASE 4 — SYSTEM-LEVEL INTEGRATION BOTTLENECK (SLIB)
      {
        id: 'n-4.1',
        track: 'nanotech',
        phase: 4,
        phaseLabel: 'Phase 4 — System-Level Integration Bottleneck (SLIB)',
        order: 10,
        name: 'Mass Swarm Cohesion and Systemic Integration',
        shortName: 'SLIB: Swarm Integration',
        isBoss: true,
        theoreticalTarget:
          'Coordinate ≥10⁹ independent nanorobotic units simultaneously within a single living subject — maintaining therapeutic task execution while preventing: (a) vascular occlusion (<5% hematocrit displacement in any capillary bed simultaneously), (b) immune hyper-response (no cytokine storm or complement cascade), (c) localised thermal toxicity (<0.5°C elevation per mm³), and (d) unit collision cascades.',
        milestones: [
          {
            id: 'n-4.1.1',
            name: 'Distributed consensus algorithm (decentralised, no coordinator) demonstrated for 1,000+ simulated unit swarm — collective therapeutic goal achieved with <1% unit collision rate and <5% hematocrit displacement modelled',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-4.1.2',
            name: 'Biocompatibility: 10⁸ units/kg dose in NHP demonstrates no systemic immune activation (IL-6, TNF-α, complement C3a within 2× baseline at 24h and 72h) — no vascular occlusion by Doppler ultrasound',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-4.1.3',
            name: 'Thermal mapping during simulated therapeutic operation: FEM modelling + ex vivo validation confirms no hotspot exceeds +0.5°C in any 1 mm³ tissue volume at full swarm operational density',
            completed: false,
            evidence: ''
          },
          {
            id: 'n-4.1.4',
            name: 'Full deployment + coordinated therapeutic task + safe retrieval/biodegradation cycle completed in NHP — all units accounted for by acoustic tracking; zero long-term retention at 90-day necropsy',
            completed: false,
            evidence: ''
          }
        ],
        anchors: [
          'Kevin O\'Keeffe MIT — swarmalator collective motion model',
          'DARPA OFFSET — Offensive Swarm-Enabled Tactics programme',
          'Wyss Institute for Biologically Inspired Engineering — microrobotics swarm research',
          'Kilobot — Nagpal Lab Harvard (1000-robot swarm coordination)',
          'Michael Rubenstein — self-organising swarm robotics',
          'Hod Lipson Lab Columbia — self-replicating and self-healing robot swarms'
        ],
        status: 'active',
        papers: [],
        lastUpdated: now
      }
    ];

    const batch = db.batch();
    for (const obstacle of obstacles) {
      const ref = db.collection('obstacles').doc(obstacle.id);
      batch.set(ref, obstacle);
    }
    await batch.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, seeded: obstacles.length })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
