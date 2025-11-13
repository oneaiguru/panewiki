# Product Scope (Phase 1 Prototype)

## Version 1 (React Web Prototype)
- Purpose: Demonstrate graph-based navigation using the real planning documentation (17 summary markdown files under `final/summaries/`).
- Home node: `home` ("Staged Writing Plan").
- Data source: `prototype/react/docsData.js` generated from summaries via `node scripts/generateDocsData.js`.
- Rendering: custom markdown subset renderer from ADR-008 (headers/bold/inline-code/bullets/fenced blocks/links).
- Editing: none (read-only prototype).

## Future Versions (Reference only)
- **V2 (Terminal/TUI)**: filesystem markdown loader + external editor hooks (deferred).
- **V3 (PDF Viewer)**: PDF rendering + linting for multi-page docs (deferred).
- **V4 (Inline Editor + Agentic)**: typora-style editing + AI assistance (deferred).

## Naming & Links
- IDs: kebab-case or CamelCase basenames that match the summary filenames (no `.md`).
- Links: `[Text](TargetId)` where `TargetId` is a peer basename; no relative paths.
- Start document: always `home` in both folders.

Keep this scope in mind when updating ADRs, roadmap, or renderer code so Phase 1 stays focused on the documentation dataset.
