# Artifact 9: Implementation Roadmap (Full Version)

## File Structure

```
src/
├── App.jsx                    (Main app component, state management)
├── App.css                    (Global styles for nav, panes, markdown)
├── data/
│   └── docsData.js          (auto-generated from final/summaries via scripts/generateDocsData.js)
├── components/
│   ├── NavigationBar.jsx      (Top navigation bar)
│   ├── ScrollContainer.jsx    (Viewport + scroll logic)
│   ├── PaneStrip.jsx          (Flex container for panes)
│   ├── Pane.jsx               (Individual pane component)
│   └── RelatedDiagrams.jsx    (List of links in pane)
├── hooks/
│   └── useNavigation.js       (Custom hook for navigation logic)
└── utils/
    └── scrollCalculations.js  (Scroll position formulas)

public/
└── index.html                 (Entry point)
```

---

## Component Hierarchy

```
App
├── NavigationBar
│   ├── BreadcrumbDisplay (text only)
│   ├── AncestorJumpButtons (dynamic button list)
│   ├── BackControls
│   │   ├── [◄ BACK] button
│   │   ├── [🏠 HOME] button
│   │   └─ Depth display
│   └── KeyboardHintText
│
└── ScrollContainer
    └── PaneStrip
        └── Pane[] (map over history)
            ├── PaneHeader
            ├── MarkdownContent (rendered markdown)
            └── RelatedDiagrams
                └── Link[] (map over node.links)
```

---

## State Management Strategy

### App.jsx (Root State)

```javascript
const [history, setHistory] = useState([DIAGRAMS_DATA['issues']]);
const [currentIndex, setCurrentIndex] = useState(0);

// Derived state (calculated, not stored)
const visibleStartIndex = Math.max(0, currentIndex - 2);
const visiblePanes = history.slice(visibleStartIndex, currentIndex + 1);
const hiddenAncestors = history.slice(0, visibleStartIndex);
const scrollLeft = Math.max(0, (currentIndex - 2) * 400);
const depth = currentIndex + 1;
const totalHistory = history.length;
```

### State Update Handlers (all in App.jsx)

```javascript
const handleClickLink = (targetDocId) => {
  const targetDoc = DIAGRAMS_DATA[targetDocId];
  setHistory(prev => [...prev, targetDoc]);
  setCurrentIndex(history.length);
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
```

### Props Flow

```
App 
  → history[], currentIndex
  → NavigationBar { depth, hiddenAncestors, onBack, onHome, onJumpToAncestor }
  → ScrollContainer { scrollLeft, onScroll effect }
    → PaneStrip { history, currentIndex }
      → Pane[] { node, onClickLink }
        → RelatedDiagrams { links, onClickLink }
```

---

## Implementation Order (Phased)

### Phase 1: Foundation (Core Logic) ✓

**Goal**: Get state management and scroll working

**Files to Create**:
1. `data/docsData.js` (generated) - All documentation nodes as markdown strings
2. `utils/scrollCalculations.js` - Utility functions for scroll formulas
3. `App.jsx` - State, handlers, derived values
4. `App.css` - Basic layout (flexbox for containers)

**What Works After Phase 1**:
- State updates correctly
- Scroll position calculates correctly
- App renders something visible
- Navigation logic works

**Testing**:
- Manually click links (in console), verify history grows
- Click back, verify currentIndex decreases
- Verify scrollLeft matches formula

**Checklist**:
- [ ] Generate data/docsData.js (run `node scripts/generateDocsData.js`)
- [ ] Create utils/scrollCalculations.js with helper functions:
  - [ ] calculateScrollLeft(currentIndex)
  - [ ] getVisiblePanes(history, currentIndex)
  - [ ] getHiddenAncestors(history, currentIndex)
  - [ ] getDepthDisplay(currentIndex, historyLength)
- [ ] Create App.jsx with:
  - [ ] useState for history, currentIndex
  - [ ] All handlers (handleClickLink, handleBack, etc.)
  - [ ] All derived values calculated
  - [ ] Basic render (test the math)
- [ ] Create App.css with basic flexbox layout

---

### Phase 2: Layout & Navigation Bar ✓

**Goal**: Create UI containers and navigation

