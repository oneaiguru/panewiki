# Rename Plan: Summaries ↔ Full Correspondence

Purpose: plan canonical filenames for full documents (human‑friendly, spaced) that correspond to existing summary files (compact), so we can rename consistently and keep links resolving in the full set.

Proposed naming standard for full files
- ADRs: `ADR-### Title With Spaces.md` (e.g., `ADR-003 Fixed Three Pane Viewport.md`).
- Other docs: `Title With Spaces.md` (e.g., `Implementation Roadmap.md`).
- Summary files keep current compact names (CamelCase; no spaces; no hyphen in ADR number).

Legend
- Present?: whether a full file exists today.
- Rename needed?: whether today’s full filename should be renamed to match the standard.
- Link updates?: whether we must update links inside existing full docs once the targets are renamed/added.

Mapping

- Summary: `ADR001HistoryBasedNavigation.md`
  - Full: `ADR-001 History Based Navigation.md`
  - Present?: Yes
  - Rename needed?: Done (source from Downloads used spaced naming)
  - Link updates?: Pending when cross-ADR links are added to full set

- Summary: `ADR002AppendOnlyHistory.md`
  - Full: `ADR-002 Append Only History.md`
  - Present?: Yes
  - Rename needed?: Done (source from Downloads used spaced naming)
  - Link updates?: Pending when cross-ADR links are added to full set

- Summary: `ADR003FixedThreePaneViewport.md`
  - Full: `ADR-003 Fixed Three Pane Viewport.md`
  - Present?: Yes
  - Rename needed?: Done (spaced naming)
  - Link updates?: Pending when cross-ADR links are added to full set

- Summary: `ADR004ComputedScrollPosition.md`
  - Full: `ADR-004 Computed Scroll Position.md`
  - Present?: Yes
  - Rename needed?: Done (spaced naming)
  - Link updates?: Pending when cross-ADR links are added to full set

- Summary: `ADR005ReactHooksState.md`
  - Full: `ADR-005 React Hooks State.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

- Summary: `ADR006MockPDFsNotRealRendering.md`
  - Full: `ADR-006 Mock PDFs Not Real Rendering.md`
  - Present?: Yes
  - Rename needed?: Done (spaced naming)
  - Link updates?: Pending when cross-ADR links are added to full set

- Summary: `ADR007AppendForwardNavigation.md`
  - Full: `ADR-007 Append Forward Navigation.md`
  - Present?: Yes
  - Rename needed?: Done (spaced naming)
  - Link updates?: Pending when cross-ADR links are added to full set

- Summary: `ADR008PureStatelessRenderer.md`
  - Full: `ADR-008 Pure Stateless Renderer.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

- Summary: `ConstraintsAndAssumptions.md`
  - Full: `Constraints and Assumptions.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Possibly (from ADRs once full set exists)

- Summary: `DefinitionDictionary.md`
  - Full: `Definition Dictionary.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Possibly

- Summary: `DesignDecisionsLog.md`
  - Full: `Design Decisions Log.md`
  - Present?: Yes
  - Rename needed?: No
  - Link updates?: Done (ADR-009 updated to link `Design Decisions Log`)

- Summary: `ExecutionPlan.md`
  - Full: `Execution Plan.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Possibly

- Summary: `ImplementationRoadmap.md`
  - Full: `Implementation Roadmap.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Possibly

- Summary: `MasterIssueChecklist.md`
  - Full: `Master Issue Checklist.md`
  - Present?: Yes
  - Rename needed?: Done
  - Link updates?: No (current full content has no internal links)

- Summary: `MockDataTemplate.md`
  - Full: `Mock Data Template.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Possibly

- Summary: `SectionsStatusTracker.md`
  - Full: `Sections Status Tracker.md`
  - Present?: Yes
  - Rename needed?: Done
  - Link updates?: No (current full content has no internal links)

Notes
- `final/full/ADR-009 Home Position Navigation.md` exists (full only; summary intentionally omitted). Its “See:” links currently use compact basenames (e.g., `ADR003FixedThreePaneViewport`). Once the full ADR files exist under spaced names, we must update these links to match the spaced basenames.
 - `final/full/ADR-009 Home Position Navigation.md` exists (full only; summary intentionally omitted). Its "See:" links were adjusted to avoid references to missing full ADRs; now it links only to `Design Decisions Log` until other full ADRs are added.
