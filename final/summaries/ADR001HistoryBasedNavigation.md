# ADR-001: History-Based Navigation

**Status**: Accepted

## Decision

Use graph-based navigation (any node → any node),
not tree hierarchy.

## Why

- Matches browser history mental model
- Enables cross-level links
- Users can navigate freely
- Allows loops and revisits

## The Pattern

```
User navigates: Home → Frontend → React
               ↓
History: [Home, Frontend, React]
               ↓
User clicks link to API (cross-level)
               ↓
History: [Home, Frontend, React, API]
```

## Benefits

✓ Unlimited flexibility
✓ Intuitive navigation
✓ Real-world content structure

## Trade-offs

✗ Requires careful link design
✗ Users might get "lost"
✗ Mitigated by breadcrumb + jump buttons

## Related

- [ADR002AppendOnlyHistory](ADR002AppendOnlyHistory)
- [ADR007AppendForwardNavigation](ADR007AppendForwardNavigation)

See: [DesignDecisionsLog](DesignDecisionsLog)
