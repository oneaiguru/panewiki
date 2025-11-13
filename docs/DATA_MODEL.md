# Data Model – V1 Navigation Prototype

This document captures the minimum contract that both content authors and runtime code must respect. It supersedes older informal descriptions that scattered across ADRs or mock data templates.

---

## Node shape

```ts
type DiagramNode = {
  id: string;        // required, kebab-case, unique
  title?: string;    // optional display label (falls back to name/id)
  name?: string;     // legacy field, treated like title
  content: string;   // markdown subset (see docs/RenderingSpec.md)
  links: string[];   // required array of node ids (navigation source of truth)
}
```

### Required fields
- `id` — kebab-case string; must be unique across the dataset.
- `content` — markdown limited to headings, bullets, bold/italic, inline code, fenced code, and inline links (rendered as text in V1).
- `links` — zero or more ids that point to other nodes. **Navigation uses only this list.**

### Optional fields
- `title` (preferred) or `name` — user-facing label for panes, breadcrumbs, and jump buttons. If omitted, `id` is displayed.

---

## Authoring rules

1. **Links are mandatory for navigation.** Inline markdown links (`[text](target)`) are rendered as styled text in V1 and **do not** trigger navigation.
2. **IDs must match link references.** Link integrity tooling (`docs/LinkIntegrity.md`) expects all links to refer to peer basenames without extensions (e.g., `[ADR-003](ADR-003 Fixed Three Pane Viewport)` -> `ADR-003 Fixed Three Pane Viewport.md`).
3. **`home` node is canonical.** The prototype assumes `home` exists and is reachable to satisfy connectivity checks.
4. **Content must be non-empty.** When generating mock data programmatically, fall back to templated markdown if no author-provided content exists.

---

## Tooling & validation

- **Mock data generation:** `scripts/generateDocsData.js` can be extended to enforce the shape above before emitting JSON/JS modules.
- **Runtime guardrails:** The React prototype logs warnings when pane widths drift from 400px or when links reference unknown IDs.
- **Link integrity:** Use the scripts described in `docs/LinkIntegrity.md` to validate both `final/full/` and `final/summaries/` whenever documentation changes.

---

## Future considerations (V2+)

While V1 limits inline links to text-only, future surfaces (Terminal, PDF, Editor) may:
- Promote inline links to interactive affordances **if** they match an id in `links[]`.
- Extend node metadata (e.g., `tags`, `summary`, `lastUpdated`).
- Persist nodes in external sources (CMS/DB). The contract above should remain the minimum viable schema.

Keep this file updated whenever the runtime data contract evolves; downstream teams (automation, docs tooling, mock-data generators) depend on a single source of truth.
