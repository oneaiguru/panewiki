# ADR-005: React Hooks State (No Redux/Context API)

**Status**: Accepted

**Date**: 2025-11-13

---

## Context

We needed to choose a state management approach for the prototype. Options:

1. **Local useState in App Component** - Simple React hooks, all state in one component
2. **React Context API** - Global state with providers, still component-based
3. **Redux** - Full state management library, actions/reducers/store
4. **Zustand/Jotai** - Lightweight alternatives to Redux
5. **Custom Hook** - useNavigation hook encapsulating all logic

---

## Decision

**We chose Local useState in App Component with optional custom hook.**

Implementation:
- Two state variables: `history` array, `currentIndex` number
- All derived values calculated (not stored)
- All handlers (handleClickLink, handleBack, etc.) defined in App.jsx
- Single component tree (no provider nesting required)
- Optional: Extract navigation logic into `useNavigation()` custom hook later

---

## Consequences

### Positive
✅ **Simplest possible solution** - Just React built-ins, no extra libraries
✅ **Minimal boilerplate** - No actions, reducers, dispatch, etc.
✅ **Easy to understand** - State and handlers co-located
✅ **Fast iteration** - Can change state logic without complex refactoring
✅ **No dependency bloat** - ~0 added dependencies
✅ **Sufficient for this scope** - Only 2 state variables needed
✅ **Easier debugging** - State changes visible in React DevTools
✅ **No learning curve** - Developers familiar with React already know this

### Negative
❌ **Not scalable to large apps** - If app grows, this becomes unwieldy
❌ **No time-travel debugging** - No Redux DevTools equivalent
❌ **No middleware** - Can't intercept/log all state changes
❌ **Prop drilling** - Passing handlers down through components (minor issue here)
❌ **No separation of concerns** - All state management in App.jsx

### Mitigation
- Extract to custom hook if logic becomes complex
- Add logging/debugging manually if needed
- Deferred: Move to Redux/Zustand in Phase 2 if prototype grows

---

## Alternatives Considered

### Alternative 1: React Context API
- Create NavigationContext with useNavigation hook
- Provider wraps component tree
- Access state via useContext anywhere

**Why rejected**:
- Overkill for 2 state variables
- Adds nesting layer (Provider)
- No real benefit over local state for this size
- Makes debugging slightly harder (context vs local state)
- Deferred: Can add later if needed

### Alternative 2: Redux
- Full state management (store, actions, reducers)
- Middleware for logging
- Redux DevTools integration
- Time-travel debugging

**Why rejected**:
- Way too complex for prototype
- 2 state variables don't need Redux complexity
- Significant boilerplate (action types, action creators, reducers)
- Steep learning curve for new developers
- Deferred: Can use in Phase 2 if needed

### Alternative 3: Zustand / Jotai
- Lightweight state management library
- Less boilerplate than Redux
- Still has store/hooks/selectors

**Why rejected**:
- Unnecessary overhead for 2 variables
- Still adds a dependency
- React hooks sufficient for this scope
- Deferred: Option if prototype grows

### Alternative 4: Custom useNavigation Hook
- Encapsulate all history logic in custom hook
- Multiple components can use hook via `useNavigation()`

**Partially Accepted**:
- Good optional refactoring if App.jsx becomes large
- But in prototype, can keep in App.jsx initially
- Can extract to custom hook in Phase 2 if needed

---

## Related Decisions

- **ADR-002**: Append-only history simplifies state (no complex mutations)
- **ADR-004**: Computed scrollLeft means we don't store it (reduces state variables)

---

## Implications for Implementation

### State Declaration
```javascript
function App() {
  const [history, setHistory] = useState([DIAGRAMS_DATA.home]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // That's it. No other state variables needed.
}
```

### Derived Values (NOT Stored)
```javascript
// All calculated on every render (fast, React optimizes)
const visibleStartIndex = Math.max(0, currentIndex - 2);
const visiblePanes = history.slice(visibleStartIndex, currentIndex + 1);
const hiddenAncestors = history.slice(0, visibleStartIndex);
const scrollLeft = Math.max(0, (currentIndex - 2) * 400);
const depth = currentIndex + 1;
const totalHistory = history.length;
```

### Handlers (All in App.jsx)
```javascript
const handleClickLink = (targetNodeId) => {
  const targetNode = DIAGRAMS_DATA[targetNodeId];
  setHistory(prev => {
    const next = [...prev, targetNode];
    setCurrentIndex(next.length - 1);
    return next;
  });
};

const handleBack = () => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);
  }
};

const handleHome = () => {
  setCurrentIndex(0);
};

const handleJumpToAncestor = (targetIndex) => {
  setCurrentIndex(targetIndex);
};

const handleArrowRight = () => {
  const last = visiblePanes[visiblePanes.length - 1];
  const firstLink = last?.links?.[0];
  if (firstLink) {
    handleClickLink(firstLink);
  }
};
```

