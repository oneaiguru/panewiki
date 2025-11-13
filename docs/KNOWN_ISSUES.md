# Known Issues – V1 Navigation Prototype

This list captures deliberate trade-offs and open gaps that remain after V1. Treat it as the authoritative backlog for cross-team awareness; do not attempt to “fix” these in V1 unless they block release.

---

## Navigation & State

- **Unbounded history size:** The reducer preserves every visited node. Performance begins to degrade beyond ~200 panes since all panes remain mounted.
- **No session persistence:** Reloading the page resets state to `home`. There is no localStorage/sessionStorage integration.
- **Jump buttons limited to ancestors:** Only first/last segments are shown; there is no search/filter across history.

## Rendering

- **Markdown subset only:** Unsupported constructs (tables, images, blockquotes, HTML) are not rendered and may appear as plain text.
- **Inline links are non-interactive:** The prototype renders markdown links as styled text to avoid ambiguity with `links[]`.
- **Mock PDF preview:** Decorative only; does not render real PDFs or remote content.
- **No mobile layout:** Columns target ~400px width each and assume a desktop viewport.

## Performance

- **No virtualization:** Every pane in history stays in the DOM; memory usage grows with navigation depth.
- **Speculative fetch absent:** Detail panes are rendered immediately; there is no lazy data loading beyond initial mock data.

## Accessibility & UX

- **Keyboard shortcuts limited to Home/←/→.** There is no in-UI legend or customization.
- **Toast queue lacks persistent log:** Messages auto-dismiss after 2 seconds; users cannot review prior warnings.
- **No multi-user collaboration:** The state is local to the browser tab; there is no shared session model.

## Tooling & Automation

- **Link integrity checks are manual.** Scripts exist but are not wired into CI yet.
- **No unit tests:** Reducer, renderer, and components rely on manual smoke testing.

---

## Recommended future work

1. **Session persistence:** Serialize `{ history, currentIndex }` to storage with opt-in restore.
2. **History virtualization:** Render only the visible window and lightweight placeholders for off-screen panes.
3. **Interactive inline links:** When a markdown link matches an id in `links[]`, make it clickable (or auto-augment `links[]`).
4. **Terminal/TUI renderer (V2):** Reuse the reducer + markdown contract; produce ANSI output and command-based navigation.
5. **Testing:** Add reducer property tests and markdown parser unit tests; automate link integrity in CI.
6. **Accessibility polish:** Visible keyboard help, focus outlines on buttons, and ARIA descriptions for jump buttons.

Document new issues or resolved items here as the project evolves; downstream teams should not have to re-discover these decisions.
