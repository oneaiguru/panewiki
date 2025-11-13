# ADR-007: Append-Forward Navigation (No Branch History)

**Status**: Accepted

> Implementation status: **Shipped in V1 ✅** — forward navigation always appends new entries, even when visiting from the middle of history; controls encourage clearing rather than truncating.

**Date**: 2025-11-13

---

## Context

Once we chose history-based navigation (ADR-001), we needed to decide what happens when user navigates from a middle position.

Scenario: **User navigates 1 → 2 → 3 → 4 → 5, then goes back to position 2, then clicks a link to node X.**

Two models:

### Model A: Linear Append (Browser-like)
```
History: [1, 2, 3, 4, 5, X]
currentIndex: 5
(Positions 3-5 are in history but inaccessible until user navigates back there)
```

### Model B: Branching (Git-like)
```
Main path: [1, 2, 3, 4, 5]
New branch: [1, 2, X]
Show branch selector in UI
User can switch between paths
```

---

## Decision

**We chose Linear Append: Always append new navigation to history, never create branches.**

Rule: `history.push(newNode)` always, regardless of currentIndex position

Behavior:
- User navigates: append to end of history
- currentIndex: set to new length - 1
- Earlier positions: still accessible via back button / jump buttons
- "Branches" don't exist; history is linear

---

## Consequences

### Positive
✅ **Simpler model** - Linear history is easier to understand than branches
✅ **Matches browser behavior** - Browsers use append model (mostly)
✅ **Familiar to users** - Same pattern as back-button navigation
✅ **Less state management** - No branch tracking, no merge logic
✅ **Deterministic navigation** - Always same rule (append)
✅ **Memory efficient** - Just one linear array
✅ **Easier debugging** - No "which branch am I on?" confusion

### Negative
❌ **Can't revisit discarded paths** - If user backtracks and takes different path, old path is "buried"
❌ **History grows faster** - More entries in array (but still acceptable)
❌ **Less powerful than Git** - Can't create true alternative branches
❌ **User might forget old paths** - Linear history doesn't show alternatives

### Mitigation
- Breadcrumb + depth indicator shows current position
- Jump buttons show all earlier positions (can jump back and retry)
- History only grows to reasonable size (~100-500 typical)

### Important Note
This is NOT the same as truncating history. Earlier positions are still accessible; just not shown in normal browsing.

---

## Alternatives Considered

### Alternative 1: Truncating History (Git Reset)
- Back to position 2, navigate → delete positions 3-5, then append
- Result: history = [1, 2, X]

**Why rejected**:
- User loses access to positions 3-5 permanently
- Confusing: "Where did those go?"
- Makes backtracking risky (might lose data)
- Harder to undo mistakes

### Alternative 2: Full Branching (Git-style)
- Track multiple paths (branches)
- Show branch selector in UI
- Allow switching between branches

**Why rejected**:
- Way too complex for prototype
- Requires branch data structure (trees, not arrays)
- UI becomes complicated (merge, branch select, etc.)
- Overkill for navigation use case
- Deferred to Phase 3 if ever needed

### Alternative 3: Hybrid: Show "Continue from Here" Option
- When user backtracks and is about to navigate forward, offer choice:
  1. "Continue original path"
  2. "Start new path"
- Let user decide

**Why rejected**:
- Adds unnecessary complexity
- Users don't need this level of control
- Makes UI busier
- Simple append is sufficient

---

## Related Decisions

- **ADR-001**: History-based navigation (this decision is a consequence)
- **ADR-002**: Append-only history (directly related)
- **ADR-004**: Computed scroll (scrollLeft based on currentIndex, works fine with append model)

---

## Implications for Implementation

### Navigation Logic (Simple)
```javascript
const handleClickLink = (targetNodeId) => {
  const targetNode = DIAGRAMS_DATA[targetNodeId];
  setHistory(prev => {
    const next = [...prev, targetNode];             // Always append
    setCurrentIndex(next.length - 1);               // New index = new length - 1
    return next;
  });
};

// That's it. No branching logic needed.
```

### Comparison: What DOESN'T Happen
```javascript
// DON'T do this (truncating):
const handleClickLink = (targetNodeId) => {
  const truncated = history.slice(0, currentIndex + 1);  // Delete future
  const withNew = [...truncated, DIAGRAMS_DATA[targetNodeId]];
  setHistory(withNew);
};

// DON'T do this (branching):
const handleClickLink = (targetNodeId) => {
  const newBranch = {
    name: `Branch from ${history[currentIndex].name}`,
    path: history.slice(0, currentIndex + 1).concat(targetNode),
    createdAt: Date.now()
  };
  branches.push(newBranch);  // Track multiple branches
};
```

### History Array Example
```javascript
// User navigates: 1 → 2 → 3 → 4 → 5
history = [1, 2, 3, 4, 5]
currentIndex = 4

// User clicks back 3 times
history = [1, 2, 3, 4, 5]  // UNCHANGED
currentIndex = 1            // Just moved pointer

// User clicks link to node X (while at position 1)
history = [1, 2, 3, 4, 5, X]  // APPENDED
currentIndex = 5

// User can still access positions 2-4
// Can jump back to position 2, 3, or 4
// Those earlier nodes are still in history
```

---

## Visual Flow

