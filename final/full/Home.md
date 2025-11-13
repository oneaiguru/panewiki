# Home (Staged Writing Plan with Progress)

## Stage 1: Core Logic Foundation (Critical) ⏳ NOT STARTED

**Goal**: Ensure state/navigation/scroll mechanics are rock-solid

**Sections to Write**:
- [ ] Section 3: State Management (History-Based) - fixes #1, #15
- [ ] Section 4: Navigation Actions - fixes #2, #3
- [ ] Section 5: Viewport & Scroll Logic - fixes #17

**Acceptance Criteria**:
- All state transitions clearly defined
- currentIndex behavior unambiguous at all positions
- Navigation actions (forward/back/jump) mapped to state changes
- Scroll position formula verified with examples
- All 300ms timing specified
- useEffect dependency chain explicit

**Review Checkpoint**: Confirm foundation is solid before Stage 2

**Status**: ⏳ Pending

---

## Stage 2: Data & Examples (Verification) ⏳ NOT STARTED

**Goal**: Create verified mock data and fix example calculations

**Sections to Write**:
- [ ] Section 9: Mock Data Design - fixes #8, #14, #18
- [ ] Section 10: Navigation Traversal Scenarios - fixes #9, #10, #11

**Acceptance Criteria**:
- Actual node IDs defined with real structure
- Cross-level links explicitly defined
- React memoization strategy noted
- All example calculations verified with actual IDs
- Math in 10.1 shows correct 5 jump buttons
- Math in 10.2 shows correct [L2,L3,L4] visible panes and 1 button

**Review Checkpoint**: All examples mathematically correct and traceable to Section 9

**Status**: ⏳ Waiting for Stage 1

---

## Stage 3: UI & Navigation Bar ⏳ NOT STARTED

**Goal**: Ensure component architecture and nav bar behavior align

**Sections to Write**:
- [ ] Section 7: Component Architecture - fixes #16
- [ ] Section 8: Navigation Bar Layout - fixes #5, #6, #7

**Acceptance Criteria**:
- Section 7 explicitly mentions useEffect for scroll updates
- Jump button behavior clear: show all, no scrolling (decision from #7)
- Breadcrumb display shows visible panes only (simplification for #5, #6)
- Button disabled states explicit
- Component props and state flow clear

**Review Checkpoint**: Confirm UI can be implemented as specified

**Status**: ⏳ Waiting for Stage 1

---

## Stage 4: Remaining & Context ⏳ NOT STARTED

**Goal**: Complete documentation and finalize criteria

**Sections to Write**:
- [ ] Section 1: Core Concept & Mental Model
- [ ] Section 2: Data Structure Overview
- [ ] Section 6: Edge Cases & Special Behaviors - fixes #4
- [ ] Section 11: Success Criteria - fixes #12, #13
- [ ] Section 12: Styling & Layout

**Acceptance Criteria**:
- Section 1 clearly states: "infinite history, graph-based, like browser history"
- Section 2 overview aligns with Section 9 data
- Section 6 explicitly clarifies: "never truncate, always append to end"
- Section 11 removes performance claim or caveat it to "tested up to 100 items"
- Section 11 defers mobile to "future work" or specifies single-pane behavior
- All styling is simple and readable

**Review Checkpoint**: Full PRD is consistent and complete

**Status**: ⏳ Waiting for Stages 1-3

---

## Overall Progress

```
Stage 1: ⏳ NOT STARTED [████░░░░░░] 0%
Stage 2: ⏳ BLOCKED    [░░░░░░░░░░] 0%
Stage 3: ⏳ BLOCKED    [░░░░░░░░░░] 0%
Stage 4: ⏳ BLOCKED    [░░░░░░░░░░] 0%

TOTAL:    ⏳ NOT STARTED [████░░░░░░] 0%
```

---

**Last Updated**: [Initial creation]

---

## Quick Links

### Planning docs
- [Master Issue Checklist](Master Issue Checklist)
- [Sections Status Tracker](Sections Status Tracker)
- [Implementation Roadmap](Implementation Roadmap)
- [Design Decisions Log](Design Decisions Log)
- [Constraints and Assumptions](Constraints and Assumptions)
- [Definition Dictionary](Definition Dictionary)
- [Mock Data Template](Mock Data Template)

### ADR index
- [ADR-001 History Based Navigation](ADR-001 History Based Navigation)
- [ADR-002 Append Only History](ADR-002 Append Only History)
- [ADR-003 Fixed Three Pane Viewport](ADR-003 Fixed Three Pane Viewport)
- [ADR-004 Computed Scroll Position](ADR-004 Computed Scroll Position)
- [ADR-005 React Hooks State](ADR-005 React Hooks State)
- [ADR-006 Mock PDFs Not Real Rendering](ADR-006 Mock PDFs Not Real Rendering)
- [ADR-007 Append Forward Navigation](ADR-007 Append Forward Navigation)
- [ADR-008 Renderer Independent Navigation](ADR-008 Renderer Independent Navigation)
- [ADR-009 Home Position Navigation](ADR-009 Home Position Navigation)
