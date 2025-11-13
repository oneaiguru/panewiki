# ADR-004: Computed ScrollPosition

**Status**: Accepted

## Decision

ScrollLeft is always calculated from currentIndex.
Users cannot manually scroll.

## Formula

```
scrollLeft = max(0, (currentIndex - 2) * 400)

Position 0:  scrollLeft = 0
Position 5:  scrollLeft = 1200
Position 50: scrollLeft = 19200
```

## Why

- Deterministic position (always correct)
- No state conflicts
- Automatic smooth animation
- Prevents scrolling bugs

## Implementation

```javascript
useEffect(() => {
  container.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'  // 300ms
  });
}, [scrollLeft]);
```

## Benefits

✓ Consistent positioning
✓ No manual override conflicts
✓ Easy to test

## Trade-offs

✗ Users can't manually scroll to explore
✗ Less familiar than typical scrollbars

## Mitigation

Jump buttons + keyboard shortcuts enable exploration.

## Related

- [ADR003FixedThreePaneViewport](ADR003FixedThreePaneViewport)
- [DesignDecisionsLog](DesignDecisionsLog)
