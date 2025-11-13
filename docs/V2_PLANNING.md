# V2 Planning (Terminal / TUI Surface)

This document seeds the planning process for the Terminal/TUI implementation. Treat `final/V1_IMPLEMENTATION_NOTES.md` and `docs/DATA_MODEL.md` as the canonical references for what V1 shipped and the data contract you must preserve.

---

## Source of truth from V1

- **History model:** Append-only reducer with `NAV/BACK/JUMP/HOME/CLEAR_*` actions (see `prototype/react/V1NavigationPrototype.jsx` and Implementation Notes).
- **Data contract:** Each node follows the schema in `docs/DATA_MODEL.md` (`id`, optional `title/name`, required `content`, `links[]` as navigation source of truth).
- **Markdown subset:** Same subset rendered in V1 (documented in `docs/RenderingSpec.md`; renderer logic in `prototype/react/COMPLETE-MARKDOWN-RENDERER-V2.jsx`).
- **Known issues/backlog:** Use `docs/KNOWN_ISSUES.md` to understand accepted limitations (history size, inline links, no persistence, etc.).

---

## Goals for V2 (Terminal / ANSI output)

1. **Reuse the reducer + data contract** unchanged; only the presentation/input layer changes.
2. **Render summaries + detail panes as ANSI text** within an ncurses-style layout (columns or stacked sections).
3. **Provide keyboard/command navigation** equivalent to V1 (`home`, `back`, `forward`, `jump`).
4. **Respect markdown subset** by mapping headings/bullets/code to ANSI styles; ensure inline links remain textual hints unless `links[]` provides an actionable target list.
5. **Expose toast/status line equivalents** for warnings (invalid links, empty history, etc.).

---

## Open questions / decisions needed

- **Layout:** Single-column scroll vs. multi-column within terminal constraints? (Consider 80–100 character width; may need collapsible sections rather than horizontal panes.)
- **Input model:** Command palette (`:home`, `:back`, `:jump 5`) vs. key bindings? Need to document defaults and rebind options.
- **History visualization:** How to show jump targets (breadcrumb line, numbered list, etc.)?
- **Error handling:** Replace React error boundary with try/catch logging + user-facing error message area.
- **Testing:** Define automated coverage (e.g., reducer property tests shared with V1, snapshot tests for markdown renderer).
- **Packaging:** Determine whether V2 lives in the existing repo (`prototype/tui/`?) or a separate package.

---

## Next steps

1. Draft a lightweight architecture doc focusing on terminal layout + input handling.
2. Identify shared modules to extract from V1 (reducer, data loaders, markdown parser).
3. Define MVP scope/features (parity list vs. explicit deferments referencing `docs/KNOWN_ISSUES.md`).
4. Create task breakdown for implementation (e.g., data loading CLI, history reducer harness, renderer, input loop, status line).
5. Align with stakeholders on success metrics (latency, usability, parity with V1 navigation).

Update this document (or replace with a more detailed design) as V2 planning progresses. Always link back to the Implementation Notes and data contract when assumptions change.
