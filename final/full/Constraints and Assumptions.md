# Artifact 6: Assumptions & Constraints

## Environmental Assumptions

### Technology Stack
- **Framework**: React (functional components with hooks)
- **Styling**: CSS-in-JS or CSS classes (plain, no Tailwind for now)
- **Browser APIs**: Modern browser (scrollTo, smooth scroll, keyboard events)
- **JavaScript Version**: ES6+ (arrow functions, destructuring, etc.)
- **Package Manager**: npm/yarn (standard setup)
- **Bundler**: Vite or Create React App (developer choice)
- **Runtime**: Single-threaded browser environment

### Browser Support
- Desktop browsers only (Chrome, Firefox, Safari, Edge latest versions)
- No IE11 or legacy browser support
- Assumes smooth scrolling CSS support
- Assumes event listener support (keyboard, mouse)

### User Context
- Single user, single browser session (no multi-user sync)
- Single tab/window (no cross-tab communication)
- Continuous session (no persistence between page reloads)
- Assumes mouse and keyboard available (no touch optimization)

---

## Technology NOT Being Used

### Explicitly Out of Scope

**PDF Rendering**
- No real PDF files loaded or rendered
- Using mock colored boxes with text labels instead
- Rationale: Focus on navigation UX, not PDF display library

**Data Persistence**
- No database, localStorage, or session storage
- History lost on page refresh
- All data in-memory only
- Rationale: Prototype, not production app

**Real-Time Collaboration**
- No multi-user support or data sync
- No WebSocket or server communication
- Single client prototype
- Rationale: Out of scope for this prototype

**Virtual Scrolling / Virtualization**
- All history items rendered as DOM nodes
- No windowing or lazy rendering
- Works smoothly up to ~100 items
- Rationale: Prototype simplicity; Phase 2 if needed

**State Management Library**
- No Redux, Zustand, or Context API beyond local useState
- App state managed with React hooks only
- Rationale: Simple enough for single component tree

**Testing Framework**
- No Jest, Vitest, or testing libraries included
- Manual testing via browser only
- Rationale: Prototype validation, not production QA

**TypeScript**
- Pure JavaScript (no TypeScript)
- Rationale: Faster prototyping, simpler setup

**Component Library**
- No Material-UI, Chakra, or similar
- Plain HTML + CSS buttons and inputs
- Rationale: Full visual control, minimal dependencies

**Accessibility (WCAG)**
- No screen reader optimization initially
- No ARIA labels or semantic HTML focus
- Rationale: Prototype; Phase 2 if needed

**Mobile Optimization**
- Desktop-only layout (1200px + viewport)
- No responsive breakpoints or touch handling
- Rationale: Deferred to Phase 2

**Analytics or Tracking**
- No event tracking, Google Analytics, or telemetry
- Rationale: Out of scope

---

## Hard Constraints

### Strip Width Calculation
- Formula: `strip.width = history.length * 400px`
- At 100 items: 40,000px wide
- At 1000 items: 400,000px wide
- Browser handles this fine (CSS transforms, not layout recalc)
- **Constraint**: No virtual scrolling, so all DOM nodes exist

### Viewport Size (Fixed)
- Width: 1200px (shows 3 panes of 400px each)
- Height: 500px (A4-ish ratio, approximate)
- **Constraint**: Not responsive; desktop only

### Pane Layout (Immutable)
- Each pane: 400px wide, flex: 0 0 400px (no shrink/grow)
- All panes identical width (no dynamic sizing)
- **Constraint**: Affects scroll position calculations

### Scroll Position Logic (Deterministic)
- Formula: `scrollLeft = max(0, (currentIndex - 2) * 400)`
- Always maintains 3-pane viewport (or fewer at history start)
- **Constraint**: Cannot manually scroll; scrollLeft is computed-only

### History Immutability (Append-Only)
- History array can only grow (push)
- Cannot remove, truncate, or modify past items
- **Constraint**: Simplifies state management

