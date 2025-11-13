<!-- model: haiku -->
# Architecture: Information Flow

## How Data Moves Through System

```
User Query
    ↓
┌─────────────────────────┐
│ OPUS (Strategic)        │
│ "What are 3 components?"│
└────────┬────────────────┘
         │ (200 tokens)
         ↓
    ┌────┴────┐
    │ Emit    │
    │ "For each component,
    │ illustrate with:"
    └────┬────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌──────────────┐           ┌──────────────┐
│ HAIKU 1      │           │ HAIKU 2      │ (parallel)
│ Component A  │           │ Component B  │
│ 1000 tokens  │           │ 1000 tokens  │
└──────┬───────┘           └───────┬──────┘
       │                           │
       └───────────────┬───────────┘
                       ↓
         Collect all Haiku outputs
                       │
                       ▼
         ┌──────────────────────────┐
         │ SONNET (Review)          │
         │ "Validate all outputs"   │
         │ 500 tokens               │
         └──────────┬───────────────┘
                    ↓
         ┌──────────────────────────┐
         │ User sees in 3 panes:    │
         │ L: Opus strategy         │
         │ C: Haiku examples        │
         │ R: Sonnet validation     │
         └──────────────────────────┘
```

## Viewport Semantics

```
┌──────────────────────────────────────────────┐
│ [home] > [architecture] > [flow]            │ Breadcrumb
├──────────────────────────────────────────────┤
│ ┌───────┬───────────┬───────────┐           │
│ │Context│  Summary  │  Detail   │           │
│ │ (L)   │  (C)      │  (R)      │           │
│ │       │           │           │           │
│ │ Opus  │ Haiku     │ Sonnet    │ Model IDs
│ │ role  │ examples  │ review    │
│ │       │           │           │           │
│ │[link] │[expand]   │[validate] │ Actions  │
│ └───────┴───────────┴───────────┘           │
└──────────────────────────────────────────────┘
```

- **Left pane:** Context + strategy layer
- **Center pane:** Summary that expands to detail on click
- **Right pane:** Always shows related or validating content

---

**Learn:** [Viewport Semantics](viewport-semantics.md) | **See:** [Data Model](../architecture/data-model.md)
