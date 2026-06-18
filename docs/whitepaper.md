# Programmable Detection of Somatic Identity Failure in Living Cells: Milestone Definition and Gap Analysis

**Document type:** Milestone definition and gap analysis  
**Status:** Pre-experimental. No experimental results are reported.

---

## Abstract

This paper defines one milestone: demonstrate, in one somatic lineage, that a synthetic circuit can distinguish sustained co-loss of two lineage master regulators from normal physiological variation in living primary cells. Apoptosis is the proof-of-principle readout; the sensing logic is the claim.

This is a gap analysis, not a therapy proposal or clinical roadmap. Indefinite longevity is not claimed.

The integrated circuit has not been demonstrated in any cell type. Supporting component-level biology exists. The main unresolved obstacles are: temporal discrimination between physiological and pathological LMR dynamics in primary cells; immunogenicity of the sensing engine; dual-vector co-delivery efficiency; and escape suppression under long-term selective pressure.

**Readiness: pre-experimental.** Component biology is established; the integrated function has not been demonstrated.

---

## 1. What Milestone Is Being Defined

**Milestone statement:** Demonstrate, in one somatic lineage, that a synthetic circuit can distinguish sustained co-loss of two lineage master regulators from normal physiological variation in living primary cells.

Apoptosis is the proof-of-principle readout; the sensing logic is the claim.

### 1.1 In Scope

**Core claim:**
- One target lineage (hepatocytes proposed as the first model, given the characterised HNF4A/FOXA2 pair)
- One sensing logic (AND-gated dual-LMR detection)

**Readout and metrics:**
- Quantitative characterisation of false-positive rate: circuit activation during physiological LMR variation
- Quantitative characterisation of false-negative rate: failure to activate during validated sustained LMR co-loss

**Validation context:**
- Primary human cells as the required validation context
- Confirmation of in-circuit discrimination in a living-tissue model (in vivo or 3D organoid)

### 1.2 Out of Scope

- Application to any tissue beyond the proof-of-concept lineage
- Clinical translation at any stage
- Simultaneous multi-lineage deployment
- Delivery solutions for tissues outside the proof-of-concept model
- Claims of lifespan extension
- Secondary clearance modules (e.g., engineered macrophage phagocytosis)

### 1.3 What the Milestone Is and Is Not

The milestone is about detection and discrimination, not therapeutic outcome. Success means a synthetic circuit can reliably distinguish cells with sustained LMR co-loss from cells with transient LMR reduction due to normal physiology. Apoptosis operationalises the readout; it is not asserted to be the optimal long-term output modality, and later versions may use less consequential outputs once the sensing logic is established. Achieving this milestone does not extend lifespan in any model and does not constitute clinical evidence of any kind.

---

## 2. Why This Milestone Matters

Current interventions in aging biology act on established dysfunction. Senolytics clear fully senescent cells. Partial reprogramming targets cells with substantially advanced epigenetic age. Stem cell therapies replenish depleted compartments. Each addresses decline that is already present.

A capability not currently available is detection of early cellular state change — specifically, sustained departure from lineage-defined transcriptional identity — before secondary consequences such as SASP induction or etroelement derepression are established. No programmable, cell-autonomous method for detecting this transition in living somatic cells currently exists.

**What demonstrating this milestone would establish:**

- That sustained LMR co-loss is distinguishable from physiological variation in living primary cells using a synthetic circuit
- The false-positive and false-negative profile of this sensing approach in at least one lineage
- Whether the AND-gate and temporal integration design choices produce adequate discrimination in a real cellular context

**What it would not establish:**

- That somatic identity surveillance extends lifespan
- That the approach transfers to other lineages without independent validation
- That somatic-scale deployment is feasible

The milestone retains value independent of the broader longevity thesis. Demonstrating programmable discrimination of early cellular state failure is a synthetic biology result, and the false-positive and false-negative data it generates would be informative regardless of how the longevity question resolves.