### Node IDs (Unique)
- Each node must have unique `id` string
- Links reference node IDs, not indices
- **Constraint**: No duplicate IDs allowed

---

## Data Constraints

### Mock Data Set
- Approximately 15-20 diagram nodes (actually 32 for richer testing)
- Each node has: id (string), name (string), links (array of IDs)
- Nodes stored in flat object map (not tree)
- **Constraint**: Fixed set of nodes (no create/edit in prototype)

### Link Structure
- Each node's `links` array contains target node IDs only
- Links can point to any node (no parent-child restriction)
- Links can include self-reference (node links to itself)
- Links can create cycles (A→B→C→A)
- **Constraint**: No validation that all linked IDs exist (assume valid data)

### Mock PDF Content
- String placeholder for PDF preview
- No actual file uploads or rendering
- Fixed content per node
- **Constraint**: Not representing real document content

---

## Performance Constraints

### Tested Limits
- **History length**: Smooth up to 100 items (not rigorously tested beyond)
- **DOM nodes**: Same as history length (1:1 ratio)
- **Rendering**: React re-renders entire app on state change (no memoization)
- **Memory**: Minimal (node references only, ~1-2KB per history item)
- **Scroll animation**: 300ms smooth (CSS transition, not JS animation loop)

### What We're NOT Optimizing
- Initial page load (no lazy loading of diagram data)
- Re-render performance (no shouldComponentUpdate or React.memo)
- Memory at 1000+ item history
- Scroll performance beyond 100 items
- Runtime with 50+ jump buttons visible

---

## Behavioral Constraints

### Navigation Rules (Fixed)
- Forward: append to history, increment currentIndex
- Back: decrement currentIndex (history unchanged)
- Jump: set currentIndex to any earlier position
- Home: set currentIndex to 0
- **Constraint**: No branching; if at position 3 and navigate, position 4+ are discarded (actually: appended, not discarded)

### User Input Handling
- Keyboard events: Always listened to (not scoped to input)
- Mouse clicks: Only respond to link clicks and button clicks
- Typing into fields: Not applicable (no input fields in prototype)
- **Constraint**: No form validation or input handling

### State Transitions
- Only two state variables: `history` array, `currentIndex` number
- All other values (scrollLeft, visible panes, etc.) are derived/computed
- **Constraint**: Never directly mutate state; always use setState

---

## Scope Boundaries (What's NOT Included)

| Feature | Status | Reason |
|---------|--------|--------|
| Create/Edit Diagrams | ❌ Out of scope | Prototype is read-only |
| Search or Filter | ❌ Out of scope | Graph small enough to navigate |
| Favorites/Bookmarks | ❌ Out of scope | History itself is the bookmark |
| Share/Export History | ❌ Out of scope | Single-user, single session |
| Dark Mode | ❌ Out of scope | Simple styling only |
| Accessibility (WCAG) | ❌ Out of scope | Phase 2 consideration |
| Mobile View | ❌ Out of scope | Desktop only |
| Touch Support | ❌ Out of scope | Desktop only |
| Real PDF Rendering | ❌ Out of scope | Mock boxes sufficient |
| Database/Backend | ❌ Out of scope | Browser-only prototype |
| Analytics | ❌ Out of scope | Not needed for prototype |
| Authentication | ❌ Out of scope | Single user assumed |

---

## Assumptions About Data Quality

- All node IDs are unique
- All links point to valid node IDs (no 404-style dead links)
- Node data doesn't change during session
- Node names are short enough to display in headers
- No circular reference issues (though cycles allowed in navigation)
- Mock data is hardcoded and valid JSON

---

## Assumptions About User Behavior

- User navigates via links (not directly manipulating state)
- User uses browser back-button or our [◄ BACK] button (not browser history)
- User understands the 3-pane viewport (might need tooltip on first use)
- User won't navigate 1000+ times in one session (though it's allowed)
- User expects keyboard shortcuts to work globally

---

**Usage**: Review these constraints before starting implementation. If you need to change a constraint, document it and update the PRD accordingly.
