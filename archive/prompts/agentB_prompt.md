You are Codex Agent B working on branch `normalization/pro0`.

Goal
- Execute Phases 0–4 of the mechanical normalization plan and apply the pricing/content fixes from Pro’s reviews. Treat `archive/prompts/son1.markdown` as orchestration, and read:
  - docs/haiku-docs/_incoming/pro0.markdown (content review per file)
  - docs/haiku-docs/_incoming/pro2.markdown (pricing/output‑rate corrections and P0 patches)

Skip (Agent A owns these files)
- docs/haiku-docs/architecture/data-model.md
- docs/haiku-docs/architecture/information-flow.md
- docs/haiku-docs/three-pillars/pillar-1/pillar-1-detail.md
- docs/haiku-docs/use-cases/code-review.md

Work on all other files under docs/haiku-docs/.

Phase 0 – Pricing corrections (see pro2)
1) Replace Haiku `$0.80/M` → `$1.00/M` everywhere.
2) Ensure output rates are correct in examples: Haiku `$5/M` out, Sonnet `$15/M` out (Opus `$75/M` out). Recompute totals and savings accordingly.
3) Where possible, replace hardcoded pricing with a link to `[Pricing](appendix/pricing)`.

Phase 1 – File organization (verify)
4) Confirm all files are already under `docs/haiku-docs/` (organization done). No structural moves needed.

Phase 2 – Foundation files
5) Ensure `docs/haiku-docs/appendix/pricing.md` exists (already added) and aligns with corrected math.
6) Create `docs/haiku-docs/appendix/models.md` describing Opus/Sonnet/Haiku roles, when to use each, and linking back to pricing (do not hardcode rates inline; refer to Pricing).
7) Create `docs/haiku-docs/MISSING_FILES.md` listing the two remaining missing docs to generate later (home-detail.md; three-pillars/pillar-1/400px-width-math.md) with path, length, and content notes.

Phase 3 – Consistency fixes
8) Update the TypeScript interface in `architecture/data-model.md` (but do not add the cost function). Changes:
   - Use `haikuRuns: Array<{ prompt: string; tokens: number; parallelIndex?: number; timestamp?: string }>`
   - `type ISO8601 = string` and use it consistently.
   - Remove fields that can be derived (e.g., hasDetailLayer, linkedFrom); document derivation instead.
9) Remove `.md` from all internal links; keep extension‑less references.
10) Add YAML front‑matter (id/title/models/summary/readTime) to any doc missing it (vision.md, research.md, learning.md, debugging.md, etc.).
11) Add a breadcrumb line after the `<!-- model: ... -->` tag (e.g., `> **Path:** Home › …`).
12) Add the standardized “Related” footer block (Next / See also / Back) across all docs.
13) Apply the per‑file P0 content patches from pro0/pro2 (e.g., vision.md/token-economics.md updates, link fixes).
14) Align time estimates between `INDEX.md` and `QUICK_START.md` (pick one source of truth and update the other).

Phase 4 – Validation tools & checks
15) Add `scripts/docs-lint.js` that checks: front‑matter, breadcrumb, standard footer, no internal `.md` links, and no `$0.80` remnants.
16) Add `scripts/diagram-width-check.sh` that flags non‑code ASCII lines > 40 chars.
17) Run both scripts and fix any reported violations.

References to read
- archive/prompts/son1.markdown (orchestration context)
- docs/haiku-docs/_incoming/pro0.markdown (content review)
- docs/haiku-docs/_incoming/pro2.markdown (pricing/output examples and patches)

Commit message
`feat: Normalize documentation structure and pricing`

