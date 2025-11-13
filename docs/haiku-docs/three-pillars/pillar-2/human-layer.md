---
id: pillar-2-human-layer
title: "Pillar 2: The Human Layer (Summary)"
models: [haiku]
summary: false
readTime: 5m
---

<!-- model: haiku -->
> **Path:** Home › Pillars › Pillar 2 › Human Layer

# The Human Layer: Summary First

## What Goes In Summary

**Rule:** Show only what humans need to decide.

**Include:**
- Core idea (1-2 sentences)
- 3-5 key points
- Why it matters
- Link to details

**Exclude:**
- Implementation details
- Edge cases
- Full examples
- Rationale (save for detail)

## The 30-Line Constraint

Summary = ~30 lines fits one screen:

```
┌──────────────────┐
│ Title            │ 1 line
├──────────────────┤
│ Core idea        │ 3 lines
│                  │
│ Key points:      │ 1 line
│ • Point 1        │ 1 line
│ • Point 2        │ 1 line
│ • Point 3        │ 1 line
│                  │
│ Why it matters   │ 2 lines
│                  │
│ [See details →]  │ 1 line
│                  │
│ Cost: $X         │ 1 line
└──────────────────┘
```

**Total: ~15-30 lines (one screen)**

## Writing for Summary

**Transform verbose → concise:**

❌ Verbose:
```
"The authentication system we're implementing
involves several interconnected layers including
a user model layer, a middleware layer, and..."
```

✓ Concise:
```
Three auth layers:
• User model (identity)
• Middleware (validation)
• Rate limiting (security)
```

## Identifying Key Points

Ask yourself:
1. What's the core decision?
2. What 3-5 components matter?
3. What changes if this is wrong?
4. Why would someone care?

Those are your key points.

## Reading Time

Summary: 30 seconds - 2 minutes
- Users decide depth needed
- Fast filtering
- Low commitment

---

**Related:** [AI Layer](ai-layer) | [Navigation Between Layers](navigation-between-layers)
