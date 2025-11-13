# ADR-004: Computed scrollLeft (No Manual Scrolling)

**Status**: Accepted

**Date**: 2025-11-13

---

## Context

With a fixed 3-pane viewport over an infinite strip (ADR-003), we needed to decide how to control scroll position.

Options:
1. **User Controls Scroll** - User can drag scrollbar or scroll wheel to move strip
2. **Computed Automatic Scroll** - App calculates scrollLeft based on currentIndex; user can't override
3. **Hybrid** - Computed most of the time, but allow manual override

---

## Decision

**We chose Computed Automatic Scroll: scrollLeft is always determined by currentIndex, never user-controlled.**

Rule:
```
scrollLeft = max(0, (currentIndex - 2) * 400px)
```

When `currentIndex` changes → `scrollLeft` recalculates automatically → viewport slides to correct position

---

## Consequences

### Positive
✅ **Deterministic position** - Always know where viewport will be
✅ **No scroll conflicts** - App and user never fight for scroll control
✅ **Matches mental model** - "Click link → page shifts to show it"
✅ **Simpler UX** - One source of truth (currentIndex)
✅ **Easier testing** - Position always matches formula
✅ **No scroll bugs** - Can't get into inconsistent scroll state
✅ **Smooth animations** - Can easily animate scrollLeft over 300ms

### Negative
❌ **No manual exploration** - User can't manually scroll to peek ahead
❌ **Less familiar** - Different from typical scrollable containers
❌ **Feels restrictive** - User might want to explore by scrolling

### Mitigation
- Breadcrumb + jump buttons show what's off-screen
- Jump buttons let user "peek" (click button to jump)
- Keyboard shortcuts (arrow keys) navigate faster
- Not actually restrictive (can click any link or button to navigate)

---

## Alternatives Considered

### Alternative 1: User-Controlled Scroll
- Browser default scrollbar visible
- User can scroll freely
- App responds to scroll position

**Why rejected**:
- Conflicts with our history model
- If user manually scrolls to position X, but currentIndex points to Y, state is inconsistent
- Back button would "jump" user's manual scroll
- Too many edge cases (what if user scrolls while animation is happening?)

### Alternative 2: Hybrid Control
- Computed scroll by default
- User can manually override
- If user scrolls, disable animations temporarily

**Why rejected**:
- Overly complex
- State management nightmare (tracking both computed and manual scroll)
- Still has conflicts (what wins in edge cases?)
- Not worth the complexity for this use case

### Alternative 3: Computed Scroll with Scroll Events (Read-Only)
- scrollLeft computed and set by app
- Listen to scroll events for logging/debugging only
- Ignore user scrollbar position

**Why rejected**:
- Still shows scrollbar, which confuses users
- Better to hide it entirely

---

## Related Decisions

- **ADR-003**: Fixed viewport necessitates precise scroll control
- **ADR-002**: Append-only history means we always know currentIndex

---

## Implications for Implementation

### CSS (Hide Scrollbar)
```css
.scroll-container {
  width: 1200px;
  height: 500px;
  overflow-x: hidden;  /* Hide scrollbar */
  overflow-y: hidden;
  position: relative;
  border: 2px solid #333;
}
```

### React State Update
```javascript
const [currentIndex, setCurrentIndex] = useState(0);
const scrollLeft = Math.max(0, (currentIndex - 2) * 400);

// Effect: whenever currentIndex changes, update scroll
useEffect(() => {
  const container = scrollContainerRef.current;
  if (container) {
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'  // 300ms animation
    });
  }
}, [scrollLeft, currentIndex]);
```

### Scroll Position Formula
```javascript
function calculateScrollLeft(currentIndex) {
  const PANE_WIDTH = 400;
  const VIEWPORT_PANES = 3;
  return Math.max(0, (currentIndex - (VIEWPORT_PANES - 1)) * PANE_WIDTH);
}

// Examples:
calculateScrollLeft(0)   // → 0    (show panes 0-2)
calculateScrollLeft(1)   // → 0    (show panes 0-2)
calculateScrollLeft(2)   // → 0    (show panes 0-2)
calculateScrollLeft(3)   // → 400  (show panes 1-3)
calculateScrollLeft(4)   // → 800  (show panes 2-4)
calculateScrollLeft(100) // → 39200 (show panes 98-100)
```

### Animation Timing
```javascript
// CSS scroll-behavior: smooth (native)
container.scrollTo({
  left: scrollLeft,
  behavior: 'smooth'  // Duration ~300ms (browser-dependent, usually 300-400ms)
});

// OR custom animation via CSS transition
<div 
  style={{
    transform: `translateX(-${scrollLeft}px)`,
    transition: 'transform 300ms ease-out'
  }}
>
  {/* content */}
</div>
```

