---
id: appendix-pricing
title: "Appendix: Current Pricing"
models: [sonnet]
summary: true
readTime: 3m
---

<!-- model: sonnet -->
> **Path:** Home › Appendix › Pricing
> **Validation:** Reviewed by Sonnet ✓

# Current Model Pricing

**Last updated:** November 2024
**Source:** [Anthropic Official Documentation](https://docs.claude.com/en/docs/about-claude/pricing)

## Per Million Tokens

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| **Haiku 4.5** | $1 | $5 | Execution, parallel work |
| **Sonnet 4.5** | $3 | $15 | Mid-tier reasoning |
| **Opus 4.1** | $15 | $75 | Strategic thinking |

## Cost Per Task (Scenario A: Real-time Orchestrated)

**Design auth system (Opus plan → Haiku examples → Sonnet validation):**
```
Opus:   200 input = $0.0030
Haiku:  3000 output = $0.0150
Sonnet: 500 output = $0.0075
─────────────────────────────
Total = $0.0255 (mixed models)
```

## Scenario B: Batch API (50% Discount)

Applying Batch API to the exact workload above:
```
Opus:   $0.0030 → $0.0015
Haiku:  $0.0150 → $0.0075
Sonnet: $0.0075 → $0.00375
──────────────────────────
Total = $0.01275 (≈50% less)
```

## Scenario C: Batch + Short Outputs (Optional)

If Haiku/Sonnet responses are trimmed to a few hundred tokens each, the workflow can drop toward **$0.00525**. Call out the smaller token counts when sharing this hero number to avoid confusion.

## Batch API Discount

All rates: **50% off** when using Batch API. Use it for asynchronous jobs that can wait ~24 hours.

## Premium Features

**Prompt Caching** (for repeated queries):
- Write tokens: 1.25× base input price
- Read tokens: 0.1× base input price
- Savings: Up to 90% for repeated content

**Long Context** (1M tokens, Sonnet/Opus only):
- Premium rate applied to tokens > 200K input
- See docs for exact multiplier

## Regional Pricing

**Global (default):** No markup
**Regional endpoints:** 10% premium

## Calculation Formula

```
Cost = (input_tokens × input_rate + 
        output_tokens × output_rate) / 1_000_000

Example:
Cost = (200 × $15 + 3000 × $5) / 1_000_000
Cost = $18,000 / 1_000_000
Cost = $0.018 (before orchestration optimization)
```

## When Prices Change

Anthropic updates pricing quarterly. Check:
- [Anthropic Documentation](https://docs.claude.com/en/docs/about-claude/pricing)
- [Product Updates](https://www.anthropic.com/news)

For local documentation, update this appendix when prices change.

---
**Related**
- [Next: Batch API Guide](batch-api-guide)
- [See also: Token Economics](../architecture/token-economics)
- [Back: Index](../INDEX)
