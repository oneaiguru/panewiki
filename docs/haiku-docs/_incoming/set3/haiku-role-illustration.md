---
id: pillar-3-haiku-role
title: "Pillar 3: Haiku Role - Execution Layer"
models: [haiku]
summary: false
readTime: 5m
---

<!-- model: haiku -->
> **Path:** Home › Pillars › Pillar 3 › Haiku Role

# Haiku Role: The Execution Layer

## What Haiku Does

Haiku is the **execution and illustration layer**. Its job: create working examples from Opus strategy.

## What Haiku Is Best At

- Generating working examples
- Creating consistent code patterns
- Illustrating concepts with code
- Running in parallel (4-8 simultaneous calls)
- Fast iteration (4-5× faster than Sonnet)

## What Haiku Should NOT Do

- Make architectural decisions (Opus does this)
- Design system-level trade-offs (use Opus)
- Validate quality (Sonnet reviews this)

## Output Format

**Constraint:** Fits in 400px column

```
# ComponentName

[2-3 sentence explanation]

\`\`\`typescript
[working code, max 15 lines]
\`\`\`

## Why this works
[2-3 sentences explaining pattern]
```

## Cost Structure

See [Pricing Appendix](../../appendix/pricing):
- Input/Output: $1/M (see appendix for current rates)
- Per call: ~1000 tokens
- Parallel: 4 calls simultaneous

**Example:** 4 parallel Haiku calls = same time, 1/4 cost vs sequential

## Parallel Execution

```javascript
const haikuPromises = opusComponents.map(comp => 
  callHaiku(`Create example for ${comp.name}`)
);
const haikuResults = await Promise.all(
  haikuPromises
);
// All components generated simultaneously
```

**Advantage:** 4 components in ~5 seconds vs 20 seconds sequential

## Token Usage

- Input: Opus instruction (100-200 tokens)
- Output: 800-1200 tokens per call
- Total: ~1000 tokens per call

Parallel efficiency: More output, same total time.

## Example Output

```
# User Model

Stores user identity and credentials
separately. Enables password changes
without invalidating active tokens.

\`\`\`typescript
const userSchema = new Schema({
  id: UUID,
  email: String,
  passwordHash: String,
  createdAt: Date
});
\`\`\`

## Why this works
Separation of concerns. Each layer
has single responsibility.
```

---

**Related:** [Opus Role](opus-role-essence) | [Sonnet Role](sonnet-role-review) | [Model Orchestration](pillar-3-model-orchestration)
