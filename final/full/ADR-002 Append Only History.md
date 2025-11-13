# ADR-002: Append-Only History (Never Truncate or Prune)

**Status**: Accepted

**Date**: 2025-11-13

---

## Context

Once we decided on history-based navigation (ADR-001), we needed to define how history grows and shrinks.

Key scenario: **User navigates 1 → 2 → 3 → 4 → 5 (at position 4), then clicks back to position 3, then clicks a link to node X.**

Question: **What happens to the history array?**

Option A: Truncate history (delete positions 4+), then append new node
- Result: history = [1, 2, 3, X]
- Matches browser behavior (back button resets)

Option B: Append-only (keep all items), just move currentIndex
- Result: history = [1, 2, 3, 4, 5, X]
- Never lose any historical data

---

## Decision

**We chose Append-Only: History array only grows, never shrinks or truncates.**

When user navigates:
- Always `history.push(newNode)`
- Always `currentIndex = history.length - 1`
- Never remove or modify existing history items
- Back button only decrements `currentIndex` (doesn't remove items)

---

## Consequences

### Positive
✅ **Simpler state management** - No edge cases for "what happens when we backtrack"
✅ **Complete history preservation** - User can always jump to any past position
✅ **Linear append is fast** - Array push is O(1), no splicing or manipulation
✅ **Deterministic behavior** - Every navigation is just an append
✅ **Easier debugging** - History is always a clean linear array
✅ **Deliberately deviates from browsers** - Browsers truncate forward history; we keep both old and new paths visible so nothing is lost

### Negative
❌ **No "branch cleanup"** - History grows even if user backtracks a lot
❌ **Infinite memory potential** - If user navigates 1000 times, array has 1000 items
❌ **Can't "undo" to clean state** - Back button doesn't remove history, just moves pointer
❌ **Weird for tree-thinking users** - "Going back then forward" creates a different path than expected

### Mitigation
- Memory impact minimal (node references only, ~1-2KB per item)
- Deferred optimization: Virtual scrolling in Phase 2 if history > 100 items
- Clear breadcrumb shows current position
- Depth indicator shows total history length

---

## Alternatives Considered

### Alternative 1: Truncate History (Git-style)
- Back to position 3, navigate → delete positions 4-5, append new node
- Result: history = [1, 2, 3, X]

**Why rejected**:
- More complex state logic (splice vs push)
- Confusing UX: user's previous navigation "disappears" from jump buttons
- Jump buttons would need to update dynamically
- Harder to reason about

**Example of confusion**:
```
User: 1 → 2 → 3 → 4 → 5 (jump buttons: [0,1,2,3])
User: Back, Back, Back (now at position 2)
User: Click link to node X

With truncation: history = [1, 2, X], can only jump to [0, 1]
User has lost access to positions 3, 4, 5
Could be confusing: "Where did those go?"
```

### Alternative 2: Branch History (Full Version Control)
- Track multiple timelines (like Git branches)
- Show branch selector in UI
- Complex but powerful

**Why rejected**:
- Overkill for prototype
- Requires separate branch tracking data structure
- UI becomes very complex (branch selector, merge, etc.)
- Doesn't match browser mental model

### Alternative 3: Depth Limit (Max History = 100)
- Once history reaches 100 items, start removing oldest items
- Circular buffer approach

**Why rejected**:
- Adds complexity (modulo logic, wrapping)
- Arbitrary limit feels wrong
- Can always increase limit if needed in Phase 2
- Deferred optimization

---

## Related Decisions

- **ADR-001**: History-based navigation (this decision is consequence of that)
- **ADR-007**: Navigation is forward-append (consequence of append-only)

---

## Implications for Implementation

### State Update Pattern
```javascript
// CORRECT (append-only):
const handleClickLink = (targetNodeId) => {
  const targetNode = DIAGRAMS_DATA[targetNodeId];
  setHistory(prev => {
    const next = [...prev, targetNode];
    setCurrentIndex(next.length - 1);  // New entry lives at the old length index
    return next;
  });
};

// WRONG (truncating):
// Don't do: setHistory(history.slice(0, currentIndex + 1).concat(targetNode))
```

### Back Button
```javascript
// CORRECT (just move pointer):
const handleBack = () => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);
  }
};

// WRONG (removing from array):
// Don't do: setHistory(history.slice(0, history.length - 1))
```

### Jump Navigation
```javascript
// CORRECT (set pointer to any past position):
const handleJumpToAncestor = (targetIndex) => {
  setCurrentIndex(targetIndex);
};

// History never changes, only currentIndex changes
```

### Strip Width Calculation
```javascript
// Always grows with history length
const stripWidth = history.length * 400;  // Gets wider as user navigates more
```

---

## Testing Scenarios

### Scenario 1: Backtrack and Navigate
```
1. Navigate: home → frontend → react → components → button
   history = [home, frontend, react, components, button]
   currentIndex = 4

2. Back 3 times: currentIndex = 1
   history = [home, frontend, react, components, button] (UNCHANGED)
   visiblePanes = [frontend, react, components] (showing panes 1-3)

3. Click link to "api-services"
   history = [home, frontend, react, components, button, api-services]
   currentIndex = 5

4. Jump back to position 1
   currentIndex = 1
   history = [home, frontend, react, components, button, api-services] (UNCHANGED)
   Can still jump to positions 3-5
```

### Scenario 2: Deep History
```
User navigates 100 times
history.length = 100
currentIndex = 99
Can jump to any position [0-99]
No history is lost
```

### Scenario 3: Self-Reference Loop
```
1. Navigate to "random-deep" node which has link to itself
   click "random-deep" → "random-deep"
   history = [..., random-deep, random-deep, random-deep]
   
2. Each position is independent (even though same node)
   Can jump between positions
```

---

## Performance Notes

### Memory Usage
- Each history item: ~500 bytes (node reference + metadata)
- 100 items: ~50KB (negligible)
- 1000 items: ~500KB (still fine for modern browsers)
- 10,000 items: ~5MB (getting tight, but still usable)

### Mitigation Strategy
- Phase 1: No optimization (append-only as-is)
- Phase 2: If needed, add virtual scrolling for strip
- Phase 2: If needed, add memory limit with circular buffer

---

## Open Questions

- Should we add a "Clear History" button? **Answer**: Not in prototype; deferred.
- What's the realistic max history for a user session? **Answer**: Probably 100-500; deferred optimization.
- Should we persist history across page reloads? **Answer**: No; single session only.

---

## Sign-Off

- [ ] Architecture Lead: Approved
- [ ] Product: Approved
- [ ] Engineering Lead: Approved
