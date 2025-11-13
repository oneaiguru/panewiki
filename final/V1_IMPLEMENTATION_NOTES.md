# V1 Implementation Notes

This document captures what actually shipped for the V1 navigation prototype, the critical gaps that remain, and the guidance future teams (V2 Terminal, V3 PDF, V4 Editor) should rely on instead of attempting to reconcile every ADR with the current code.

---

## What shipped in V1

- **Three-pane React prototype** backed by an append-only history reducer (`src/state/navigationReducer.js`).
- **Lazy-rendered markdown subset** (headings, bullets, bold, inline code, fenced code, links rendered as text) with recursion guards (`src/utils/markdown.js`).
- **Keyboard controls:** `Home` jumps to the first pane, `←` steps back (guarded against repeats), `→` follows the first related link if it exists.
- **Jump buttons:** first five ancestors + gap indicator + last five, horizontally scrollable.
- **Toast queue + error boundary:** user-visible feedback for invalid links or missing navigation targets, with automatic dismissal and reset-on-content-change behavior.
- **Accessibility:** pane focus via `requestAnimationFrame`, `aria-current="page"` for the active pane, button labels/aria for navigation controls.
- **Mock data source:** `{ id, title, content, links[] }` with links as the only navigation source of truth (`src/data/mockDiagrams.js`).

---

## Key divergences from ADRs (keep these in mind)

| ADR | Original intent | Implemented reality |
| --- | --------------- | ------------------- |
| ADR-001 / ADR-002 | Match browser history (truncate forward stack). | **Append-only history** that preserves forward entries; jump buttons expose older ancestors. |
| ADR-003 | All panes rendered, scroll-to index calculation. | Same scroll math, but pane width enforcement + warning added at runtime. |
| ADR-005 | Independent `setState` calls for history/index. | **Reducer** centralizes updates to avoid stale closures and race conditions. |
| ADR-006 | Mock PDFs optional. | Implemented as visual placeholders only; no real PDF rendering. |
| ADR-008 | Markdown renderer spec. | Custom subset implemented with recursion guards and inline link policy (text-only). |
| ADR-009 | Home ID was `ExecutionPlan`. | Home ID is `home`, matching mock data + link integrity tooling. |

Where ADR text differs, **trust the code + this note** rather than trying to realign every paragraph.

---

## Data contract (authoring & runtime)

See also `docs/DATA_MODEL.md`.

```ts
type DiagramNode = {
  id: string;        // kebab-case, unique
  title?: string;    // fallback to name/id if omitted
  content: string;   // markdown subset only (see RenderingSpec)
  links: string[];   // list of node ids; navigation source of truth
}
```

Rules:
- IDs must be unique and kebab-case in V1.
- `links[]` drives navigation. Inline markdown links are rendered as text and do **not** call `onClick`.
- Every node must contain `content`. The prototype auto-generates placeholder text when missing.

---

## Testing & verification

Automated scripts:
- **Link integrity / reachability:** documented in `docs/LinkIntegrity.md`. Run against `final/full/` and `final/summaries/` whenever docs change.

Manual smoke checklist (run before tagging releases):
1. Navigate at least 150 steps (mix of forward/back/jump) – no crashes, panes remain responsive.
2. `Clear (Keep Current)` keeps only the current pane; `Reset Home` jumps to `home`.
3. Keyboard shortcuts obey guards (holding `←` or `→` does not spam history).
4. Markdown renders headers, bullets, bold, inline code, and fenced code; overly deep nesting shows ellipsis instead of crashing.
5. Jump buttons show first 5 + gap + last 5 when ancestors > 12; horizontal scroll works.
6. Toasts queue correctly (multiple warnings display in order and dismiss after 2s).
7. Pane width sanity warning does **not** fire at 100% zoom in Chrome/Safari/Firefox.
8. Error boundary recovers when you switch to a different node after forcing a render failure (tamper with mock data to test).

---

## Known limitations (see `docs/KNOWN_ISSUES.md` for details)

- History growth is unbounded (practical upper limit ~200 panes before performance degrades).
- No pane virtualization; entire history remains in the DOM.
- No session persistence—reload resets state to `home`.
- Inline markdown links are non-interactive by design.
- Mock “PDF preview” is decorative only.
- No mobile layout – columns target desktop widths.

---

## Handoff to V2+

Use this implementation as the **ground truth** for:
- History reducer behavior & invariants.
- Markdown subset contract and renderer safeguards.
- Keyboard + accessibility expectations.
- Data model (IDs, links, content requirements).

Do **not** invest time rewriting the ADRs to match V1. Instead:
1. Reference this file plus the code when planning V2 (Terminal/TUI).
2. Create new design docs per platform, noting which V1 guarantees carry over and which do not (e.g., scroll behavior, rendering stack).
3. Treat `docs/DATA_MODEL.md` and `docs/KNOWN_ISSUES.md` as the single source of truth for current constraints.

V1 is officially considered shipped once this file, the ADR status stamps, and the data contract are in place.
