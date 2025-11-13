# ADR-003: Fixed 3-Pane Viewport Over Infinite Strip

**Status**: Accepted

> Implementation status: **Shipped in V1 ✅** — the React shell renders three fixed-width panes over a horizontally scrolling strip, with runtime width checks logging a warning if panes drift from 400 px.

**Date**: 2025-11-13

---

## Context

With history-based navigation (ADR-001) and append-only history (ADR-002), we needed to decide how to display the history visually.

Key requirement: **"Show diagrams in a 3-pane layout that users can traverse left-right"**

Options:
1. **Modal/Page Replacement** - Show one diagram at a time, replace on navigation
2. **Tab-Based** - Show multiple tabs, user clicks tab to switch (like browser tabs)
3. **Carousel/Slider** - Show one diagram, slide left/right to reveal next/prev
4. **Fixed Viewport Over Strip** - Show exactly 3 diagrams always, scroll sideways to reveal more

---

## Decision

**We chose Fixed 3-Pane Viewport Over Infinite Strip.**

Architecture:
- **Strip**: Horizontal container with width = `history.length * 400px` (grows infinitely)
- **Viewport**: Fixed 1200px window showing exactly 3 panes (400px each)
- **Scroll Position**: Deterministically calculated from `currentIndex` (not user-scrollable)
- **Navigation**: User clicks links; viewport automatically slides to show new content

---

## Consequences

### Positive
✅ **Always shows context** - User sees 3 panes simultaneously (past, current, next possibilities)
✅ **No loss of visibility** - All content is always accessible (just scroll)
✅ **Elegant scroll behavior** - Smooth left-right transitions as user navigates
✅ **Spatial memory** - User learns pane positions (left is past, right is future)
✅ **Scalable with history** - Strip grows infinitely, viewport stays fixed
✅ **Desktop-friendly** - Natural for 1200px+ browsers
✅ **Jump visualization** - Can literally see earlier panes off-screen, jump buttons make sense

### Negative
❌ **Not mobile-friendly** - 1200px width doesn't work on phones (deferred)
❌ **PDF width constrained** - Each pane is 400px (A4 scaled down ~33%)
❌ **No "zoomed in" view** - Can't see full detail of one diagram
❌ **User must understand scrolling** - Less obvious than tabs or modals
❌ **Requires smooth scroll** - Browsers that don't support scroll-behavior need fallback

### Mitigation
- Breadcrumb + depth indicator + jump buttons make position clear
- CSS smooth scroll as standard (polyfill available)
- 400px pane width is still readable (A4 at ~33% scale)
- Mobile: defer to Phase 2 (single-pane view)

---

## Alternatives Considered

### Alternative 1: Modal / Page Replacement
- One diagram at a time, full screen
- Links navigate to different page
- Back button replaces with previous page

