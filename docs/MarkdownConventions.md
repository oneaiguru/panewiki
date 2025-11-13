# Markdown Conventions (Prototype)

Scope: documents under `final/summaries/` and `final/full/`.

Allowed subset (keep simple and fast):
- Headers: `#`, `##`, `###`, `####`
- Bold: `**text**`
- Inline code: `` `code` ``
- Bullet lists: `- item`
- Fenced code blocks: triple backticks
- Links: `[Text](document-id)` used for navigation

Excluded (not rendered):
- Strikethrough, block quotes, numbered lists, images, tables, nested lists

Constraints:
- Max ~45 lines per summary document
- Max ~85 characters per line
- No frontmatter
- Link targets must be peer basenames (no `.md`, no relative paths)

Link semantics (navigation):
- A markdown link like `[See ADR-001](ADR001HistoryBasedNavigation)` must navigate to the document with the matching basename (`ADR001HistoryBasedNavigation.md`).
- For spaced filenames, use the exact base: `[ADR-009 Home Position Navigation](ADR-009 Home Position Navigation)`.

Rationale:
- Keeps content scannable for the V1 React artifact
- Ensures uniform internal linking without custom formats
