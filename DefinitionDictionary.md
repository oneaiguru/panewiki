# Definition Dictionary

## Core Terms

**History**: Array of visited documents. Grows indefinitely.

**CurrentIndex**: Position in history (0-based). User's location.

**Breadcrumb**: Text showing last 3 visible panes. Navigation context.

**Pane**: Individual document display (400px wide).

**Viewport**: Visible window (1200px). Shows 3 panes always.

**Strip**: Horizontal container (full width = history length × 400px).

## Navigation Terms

**Jump Button**: Button to jump to earlier position instantly.

**Navigate Forward**: Click link → append to history.

**Navigate Back**: Decrement currentIndex (history unchanged).

**Leaf Node**: Document with no outgoing links.

**Self-Reference**: Link pointing to same document.

## State Terms

**Rendered Panes**: 3 panes currently visible in viewport.

**Hidden Ancestors**: Earlier panes (off-screen left).

**Visible StartIndex**: Index of leftmost visible pane.

**ScrollLeft**: CSS position of viewport scroll (computed).

**Depth**: Current position (currentIndex + 1 / total length).

See: [DesignDecisionsLog](DesignDecisionsLog)
