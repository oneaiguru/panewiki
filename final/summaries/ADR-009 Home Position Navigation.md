# ADR-009: Home Position Navigation

**Status**: Accepted

## Decision

ExecutionPlan is the home/entry point.
Home button always returns to ExecutionPlan.
Home key (keyboard) jumps to start.

## Why

- Users need an entry point (familiar mental model)
- Escape route if lost in navigation
- Single consistent reference point
- Matches browser "Home" behavior

## Navigation Pattern

```
From any position:
  Press Home button → currentIndex = 0
  Press Home key   → currentIndex = 0
  Result: Back at ExecutionPlan
```

## Benefits

✓ Users never truly lost
✓ Clear entry point
✓ Reduces disorientation
✓ Familiar from web browsers

## Implementation

```javascript
const handleHome = () => {
  setCurrentIndex(0)
  // history stays intact
}

// Keyboard listener
if (event.key === 'Home') {
  handleHome()
}
```

## State Behavior

- **Home button**: Navbar button labeled "Home"
- **Keyboard**: Home key triggers handleHome()
- **History**: Preserved (can jump back to where you were)
- **Breadcrumb**: Shows "1 / N" when at home

## Related

- [ADR003FixedThreePaneViewport](ADR003FixedThreePaneViewport)
- [ADR004ComputedScrollPosition](ADR004ComputedScrollPosition)
- [ADR005ReactHooksState](ADR005ReactHooksState)

See: [DesignDecisionsLog](DesignDecisionsLog)

