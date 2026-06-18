# Immortality Index
### A Binary Milestone Registry for Longevity Research

A structured, open-source, binary milestone registry tracking humanity's quantitative progress toward defeating biological aging. Designed for formal academic citation and collaborative scientific contribution.

**Live platform:** [immortality-index.pages.dev](https://immortality-index.pages.dev)  
**Documentation & whitepaper:** [immortalityindex.github.io/immortality-index](https://immortalityindex.github.io/immortality-index)  
**Academic citation:** See [`CITATION.cff`](./CITATION.cff) and [`docs/whitepaper.md`](./docs/whitepaper.md)

---

## AI Authorship Disclosure

This project was conceived by a human and developed through AI-assisted collaboration — initially with Google Gemini, then further refined with Claude (Anthropic). All framework design, obstacle definitions, milestone criteria, quantitative thresholds, and the academic whitepaper were generated through this human–AI process and lightly reviewed by a human. We make this disclosure in the interest of full transparency about the origins of this work.

---

## About

The Immortality Index operationalises the engineering prerequisites for negligible somatic senescence. Rather than tracking qualitative "progress," it uses a formal dependency graph of **24 research obstacles** across two primary engineering tracks, each governed by **four binary milestone gates** — concrete, falsifiable achievements that peer-reviewed literature either confirms or does not.

Milestone status is updated autonomously every six hours via large-language-model (LLM) edge-worker literature scanning against peer-reviewed sources. No human curator adjusts thresholds after the fact. This design ensures the framework functions as a **neutral, falsifiable benchmarking mechanism** rather than an advocacy tool.

### Engineering Tracks

- **Track 01 · Somatic Genetic Fidelity** — 14 obstacles, 56 milestones  
  Covers epigenetic reprogramming, genomic error-correction, senescent cell clearance, vascular gene delivery, telomere maintenance, transcriptional fidelity, and somatic identity verification.

- **Track 02 · Nanoscale Biomedical Systems** — 10 obstacles, 40 milestones  
  Covers nanoscale mechanical propulsion, reversible neuromorphic processing, acoustic mesh networks, molecular assembly, radiation-hardened structural hulls, tissue interface scaffolding, extracellular matrix engineering, code-flashing protocols, and swarm cohesion integration.

---

## Citing This Work

This framework is designed for formal academic citation. If you reference, build upon, or integrate the Immortality Index into your research, please cite using the bibliographic metadata in [`CITATION.cff`](./CITATION.cff).

**BibTeX:**
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

**APA:**
> Immortality Index. (2026). *Immortality Index: A Binary Milestone Registry for Longevity Research* (Version 1.0.0). GitHub. https://doi.org/10.5281/zenodo.PLACEHOLDER

---

## Structure

```
immortality-index/
├── index.html              # Live dashboard — real-time milestone registry
├── admin.html              # Authenticated administration panel
├── docs/
│   ├── index.html          # GitHub Pages documentation entry point
│   └── whitepaper.md       # Full academic preprint
├── workers/
│   ├── scanner.js          # Cloudflare edge worker — LLM literature scanning
│   └── wrangler.toml       # Worker deployment configuration
├── .github/
│   ├── workflows/
│   │   └── deploy-worker.yml
│   └── ISSUE_TEMPLATE/
│       ├── milestone-achieved.md
│       └── incorrect-assessment.md
├── CITATION.cff            # Structured academic citation metadata
├── MILESTONES.md           # Static reference snapshot of all obstacles & milestones
├── LICENSE                 # CC BY 4.0
└── README.md
```

---

## Contributing

Contributions must satisfy the following criteria to maintain scientific integrity:

1. **Falsifiability:** Every proposed milestone must be binary (achieved / not achieved) and evaluable from peer-reviewed primary literature alone.
2. **Independence:** No milestone may depend on proprietary data, paywalled datasets, or unpublished results.
3. **No threshold manipulation:** Milestone thresholds may only be adjusted via public, peer-reviewed consensus with documented justification in the pull request.
4. **Attribution:** All contributions are attributed to the Immortality Index project unless a contributor explicitly opts into named attribution.

Open an Issue using the provided templates to propose new milestones, dispute assessments, or report incorrect AI-assigned completions.

---

## Anonymity

This project is maintained anonymously to ensure the framework's scientific assessments remain free from institutional bias, funding pressure, or individual reputational incentive. All contributors are anonymous by default. This is a deliberate structural choice to preserve the integrity of the benchmarking mechanism.

---

## License

[CC BY 4.0](./LICENSE) — You are free to share, adapt, and build upon this work for any purpose, including commercial and academic, provided you give appropriate attribution to the Immortality Index and link to the original repository.
