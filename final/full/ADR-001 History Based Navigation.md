# ADR-001: History-Based Navigation vs Breadcrumb/Tree Navigation

**Status**: Accepted

**Date**: 2025-11-13

---

## Context

When designing the diagram traversal UI, we needed to choose the fundamental navigation model. Two main paradigms were considered:

1. **Tree/Hierarchy Model** - Strict parent-child relationships, clear hierarchy
2. **History/Graph Model** - Any node can link to any other node, full freedom

The user requirement was: "Show PDF diagrams with a 3-pane viewport, allowing traversal through content." Initially, we assumed a tree structure (5 levels, 2 branches each). However, during planning, the user revealed the real requirement: **"This should work like a browser with history - you can go anywhere and create infinite loops."**

---

## Decision

**We chose History-Based Navigation with a Graph Model (not Tree-based).**

The system will:
- Treat navigation like browser history (can visit any page, any number of times)
- Allow any node to link to any other node (no parent-child constraint)
- Maintain a linear history array (append-only)
- Show the last 3 history entries in a viewport
- Enable backward/forward navigation and jumping to earlier positions

---

## Consequences

### Positive
✅ **Matches user expectations** - Works like a browser, familiar mental model
✅ **Unlimited flexibility** - Users can navigate in any order, create loops, revisit nodes
✅ **Infinite history** - No depth limit; can navigate 100+ times if needed
✅ **Simpler than versioned history** - Linear append-only is easier than Git-style branching
✅ **Real-world content structure** - Actual content doesn't have strict hierarchies; web navigation is a graph

### Negative
❌ **More complex data structure** - Nodes must know all possible targets (not just children)
❌ **Requires careful link curation** - Can create dead ends or confusing navigation if links are poorly designed
❌ **Users might get "lost"** - Without a clear hierarchy, users might not understand where they are
❌ **No "go to parent" affordance** - No automatic parent links; must be added manually

### Mitigation
- Breadcrumb display shows current visible panes (context)
- Depth indicator shows position in history (how far in you are)
- Jump buttons show all earlier positions (easy backtracking)
- Keyboard shortcuts provide escape routes (Home key, Esc)

---

## Alternatives Considered

### Alternative 1: Strict Tree Model (Hierarchical)
- Nodes have parent-child relationships only
- User navigates up/down the tree
- Breadcrumb shows path from root

**Why rejected**:
- User specifically said: "Navigate in random order, create loops, infinite history"
- Tree model prevents revisiting nodes in different contexts
- No cross-level jumps (Level 2 → Level 5)
- Doesn't match browser history mental model

### Alternative 2: Git-Style Branching History
- When user navigates from middle of history, create a branch
- Track multiple timelines
- Show branch indicator in UI

**Why rejected**:
- Too complex for prototype
- Users expect linear history (like browser), not branching
- Would require significant state management overhead
- Harder to display in 3-pane viewport

### Alternative 3: No History at All (Single Page)
- Each click replaces current view
- No back button, no history
- Simple state management

**Why rejected**:
- User explicitly wants browser-like history
- No way to backtrack
- Loses context of where you've been
- Doesn't match requirement

---

## Related Decisions

- **ADR-002**: History is append-only (never truncated)
- **ADR-007**: Navigation is forward-append (not branching history)
- **ADR-003**: 3-pane viewport over infinite strip (visual consequence of history-based model)

---

## Implications for Implementation

1. **Data Model**: Nodes stored as flat map, not tree
   ```javascript
   {
     "react": { id: "react", name: "React", links: ["comp-lib", "hooks", "home"] }
   }
   ```

2. **Validation**: Must check that all linked node IDs exist (no broken links)

3. **UI**: Must show navigation context clearly:
   - Breadcrumb (current position)
   - Jump buttons (where you can go back to)
   - Depth indicator (position in history)

4. **Testing**: Must verify loops and self-references work correctly

---

## Open Questions

- Should there be any validation to prevent cycles? **Answer**: No, cycles are allowed and expected.
- What if user creates a loop and gets "confused"? **Answer**: Jump buttons and breadcrumb provide clear escape routes.
- Should we limit history length (e.g., max 500 items)? **Answer**: No limit for prototype; deferred to Phase 2 if needed.

---

## Sign-Off

- [ ] Architecture Lead: Approved
- [ ] Product: Approved
- [ ] Engineering Lead: Approved
