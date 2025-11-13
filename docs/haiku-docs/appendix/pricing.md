---
id: appendix-pricing
title: "Appendix: Current Pricing"
models: [sonnet]
summary: true
readTime: 3m
---

<!-- model: sonnet -->
> **Path:** Home › Appendix › Pricing

# Current Model Pricing

**Last updated:** November 2024
**Source:** [Anthropic Official Documentation](https://docs.claude.com/en/docs/about-claude/pricing)

## Per Million Tokens

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| **Haiku 4.5** | $1 | $5 | Execution, parallel work |
| **Sonnet 4.5** | $3 | $15 | Mid-tier reasoning |
| **Opus 4.1** | $15 | $75 | Strategic thinking |

## Cost Per Task (Standard)

**Design auth system:**
```
Opus:   200 input = $0.003
Haiku:  3000 output = $0.015
Sonnet: 500 output = $0.0075
─────────────────
Total = $0.0255 (average mixed)
```

**Orchestrated (Opus→Haiku→Sonnet):**
```
Opus:   200 = $0.003
Haiku:  3000 = $0.0015
Sonnet: 500 = $0.00075
─────────────────
Total = $0.00525 (optimized)
```

## Batch API Discount

All rates: **50% off** when using Batch API

```
Real-time: $0.00525
Batch:     $0.002625 (50% less)
```

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

**Related:** [Token Economics](../architecture/token-economics) | [Batch API Guide](batch-api-guide)
