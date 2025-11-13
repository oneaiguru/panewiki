# ADR-003: Fixed 3-Pane Viewport

**Status**: Accepted

## Decision

Show exactly 3 panes (400px each) in 1200px viewport.
Strip grows infinitely as user navigates.

## Why

- Users see context (past + current + next)
- Spatial memory (left = past, right = future)
- Scalable with history growth
- Elegant visual transitions

## Geometry

```
Pane: 400px wide
Viewport: 1200px (3 panes visible)
Strip: history.length × 400px

At position 0: show panes 0, 1, 2
At position 5: show panes 3, 4, 5
At position 50: show panes 48, 49, 50
```

## Benefits

✓ Intuitive navigation
✓ Always shows relationships
✓ Desktop-friendly

## Trade-offs

✗ Not mobile-friendly (deferred)
✗ PDF width constrained to 400px

## Related

- [ADR004ComputedScrollPosition](ADR004ComputedScrollPosition)
- [ImplementationRoadmap](ImplementationRoadmap)

See: [DesignDecisionsLog](DesignDecisionsLog)
