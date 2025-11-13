---
id: pillar-2-navigation
title: "Pillar 2: Navigation Between Layers"
models: [haiku]
summary: false
readTime: 5m
---

<!-- model: haiku -->
> **Path:** Home › Pillars › Pillar 2 › Navigation

# Navigating Between Layers

## The User Journey

```
1. Land on document
   → See summary (default)
   
2. Read summary (30 sec)
   → "See details →" link visible
   
3. Click "See details"
   → Center pane expands
   → Summary → Detail transition
   
4. Read relevant detail (5 min)
   → Breadcrumb shows depth
   
5. Click related link
   → Navigate to new document
   → Back to summary view (reset)
   
6. Browser back button
   → Returns to previous state
   → Same layer (summary vs detail)
```

## Breadcrumb Updates

**At summary view:**
```
[home] › [architecture] › [flow]
```

**Click "See details":**
```
[home] › [architecture] › [flow] (detail)
```

**Notice:** "(detail)" appended, shows depth level.

**Click link while in detail:**
```
[home] › [new-doc]
```
Back to summary view, new breadcrumb.

## "See Details" Link Behavior

**When to show:**
- Detail layer exists
- Content > 40 lines
- Additional value in detail

**When to hide:**
- Simple documents
- Summary is complete
- No detail layer

**Link text options:**
- "See full context →"
- "Read implementation details →"
- "Explore edge cases →"
- Always include arrow (visual cue)

## Mobile Navigation

**Desktop (3 panes visible):**
```
[Nav] [Content] [Related]
```
All layers accessible, toggle summary/detail in center

**Tablet (2 panes):**
```
[Content] [Related]
```
Navigation: hamburger menu, toggle summary/detail

**Mobile (1 pane):**
```
[Content]
```
Navigation: 
- Breadcrumb clickable (back)
- Hamburger (sidebar)
- "See details" button (expand)

## Back Navigation

Users expect:
- Browser back button works
- Maintains layer state (summary vs detail)
- Preserves scroll position on return

Implementation:
```javascript
// Store state in URL
/docs/architecture/flow?layer=detail

// Browser back maintains state
Back button → /docs/architecture?layer=summary
```

---

**Related:** [Human Layer](human-layer) | [AI Layer](ai-layer) | [Viewport Semantics](../../architecture/viewport-semantics)
