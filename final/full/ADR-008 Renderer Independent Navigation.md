# ADR-008: Renderer-Independent Navigation

**Status**: Accepted  
**Date**: 2025-11-13

---

## Context

Our product evolves through four versions that share the same navigation model but differ in how content is rendered and edited:

- V1: React web prototype (hardcoded data, read-only)
- V2: Terminal/TUI (filesystem .md, external editor)
- V3: PDF viewer (filesystem .pdf, linter for multi‑page)
- V4: Web editor + agentic (inline markdown editor, AI assistance)

Across all versions, the navigation rules remain the same (ADR‑001…ADR‑007). We need an architecture that lets us reuse navigation logic while swapping renderers per platform and format.

---

## Decision

Adopt a “renderer‑independent navigation” architecture:

- Navigation layer owns all state (history, currentIndex, handlers).  
  Renderers remain pure/stateless with no internal navigation state.
- Renderers receive inputs and callbacks from navigation and return view output.  
  They do not mutate navigation or hold cross‑pane state.
- Data format is markdown first for V2+; V3 wraps PDF pages; V4 edits markdown inline.  
  V1 embeds data for speed, but uses the same logical shape.

This keeps navigation portable across React, Terminal, PDF and Editor environments.

---

## Why

- Separation of concerns: navigation logic is stable, renderers focus on visuals/IO.
- Cross‑platform: same navigation works in web, terminal, PDF, editor.
- Testability: navigation can be unit‑tested without rendering.
- Extensibility: add new renderers without touching navigation logic.
- Simplicity: avoids over‑engineering (no plugin registries required for V1).

---

## Interface (Renderer Contract)

Conceptually, each renderer implements the same contract with the navigation layer:

```typescript
// Inputs provided by navigation
type NavInputs = {
  node: DocNode;                 // current document
  visibleIndices?: number[];     // optional, e.g., 3‑pane indices
  onClickLink: (targetId: string) => void; // navigation callback
};

// Renderer output varies by platform
// V1 (React): JSX element
// V2 (Terminal): string/ANSI buffer
// V3 (PDF): a page render operation / PDF page
// V4 (Editor): editor component instance

function render(inputs: NavInputs): ViewOutput;
```

Link handling is the renderer’s responsibility: links in content must become interactive elements that call `onClickLink(targetId)`.

Pseudocode (renderer contract):

```
Inputs:
  - node          // document data (id, title, content, links)
  - onClickLink   // callback(targetId)
Output:
  - view          // JSX (web), string/ANSI (terminal), PDF page, or editor component
Behavior:
  - Render content
  - Turn [text](target) links into interactive controls that call onClickLink(target)
```

---

## Link Semantics (React Example)

Make markdown links clickable navigation buttons:

```jsx
// Inside a React inline renderer
// Example: [See ADR-001](ADR-001 History Based Navigation)
// becomes a clickable element that calls onClickLink("ADR-001 History Based Navigation")

if (matchIsMarkdownLink) {
  const [text, target] = [match.groups.text, match.groups.target];
  parts.push(
    <button
      key={`l-${i}`}
      onClick={() => onClickLink(target)}
      style={{
        background: 'none', border: 'none', color: '#1a73e8',
        textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit'
      }}
    >
      {text}
    </button>
  );
}
```

For the markdown subset and conventions used in V1/V2, see: [Markdown Conventions](../../docs/MarkdownConventions.md)

Across all versions, markdown links of the form `[text](id)` are the primary navigation mechanism and must be parsed into interactive elements that trigger navigation to `id`.

---

## Data Model (Works Across Versions)

Minimal shape the renderer expects from navigation:

```typescript
type DocNode = {
  id: string;           // unique id, e.g., "ADR-001 History Based Navigation"
  title: string;        // display title
  content: string;      // markdown text (V2/V4), or metadata for V3
  links?: string[];     // optional explicit links (can also be parsed from content)
};
```

- V1: nodes are embedded in code (fast bootstrapping)
- V2: nodes come from `.md` files on disk
- V3: nodes represent PDF pages/documents (markdown content replaced by PDF source)
- V4: nodes are editable markdown (same shape, editor writes back)

---

## Alternatives Considered

1) Monolithic React stateful renderer
- Single component owns navigation + rendering.
- Rejected: ties navigation to React; cannot reuse in terminal/PDF.

2) Plugin registry / renderer factory
- `registerRenderer() / getRenderer()` indirection.
- Rejected for now: over‑engineered for four known targets; extra complexity.

3) Context + useReducer (React‑only)
- Rejected: doesn’t help for terminal/PDF; more complexity for 2 state vars.

---

## Consequences

Positive:
- Reuse: one navigation core, many renderers.
- Clear layering: simple mental model and code ownership.
- Easier to test: renderer mocks can verify callbacks.

Negative:
- Some duplication: each renderer re‑implements visuals.
- Contract discipline required: renderers must not store nav state.

Mitigation:
- Keep contract tiny (node + onClickLink).
- Document markdown subset and link rules.

---

## Implementation Notes (Per Version)

V1 (React, read‑only)
- Navigation hook exposes `history`, `currentIndex`, and handlers.
- Renderer converts markdown to JSX; links call `onClickLink`.
- 3‑pane viewport and scroll math from ADR‑003/ADR‑004.
 
Note: V1 is a read‑only prototype used for UX research with hardcoded data.

V2 (Terminal/TUI)
- Same navigation; renderer outputs ANSI strings.
- Opens external editor for `.md` when editing (outside this ADR).
 
Note: V2 is the first “real product” using filesystem markdown with external editing.

V3 (PDF Viewer)
- Same navigation; renderer loads PDF pages.
- Linter warns if PDF has more than one page (see product checks).

V4 (Web Editor + Agentic)
- Same navigation; renderer is an editor component.
- Inline editing writes back to `.md`; agentic assists (future work).

---

## Related

- [ADR-001 History Based Navigation](ADR-001 History Based Navigation)
- [ADR-002 Append Only History](ADR-002 Append Only History)
- [ADR-003 Fixed Three Pane Viewport](ADR-003 Fixed Three Pane Viewport)
- [ADR-004 Computed Scroll Position](ADR-004 Computed Scroll Position)
- [ADR-005 React Hooks State](ADR-005 React Hooks State)
- [ADR-006 Mock PDFs Not Real Rendering](ADR-006 Mock PDFs Not Real Rendering)
- [ADR-007 Append Forward Navigation](ADR-007 Append Forward Navigation)
- [Design Decisions Log](Design Decisions Log)
