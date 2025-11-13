---
id: implementation-model-metadata
title: "Model Metadata"
models: [sonnet]
summary: true
readTime: 4m
---

<!-- model: sonnet -->
> **Path:** Home › Implementation › Model Metadata
> **Validation:** Reviewed by Sonnet ✓

# Model Metadata

## What Gets Tracked

For every document, store:

```javascript
modelMetadata: {
  opus: {
    prompt: "Full prompt sent to Opus",
    tokens: 200,
    timestamp: "2025-11-13T08:00:00Z",
    temperature: 0.7,
    maxTokens: 300
  },
  haiku: {
    prompt: "Full prompt sent to Haiku",
    tokens: 1000,
    parallelIndex: 0,  // If parallel calls
    timestamp: "2025-11-13T08:00:05Z",
    temperature: 0.8
  },
  sonnet: {
    prompt: "Full prompt sent to Sonnet",
    tokens: 500,
    timestamp: "2025-11-13T08:00:10Z",
    temperature: 0.7
  }
}
```

## Display to User

Show at bottom of document (rates reference [Pricing](../appendix/pricing)):

```
Created by:
• Opus (strategy)  - ≈$0.0030
• Haiku (examples) - ≈$0.0150
• Sonnet (review)  - ≈$0.0075

Total cost: ≈$0.0255
```

## Why Track This

1. **Transparency:** Users see what they're paying for
2. **Education:** Learn optimal model usage
3. **Optimization:** Identify expensive patterns
4. **Verification:** Reproducible prompts

## Cost Calculation

```javascript
const PRICING = {
  input: { opus: 15 / 1_000_000, haiku: 1 / 1_000_000, sonnet: 3 / 1_000_000 },
  output: { opus: 75 / 1_000_000, haiku: 5 / 1_000_000, sonnet: 15 / 1_000_000 },
};

const dollars = (tokens, rate) => tokens * rate;

const calculateCost = (metadata) => ({
  opus: dollars(metadata.opus?.tokens || 0, PRICING.input.opus),
  haiku: (metadata.haiku?.tokens || 0) * PRICING.output.haiku,
  sonnet: dollars(metadata.sonnet?.tokens || 0, PRICING.output.sonnet),
});
```

---

**Related**
- [Next: Prompt Patterns](prompt-patterns)
- [See also: Data Model](../architecture/data-model)
- [Back: Implementation Overview](extending-current-system)
