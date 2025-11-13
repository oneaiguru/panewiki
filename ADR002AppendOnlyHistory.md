# ADR-002: Append-Only History

**Status**: Accepted

## Decision

History array only grows. Never truncate or prune.

## Why

- Simpler state management
- Users can always jump back
- Matches browser behavior mostly
- No edge cases

## Example

```
Navigate: 1 → 2 → 3 → 4 → 5
Back 2 times (now at position 3)
Click link to X
               ↓
Result: history = [1, 2, 3, 4, 5, X]
        can still jump to 4 or 5
```

## Benefits

✓ Simple logic (just push)
✓ Nothing is ever lost
✓ Deterministic behavior

## Trade-offs

✗ History grows with usage
✗ No code reuse between versions

## Mitigation

Memory impact minimal (~1-2KB per item).
Can add virtual scrolling in Phase 2.

## Related

- [ADR001HistoryBasedNavigation](ADR001HistoryBasedNavigation)
- [ADR007AppendForwardNavigation](ADR007AppendForwardNavigation)

See: [ConstraintsAndAssumptions](ConstraintsAndAssumptions)
