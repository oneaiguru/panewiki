---
id: appendix-batch-api
title: "Appendix: Batch API Guide"
models: [sonnet]
summary: true
readTime: 5m
---

<!-- model: sonnet -->
> **Path:** Home › Appendix › Batch API

# Batch API: 50% Cost Savings

## What is Batch API?

Asynchronous request processing. Send multiple queries at once, get results later.

**Standard API:** Real-time responses
**Batch API:** 50% discount on all tokens

## When to Use Batch

**Use batch for:**
- Bulk document processing
- Nightly analysis runs
- Large-scale content generation
- Cost optimization critical
- Latency acceptable (24 hours)

**Use real-time for:**
- User-facing queries
- Interactive workflows
- Code generation during work
- Debugging sessions
- Need results in seconds

## Cost Comparison: Auth System Example

**Standard (real-time):**
```
Opus:   200 tokens = $0.003
Haiku:  3000 tokens = $0.003
Sonnet: 500 tokens = $0.0015
────────────────────
Total = $0.0075
```

**Batch API (50% discount):**
```
Opus:   200 × 0.5 = $0.0015
Haiku:  3000 × 0.5 = $0.0015
Sonnet: 500 × 0.5 = $0.00075
────────────────────
Total = $0.00375 (50% less)
```

## Latency Trade-off

| Method | Speed | Cost |
|--------|-------|------|
| Real-time | Instant | Full price |
| Batch | 24 hours | 50% discount |

**Use case:** Generate 1000 API docs overnight
- Real-time: $75
- Batch: $37.50 (save $37.50)

## Example: Batch Request

```javascript
const requests = [
  { model: 'opus-4', messages: [...] },
  { model: 'haiku-4-5', messages: [...] },
  { model: 'sonnet-4-5', messages: [...] }
];

const batch = await anthropic.beta.messages.batches.create({
  requests: requests
});

// Check status later
const results = await anthropic.beta.messages.batches.retrieve(
  batch.id
);
```

## Best Use Cases for Batch

1. **Content generation:** Generate summaries at night
2. **Analysis at scale:** Process 1000s of documents
3. **Orchestrated workflows:** Opus → Haiku → Sonnet (all batched)
4. **Cost-critical:** Every dollar matters
5. **Asynchronous work:** Don't need immediate results

See [Token Economics](../architecture/token-economics) for more cost optimization strategies.

---

**Related:** [Token Economics](../architecture/token-economics) | [Pricing Appendix](pricing)
