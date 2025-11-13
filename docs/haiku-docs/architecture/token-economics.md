---
id: architecture-token-economics
title: "Token Economics: The Math"
models: [sonnet]
summary: false
readTime: 8m
---

<!-- model: sonnet -->
> **Path:** Home › Architecture › Token Economics
> **Validation:** Reviewed by Sonnet ✓

# Token Economics: The Math

## Pricing Reality (see [Pricing](../appendix/pricing))

| Model | Input focus | Output focus | Notes |
|-------|-------------|--------------|-------|
| **Opus 4.1** | Premium | Premium | Use sparingly for strategy/architecture. |
| **Sonnet 4.5** | Mid-tier | Mid-tier | Ideal for validation & synthesis. |
| **Haiku 4.5** | Budget | Budget | Use for execution, examples, batch work. |

## Scenario Inputs

| Component | Tokens | Role |
|-----------|--------|------|
| Opus planning | 200 input | Strategy brief + work plan |
| Haiku execution | 3 × 1,000 output | Code/examples per component |
| Sonnet validation | 500 output | QA + recommendations |

Total tokens: **200 input + 3,500 output**.

## Scenario A — All Opus (Naive)

```
4,000 output tok × $75/M = $0.30
```

## Scenario B — Orchestrated (Real-time)

```
Opus:   200 in × $15/M  = $0.0030
Haiku:  3000 out × $5/M = $0.0150
Sonnet:  500 out × $15/M= $0.0075
─────────────────────────────────
Total ≈ $0.0255 (≈81% savings)
```

## Scenario C — Orchestrated + Batch (50% discount)

Batching the same work cuts the total in half:
```
Total_batch ≈ $0.01275
```

Label any more aggressive claim (e.g., $0.00525) with the assumptions: shorter outputs + Batch API + cached prompts.

## Assumptions Table

| Symbol | Meaning | Example |
|--------|---------|---------|
| `N` | Number of components | 3 Haiku calls |
| `T_opus` | Opus input tokens | 200 |
| `T_haiku` | Tokens per Haiku call | 1,000 |
| `T_sonnet` | Sonnet output tokens | 500 |
| `R_model` | Rate per 1M tokens | See [Pricing](../appendix/pricing) |

## General Formula

```
Naive_all_opus = T_total_out × R_opus_out

Orchestrated_real_time = (T_opus × R_opus_in) +
                         (N × T_haiku × R_haiku_out) +
                         (T_sonnet × R_sonnet_out)

Batch_discount = 0.5 × Orchestrated_real_time
```

Plug in the real token counts for your workload. If Haiku outputs are shorter (e.g., 400 tokens), the savings increase further because Haiku stays cheap while Opus remains capped.

## Savings Range

- **Small jobs (N ≤ 2):** 20–40% savings (less fan-out).
- **Medium jobs (N = 3–5):** 60–80% savings (scenario B above).
- **Large jobs (N ≥ 6):** 80–90% savings if Haiku runs in parallel and Sonnet validates summaries instead of full transcripts.

## When Orchestration Shines

- Tasks decompose into parallelizable units.
- Validation adds business value (security, compliance, QA).
- Teams want predictable, explainable costs (tie every decision back to [Pricing](../appendix/pricing)).

## When to Stay All-Opus

- Highly novel problems without repeatable components.
- Extremely short prompts where orchestration overhead dominates.
- Latency-sensitive work when Batch API isn't acceptable.

---
**Related**
- [Next: Viewport Semantics](viewport-semantics)
- [See also: Pricing](../appendix/pricing)
- [Back: Index](../INDEX)
