---
id: 400px-width-math
title: "400px Column Width: Mathematical Justification"
models: [haiku]
summary: true
readTime: 5m
---

> Path: Home › Three Pillars › Pillar 1 › 400px Math

## Why 400px?

Typography science shows that **60–75 characters per line** optimize reading speed and comprehension. Fewer than 40 characters feels fragmented; more than 80 causes eye strain and comprehension drops.

A 400px column at standard web font sizes (16px, 1.5em line-height) yields approximately **65–70 characters per line**—the sweet spot.

## The 3×400px Formula

```
Desktop viewport: 1200px
÷ Gutters (margins): ~40px total
= 1160px usable
÷ 3 columns: 1160 ÷ 3 = ~387px per column

Rounded: 400px columns
Result: 60–75 characters per line
       (depends on font and font-size)
```

## Character Estimation

```
Width (px) ÷ Average char width = Character count
400px ÷ 6 (monospace) ≈ 67 characters
400px ÷ 8 (serif) ≈ 50 characters
400px ÷ 9 (sans-serif) ≈ 44 characters
```

For readable text at 16px sans-serif: expect **60–70 characters per line**.

## Responsive Breakpoints

| Viewport | Layout | Columns |
|----------|--------|---------|
| ≥1200px | Three-column | All visible |
| 600–1200px | Two-column | Haiku + Sonnet visible; Opus on demand |
| <600px | Single-column | Stacked; progressive reveal |

Each column maintains readability by constraining width, even as layout adapts.

## Why This Matters

The constraint forces clarity. Writers can't hide weak ideas in verbose padding. Readers absorb information faster when each line is the right length. This isn't arbitrary—it's neuroscience applied to information design.

See [Pillar 1 Detail (pillar-1-detail) for the full design rationale and implementation considerations.

## Related

- Full explanation: [Pillar 1 Detail (pillar-1-detail)
- Cost context: [Pricing (appendix/pricing)
- Next: [Pillar 2: Dual Representation (../pillar-2/dual-representation)
- Back: [Three Pillars (../../three-pillars)
