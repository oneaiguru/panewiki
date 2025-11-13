---
id: architecture-viewport-semantics
title: "Architecture: Viewport Semantics"
models: [haiku]
summary: true
readTime: 5m
---

<!-- model: haiku -->
> **Path:** Home › Architecture › Viewport
> **Validation:** Reviewed by Sonnet ✓

# Architecture: Viewport Semantics

## The 3-Pane Layout

```
Total Width: 1200px
├─ 400px (Left Pane)
├─ 400px (Center Pane)
└─ 400px (Right Pane)
  + 48px scrollbar (overlaid)
```

## Left Pane: Context

**Purpose:** Navigation and strategy

**Contains:**
- Breadcrumb path
- Sidebar navigation
- Opus strategic summary
- Links to related docs

**Fixed or Scrolls?**
Fixed on desktop, collapsible on mobile

**Read Time:** 30 seconds - 2 minutes

## Center Pane: Main Content

**Purpose:** Primary document

**Contains:**
- Document title
- Summary section (default)
- Detail section (on click "See details")
- Navigation links
- Code examples

**Default View:** Summary (human-optimized, 30 lines)

**Expanded View:** Detail (AI-complete, 100 lines)

**Read Time:** 5 minutes (summary) → 15 minutes (detail)

## Right Pane: Context/Details

**Purpose:** Reference and validation

**Contains:**
- Related document summaries
- Haiku illustrations or examples
- Sonnet validation results
- Cross-references
- Metadata (read time, model, cost)

**Behavior:** Updates when center pane changes

**Read Time:** 1-5 minutes

## Responsive Breakdown

### Desktop (1200px+)
```
┌────┬────┬────┐
│ L  │ C  │ R  │
└────┴────┴────┘
```
All three panes visible.

### Tablet (800px)
```
┌────┬────┐
│ C  │ R  │
└────┴────┘
```
Left pane collapses into a drawer.

### Mobile (400px)
```
┌────┐
│ C  │
└────┘
```
Left pane becomes hamburger; right pane slides over content when opened.

## Interaction Patterns

### Click "See Details"
Center pane: Summary → Detail
Breadcrumb updates to show depth
Right pane: Shows detail-specific context

### Click Link
Left: Update breadcrumb
Center: Load new document (summary view)
Right: Show related content

### Scroll
Left pane: Fixed (doesn't scroll)
Center pane: Scrolls vertically
Right pane: Scrolls (independent)

## Visual Indicators

**Summary Mode:**
- "See details →" link visible
- Compact layout
- 400px column respected

**Detail Mode:**
- "← Back to summary" link visible
- Expanded content
- Still fits 400px column

**Navigation Indicators:**
```
[home] > [architecture] > [flow] (current)
```

---
**Related**
- [Next: Information Flow](information-flow)
- [See also: Data Model](data-model)
- [Back: Token Economics](token-economics)
