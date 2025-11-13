# ADR-009: Home Position Navigation

**Status**: Accepted **Date**: Phase 1

## Decision

The documentation graph includes a canonical node `home` (aliased to the staged writing plan). Home button in navbar and Home key on keyboard both jump to `home`. `currentIndex` set to 0, history preserved.

## Context

Users navigating through 16+ documents via links can become disoriented. What's the reference point? How do they reset without reloading?

## Why Home Position Matters

- **Mental model**: Every app/website has "Home" (familiar to users)
- **Escape hatch**: Users can always reset and start over
- **Reference point**: Single consistent entry to documentation
- **Anxiety reduction**: Knowing you can return removes fear of getting lost
- **Matches browser**: Browser "Home" button behavior expected

## The Pattern

```
User at any position (e.g., ADR007, index 15):
  Press Home button OR Home key
               ↓
  currentIndex = 0 (back to `home`)
  history preserved (can jump back to 15)
  Breadcrumb shows: "1 / 16"
```

## State Behavior

When Home is pressed:

- currentIndex → 0
- history array → unchanged
- scrollLeft → computed as max(0, (0 - 2) * 400) = 0
- breadcrumb → "1 / [total]"
- visible panes → [0, 1, 2] (first three documents)

User can still:

- Jump to any earlier position via jump buttons
- Use back arrow (disabled at 0)
- Navigate forward from home again

## Implementation

javascript

```javascript
// State management
const [history, setHistory] = useState([initialNode])
const [currentIndex, setCurrentIndex] = useState(0)

// Home handler
const handleHome = () => {
  setCurrentIndex(0)  // Jump to start
  // history unchanged - can still jump to previous positions
}

// Navbar button
<button onClick={handleHome} title="Home (Press Home key)">
  🏠 Home
</button>

// Keyboard listener
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Home') {
      e.preventDefault()
      handleHome()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

## UI/UX Placement

Navbar layout:

```
[🏠 Home] [← Back] [Breadcrumb: Execution... 1/16] [...jump buttons...]
```

Keyboard: Home key (standard on most keyboards)

- Different from arrow keys (← back, → forward)
- Intuitive for users familiar with web browsers
- Escape from any deep position

Accessibility: Home button prominent, always available

## Benefits

✓ Psychological safety (never truly lost) ✓ Reduced navigation anxiety ✓ Familiar browser-like behavior ✓ Single entry point for documentation ✓ Easy to implement (one setState call) ✓ No state complexity added

## Trade-offs

✗ Uses Home key (users must know about it) ✗ Navbar space consumed by Home button ✗ Not discoverable without UI hint

## Mitigation

- Help text/tooltip on Home button
- Keyboard shortcuts documented in UI
- Phase 2: Add on-screen help panel
- Include in onboarding/welcome screen

## Edge Cases

**Case 1**: User at home, presses Home

- No effect (already at 0)
- ✓ Acceptable

**Case 2**: User jumps to home, then back, then home again

- Works correctly each time
- ✓ Correct behavior

**Case 3**: User navigates 50+ nodes, then home

- Still goes to index 0 correctly
- ✓ Scales fine

**Case 4**: User at home, presses back arrow

- Back button disabled (currentIndex = 0)
- ✓ Handled by ADR004 logic

## V2+ Scaling

```
V1 (React):
  handleHome() → setCurrentIndex(0)
  Smooth scroll animation to scrollLeft = 0

V2 (Terminal):
  handle_home() → currentIndex = 0
  Display first three panes in terminal
  Same keyboard listener works

V3 (PDF):
  handle_home() → go to first PDF page
  Scroll position reset

V4 (Editor):
  handle_home() → reset editor view to start
  Preserve document state
```

Same navigation logic, different UI implementation.

## Related Decisions

- ADR003FixedThreePaneViewport: Defines viewport showing 3 panes from home
- ADR004ComputedScrollPosition: Home position means scrollLeft = 0
- ADR005ReactHooksState: Home handler uses setState

## Implementation Checklist

- ✓ Add handleHome function to App.jsx
- ✓ Add Home button to NavigationBar
- ✓ Add keyboard listener for Home key
- ✓ Update breadcrumb to show current depth
- ✓ Style Home button to be prominent
- ✓ Test: home at start position
- ✓ Test: home from deep position
- ✓ Test: home multiple times in sequence
- ✓ Verify smooth scroll animation works
- ✓ Verify history not lost on home

## Phase 2 Considerations

- Keyboard shortcuts help panel
- Mobile: swipe gesture to home
- Desktop: F5 or other shortcut alternatives
- Analytics: track home button usage

See: [Design Decisions Log](Design Decisions Log)