**Files to Create**:
1. `components/NavigationBar.jsx` - Top bar component
2. `components/NavigationBar.css` - Navigation styling
3. `components/ScrollContainer.jsx` - Viewport wrapper
4. `components/ScrollContainer.css` - Scroll container styling

**What Works After Phase 2**:
- Navigation bar appears with breadcrumb
- Scroll container visible with border
- Back/Home buttons appear
- Jump buttons appear when needed
- Depth indicator shows

**Testing**:
- Back button works and is disabled when currentIndex = 0
- Home button works and goes to position 0
- Jump buttons show only when there are hidden ancestors
- Breadcrumb displays correctly
- Depth shows "X/Y" format

**Checklist**:
- [ ] Create components/NavigationBar.jsx with:
  - [ ] BreadcrumbDisplay (shows visible panes titles)
  - [ ] AncestorJumpButtons (dynamic list)
  - [ ] BackControls (Back, Home buttons, Depth display)
  - [ ] KeyboardHintText (optional hint)
- [ ] Create components/NavigationBar.css
- [ ] Create components/ScrollContainer.jsx with:
  - [ ] Fixed width 1200px, fixed height 500px
  - [ ] border: 2px solid #333 (viewport indicator)
  - [ ] overflow-x: hidden
  - [ ] scrollLeft controlled by props
- [ ] Create components/ScrollContainer.css
- [ ] Update App.jsx to import and render both

---

### Phase 3: Panes & Display ✓

**Goal**: Render individual document panes

**Files to Create**:
1. `components/PaneStrip.jsx` - Flex container for all panes
2. `components/Pane.jsx` - Individual pane component
3. `components/Pane.css` - Pane styling
4. `components/RelatedDiagrams.jsx` - Links list in pane

**What Works After Phase 3**:
- Panes render with correct content
- 3 panes visible at once (or fewer at start)
- Related documents links appear
- Clicking links updates state
- Forward navigation shifts panes right
- Back navigation shifts panes left
- Visible pane count always 1-3

**Testing**:
- Navigate forward, panes shift right
- Navigate back, panes shift left
- Visible pane count is correct (1 at start, 3 when deep)
- Off-screen panes remain in the DOM but are hidden via CSS (no virtualization in V1)
- Links in pane are clickable

**Checklist**:
- [ ] Create components/PaneStrip.jsx with:
  - [ ] Flex container
  - [ ] Width = history.length * 400px
  - [ ] Maps over history, renders Pane for each
- [ ] Create components/Pane.jsx with:
  - [ ] PaneHeader (shows document title)
  - [ ] MarkdownContent (uses markdown renderer)
  - [ ] RelatedDiagrams (list of links)
- [ ] Create components/Pane.css with:
  - [ ] Pane width: 400px, flex: 0 0 400px
  - [ ] Padding, borders, background
  - [ ] Markdown styling
- [ ] Create components/RelatedDiagrams.jsx with:
  - [ ] Renders ul > li > button for each link
  - [ ] onClick calls onClickLink(targetId) (the `links[]` array is the navigation source of truth; inline markdown links remain informational text)
  - [ ] Shows document titles (not IDs) and highlights the first link in the rightmost pane to mirror the ArrowRight shortcut
- [ ] Update App.jsx to render PaneStrip inside ScrollContainer

---

### Phase 4: Interactions & Polish ✓

**Goal**: Keyboard shortcuts, smooth animations, markdown rendering

**Files to Modify**:
1. `App.jsx` - Add useEffect for keyboard events
2. `ScrollContainer.jsx` - Add smooth scroll animation
3. `App.css` - Add animations, transitions
4. Wire the ADR-008 renderer (custom JSX-based markdown renderer)

**What Works After Phase 4**:
- Arrow keys work (← for back, → jumps to the first related link in the rightmost pane, highlighted with a “→” hint)
- Home key works and prevents the browser’s default scroll-to-top behavior
- Smooth scroll animation (~300–400ms, browser-dependent) with `prefers-reduced-motion` honored
- Visual feedback on hover (buttons, links)
- Markdown renders via the ADR-008 renderer (see `docs/RenderingSpec.md`)
- Headers in different colors/sizes
- Code blocks in monospace

**Testing**:
- Keyboard shortcuts work globally
- Scroll animation is smooth, 300ms duration
- No jarring jumps in viewport
- Markdown displays correctly (colors, fonts, emphasis)
- Links are styled and clickable