### Navigation Handlers
```javascript
const handleClickLink = (targetNodeId) => {
  const targetNode = DIAGRAMS_DATA[targetNodeId];
  setHistory(prev => {
    const next = [...prev, targetNode];
    setCurrentIndex(next.length - 1);  // Automatically triggers scroll effect
    return next;
  });
};

const handleBack = () => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);  // Automatically triggers scroll effect
  }
};

const handleJumpToAncestor = (targetIndex) => {
  setCurrentIndex(targetIndex);  // Automatically triggers scroll effect
};
```

---

## Visual Behavior

### Forward Navigation
```
User clicks link in rightmost pane
  ↓
currentIndex++
  ↓
useEffect fires
  ↓
scrollLeft recalculates
  ↓
container.scrollTo() animates over 300ms
  ↓
Viewport slides right, new content appears
```

### Back Navigation
```
User clicks [◄ BACK]
  ↓
currentIndex--
  ↓
useEffect fires
  ↓
scrollLeft recalculates (smaller value)
  ↓
container.scrollTo() animates over 300ms
  ↓
Viewport slides left, earlier panes reappear
```

### Jump Navigation
```
User clicks [◄ Earlier Position]
  ↓
currentIndex = targetIndex (can be many positions back)
  ↓
useEffect fires
  ↓
scrollLeft recalculates
  ↓
container.scrollTo() animates over 300ms
  ↓
Viewport jumps to position (can be big jump)
```

---

## Testing Scenarios

### Scenario 1: Forward Navigation
```
Initial: currentIndex = 0, scrollLeft = 0
User clicks link in pane 2
Expected: currentIndex = 1, scrollLeft = 0 (still shows panes 0-2)
Animation: No visible change (already showing correct panes)
```

### Scenario 2: Forward Past Viewport
```
Initial: currentIndex = 2, scrollLeft = 0 (showing panes 0-2)
User navigates to position 4
Expected: currentIndex = 4, scrollLeft = 800
Animation: Slides right 800px
Result: Pane 0 disappears off-left, pane 4 appears on right
```

### Scenario 3: Back Navigation
```
Initial: currentIndex = 50, scrollLeft = 19200 (showing panes 48-50)
User clicks back 3 times
Expected: currentIndex = 47, scrollLeft = 18000
Animation: Slides left 1200px
Result: Pane 47 visible, pane 50 disappears off-right
```

### Scenario 4: Jump Navigation
```
Initial: currentIndex = 50, scrollLeft = 19200
User clicks [◄ Position 2]
Expected: currentIndex = 2, scrollLeft = 0
Animation: Jumps left 19200px (big jump, but smooth)
Result: Back to panes 0-2
```

### Scenario 5: At History Start
```
Initial: currentIndex = 0, scrollLeft = 0
Any back button: Do nothing (disabled)
Any scroll calculation still gives 0
Position is locked at start
```

### Scenario 6: At History End
```
currentIndex = history.length - 1
scrollLeft = max(0, (currentIndex - 2) * 400)
Position locked at end (unless user navigates forward)
```

---

## Keyboard Integration

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handleBack();  // currentIndex--, triggers scroll
    } else if (e.key === 'ArrowRight') {
      // Navigate to first link of current pane
      if (visiblePanes[visiblePanes.length - 1]?.links?.length > 0) {
        handleClickLink(visiblePanes[visiblePanes.length - 1].links[0]);
      }
    } else if (e.key === 'Home') {
      handleHome();  // currentIndex = 0, triggers scroll
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentIndex, visiblePanes]);

// All keyboard actions trigger currentIndex change → scroll effect
```

---

## Performance Considerations

- **Scroll calculation**: O(1) - just arithmetic
- **ScrollTo animation**: Browser-optimized (~60fps on modern browsers)
- **Re-renders**: Only when currentIndex changes (minimal)
- **No janky scrolling**: Computed position prevents conflicts

---

## Browser Compatibility

- **scroll-behavior: smooth** - Supported in all modern browsers (polyfill available)
- **scrollTo()** - Universal support
- **CSS transitions on transform** - Universal support
- **requestAnimationFrame** - If using custom animation

---

## Open Questions

- Should scroll animation be 300ms or 400ms? **Answer**: 300ms (standard UX timing)
- What if user scrolls manually? **Answer**: Ignored; scroll position is always recomputed
- Should scroll animation be eased (ease-out) or linear? **Answer**: ease-out (more natural feel)
- Can user right-click and use browser scroll? **Answer**: Should be disabled (overflow hidden removes scrollbar)

---

## Sign-Off

- [ ] Architecture Lead: Approved
- [ ] Product: Approved
- [ ] Engineering Lead: Approved
