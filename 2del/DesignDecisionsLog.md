# Design Decisions Log

## Decision #1: Breadcrumb Shows Visible Panes Only
Breadcrumb displays only 3 currently visible panes, not full history.
Status: Locked

## Decision #2: Never Truncate History, Always Append
History array only grows; never removes or prunes items.
Status: Locked

## Decision #3: Show All Jump Buttons (No Truncation)
Jump buttons for ALL hidden ancestor panes, not truncated.
Status: Locked

## Decision #4: Right Arrow on Leaf Nodes = No-Op
If rightmost pane has no links, keyboard right-arrow does nothing.
Status: Locked

## Decision #5: Graph-Based Navigation (Any Node → Any Node)
Nodes can link to any other node; no parent-child hierarchy.
Status: Locked

## Decision #6: Initial State = Homepage Only
App starts with history = [HomepageNode], currentIndex = 0.
Status: Locked

## Decision #7: Pane Width = 400px (A4 at ~33%)
Each pane 400px, viewport 1200px = 3 panes visible.
Status: Locked

## Decision #8: Scroll Animation = 300ms Smooth
ScrollLeft updates animate over 300ms via CSS smooth scroll.
Status: Locked

## Decision #9: No Performance Optimization in Prototype
Render all panes as DOM nodes; no virtual scrolling.
Status: Deferred to Phase 2

## Decision #10: Mobile Behavior Deferred
No mobile optimization in prototype; single-pane deferred.
Status: Deferred to Phase 2

## Decision #11: No React Memoization
Components don't use React.memo or useMemo in prototype.
Status: Deferred to Phase 2

## Decision #12: Mock PDFs = Colored Boxes
Show placeholder boxes with diagram name instead of real PDFs.
Status: Prototype only

## Decision #13: One-Way Navigation History
History only grows forward; no branching like Git.
Status: Locked

## Decision #14: Keyboard Shortcuts Enabled by Default
← (back), → (forward), Home work globally.
Status: Locked

## Related Architecture Decisions

- [ADR001HistoryBasedNavigation](ADR001HistoryBasedNavigation)
- [ADR002AppendOnlyHistory](ADR002AppendOnlyHistory)
- [ADR003FixedThreePaneViewport](ADR003FixedThreePaneViewport)
- [ADR004ComputedScrollPosition](ADR004ComputedScrollPosition)
- [ADR005ReactHooksState](ADR005ReactHooksState)
- [ADR006MockPDFsNotRealRendering](ADR006MockPDFsNotRealRendering)
- [ADR007AppendForwardNavigation](ADR007AppendForwardNavigation)
- [ADR008PureStatelessRenderer](ADR008PureStatelessRenderer)

## Supporting Documentation

- [DefinitionDictionary](DefinitionDictionary)
- [ConstraintsAndAssumptions](ConstraintsAndAssumptions)
- [MockDataTemplate](MockDataTemplate)

See: [ConstraintsAndAssumptions](ConstraintsAndAssumptions)