```
Navigation 1 → 2 → 3 → 4 → 5
history: [1, 2, 3, 4, 5]
currentIndex: 4
        
Back 3 times
history: [1, 2, 3, 4, 5]  (same!)
currentIndex: 1

At position 1, click link to X
history: [1, 2, 3, 4, 5, X]  (appended!)
currentIndex: 5

User can now:
- Jump to position 2 (revisit node 2)
- Jump to position 3 (revisit node 3)
- Back button goes to position 4
- Forward navigation continues from position 5
```

---

## User Experience

### Scenario 1: Accidental Back
```
User: 1 → 2 → 3 → 4 → 5 (realizes they clicked wrong)
User: Back, Back (now at position 3)
User: Takes different path (navigates to node Y)
Result: history = [1, 2, 3, 4, 5, Y]
User can still: Jump back to position 4 or 5
```

### Scenario 2: Exploration
```
User: 1 → 2 (explores a bit)
User: Back to 1
User: Navigate different direction → 3
Result: history = [1, 2, 3]
Both paths visible in jump buttons
Can toggle between by jumping
```

### Scenario 3: Deep History
```
User navigates 50 times, realizes they want to retry from position 10
User: Clicks jump button [◄ Position 10]
User: Takes new path from there
Result: New nodes appended to history after position 10
Old positions 11-50 still in history, accessible via jump
```

---

## History as "Breadcrumb Trail"

Think of history as a breadcrumb trail you leave as you explore:

```
🏠 → Front → React → Comps → Button
          ↓
         API → Endpoints → User
          ↓
        DB → SQL → Schema
```

When you backtrack and go somewhere new, you're ADDING to the trail, not replacing it:

```
🏠 → Front → React → Comps → Button
          ↓              ↓
         API        NewPath
```

You can follow any path forward from where you are, and the trail grows.

---

## Comparison with Browser History

### Real Browser
```
Sequence: google.com → wikipedia.org → github.com
Go back → wikipedia.org
Click link to stackoverflow.com

Browser history: google.com → wikipedia.org → stackoverflow.com
(github.com is gone; browser truncates)
```

### Our Model
```
Sequence: 1 → 2 → 3
Go back → 2
Click link to 4

Our history: 1 → 2 → 3 → 4
(Position 3 is still accessible)
```

**Difference**: Browsers truncate, we append. Both valid models.

**Our choice**: Append is simpler and more forgiving (nothing is ever lost).

---

## Testing Scenarios

### Scenario 1: Simple Linear
```
Navigate: home → frontend → react → comps → button
Expected: history = [home, frontend, react, comps, button]
          currentIndex = 4
          visiblePanes = [react, comps, button]
```

### Scenario 2: With Backtrack
```
Navigate: home → frontend → react → comps → button
Back 2 times: currentIndex = 2 (at react)
Navigate to: api-services
Expected: history = [home, frontend, react, comps, button, api-services]
          currentIndex = 5
          Can jump to positions 2-4
```

### Scenario 3: Deep History
```
Start: position 50 (deep in history)
Back 10 times: currentIndex = 40
Navigate to new node: database
Expected: history[51] = database
          currentIndex = 50
          Positions 41-50 still accessible
```

### Scenario 4: Self-Reference
```
At node X (which has link to itself)
Click X → X
Expected: history = [..., X, X]  (two entries, same node)
          Each position is independent
          Can jump between them
```

---

## Edge Cases & Handling

### Edge Case 1: Navigating Forward from Position 0
```
currentIndex = 0
Click link
history = [home, newNode]
currentIndex = 1
✓ Works fine
```

### Edge Case 2: Very Deep History (100+ items)
```
currentIndex = 99
history.length = 100
Click link
history.length = 101
currentIndex = 100
✓ Works fine, just longer strip
```

### Edge Case 3: Multiple Back Clicks, Then Forward
```
currentIndex = 50
Back 10 times → currentIndex = 40
Back 5 times → currentIndex = 35
Navigate forward → history.length becomes 36
currentIndex = 35
✓ Works fine, history just keeps growing
```

---

## Performance Notes

### History Array Growth
- User navigates: array length increases by 1
- User clicks back: array length stays same
- No branching: array is always linear

### Memory Impact
- 100 navigations: ~100 items (each ~500 bytes) = 50KB
- 1000 navigations: ~500KB
- Still manageable (can add virtual scrolling if needed)

---

## Alternatives Not Chosen (Recap)

1. **Truncating (Git reset)** - Loses data, confusing
2. **Full branching (Git flow)** - Too complex, overkill
3. **Hybrid (ask user)** - Unnecessary complication

**Chosen**: Simple append (linear, forgiving, matches browser mostly)

---

## Open Questions

- What if user navigates 10,000 times? **Answer**: History becomes very large; Phase 2 optimization.
- Can we show "alternate paths" in UI? **Answer**: Jump buttons already show accessible positions; visual branching deferred.
- Should there be a "Clear Old History" feature? **Answer**: Not in prototype; deferred.
- What if we want to add undo/redo later? **Answer**: This model makes redo hard; but redo deferred to Phase 2+.

---

## Sign-Off

- [ ] Architecture Lead: Approved
- [ ] Product: Approved
- [ ] Engineering Lead: Approved