### Effects (Side Effects)
```javascript
// Scroll animation
useEffect(() => {
  const container = scrollContainerRef.current;
  if (container) {
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }
}, [scrollLeft]);

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handleBack();
    else if (e.key === 'ArrowRight') handleArrowRight();
    else if (e.key === 'Home') handleHome();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentIndex, visiblePanes]);
```

### Prop Drilling
```javascript
// Handlers passed down to child components
<NavigationBar
  breadcrumb={visiblePanes}
  depth={depth}
  totalHistory={totalHistory}
  hiddenAncestors={hiddenAncestors}
  onBack={handleBack}
  onHome={handleHome}
  onJumpToAncestor={handleJumpToAncestor}
/>

<ScrollContainer
  scrollLeft={scrollLeft}
  children={
    <PaneStrip
      history={history}
      visibleIndices={...}
      onClickLink={handleClickLink}
    />
  }
/>
```

**Observation**: Only 2 levels deep (App → NavigationBar, App → ScrollContainer), so prop drilling is minimal.

---

## Optional Refactoring: Custom Hook

If needed in future, can extract to custom hook:

```javascript
// hooks/useNavigation.js
export function useNavigation(initialNode) {
  const [history, setHistory] = useState([initialNode]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // All derived values
  const visibleStartIndex = Math.max(0, currentIndex - 2);
  const visiblePanes = history.slice(visibleStartIndex, currentIndex + 1);
  const hiddenAncestors = history.slice(0, visibleStartIndex);
  const scrollLeft = Math.max(0, (currentIndex - 2) * 400);
  
  // All handlers
  const handleClickLink = (targetNodeId) => { ... };
  const handleBack = () => { ... };
  const handleHome = () => { ... };
  const handleJumpToAncestor = (targetIndex) => { ... };
  
  return {
    history,
    currentIndex,
    visiblePanes,
    hiddenAncestors,
    scrollLeft,
    handlers: {
      onClickLink: handleClickLink,
      onBack: handleBack,
      onHome: handleHome,
      onJumpToAncestor: handleJumpToAncestor
    }
  };
}

// Usage in App.jsx
function App() {
  const nav = useNavigation(DIAGRAMS_DATA.home);
  
  return (
    <>
      <NavigationBar {...nav} />
      <ScrollContainer {...nav} />
    </>
  );
}
```

---

## Re-render Performance

### Initial Concern
With all state in App.jsx, every state change re-renders all children.

### Reality Check
- State changes: only when user navigates (link, back, jump)
- Re-renders: App component and all children
- Cost: Minimal (simple components, small component tree)
- Panes re-render with same data (no expensive operations)

### If Performance Issues Arise (Phase 2)
- Option 1: Memoize components (`React.memo`)
- Option 2: Extract child state (NavigationBar manages its own state)
- Option 3: Move to Redux/Zustand

For prototype: No optimization needed yet.

---

## Testing Approach

### Manual Testing
- Open DevTools, inspect state in React tab
- Verify history array grows
- Verify currentIndex changes correctly

### Unit Testing (Optional)
```javascript
// Can test handlers in isolation
const mockDispatch = jest.fn();
const nav = useNavigation(mockNode);
nav.handlers.onClickLink("target-id");
expect(nav.history.length).toBe(2);
```

### E2E Testing
- Use Cypress/Playwright to test full flow
- Click links, verify UI updates
- No special state inspection needed

---

## DevTools & Debugging

### React DevTools
- View component tree with state
- Inspect state variables directly
- No Redux DevTools (deferred)

### Manual Logging
```javascript
useEffect(() => {
  console.log('History updated:', history);
  console.log('Current index:', currentIndex);
}, [history, currentIndex]);
```

### Deferred: Redux DevTools
- If Phase 2 migrates to Redux, get time-travel debugging
- Not needed for prototype

---

## Scalability Limits

### When to Consider Alternatives
- **When**: App grows beyond ~1000 LOC in App.jsx
- **When**: More than 5-10 state variables needed
- **When**: Multiple components need same state
- **When**: Debugging state changes becomes hard

### Migration Path
1. Phase 1: useState in App.jsx ✓ (current)
2. Phase 2a: Extract to custom hook (if needed)
3. Phase 2b: Move to Redux/Zustand (if much larger)

---

## Code Structure

```
App.jsx
├── useState (history, currentIndex)
├── Derived values (calculated)
├── Handlers (onClick, onBack, etc.)
├── useEffect (scroll, keyboard)
└── Render
    ├── NavigationBar (stateless, props only)
    ├── ScrollContainer (stateless, props only)
    └── PaneStrip (stateless, props only)
```

**Total state management**: ~20 lines of code

---

## Open Questions

- Should we add logging for debugging? **Answer**: Manual console.log for now; Redux logging deferred.
- Should we memoize components? **Answer**: No; measure performance first.
- Should we extract custom hook now? **Answer**: No; extract in Phase 2 if needed.
- What if multiple components need same state? **Answer**: Refactor to custom hook or Context API then.

---

## Sign-Off

- [ ] Architecture Lead: Approved
- [ ] Product: Approved
- [ ] Engineering Lead: Approved
