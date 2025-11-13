# ADR-008: Pure Stateless Renderer

**Status**: Accepted

## Decision

Navigation Layer owns ALL state.
Renderer Layer is pure function (no internal state).

## Why

- Pattern replicates across all platforms
- Each version can use native idioms
- Navigation testable without rendering
- Renderers swappable

## The Pattern

```
Navigation owns:
- currentIndex
- history[]
- handleClickLink()

Renderer receives:
- node (document)
- onClickLink callback

Renderer returns:
- Visual output (JSX, string, PDF, etc.)
```

## V1 to V2+ Scaling

```
V1 (React):      render(node) → JSX
V2 (Terminal):   render(node) → ANSI string
V3 (PDF):        render(node) → PDF page
V4 (Editor):     render(node) → Editor component
```

Same navigation, different renderers.

## Benefits

✓ Platform independence
✓ Pattern is obvious
✓ Easy to reimplement in V2+

## Trade-offs

✗ No actual code reuse across platforms
✗ Each version reimplements pattern

## Related

- [ADR001HistoryBasedNavigation](ADR001HistoryBasedNavigation)
- [ADR005ReactHooksState](ADR005ReactHooksState)
- [ImplementationRoadmap](ImplementationRoadmap)
