# Programmable Detection of Somatic Identity Failure in Living Cells: Milestone Definition and Gap Analysis

**DOI:** [10.5281/zenodo.20793473](https://doi.org/10.5281/zenodo.20793473)  
**Immortality Index** · Independent Distributed Research Infrastructure · 2026


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

A capability not currently available is detection of early cellular state change — specifically, sustained departure from lineage-defined transcriptional identity — before secondary consequences such as SASP induction or retroelement derepression are established. No programmable, cell-autonomous method for detecting this transition in living somatic cells currently exists.

**What demonstrating this milestone would establish:**

- That sustained LMR co-loss is distinguishable from physiological variation in living primary cells using a synthetic circuit
- The false-positive and false-negative profile of this sensing approach in at least one lineage
- Whether the AND-gate and temporal integration design choices produce adequate discrimination in a real cellular context

**What it would not establish:**

- That somatic identity surveillance extends lifespan
- That the approach transfers to other lineages without independent validation
- That somatic-scale deployment is feasible

The milestone retains value independent of the broader longevity thesis. Demonstrating programmable discrimination of early cellular state failure is a synthetic biology result, and the false-positive and false-negative data it generates would be informative regardless of how the longevity question resolves.

---

## 3. What Is Already Known

### 3.1 Established Biology

- **Lineage identity is maintained by a small number of master regulators.** HNF4A and FOXA2 are jointly required for hepatocyte identity; their loss drives dedifferentiation [1,2]. Equivalent LMR pairs have been characterised in multiple lineages.
- **Epigenetic drift occurs with age and predicts mortality.** DNA methylation-based estimators capture biological age as a quantity that diverges from a youthful reference and independently predicts all-cause mortality [3,4,5]. This supports the inference that cellular state control degrades with age but does not specify timing or cellular mechanism.
- **Senescent cells accumulate and contribute to tissue dysfunction.** Genetic or pharmacological clearance of p16$^\text{INK4a}$-positive cells improves tissue function in murine models [11]. The cells eliminated are already fully senescent.
- **LINE-1 retroelement reactivation in senescent cells drives chronic inflammation.** Loss of heterochromatic silencing generates a type I interferon response that propagates to adjacent tissue [6]. This is a downstream consequence of identity loss, not an early marker.
- **Split-intein trans-splicing is efficient in mammalian cells.** Multiple split-intein pairs perform protein ligation in mammalian cell lines [9]. The Npu DnaE pair has characterised in vitro kinetics compatible with the assembly timescales required for the proposed circuit [14].
- **Inducible apoptotic safety switches are clinically validated.** iCasp9/AP20187 eliminates >99% of engineered cells within hours and has been used safely in adoptive cell therapy trials [13].
- **Synthetic AND-gate logic has been demonstrated in mammalian cell circuits.** synNotch two-stage gating [15] and split-protein reconstitution systems have been demonstrated in T-cell and oncology contexts. Not demonstrated for somatic identity sensing.

### 3.2 Plausible Inferences

These are supported by the evidence above but are not directly demonstrated:

- Sustained LMR co-loss may precede the p16$^\text{INK4a}$ threshold, creating a detectable pre-senescent window. Whether this window is large enough to be actionable is not established.
- Pairwise LMR sensing may improve specificity over single-marker detection, because individual LMRs fluctuate during normal physiology whereas co-loss of two jointly necessary factors may be a more specific signal. This depends on the correlation structure of physiological LMR oscillations, which has not been characterised at the required resolution.
- Temporal integration may further reduce false positives from transient LMR dips. Whether physiological and pathological co-loss durations are empirically distinguishable in primary cells is an open question.

### 3.3 Proposed Engineering

These are design proposals, not demonstrated components:

- A split-intein AND-gate for dual-LMR sensing, producing active caspase only when both LMRs are co-absent. Not yet assembled or tested in any cell.
- A stable inhibitory intermediate providing temporal integration, whose degradation half-life must be calibrated empirically per lineage.
- A dual-vector co-delivery strategy requiring the same cell to take up two distinct vector payloads at functionally relevant co-transduction efficiency.
- A split caspase-3 payload reconstituted via intein trans-splicing. The specific split-point and linker configuration for this application have not been validated.

---

## 4. Proposed Implementation

### 4.1 Core Circuit

The circuit requires two co-delivered vector fragments:

- **Fragment A:** Promoter responsive to LMR 1 → N-terminal split-intein domain fused to N-terminal split-caspase subunit (catalytically inert alone)
- **Fragment B:** Promoter responsive to LMR 2 → C-terminal split-intein domain fused to C-terminal split-caspase subunit

**Gate logic:**

| LMR 1 | LMR 2 | Assembly possible | Response triggered |
|---|---|---|---|
| Present | Present | Yes | No (inhibitor maintained) |
| Absent | Present | No | No |
| Present | Absent | No | No |
| Absent (sustained) | Absent (sustained) | Yes | Yes (after temporal delay) |

Assembly is structurally prevented when either fragment is absent — the AND requirement is intrinsic to the split-intein mechanism, not a soft regulatory threshold.

### 4.2 Why Pairwise Input

Individual LMRs fluctuate during circadian cycling, stress responses, and mitotic entry. Requiring co-loss of two jointly necessary LMRs is more specific than single-marker sensing. This specificity advantage depends on the two target LMRs not regularly co-oscillating under normal physiological conditions — an assumption that must be validated empirically before threshold calibration is possible.

### 4.3 Temporal Integration and Output Choice

Because apoptotic commitment is irreversible, instantaneous response to LMR co-loss would activate during any physiological co-dip. To prevent this, the circuit drives expression of a stable inhibitory protein rather than producing active caspase directly. The inhibitor decays slowly enough that transient LMR co-reductions cannot deplete it before LMR expression recovers; only sustained co-loss crosses the threshold. The required inhibitor half-life must be determined from primary cell LMR dynamics — it is a measurement, not a free parameter.

Apoptosis is used here as a proof-of-principle readout only; it is not asserted to be the best long-term output modality. It provides a binary, non-inflammatory, unambiguous readout that is straightforward to score. Later versions may use less consequential outputs once the sensing logic is established.

### 4.5 Safety Override

Every circuit configuration used in vivo must include an independently triggered safety switch capable of eliminating all circuit-bearing cells rapidly regardless of circuit state. The iCasp9/AP20187 system meets this requirement and is clinically validated [13]. This is a non-negotiable design requirement, not an optional component.

### 4.6 Secondary Module (Not Part of This Milestone)

An engineered macrophage follow-on module for phagocytic clearance of circuit-committed cells is proposed as a future second layer. It is explicitly not scored as part of this milestone. Its development is not justified until the core circuit is functional and characterised.

---

## 5. Experimental Roadmap

---

**Milestone 1: AND-gate logic in an established cell model**

- **Objective:** Confirm that the circuit produces apoptotic output only under dual LMR co-loss, not under single-LMR knockdown or intact conditions.
- **Minimal experiment:** Transfect Fragment A and Fragment B into a hepatoma cell line (e.g., HepG2) with characterised HNF4A and FOXA2 expression. Apply four conditions: both LMRs intact; LMR 1 knocked down alone; LMR 2 knocked down alone; both knocked down simultaneously.
- **Primary readout:** Annexin V / DAPI flow cytometry; intein assembly by co-immunoprecipitation (anti-HA / anti-Flag).
- **Success criterion:** Apoptotic signal ≥10-fold above background in the dual-knockdown condition only; no statistically significant increase over background in either single-knockdown or intact-control condition; safety override (doxycycline-mediated silencing) eliminates signal completely.
- **Main failure mode:** Apoptotic signal in single-knockdown conditions, indicating partial intein assembly at subsaturating fragment concentrations.
- **What failure teaches:** Whether the current promoter configuration provides adequate stoichiometric control for AND-gate specificity; the minimum fragment concentration ratio required; whether a different intein pair or promoter architecture is needed before proceeding.

---

**Milestone 2: Temporal discrimination in primary hepatocytes**

- **Objective:** Confirm that the circuit does not activate during physiological LMR variation in primary cells, and does activate under sustained LMR co-loss.
- **Minimal experiment:** Deliver Fragment A and Fragment B to primary human hepatocytes from ≥3 independent donors. Characterise baseline LMR expression dynamics by RNA-seq over 72 hours in the same donor cells. Apply sustained dual-knockdown (≥48 hours, confirmed by RT-qPCR). Measure apoptotic output under both conditions.
- **Primary readout:** Annexin V / DAPI flow cytometry; LMR protein levels by Western blot at matching timepoints.
- **Success criterion:** No statistically significant increase in apoptosis during physiological LMR oscillation versus vehicle control; ≥10-fold apoptotic signal above baseline under sustained dual-knockdown; replicated in all three donors.
- **Main failure mode:** False-positive apoptosis during physiological LMR dips; or failure to activate under sustained knockdown (false negative in primary cells).
- **What failure teaches:** The amplitude and duration of physiological LMR co-variation in primary hepatocytes — data required to set the inhibitor half-life. Failure also determines whether the temporal delay approach is calibratable in primary cells or whether a supplementary discriminating variable is needed.

---

**Milestone 3: Immunological compatibility of the sensing engine**

- **Objective:** Confirm that an intein variant with reduced predicted CTL epitope burden retains assembly kinetics compatible with circuit function; or demonstrate that a humanised alternative achieves equivalent AND-gate performance.
- **Minimal experiment:** Screen the wild-type Npu DnaE sequence against a representative HLA supertype panel using NetMHCpan or equivalent. Generate minimum-epitope variants by conservative substitution at high-scoring solvent-exposed residues, protecting the catalytic triad. Measure assembly rate of de-immunized variant versus wild-type in vitro and in cell lines.
- **Primary readout:** In vitro trans-splicing kinetics (half-time for ligation product formation); predicted high-affinity epitope count (IC₅₀ ≤500 nM) across the tested HLA panel.
- **Success criterion:** De-immunized variant retains assembly rate within 2-fold of wild-type; predicted high-affinity epitopes reduced by ≥80% across the HLA panel. If this fails: a humanised dimerisation alternative (e.g., FKBP/FRB or leucine-zipper complementation) must achieve Milestone 1 criteria before the programme continues.
- **Main failure mode:** Structural disruption of the intein fold by surface substitutions required for epitope elimination, producing kinetic degradation below the threshold required for reliable circuit function.
- **What failure teaches:** Whether the Npu DnaE scaffold is compatible with de-immunization; or whether the sensing engine must be replaced with a human-origin alternative, requiring Milestones 1 and 2 to be repeated with the new engine.

---

**Milestone 4: Escape resistance under long-term selective pressure**

- **Objective:** Confirm that cells cannot evade circuit-mediated apoptosis through stochastic loss-of-function events over 30 days under active selective pressure.
- **Minimal experiment:** Apply the circuit to a cell model in which LMR co-loss and circuit activation are confirmed (Milestone 1 passed). Culture under continuous LMR co-loss selective pressure for 30 days. Sequence circuit loci (both promoter regions and intein coding domains) in all surviving colonies. Re-apply Milestone 1 conditions to surviving colonies.
- **Primary readout:** Deep sequencing of circuit loci in surviving colonies; Milestone 1 apoptotic response assay on surviving subpopulations.
- **Success criterion:** Zero colonies with circuit-inactivating mutations or promoter methylation at circuit loci; circuit activity in surviving colonies is indistinguishable from the starting culture; replicated in ≥3 independent biological replicates.
- **Main failure mode:** Reproducible emergence of escape variants — through promoter CpG methylation, intein truncation, or downstream effector loss — at a frequency inconsistent with the expected basal somatic mutation rate.
- **What failure teaches:** Whether the circuit requires an anti-escape architecture (coupling circuit integrity to an essential gene, so that circuit loss causes metabolic collapse) before long-term deployment is feasible; the specific escape mechanism observed determines what architectural modification is needed.

---

**Milestone 5: In vivo co-delivery and circuit function in a hepatocyte model**

- **Objective:** Confirm that both fragments can be co-delivered to the same hepatocytes in a living organ, that the circuit responds specifically to LMR co-loss in vivo, and that the safety override functions as required.
- **Minimal experiment:** Humanised mouse liver model. Co-administer both vectors by hepatic injection. Confirm co-transduction in isolated hepatocytes by dual reporter expression (flow cytometry). Induce LMR co-loss by AAV-mediated Cas9 delivery to circuit-bearing cells. Measure apoptotic output in targeted versus non-targeted hepatocytes. Administer AP20187; confirm elimination of circuit-bearing cells.
- **Primary readout:** Percentage of isolated hepatocytes that are dual-reporter-positive; Annexin V signal in LMR-targeted versus non-targeted hepatocytes; circuit-bearing cell count at 0 and 4 hours post AP20187.
- **Success criterion:** ≥15% dual-reporter-positive co-transduction in isolated hepatocytes (provisional; to be revised based on Milestone 2 effect-size data); specific Annexin V signal in LMR-targeted cells with no detectable increase above background in non-targeted bystander hepatocytes; ≥99% circuit-bearing cell elimination within 4 hours of AP20187 administration.
- **Main failure mode:** Insufficient co-transduction efficiency; or off-target apoptosis in non-targeted hepatocytes above the detection threshold of cfDNA or histological assays.
- **What failure teaches:** Whether dual-vector hepatic delivery requires alternative strategies (co-packaging, non-viral vehicles, iterative dosing); whether the circuit generates bystander toxicity in a living-tissue context; sets the feasibility ceiling for in vivo deployment before any subsequent development.

---

## 6. Falsification Criteria

Each criterion specifies what result constitutes failure, whether that failure kills the concept or only the current design, and what redesign is suggested.

---

**F1: Unacceptable false-positive rate — concept or model failure**

- *Failure result:* Circuit activates during physiological LMR variation in primary cells, and this cannot be resolved by adjustment of the temporal integration window, across multiple independently tested LMR pairs.
- *If this occurs across multiple lineages and LMR pairs:* **Concept failure** for duration-based temporal discrimination. The discriminating variable must change.
- *If lineage-specific:* **Model failure**. A different LMR pair or lineage is needed.
- *Redesign direction:* Add a third co-sensor (chromatin accessibility, metabolic marker); shift the discriminating variable from duration to amplitude; evaluate lineages with lower physiological LMR noise.

---

**F2: Kinetic loss from de-immunization — implementation failure**

- *Failure result:* No de-immunized intein variant retains assembly rate within 2-fold of wild-type, and no humanised alternative achieves Milestone 1 criteria.
- *Classification:* **Implementation failure** for Npu DnaE. Not concept failure — the AND-gate design remains valid if a different engine can be found.
- *Redesign direction:* Develop a humanised CID or leucine-zipper split-caspase system using human-origin sequences. Repeat Milestones 1 and 2 with the new engine before continuing.

---

**F3: Loss of temporal discrimination — concept or model failure**

- *Failure result:* The duration of physiological LMR co-reduction in primary cells substantially overlaps with the duration of early pathological co-loss, making any single integration window generate either unacceptable false positives or unacceptable false negatives.
- *If cross-lineage:* **Concept failure** for duration-based gating as the sole discriminant.
- *If lineage-specific:* **Model failure**.
- *Redesign direction:* Add an epigenetic co-sensor (H3K27ac or chromatin accessibility at LMR target genes) to distinguish physiological dips, which retain chromatin accessibility, from pathological loss, which does not.

---

**F4: Escape mutations exceed suppression capacity — implementation failure unless anti-escape architecture also fails**

- *Failure result:* Circuit-inactivating events occur in ≥3 of 5 independent biological replicates within 30 days under selective pressure, and coupling circuit integrity to an essential gene does not prevent escape in a subsequent 30-day test.
- *Classification:* Milestone 4 failure alone is **implementation failure**, correctable by anti-escape architecture. If anti-escape architecture also fails reproducibly, this approaches **concept failure** for the single-circuit approach.
- *Redesign direction:* Redundant circuits at independent genomic loci; stochastic barcode coupling to multiple essential genes.

---

**F5: Co-delivery cannot be demonstrated at functionally relevant efficiency — implementation failure**

- *Failure result:* Co-transduction cannot exceed a functionally relevant threshold (provisionally 5% of target cells; exact requirement depends on Milestone 2 effect-size data) using any delivery strategy in any in vivo or organoid model.
- *Classification:* **Implementation failure** for the dual-vector approach. The sensing concept may remain valid in vitro or with alternative delivery.
- *Redesign direction:* Co-packaging both fragments in a single high-capacity vector; mRNA co-delivery; alternative cell types with higher susceptibility; iterative dosing to build coverage.

---

**F6: Bystander toxicity above detection threshold — model or concept failure**

- *Failure result:* Off-target apoptosis in non-circuit-bearing cells above the sensitivity of cfDNA or histological assays in vivo, across multiple delivery strategies and circuit configurations.
- *If delivery-method-specific:* **Model failure**.
- *If persistent across strategies and configurations:* **Concept failure** for apoptosis as the output modality in vivo.
- *Redesign direction:* Replace the apoptotic output with a surface marker change for initial in vivo experiments; restrict promoters to tighter lineage-specific elements; validate the circuit in 3D organoid systems before any in vivo work.

---

## 7. Current Status and Progress Estimate

### 7.1 Component Status

| Component | Status |
|---|---|
| HNF4A/FOXA2 as hepatocyte identity determinants | **Established** [1,2] |
| Epigenetic drift as aging correlate | **Established** [3,4,5] |
| Senescent cell clearance benefit | **Established** [11] |
| Retroelement reactivation in senescence | **Established** [6] |
| Npu DnaE split-intein kinetics in mammalian cells | **Established** [9,14] |
| iCasp9/AP20187 safety switch | **Established** (clinically validated) [13] |
| AND-gate logic in mammalian cells (general contexts) | **Established** (not for LMR sensing) [15] |
| Temporal integration in synthetic biology (general) | **Partial** (not demonstrated for LMR sensing in primary somatic cells) |
| AND-gate circuit for LMR identity sensing | **Missing** |
| Temporal discrimination in primary somatic cells | **Missing** |
| De-immunized intein with maintained assembly kinetics | **Missing** |
| Dual-vector co-delivery at relevant efficiency | **Missing** |
| Escape resistance under long-term selective pressure | **Missing** |
| In vivo circuit function in any somatic tissue | **Missing** |

### 7.2 Blocking Bottlenecks

1. **Immunogenicity.** No immunologically compatible intein engine exists. MHC Class I presentation of Npu DnaE-derived peptides will likely generate CTL responses in vivo. This must be resolved before in vivo work is justified.
2. **LMR dynamics data.** The inhibitor half-life required for temporal discrimination cannot be set without single-cell LMR co-expression dynamics data in primary hepatocytes. This data does not exist at the required resolution.
3. **Co-delivery efficiency.** Simultaneous co-transduction of the same primary somatic cell with two distinct vectors at functionally relevant efficiency has not been demonstrated for this application.
4. **Escape suppression.** The frequency of circuit-evasive events in primary cells under long-term apoptotic selective pressure is uncharacterised. Anti-escape architecture has been proposed but not tested.

### 7.3 Milestone Progress

| Milestone | Status |
|---|---|
| M1: AND-gate logic in established cell model | Not attempted |
| M2: Temporal discrimination in primary hepatocytes | Not attempted |
| M3: Immunological compatibility of sensing engine | Not attempted |
| M4: Escape resistance under selective pressure | Not attempted |
| M5: In vivo co-delivery and circuit function | Not attempted |

### 7.4 Readiness

> **Readiness band: Pre-experimental.** Supporting component-level biology is established. The integrated circuit has not been assembled. All five milestones are unattempted. Only component biology exists; the integrated capability has not been demonstrated.

---

## 8. Limitations

**Tissue specificity.** Validation in hepatocytes does not transfer to other lineages. Each lineage requires independent LMR identification, physiological dynamics characterisation, inhibitor half-life calibration, and delivery optimisation. Extension from one lineage to a broader somatic application represents a large, separate research programme.

**Delivery.** Dual-vector co-delivery is an unsolved problem for this application. The 15% co-transduction threshold in Milestone 5 is a floor for proof-of-concept in a mouse model. Tissue-scale maintenance at clinical relevance would require substantially higher coverage and a re-dosing strategy that is not yet defined.

**Immunogenicity.** If Milestone 3 fails for Npu DnaE and no humanised alternative is found, the class of intein-based sensing engines requires replacement. This would require Milestones 1 and 2 to be repeated with the replacement engine before any further progress can be claimed.

**Long-term epigenetic silencing.** Synthetic promoter configurations are susceptible to CpG methylation over time. Circuit silencing would reduce coverage without generating a detectable adverse signal, resulting in accumulation of undetected identity failure in formerly circuit-bearing cells. Long-term stability studies (>90 days) are not part of the current milestone sequence but are a prerequisite for any long-duration application.

**False-positive accumulation at scale.** A false-positive rate that is negligible in short-term primary cell assays can accumulate into significant tissue loss integrated over many cells and many years. The acceptable rate at scale cannot be determined until the natural frequency of genuine identity failure events is independently characterised.

**Scope.** This paper does not describe a therapy. In vivo proof-of-concept in a mouse model is not clinical evidence. Extension to a human clinical context would require independent safety characterisation, GMP production, regulatory approval, and clinical trial infrastructure. None of those steps are addressed here.

---

## 9. Conclusion

This paper defines a single milestone: a synthetic circuit that can distinguish sustained co-loss of two lineage master regulators from normal physiological variation in living primary cells, in one somatic lineage. That capability does not currently exist. The integrated system has not been assembled or tested. If demonstrated, it would establish a new synthetic biology capability relevant to long-term somatic maintenance, while remaining far short of clinical translation or any claim of longevity.

---

## References

[1] López-Otín, C., Blasco, M.A., Partridge, L., Serrano, M., & Kroemer, G. (2013). The hallmarks of aging. *Cell*, 153(6), 1194–1217. https://doi.org/10.1016/j.cell.2013.05.039

[2] López-Otín, C., Blasco, M.A., Partridge, L., Serrano, M., & Kroemer, G. (2023). Hallmarks of aging: An expanding universe. *Cell*, 186(2), 243–278. https://doi.org/10.1016/j.cell.2022.11.001

[3] Horvath, S. (2013). DNA methylation age of human tissues and cell types. *Genome Biology*, 14(10), R115. https://doi.org/10.1186/gb-2013-14-10-r115

[4] Lu, A.T., et al. (2019). DNA methylation GrimAge strongly predicts lifespan and healthspan. *Aging*, 11(2), 303–327. https://doi.org/10.18632/aging.101684

[5] Belsky, D.W., et al. (2020). DunedinPACE, a DNA methylation biomarker of the pace of aging. *eLife*, 9, e54870. https://doi.org/10.7554/eLife.54870

[6] De Cecco, M., et al. (2019). L1 drives IFN in senescent cells and promotes age-associated inflammation. *Nature*, 566(7742), 73–78. https://doi.org/10.1038/s41586-018-0784-9

[9] Shah, N.H. & Muir, T.W. (2014). Inteins: Nature's gift to protein chemists. *Chemical Science*, 5(2), 446–461. https://doi.org/10.1039/C3SC52951G

[11] Campisi, J. (2013). Aging, cellular senescence, and cancer. *Annual Review of Physiology*, 75, 685–705. https://doi.org/10.1146/annurev-physiol-030212-183653

[13] Di Stasi, A., et al. (2011). Inducible apoptosis as a safety switch for adoptive cell therapy. *New England Journal of Medicine*, 365(18), 1673–1683. https://doi.org/10.1056/NEJMoa1106152

[14] Zettler, J., Schütz, V., & Mootz, H.D. (2009). The naturally split Npu DnaE intein exhibits an extraordinarily high rate in the protein trans-splicing reaction. *FEBS Letters*, 583(5), 909–914. https://doi.org/10.1016/j.febslet.2009.02.003

[15] Roybal, K.T., et al. (2016). Precision tumor recognition by T cells with combinatorial antigen-sensing circuits. *Cell*, 164(4), 770–779. https://doi.org/10.1016/j.cell.2016.01.011

