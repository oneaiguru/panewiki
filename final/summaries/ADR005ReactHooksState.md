# ADR-005: React Hooks State

**Status**: Accepted

## Decision

Use local useState for 2 variables.
No Redux, Context API, or other library.

## Why

- Simple for 2 state variables
- Minimal boilerplate
- Fast iteration
- No learning curve

## Implementation

```javascript
const [history, setHistory] = useState([...])
const [currentIndex, setCurrentIndex] = useState(0)

// Derived (calculated, not stored):
const scrollLeft = max(0, (currentIndex - 2) * 400)
const visiblePanes = history.slice(...)
```

## Handlers

All in App.jsx:

```javascript
const handleClickLink = (id) => {
  setHistory(prev => {
    const next = [...prev, DOCS[id]]
    setCurrentIndex(next.length - 1)
    return next
  })
}

const handleBack = () => {
  setCurrentIndex(prev => prev - 1)
}
```

## Benefits

✓ Simple and readable
✓ No framework overhead
✓ Standard React patterns

## Trade-offs

✗ Not scalable to large apps
✗ Prop drilling if many components

## Scaling Path

Phase 2: extract custom hook if needed
Phase 3: move to Redux/Zustand if needed

## Related

- [ADR002AppendOnlyHistory](ADR002AppendOnlyHistory)
- [ADR008PureStatelessRenderer](ADR008PureStatelessRenderer)
