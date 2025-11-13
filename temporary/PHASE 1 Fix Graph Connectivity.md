**Complete Step-by-Step Plan:**

---

## PHASE 1: Fix Graph Connectivity

### Step 1.1: Update DesignDecisionsLog.md (SUMMARIES)
Add at end:
```
## Related Architecture Decisions

- [ADR001HistoryBasedNavigation](ADR001HistoryBasedNavigation)
- [ADR002AppendOnlyHistory](ADR002AppendOnlyHistory)
- [ADR003FixedThreePaneViewport](ADR003FixedThreePaneViewport)
- [ADR004ComputedScrollPosition](ADR004ComputedScrollPosition)
- [ADR005ReactHooksState](ADR005ReactHooksState)
- [ADR006MockPDFsNotRealRendering](ADR006MockPDFsNotRealRendering)
- [ADR007AppendForwardNavigation](ADR007AppendForwardNavigation)
- [ADR008PureStatelessRenderer](ADR008PureStatelessRenderer)

## Supporting Documentation

- [DefinitionDictionary](DefinitionDictionary)
- [ConstraintsAndAssumptions](ConstraintsAndAssumptions)
- [MockDataTemplate](MockDataTemplate)
```

### Step 1.2: Update DesignDecisionsLog.md (FINAL)
Same update as Step 1.1

### Step 1.3: Update ExecutionPlan.md (SUMMARIES)
Change "See:" links to:
```
See: [DesignDecisionsLog](DesignDecisionsLog)
See: [MasterIssueChecklist](MasterIssueChecklist)
```

### Step 1.4: Update ExecutionPlan.md (FINAL)
Same update as Step 1.3

### Step 1.5: Run Connectivity Check
Execute Python script to verify all 16 files now reachable from ExecutionPlan

---

## PHASE 2: Create ADR009 (Home Navigation)

### Step 2.1: Create ADR009PureStatelessRenderer.md (SHORT - for SUMMARIES)
~35-40 lines covering:
- Decision: ExecutionPlan is home position
- Why: Provides entry point, helps users navigate back
- Home button: Navbar placement (Option A+C)
- Keyboard: Home key jumps to start
- State: currentIndex=0, history preserved
- Related: ADR003, ADR004, ADR005
- Implementation: handleHome() function

### Step 2.2: Create ADR009PureStatelessRenderer.md (FULL - for FINAL)
~60-70 lines with:
- Full context (why home position matters)
- Implementation details (code examples)
- V2+ scaling (Terminal/PDF/Editor versions)
- Edge cases (what if already at home, etc.)

### Step 2.3: Copy to both folders
- `/tmp/SUMMARIES/ADR009HomePositionNavigation.md`
- `/tmp/FINAL/ADR009HomePositionNavigation.md`

---

## PHASE 3: Create Linting Specification

### Step 3.1: Create SystemLintingRequirements.md (for reference)
Specification document (not an ADR) containing:
- Purpose: Automated validation on file updates
- Checks: 
  1. No broken links (all targets exist)
  2. No orphaned files (all files reachable)
  3. No graph disconnection (full connectivity)
  4. Naming consistency (CamelCase + ADR prefix)
  5. Encoding validation (UTF-8)

- Implementation: Include the exact Python code we used
- When to run: Pre-commit hook, Phase 2+
- Output: Pass/fail report with violations

### Step 3.2: Embed Python code
Add complete `verify_links.py` and `check_connectivity.py` scripts to document

---

## PHASE 4: Update Reference Documents

### Step 4.1: Update DesignDecisionsLog.md (both)
Add new decision:
```
## Decision #15: Home Position = ExecutionPlan
Users can jump to ExecutionPlan (home) via Home button or keyboard.
Status: Locked
```

### Step 4.2: Update ExecutionPlan.md header
Add note:
```
**Entry Point**: This is the starting page for prototype navigation.
```

---

## PHASE 5: Final Verification

### Step 5.1: Run connectivity check again
Verify all 16+ files reachable from ExecutionPlan

### Step 5.2: Verify ADR links
Ensure ADR009 links to ADR003, ADR004, ADR005 and they link back

### Step 5.3: List final structure
Show clean file inventory:
- `/tmp/SUMMARIES/` - 17 files (16 + ADR009)
- `/tmp/FINAL/` - 17 files (16 + ADR009)
- Ready for React artifact

---

## SUMMARY OF ACTIONS

| Phase | Action           | Files                             | Status  |
| ----- | ---------------- | --------------------------------- | ------- |
| 1     | Fix connectivity | DesignDecisionsLog, ExecutionPlan | PENDING |
| 2     | Create ADR009    | ADR009HomePositionNavigation      | CREATE  |
| 3     | Linting spec     | SystemLintingRequirements         | CREATE  |
| 4     | Update refs      | DesignDecisionsLog, ExecutionPlan | UPDATE  |
| 5     | Verify all       | Run checks                        | VERIFY  |

---

**Ready to execute this full plan?**v