**Checklist**:
- [ ] Add markdown renderer (ADR-008 implementation):
  - [ ] Import the shared renderer component (CompleteMarkdownRenderer)
  - [ ] Pass pane markdown for read-only rendering (navigation handled by Related links list)
  - [ ] Follow the runtime spec in `docs/RenderingSpec.md`
- [ ] Add useEffect in App.jsx for keyboard events:
  - [ ] ArrowLeft → handleBack()
  - [ ] ArrowRight → handleArrowRight() helper (jumps to first link in rightmost visible pane)
  - [ ] Home → handleHome()
- [ ] Add smooth scroll to ScrollContainer.jsx:
  - [ ] Use `scrollTo({ left, behavior: 'smooth' })` with a null guard on the ref
  - [ ] Add CSS fallback with `scroll-behavior: smooth` plus `prefers-reduced-motion` override
- [ ] Update App.css with:
  - [ ] Smooth transitions on button hover
  - [ ] Disabled state styling for buttons
  - [ ] Link styling (blue, underline on hover)
- [ ] Add Pane.css markdown styling:
  - [ ] h1: color #1a73e8, font-size 2em
  - [ ] h2: color #34a853, font-size 1.5em
  - [ ] h3: color #666, font-size 1.2em
  - [ ] code: monospace, gray background
- [ ] Show a soft warning when history length exceeds 100 entries with a “Clear history” button (keeps current pane)
  - [ ] bold/italic: proper styling
- [ ] Test all interactions

---

## Key Utilities to Create

### `utils/scrollCalculations.js`

```javascript
export const PANE_WIDTH = 400;
export const VIEWPORT_PANES = 3;
export const VIEWPORT_WIDTH = PANE_WIDTH * VIEWPORT_PANES; // 1200px

export function calculateScrollLeft(currentIndex) {
  return Math.max(0, (currentIndex - (VIEWPORT_PANES - 1)) * PANE_WIDTH);
}

export function getVisiblePanes(history, currentIndex) {
  const startIndex = Math.max(0, currentIndex - (VIEWPORT_PANES - 1));
  return history.slice(startIndex, currentIndex + 1);
}

export function getHiddenAncestors(history, currentIndex) {
  const startIndex = Math.max(0, currentIndex - (VIEWPORT_PANES - 1));
  return history.slice(0, startIndex);
}

export function getDepthDisplay(currentIndex, historyLength) {
  return `${currentIndex + 1}/${historyLength}`;
}
```

### `hooks/useNavigation.js`

```javascript
import { useState } from 'react';
import { DOCS, START_DOC_ID } from '../data/docsData';

export function useNavigation() {
  const [history, setHistory] = useState([DOCS[START_DOC_ID]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
const handleClickLink = (targetDocId) => {
  const targetDoc = DOCS[targetDocId];
  setHistory(prev => {
    const next = [...prev, targetDoc];
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
  
  return {
    history,
    currentIndex,
    handleClickLink,
    handleBack,
    handleHome,
    handleJumpToAncestor
  };
}
```

---

## Data Source: Planning Documents (17 Nodes)

- Canonical markdown lives under `final/summaries/` (currently 17 files).
- `scripts/generateDocsData.js` extracts:
  - `id` (filename without extension)
  - `title` (first `#` heading)
  - `links` (all `[text](target)` references that are local IDs)
  - `content` (raw markdown, escaped for template literals)
- Output file: `prototype/react/docsData.js` (or `src/data/docsData.js` in the production app).

Example entry in `docsData.js`:

