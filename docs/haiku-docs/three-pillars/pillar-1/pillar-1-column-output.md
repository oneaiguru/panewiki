---
id: pillar-1-column-output
title: "Pillar 1: Column Output Format"
models: [haiku]
summary: true
readTime: 5m
---

<!-- model: haiku -->
> **Path:** Home › Three Pillars › Pillar 1
> **Validation:** Reviewed by Sonnet ✓

# Pillar 1: Column Output Format

## The 400px Rule

Newspaper columns are ~400px wide. This is proven optimal.

**Why 400px?**
- 60-80 characters per line (optimal for reading)
- ~30-40 lines per screen (no excessive scrolling)
- Fits mobile, tablet, desktop naturally
- Readability science backs this up

## Format Rules

**Headers**: 3-5 words, sentence case
```
# Column Output Format
## Why This Works
### The Width Constraint
```

**Paragraphs**: 2-3 sentences max
```
❌ LONG: "The authentication system involves several layers..."
✓ SHORT: "Three auth layers: model, middleware, endpoints."
```

**Lists**: Bullets only, ~5 items max
```
✓ Auth needs:
  • User schema
  • JWT tokens
  • Rate limiting
```

**Code**: Max 15 lines per block
```javascript
// GOOD: fits column
router.post('/login', authenticate);
```

## Visual Language

ASCII art only. Diagrams fit column:

```
┌──────────────┐
│ Component A  │
└───────┬──────┘
        ↓
┌──────────────┐
│ Component B  │
└──────────────┘
```

---
**Related**
- [Next: Pillar 2 Summary](../pillar-2/pillar-2-dual-representation)
- [See also: Pillar 1 Detail](pillar-1-detail)
- [Back: Home](../../home)
