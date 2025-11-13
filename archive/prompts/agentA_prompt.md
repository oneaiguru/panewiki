You are Codex Agent A working on branch `tech-fixes/pro1`.

Goal
- Apply the five technical fixes from Pro’s review to four files only. Treat `archive/prompts/son1.markdown` as orchestration context and `docs/haiku-docs/_incoming/pro1.markdown` as the source of truth for exact patches.

Scope (edit ONLY these files)
1) docs/haiku-docs/architecture/data-model.md
2) docs/haiku-docs/architecture/information-flow.md
3) docs/haiku-docs/three-pillars/pillar-1/pillar-1-detail.md  ← Agent A owns this file end‑to‑end
4) docs/haiku-docs/use-cases/code-review.md

Tasks (details/examples in pro1.markdown)
- data-model.md
  - Add PRICING constants + `calculateNodeCost()` helper (per pro1) and update in‑file examples to call it.
  - Do NOT change the TypeScript interface (Agent B will update the interface in a separate branch).

- information-flow.md
  - Insert the three ASCII blocks and notes: “Parallel Haiku with timeouts”, “Sonnet validation failure path”, and “Retry logic decision tree”.

- pillar-1-detail.md (full ownership by Agent A)
  - Add YAML front‑matter, a breadcrumb line after the model tag, and the standard “Related” footer.
  - Append the “References” section (NNG, GOV.UK, Dyson & Haselgrove) exactly as in pro1.
  - Insert the minimal CSS snippet in the “400px Architecture” section (400px and 65ch alternative, responsive/a11y).

- code-review.md
  - Replace the insecure auth middleware with the hardened version (Bearer prefix check, env‑based secrets, RS256).
  - Add the rate‑limited `/login` example and the `requireAuth` verifier (≤15 lines each), exactly as in pro1.

Out of scope
- Do not touch any other files.

References to read
- archive/prompts/son1.markdown (orchestration context)
- docs/haiku-docs/_incoming/pro1.markdown (exact patches and code blocks)

Formatting
- Keep code blocks within the line limits noted above; run markdown formatting if configured.

Commit message
`fix: Apply P0 technical improvements (Pro review)`

