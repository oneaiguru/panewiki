---
id: pillar-2-ai-layer
title: "Pillar 2: The AI Layer (Detail)"
models: [haiku]
summary: false
readTime: 5m
---

<!-- model: haiku -->
> **Path:** Home › Pillars › Pillar 2 › AI Layer
> **Validation:** Reviewed by Sonnet ✓

# The AI Layer: Complete Context

## What Goes In Detail

**Rule:** Show everything AI needs to understand completely.

**Include:**
- Everything from summary
- Full implementation details
- Edge cases and gotchas
- Rationale for decisions
- Security considerations
- Performance implications

**Exclude:**
- Obvious filler
- Information not relevant to this document
- Repetition of summary (reference it)

## The 100-Line Guideline

Detail layer = ~100 lines preserves full context:

```
Summary (30 lines)
+ Technical explanation (40 lines)
+ Examples/code (20 lines)
+ Edge cases (10 lines)
─────────────────────
Total: ~100 lines
```

**Reading time:** 5-15 minutes deep dive

## When to Create Detail

**Create detail for:**
- Complex processes (3+ steps)
- Multiple implementation options
- Security implications
- Edge cases matter
- Integration points

**Skip detail for:**
- Simple definitions
- Single concept
- No edge cases
- Already complete in summary

## Writing for Detail

Expand each summary point:

Summary point:
```
User model (identity storage)
```

Detail expansion:
```
## User Model

Stores user identity and security credentials.
Separates identity from sessions (improves
security, enables password changes without
invalidating tokens).

Includes:
- Email + password hash (bcrypt)
- Created timestamp
- Organization link (multi-tenant)
- Active status flag

Edge case: Password resets require token
regeneration. See security section.
```

## Edge Cases Matter

Detail layer catches:
- Race conditions
- Concurrent access
- Token expiration
- Refresh token logic
- Logout behavior
- Password reset flow

These are easy to miss in summary.

---
**Related**
- [Next: Navigation Between Layers](navigation-between-layers)
- [See also: Human Layer](human-layer)
- [Back: Pillar 2 Detail](pillar-2-detail)
