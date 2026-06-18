# Contributing to the Immortality Index

The Immortality Index is an open-science platform. Every milestone state in this registry is backed by peer-reviewed evidence — and we need the global research community to help keep it accurate.

---

## How Milestone Completion Works

Our nightly AI scanner monitors biomedical literature automatically. When it identifies a paper that satisfies a milestone's theoretical target and passes all inclusion criteria, it marks the milestone complete. However, no automated system is perfect. If our scanner misses a paper, or if you have direct knowledge of qualifying research, you can submit a **Peer Review Pull Request** to manually trigger a milestone check.

---

## Submitting a Peer Review Pull Request

### Eligibility Criteria

Before submitting, verify the paper meets **all** of the following requirements:

| Criterion | Minimum Threshold |
|-----------|-------------------|
| Sample size | n ≥ 30 (human cell/organoid); n ≥ 50 (murine in vivo); n ≥ 20 (NHP); n ≥ 30 (human trial) |
| Statistical significance | p < 0.01 on all primary endpoints, with multiple-comparison correction |
| Independent replication | At least one independent lab replication within the prior 24 months |
| Blinded outcome assessment | Primary endpoints assessed blind to treatment allocation |
| Data availability | Raw data deposited in a public repository (GEO, ArrayExpress, Zenodo, etc.) |

Papers that do not meet every criterion will not be accepted regardless of the quality of the findings.

### Step-by-Step Process

1. **Fork** this repository and create a new branch named `pr/milestone-[obstacle-id]` (e.g. `pr/milestone-g-3.2`).

2. **Open or edit** the file `MILESTONE_EVIDENCE.md` (create it if it does not yet exist) and add an entry in the following format:

```markdown
## [Obstacle ID] — [Obstacle Name]
### Milestone: [Milestone ID] — [Milestone Name]

**DOI:** https://doi.org/[paper-doi]
**Authors:** [Author et al.]
**Year:** [YYYY]
**Journal:** [Journal Name]
**Sample Size:** n = [X]
**p-value:** [X]
**Replication DOI:** https://doi.org/[replication-doi]

**Summary of Relevance:**
[2–4 sentences explaining precisely how this paper satisfies the milestone's theoretical target.
Quote the specific result from the paper. Do not paraphrase loosely.]

**Data Repository:** [URL to public data deposit]
```

3. **Submit a Pull Request** against the `main` branch with the title: `[Milestone Evidence] G-X.X.X — [Short description]`

4. A reviewer will evaluate the submission against the inclusion criteria above. If accepted, the milestone state will be updated in Firestore and the evidence link will be added to the public record.

---

## What Happens After Acceptance

Accepted submissions trigger a Firestore milestone update, add the paper DOI to the obstacle's public evidence log, and are credited in the commit history. The nightly AI scanner will also incorporate the new evidence into its future context window for related milestone checks.

---

## Conduct and Scope

- Submissions must be in good faith. Do not submit papers you authored without disclosing the conflict of interest in the PR description.
- Do not submit preprints that have not yet passed peer review.
- Do not submit papers that partially address a milestone. The theoretical target is the specification — if the paper does not directly satisfy it, it does not qualify.
- Questions about the framework or milestone definitions can be raised as GitHub Issues.

---

## Citation

If you use the Immortality Index in your research, please cite:

```bibtex
@misc{immortalityindex2026,
  author       = {{Immortality Index}},
  title        = {Immortality Index: A Binary Milestone Registry for Longevity Research},
  year         = {2026},
  publisher    = {GitHub},
  doi          = {10.5281/zenodo.PLACEHOLDER},
  url          = {https://github.com/immortalityindex/immortality-index},
  note         = {Version 1.0.0. License: CC BY 4.0}
}
```

---

*Immortality Index — Independent Distributed Research Infrastructure*
*License: CC BY 4.0*
