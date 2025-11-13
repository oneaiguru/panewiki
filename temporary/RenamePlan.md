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
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes (from any full doc that currently links `ADR001HistoryBasedNavigation`)

- Summary: `ADR002AppendOnlyHistory.md`
  - Full: `ADR-002 Append Only History.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

- Summary: `ADR003FixedThreePaneViewport.md`
  - Full: `ADR-003 Fixed Three Pane Viewport.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

- Summary: `ADR004ComputedScrollPosition.md`
  - Full: `ADR-004 Computed Scroll Position.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

- Summary: `ADR005ReactHooksState.md`
  - Full: `ADR-005 React Hooks State.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

- Summary: `ADR006MockPDFsNotRealRendering.md`
  - Full: `ADR-006 Mock PDFs Not Real Rendering.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

- Summary: `ADR007AppendForwardNavigation.md`
  - Full: `ADR-007 Append Forward Navigation.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Yes

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
  - Present?: No (short version only; longer hub to come later)
  - Rename needed?: N/A
  - Link updates?: Yes (e.g., `ADR-009 Home Position Navigation.md` currently links `DesignDecisionsLog`; will need to link `Design Decisions Log` in full set)

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
  - Present?: Yes (as `final/full/MasterIssueChecklist.md`)
  - Rename needed?: Yes → rename to spaced form
  - Link updates?: No (current full content has no internal links)

- Summary: `MockDataTemplate.md`
  - Full: `Mock Data Template.md`
  - Present?: No
  - Rename needed?: N/A
  - Link updates?: Possibly

- Summary: `SectionsStatusTracker.md`
  - Full: `Sections Status Tracker.md`
  - Present?: Yes (as `final/full/SectionsStatusTracker.md`)
  - Rename needed?: Yes → rename to spaced form
  - Link updates?: No (current full content has no internal links)

Notes
- `final/full/ADR-009 Home Position Navigation.md` exists (full only; summary intentionally omitted). Its “See:” links currently use compact basenames (e.g., `ADR003FixedThreePaneViewport`). Once the full ADR files exist under spaced names, we must update these links to match the spaced basenames.

