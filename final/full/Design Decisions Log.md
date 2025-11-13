# Artifact 5: Design Decisions Log

## Explicit Design Decisions (What & Why)

### Decision #1: Breadcrumb Shows Visible Panes Only
**Decision**: Breadcrumb display shows only the 3 currently visible panes, not full history
**Rationale**: 
- Full history of 100+ items becomes unreadable (Issue #6)
- Shows what user is looking at right now (matches viewport)
- Keeps nav bar clean and scannable
- Depth indicator (X/150) shows full position if needed
**Addresses**: Issues #5, #6
**Implemented in**: Section 8.1
**Example**: At history position 50, breadcrumb shows "Node48 > Node49 > Node50"

---

### Decision #2: Never Truncate History, Always Append
**Decision**: History array only grows; never removes or prunes items
**Rationale**:
- Matches browser back-button behavior (can go back indefinitely)
- Simplifies state management (no edge cases for "remove middle item")
- Users expect to be able to backtrack even after 100 clicks
- Memory footprint minimal (just node references, not data copies)
**Addresses**: Issue #4
**Implemented in**: Section 6.7
**Example**: User at position 3 clicks link → history becomes [..., node5], currentIndex = 4 (no truncation of earlier items)

---

### Decision #3: Show All Jump Buttons (No Truncation)
**Decision**: Show jump buttons for ALL hidden ancestor panes, not truncated or scrollable
**Rationale**:
- Prototype: simplicity over polish
- Shows true capability: can jump to any earlier position instantly
- Visual feedback of "how far back you can go"
- For production: could be truncated or made scrollable later
**Addresses**: Issue #7
**Implemented in**: Section 6.5, Section 8.2
**Constraint**: May result in many buttons if history is 100+ items (acceptable for prototype)

---

### Decision #4: Right Arrow Key Does Nothing on Leaf Nodes
**Decision**: If rightmost pane has no links, keyboard right-arrow is a no-op
**Rationale**:
- Leaf nodes have no forward navigation available
- Prevents confusing behavior (key press with no effect is better than unknown behavior)
- Matches expected UX: can't go forward if no options exist
**Addresses**: Issue #3
**Implemented in**: Section 4.5
**Alternative**: Could be made to do nothing silently or show a hint, both acceptable

---

### Decision #5: Graph-Based Navigation (Any Node → Any Node)
**Decision**: Nodes can link to any other node; no parent-child hierarchy enforced
**Rationale**:
- Matches real-world content: web pages don't have strict hierarchy
- Enables cross-level links (Level 2 → Level 5)
- Enables self-references and loops
- Tests full capabilities of history/viewport system
- Makes for interesting test cases
**Addresses**: Core requirement
**Implemented in**: Sections 2, 9
**Contrast**: NOT a tree structure (which would limit navigation)

---

### Decision #6: Initial State = Homepage Only
**Decision**: App starts with history = [HomepageNode], currentIndex = 0
**Rationale**:
- Simplest starting state
- User must navigate forward (can't immediately go back)
- Matches real browser: you start somewhere
**Addresses**: Issue #15 (clarified)
**Implemented in**: Section 3
**Example**: history.length = 1, depth = "1/1", no jump buttons visible

---

### Decision #7: Pane Width = 400px (A4 Size at ~33% Width)
**Decision**: Each pane is 400px wide, viewport shows exactly 3 (1200px total)
**Rationale**:
- A4 PDF at ~33% of typical browser width is readable
- 3 panes fit nicely on 1200px+ screens
- Round numbers (400 * 3 = 1200) simplify calculations
- Matches original PRD requirement: "three panes fit on screen"
**Implemented in**: Section 5
**Constraint**: Not responsive for mobile (deferred)

---

### Decision #8: Scroll Animation = 300ms Smooth
**Decision**: ScrollLeft updates animate over 300ms
**Rationale**:
- Fast enough to feel responsive (not sluggish)
- Slow enough to see visual transition (not jarring)
- Standard UX timing convention
**Addresses**: Issue #17 (clarified)
**Implemented in**: Section 5.2, Section 7

---

### Decision #9: No Performance Optimization in Prototype
**Decision**: Render all panes as DOM nodes; no virtual scrolling
**Rationale**:
- Prototype, not production
- Simplifies React code (no complex optimization)
- Tested scope: up to 100 items (browser still smooth)
- Virtual scrolling deferred to Phase 2 if needed
**Addresses**: Issue #12 (caveat added)
**Caveat in Section 11**: "Tested up to 100 items; beyond that recommend virtual scrolling"

---

### Decision #10: Mobile Behavior Deferred
**Decision**: No mobile optimization in prototype; single-pane fallback deferred to Phase 2
**Rationale**:
- Scope constraint: desktop browser first
- Mobile layout requires separate considerations (touch, smaller panes)
- Can add later without breaking core architecture
**Addresses**: Issue #13 (deferred)
**Implemented in**: Section 11 (success criteria)
**Note**: Artifact tagged "desktop only" for now

---

### Decision #11: No React Memoization
**Decision**: Components don't use React.memo or useMemo in prototype
**Rationale**:
- Prototype: simplicity over optimization
- 15-20 nodes render quickly without memoization
- Can add memoization in Phase 2 if needed
- Keeps code readable for prototype review
**Addresses**: Issue #14
**Implemented in**: Section 7

---

### Decision #12: Mock PDFs = Colored Boxes
**Decision**: Instead of rendering real PDFs, show placeholder boxes with diagram name
**Rationale**:
- Prototype: focus on navigation, not PDF rendering
- Real PDF rendering requires library (complex)
- Colored boxes sufficient for demonstrating UI/UX
- Easy to replace with real PDFs later
**Implemented in**: Section 7.4

---

### Decision #13: One-Way Navigation History
**Decision**: History only grows forward; no branching (like browser, not like Git)
**Rationale**:
- Simpler mental model
- Matches browser back-button expectation
- No "what if I had gone a different direction" branching
- If at position 3, user navigates forward anyway, creates linear path
**Implemented in**: Section 6.7

---

### Decision #14: Keyboard Shortcuts Enabled by Default
**Decision**: ← (back), → (forward to first link), Home work globally
**Rationale**:
- Power users appreciate shortcuts
- Adds no complexity to implementation (standard keyboard events)
- Doesn't interfere with form inputs (form inputs take precedence)
**Implemented in**: Section 4.5

---

## Decision Matrix (By Priority)

| # | Decision | Priority | Phase | Status |
|---|----------|----------|-------|--------|
| 5 | Graph-based navigation | Critical | Prototype | Locked |
| 2 | Never truncate history | Critical | Prototype | Locked |
| 6 | Initial state = Homepage | Critical | Prototype | Locked |
| 1 | Breadcrumb visible-only | High | Prototype | Locked |
| 8 | 300ms scroll animation | High | Prototype | Locked |
| 3 | Show all jump buttons | High | Prototype | Locked |
| 14 | Keyboard shortcuts | High | Prototype | Locked |
| 7 | 400px pane width | High | Prototype | Locked |
| 4 | Right arrow on leaf = no-op | Medium | Prototype | Locked |
| 9 | No performance optimization | Medium | Phase 2 | Deferred |
| 10 | Mobile deferred | Medium | Phase 2 | Deferred |
| 11 | No React memoization | Medium | Prototype | Locked |
| 12 | Mock PDFs | Medium | Prototype | Locked |
| 13 | One-way history | High | Prototype | Locked |

---

**Usage**: When implementing, consult this log for the reasoning behind each choice. If you need to change a decision, document it here with rationale.