```javascript
"home": {
  id: "home",
  title: `Home (Staged Writing Plan)`,
  filename: "home.md",
  links: ["DesignDecisionsLog", "MasterIssueChecklist"],
  content: `# Staged Writing Plan\n\n...`
}
```

Home node alignment:
- ADR-009 designates **`home`** as the entry document (alias for the staged writing plan).
- The generator sets `START_DOC_ID = 'home'`; if `home.md` is missing, it falls back to `MasterIssueChecklist`.

Keep the markdown set and the generated data in sync by re-running the script whenever the summaries change.

**Link integrity**
- Before regenerating, run the link checker described in `docs/LinkIntegrity.md` to ensure all `[text](target)` references resolve to actual documents.
- The React prototype assumes data is link-safe; broken targets are caught by the script, not at runtime.

---

## Testing Scenarios (Manual, Phase by Phase)

### Phase 1 Tests
- [ ] Open dev console, verify history = [first doc], currentIndex = 0
- [ ] Manually call handleClickLink("setup"), verify history grows
- [ ] Verify scrollLeft calculates correctly
- [ ] Verify visiblePanes calculation works

### Phase 2 Tests
- [ ] Breadcrumb displays correct document titles
- [ ] No jump buttons at start (no hidden ancestors)
- [ ] After 3 navigations, jump buttons appear
- [ ] Click jump button, verify jump works
- [ ] Back button disabled when currentIndex = 0
- [ ] Home button goes to position 0
- [ ] Depth shows "X/Y" correctly

### Phase 3 Tests
- [ ] Initial render shows 1 pane (just first doc)
- [ ] Click link, second pane appears
- [ ] After 3 navigations, see exactly 3 panes
- [ ] Fourth navigation makes pane 1 disappear off-left
- [ ] Back button removes rightmost pane from view
- [ ] Links are clickable and trigger navigation
- [ ] Related documents list shows correct links

### Phase 4 Tests
- [ ] Arrow left key works (back button)
- [ ] Arrow right key works (forward to first link)
- [ ] Home key works (go to home)
- [ ] Scroll animation is smooth, takes ~300ms
- [ ] Markdown renders with colors (h1 blue, h2 green)
- [ ] Code blocks have monospace font
- [ ] Bold/italic text displays correctly
- [ ] All interactions feel responsive and smooth

---

## Common Implementation Pitfalls to Avoid

1. **Forgetting to add +1 to currentIndex after setHistory**
   - Push to array makes length increase
   - New index should be `history.length` (after push)
   - Wrong: `setCurrentIndex(currentIndex + 1)`
   - Right: `setCurrentIndex(history.length)`

2. **Manually scrolling the container**
   - scrollLeft must be computed-only, not user-adjustable
   - Always: `overflow: hidden` to hide browser scrollbar
   - Use: `scrollTo()` to position programmatically

3. **Rendering all history items even off-screen**
   - This is OK for 16 items, but note it
   - All DOM nodes exist, just outside viewport
   - For Phase 2+: consider virtual scrolling if many docs

4. **History array mutation**
   - Always use `setHistory(prev => [...prev, newDoc])`
   - Never: `history.push()` directly (breaks React reactivity)

5. **Not updating on keyboard events**
   - useEffect must have keyboard listener
   - Must be global (not scoped to input)
   - Don't nest in contentEditable

6. **Forgetting Math.max(0, ...) in calculations**
   - scrollLeft can't be negative
   - visibleStartIndex can't be negative
   - Always guard: `Math.max(0, ...)`

7. **Using array indices instead of document IDs for links**
   - Links must reference doc IDs ('issues', 'status', etc.)
   - Never use array indices ([0], [1])
   - Indices change as history grows

---

## Success Criteria (Implementation Complete)

After all 4 phases:
- [ ] State management works (history grows, currentIndex updates)
- [ ] Navigation works (forward, back, jump, home)
- [ ] Scroll position correct (3-pane viewport always)
- [ ] UI renders (navigation bar, panes, links)
- [ ] Keyboard shortcuts work
- [ ] Smooth animations (300ms scroll)
- [ ] Markdown renders with styling
- [ ] All interactions feel responsive and correct
- [ ] Ready for user research on navigation UX

---

## Token Estimation

**Phase 1**: 2-3 hours work, ~5-10K tokens
**Phase 2**: 1-2 hours work, ~3-5K tokens
**Phase 3**: 2-3 hours work, ~5-10K tokens
**Phase 4**: 1-2 hours work, ~3-5K tokens

**Total**: ~16-32K tokens for full implementation

---

**Status**: Ready for Phase 1 implementation once Step 1 (page format) is approved
Example helper:

```javascript
const handleArrowRight = () => {
  const last = visiblePanes[visiblePanes.length - 1];
  const firstLink = last?.links?.[0];
  if (firstLink) {
    handleClickLink(firstLink);
  }
};
```
