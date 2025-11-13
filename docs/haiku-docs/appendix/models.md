---
id: appendix-models
title: "Appendix: Model Roles"
models: [sonnet]
summary: true
readTime: 4m
---

<!-- model: sonnet -->
> **Path:** Home › Appendix › Model Roles
> **Validation:** Reviewed by Sonnet ✓

# Model Roles & When to Use Them

| Model | Best at | Use it when | Token profile* |
|-------|---------|-------------|----------------|
| **Opus 4.1** | Strategic thinking | Need architecture, trade-offs, sequencing | Premium input (see [Pricing](pricing)) |
| **Haiku 4.5** | Parallel execution | Need many snippets, tables, code examples fast | Low-cost output (see [Pricing](pricing)) |
| **Sonnet 4.5** | Validation & synthesis | Need review, QA, synthesis, decision support | Mid-tier output (see [Pricing](pricing)) |

_*Token costs reference the live rates tracked in [Pricing](pricing)._

## Opus — Strategic Layer
- Decide **what matters** and in what order.
- Produce essence (≈200 tokens) plus instructions for downstream models.
- Avoid generating long examples—delegate instead.
- Typical prompts: architecture, failure modes, component checklists.

## Haiku — Execution Layer
- Generate working examples, diagrams, API payloads.
- Run multiple calls in parallel (one per component) to minimize wall-clock time.
- Keep each response within the 400px column constraint; include short "Why it works" notes.
- Pair every Haiku run with Sonnet review when the output affects production.

## Sonnet — Validation & Synthesis Layer
- Compare Opus intent with Haiku output and call out gaps (`✓ / ⚠ / ✗`).
- Summarize risk, security, or compliance findings for the user.
- Provide next-step recommendations instead of rewriting entire documents.

## Choosing the Right Mix
1. **Start with Opus** for plan + constraints.
2. **Fan out to Haiku** for concrete assets.
3. **Close with Sonnet** for review + user-facing summary.

This pattern keeps expensive thinking short, maximizes low-cost execution, and ensures every artifact is reviewed before it reaches the reader.

---
**Related**
- [Next: Pricing](pricing)
- [See also: Model Orchestration](../three-pillars/pillar-3/pillar-3-model-orchestration)
- [Back: Index](../INDEX)
