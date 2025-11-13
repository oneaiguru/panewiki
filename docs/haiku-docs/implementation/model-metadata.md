<!-- model: sonnet -->
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

Show at bottom of document:

```
Created by:
• Opus (strategic thinking) - $0.003
• Haiku (examples) - $0.001  
• Sonnet (validation) - $0.0015

Total cost: $0.0075
```

## Why Track This

1. **Transparency:** Users see what they're paying for
2. **Education:** Learn optimal model usage
3. **Optimization:** Identify expensive patterns
4. **Verification:** Reproducible prompts

## Cost Calculation

```javascript
const calculateCost = (metadata) => {
  const OPUS = 15 / 1_000_000;
  const HAIKU = 0.80 / 1_000_000;
  const SONNET = 3 / 1_000_000;
  
  return {
    opus: (metadata.opus?.tokens || 0) * OPUS,
    haiku: (metadata.haiku?.tokens || 0) * HAIKU,
    sonnet: (metadata.sonnet?.tokens || 0) * SONNET
  };
};
```

---

**Reference:** [Data Model](../architecture/data-model.md) | **Next:** [Prompt Patterns](prompt-patterns.md)