**Why rejected**:
- Loses context (can't see relationship between diagrams)
- Requires re-rendering/loading for each navigation
- Less like browser history (browser shows pages in order)
- Jump buttons less intuitive (no visual of "where you're jumping from")

### Alternative 2: Tab-Based UI
- Each pane is a tab
- User clicks tab to switch active view
- Tabs grow as user navigates deeper

**Why rejected**:
- Too many tabs become cluttered (after 20 navigations, unreadable)
- Doesn't show spatial relationship (left=past, right=future)
- Harder to understand without heavy visual design
- Browser history model doesn't use tabs

### Alternative 3: Carousel (One Visible + Arrows)
- Show one diagram large
- Left/right arrows reveal next/previous
- Swipe on mobile

**Why rejected**:
- Loses context (can't see relationships)
- Must click arrows for each navigation
- No breadcrumb equivalent possible
- Less like browser history

### Alternative 4: Single Column Vertical Stack
- Diagrams stack vertically
- Scroll up/down to navigate
- Like infinite scroll (Twitter-style)

**Why rejected**:
- Doesn't match A4 PDF layout (PDFs are horizontal)
- Vertical scrolling interferes with content scrolling
- Less intuitive for "history" navigation
- User would lose track of where they are in history

---

## Related Decisions

- **ADR-001**: History-based navigation (enables the strip concept)
- **ADR-004**: Computed scroll position (scroll is deterministic, not user-controlled)

---

## Implications for Implementation

### Geometry
```
Pane Width: 400px (A4 at ~33% scale)
Viewport Width: 1200px (shows 3 panes)
Viewport Height: 500px (A4 aspect ratio)
Strip Width: history.length * 400px (grows with history)

Scroll Calculation:
scrollLeft = max(0, (currentIndex - 2) * 400)

At currentIndex = 0: scrollLeft = 0 (show panes 0, 1, 2)
At currentIndex = 3: scrollLeft = 400 (show panes 1, 2, 3)
At currentIndex = 50: scrollLeft = 19200 (show panes 48, 49, 50)
```

### CSS Structure
```css
.scroll-container {
  width: 1200px;
  overflow-x: hidden;
  overflow-y: hidden;
  border: 2px solid #333;
}

.pane-strip {
  display: flex;
  width: /* calculated */ ;
}

.pane {
  flex: 0 0 400px;  /* Don't shrink, don't grow, 400px width */
}
```

### React Implementation
```javascript
// Container controls scroll position
useEffect(() => {
  scrollContainerRef.current?.scrollTo({
    left: Math.max(0, scrollLeft),
    behavior: 'smooth'
  });
}, [scrollLeft]);
```

### Pane Rendering
```javascript
// All history items rendered, but only 3 visible in viewport
history.map((node, index) => (
  <Pane
    key={index}
    node={node}
    isVisible={index in visibleIndices}  // May not be used (CSS handles visibility)
    onClickLink={handleClickLink}
  />
))
```

---

## User Experience Flow

```
Initial State:
┌────────────────────────────────────┐
│ VIEWPORT (1200px wide)             │
│                                    │
│ ┌─────┬─────┬─────┐               │
│ │ P0  │ P1  │ P2  │ P3,P4... OFF  │
│ └─────┴─────┴─────┘               │
└────────────────────────────────────┘

After clicking link in P2 (navigate to position 3):
- scrollLeft changes from 0 → 400px
- Animation: 300ms smooth scroll
- Result:

┌────────────────────────────────────┐
│ VIEWPORT (1200px wide)             │
│                                    │
│ ┌─────┬─────┬─────┐               │
│ │ P1  │ P2  │ P3  │ P4,P5... OFF  │
│ └─────┴─────┴─────┘               │
│ P0 OFF to left                     │
└────────────────────────────────────┘

Back button (position 3 → 2):
- scrollLeft changes from 400 → 0
- Animation: 300ms smooth scroll
- P0 comes back into view
```

---

## Visual Design Implications

### Viewport Border
- Clear 2px border shows what's inside vs outside
- Makes off-screen panes obvious
- User understands "more content to left/right"

### Pane Separation
- Light gray borders between panes
- ~1px line
- Subtle, doesn't clutter

### Mock PDF Preview
- Colored box (e.g., light blue)
- Dashed border to indicate placeholder
- Text: "[PDF Preview: {name}]"
- Height: ~200-300px of pane height

### Related Diagrams List
- Simple bulleted list below preview
- Blue links (underline on hover)
- Clickable to navigate

---

## Accessibility Considerations

- **Keyboard navigation**: Arrow keys to move left/right ✓
- **Screen reader**: Challenge (complex layout, may confuse)
- **Touch**: Deferred to Phase 2 (not mobile in Phase 1)
- **Focus management**: Breadcrumb/buttons should be tabbable

---

## Testing Scenarios

### Scenario 1: Initial Load
- Viewport shows panes 0, 1, 2
- Panes 3+ off-screen to right
- scrollLeft = 0

### Scenario 2: Shallow Navigation
- Navigate 1 → 2 → 3
- currentIndex = 2
- Viewport still shows panes 0, 1, 2
- scrollLeft = 0 (no scroll yet)

### Scenario 3: Deep Navigation
- Navigate 1 → 2 → 3 → 4 → 5
- currentIndex = 4
- Viewport shows panes 2, 3, 4
- scrollLeft = 800
- Panes 0, 1 off-screen to left

### Scenario 4: Very Deep Navigation
- currentIndex = 50
- Viewport shows panes 48, 49, 50
- scrollLeft = 19200
- All earlier panes off-screen to left
- Many jump buttons available

### Scenario 5: Back Navigation
- From position 50, back multiple times
- scrollLeft decreases with each back
- Earlier panes come back into view

---

## Open Questions

- Should viewport height be fixed (500px) or responsive? **Answer**: Fixed for prototype; responsive deferred.
- Should there be scroll indicators (arrows) when panes are off-screen? **Answer**: Optional; jump buttons serve this purpose.
- What if user manually scrolls container? **Answer**: Ignore; scrollLeft is computed-only.

---

## Sign-Off

- [ ] Architecture Lead: Approved
- [ ] Product: Approved
- [ ] Engineering Lead: Approved
