# Artifact 8: Documentation Data Template

This template replaces the old "mock diagram" data. The prototype now navigates the actual planning documentation (ADRs, roadmap, checklists) so the data model mirrors `final/summaries/` exactly.

## Source of Truth

- Markdown lives in `final/summaries/` (currently 17 files).
- Each file is the readable summary version of its counterpart in `final/full/`.
- The React prototype consumes the summaries so we can iterate quickly without editing the full docs.

## Generation Script

Run `node scripts/generateDocsData.js` whenever a summary changes. The script:

1. Reads every `.md` under `final/summaries/`.
2. Extracts the first `#` heading as the title.
3. Collects all internal links (`[text](TargetId)`) that do not contain `://` or `/`.
4. Escapes the markdown content for template literal usage.
5. Writes `prototype/react/docsData.js` exporting `DOCS`, `DOC_IDS`, and `START_DOC_ID`.

Snippet from the generated file:

```javascript
export const DOCS = {
  "ExecutionPlan": {
    id: "ExecutionPlan",
    title: `Staged Writing Plan`,
    filename: "ExecutionPlan.md",
    links: ["DesignDecisionsLog", "MasterIssueChecklist"],
    content: `# Staged Writing Plan\n\n...`
  },
  // ... other documents
};

export const DOC_IDS = Object.keys(DOCS);
export const START_DOC_ID = "ExecutionPlan"; // falls back if missing
```

## Document Roster (17 nodes)

1. ExecutionPlan – “Staged Writing Plan” (home document per ADR-009)
2. MasterIssueChecklist
3. SectionsStatusTracker
4. ImplementationRoadmap
5. DesignDecisionsLog
6. ConstraintsAndAssumptions
7. DefinitionDictionary
8. MockDataTemplate (this file)
9. ADR001HistoryBasedNavigation
10. ADR002AppendOnlyHistory
11. ADR003FixedThreePaneViewport
12. ADR004ComputedScrollPosition
13. ADR005ReactHooksState
14. ADR006MockPDFsNotRealRendering
15. ADR007AppendForwardNavigation
16. ADR008PureStatelessRenderer
17. ADR-009 Home Position Navigation

Each summary already embeds `[text](TargetId)` links pointing to the compact IDs above. No additional link lists are required—the script derives them automatically.

## Link Extraction Rules

- Only local links (no protocol, no slash) become navigation edges.
- Duplicates are removed; order follows first appearance in the markdown.
- Run the link-integrity script (see `docs/LinkIntegrity.md`) before regenerating to guarantee every link target exists.

## Home Document Alignment

- ADR-009 designates **ExecutionPlan** as the home/entry node.
- The generator sets `START_DOC_ID = 'ExecutionPlan'` when present; otherwise it falls back to `MasterIssueChecklist`.
- The viewer uses this value to seed `history`.

## Rendering Contract

- The renderer (see ADR-008) receives `{ id, title, content, links }` for each node.
- Links become blue/underlined buttons that call `onClickLink(targetId)`.
- All markdown content stays in the compact summary format, so the renderer only needs the limited subset defined in `docs/MarkdownConventions.md`.

Use this template/process whenever new documents are added: update `final/summaries/`, rerun the generator, and commit the refreshed `docsData.js`.
