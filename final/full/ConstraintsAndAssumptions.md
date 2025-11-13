# Constraints & Assumptions

## Technology Stack

- Framework: React (hooks)
- Styling: CSS (plain)
- Browser: Modern (Chrome, Firefox, Safari, Edge)
- JavaScript: ES6+

## What's NOT Included

✗ Real PDF rendering
✗ Data persistence
✗ Multi-user sync
✗ Virtual scrolling (Phase 2)
✗ Search/filter
✗ Accessibility (Phase 2)
✗ Mobile optimization (Phase 2)

## Hard Constraints

- Viewport width: 1200px (fixed)
- Pane width: 400px (fixed)
- Visible panes: exactly 3
- Strip width: history.length × 400px
- History: append-only (never truncate)
- ScrollLeft: computed (user can't override)
- No frontmatter in markdown files

## Tested Limits

- History length: smooth up to 100 items
- DOM nodes: 1:1 with history length
- Re-renders: React re-renders full app

## Data Constraints

- Node IDs: unique strings (semantic CamelCase)
- Links: point to valid node IDs
- Content: markdown (no custom format)
- Mock data: 32 hardcoded nodes

## Assumptions

- Single user session
- No page reloads (session-based)
- Continuous mouse/keyboard
- Desktop browser only

See: [MockDataTemplate](MockDataTemplate)
