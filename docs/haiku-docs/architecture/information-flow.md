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

## Error Paths & Retries

**A. Parallel Haiku with timeouts and partials**

```
Opus (200 tok)
     │
     ▼
Dispatch N Haiku jobs ────────────────────────────────────────────┐
     │                                                            │
     ├─ Haiku#1 → ✅ done <30s                                    │
     ├─ Haiku#2 → ⏳ >30s → RETRY(1, backoff 1.5×) → ✅/❌         │
     └─ Haiku#3 → ❌ hard error → mark FAILED                     │
                                                                 │
Aggregate results:
- If all ✅ → proceed to Sonnet
- If some ❌/⏳ → show PARTIAL (e.g., 2/3 ready) + "Retry failed"
```

**B. Sonnet validation failure path**

```
Sonnet validate (500 tok)
        │
        ├─ PASS → ship summary/detail
        └─ FAIL → classify:
               • CRITICAL → block; show issues; offer "Auto-fix (re-run Haiku)"
               • WARN     → show issues; allow user to proceed
```

**C. Retry logic (decision tree)**

```
Start
 │
 ├─ Haiku timeout (>30s)?
 │     └─ Yes → Retry once (1.5× backoff) → still failing?
 │             └─ Yes → mark FAILED; continue with partials; expose "Retry failed"
 │
 ├─ Partial results (k/N)?
 │     └─ Yes → render partial UI badges + toast "k/N ready"; user can continue or retry
 │
 └─ Sonnet FAIL?
       └─ Yes → If CRITICAL → block + suggest targeted Haiku re-runs
                 If WARN → display issues + allow proceed
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
