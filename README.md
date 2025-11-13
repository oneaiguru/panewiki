# V1 Navigation Prototype

This repository contains the V1 “pane wiki” prototype: a three-pane React application that demonstrates append-only navigation, markdown rendering, and structured history controls. Use this README for quick setup, keyboard guidance, and testing instructions. See `final/V1_IMPLEMENTATION_NOTES.md` for a deeper retrospective.

---

## Quick start

```bash
cd prototype/react
npm install
npm run dev
# Open http://localhost:5173
```

### Project structure (`prototype/react/src`)

```
App.jsx                // Main UI shell, keyboard handling, toast queue
state/navigationReducer.js
utils/markdown.js
data/mockDiagrams.js   // Sample nodes (replace with real data as needed)
App.css
```

To supply your own data, edit `src/data/mockDiagrams.js` to export a map of nodes that match `docs/DATA_MODEL.md`.

---

## Keyboard & accessibility

| Key | Behavior |
| --- | -------- |
| `Home` | Jump to the first pane (`home`). |
| `←` | Step back one pane (guarded against key repeat). |
| `→` | Follow the first related link in the active pane (shows toast if none). |

- Buttons expose `aria-label`s for assistive tech.
- The focused pane receives `aria-current="page"` and retains focus after navigation.

---

## Testing & verification

Automated (manual scripts for now):
- **Link integrity / reachability:** see `docs/LinkIntegrity.md` for Python snippets that ensure all doc links resolve and every node is reachable from `home`.

Manual smoke checklist:
1. Navigate at least 150 steps (forward/back/jump) — ensure no crashes or desynchronization.
2. `Clear (Keep Current)` retains only the current pane; `Reset Home` returns to `home`.
3. Hold `←`/`→` — history should not spam (key repeat is ignored).
4. Verify markdown rendering (headings, bullets, bold, inline code, fenced code) and error boundary recovery.
5. Confirm jump buttons show first 5 + gap + last 5 when history depth > 12.
6. Trigger invalid link (edit mock data) to see queued toasts dismiss after ~2s.
7. Observe console — no pane width warnings at 100% zoom in modern browsers.

Record results in release notes before tagging.

---

## Documentation pointers

- `final/V1_IMPLEMENTATION_NOTES.md` — What shipped, divergences vs ADRs, testing notes.
- `docs/DATA_MODEL.md` — Canonical node schema and authoring rules.
- `docs/KNOWN_ISSUES.md` — Accepted limitations and backlog.
- `docs/RenderingSpec.md` — Markdown subset supported in V1.
- `docs/AuthoringConventions.md` — Style guidelines for doc writers.

---

## Next steps (V2+)

V1 is a desktop/web prototype. For Terminal/TUI, PDF, or Editor surfaces, reuse:
- The reducer (`state/navigationReducer.js`) for history invariants.
- The markdown subset contract (`utils/markdown.js` + `docs/RenderingSpec.md`).
- The data model (`docs/DATA_MODEL.md`).

See `docs/KNOWN_ISSUES.md` for prioritized future work. Contributions should update both the code and these docs to keep downstream teams in sync.
