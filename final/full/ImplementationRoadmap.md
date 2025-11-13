# Implementation Roadmap (V1 Prototype)

## File Structure

```
src/
├─ App.jsx
├─ App.css
├─ components/
│  ├─ NavigationBar.jsx
│  ├─ ScrollContainer.jsx
│  ├─ PaneStrip.jsx
│  ├─ Pane.jsx
│  └─ RelatedDiagrams.jsx
├─ hooks/
│  └─ useNavigation.js
└─ utils/
   └─ scrollCalculations.js
```

## Component Hierarchy

```
App
├─ NavigationBar
│  ├─ BreadcrumbDisplay
│  ├─ AncestorJumpButtons
│  └─ BackControls
└─ ScrollContainer
   └─ PaneStrip
      └─ Pane[] (map history)
         ├─ PaneHeader
         ├─ MockPDFPreview
         └─ RelatedDiagrams
```

## Phase 1: Foundation (State + Math)

Create: useNavigation hook, scroll calculations
What works: State updates, scroll position math

## Phase 2: Layout (Navigation Bar + Viewport)

Create: NavigationBar, ScrollContainer
What works: UI appears, buttons visible

## Phase 3: Panes (Individual Displays)

Create: PaneStrip, Pane, RelatedDiagrams
What works: Forward/back navigation works

## Phase 4: Polish (Animation + Keyboard)

Create: Smooth scroll, keyboard shortcuts
What works: Everything feels responsive

## Success Criteria

All 4 phases complete:
✓ State management works
✓ Navigation works (forward, back, jump)
✓ UI renders correctly
✓ Smooth animations
✓ Keyboard shortcuts functional

See: [ExecutionPlan](ExecutionPlan)
