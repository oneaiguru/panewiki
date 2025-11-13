# ADR-007: Append-Forward Navigation

**Status**: Accepted

> Implementation status: **Shipped in V1 ✅** — forward navigation appends nodes even when revisiting mid-history.

## Decision

Always append navigation to history. No branch tracking.

## Why

- Simpler than branching (Git-style)
- Matches browser behavior
- Linear is easier to understand
- Deterministic (same rule always)

## Example

```
Navigate: 1 → 2 → 3 → 4 → 5
Back to position 2
Click link to X
               ↓
Result: history = [1, 2, 3, 4, 5, X]
Can still jump to 3, 4, or 5
```

## The Pattern

Navigate forward always = append to end.

No "branches" or alternative paths.

## Benefits

✓ Simple mental model
✓ Familiar to users
✓ No complex state tracking

## Trade-offs

✗ Can't show "alternate timelines"
✗ Old paths get buried (but still accessible)

## Mitigation

Jump buttons let users revisit earlier positions.
Breadcrumb shows where they are.

## Related

- [ADR001HistoryBasedNavigation](ADR001HistoryBasedNavigation)
- [ADR002AppendOnlyHistory](ADR002AppendOnlyHistory)

See: [DesignDecisionsLog](DesignDecisionsLog)
