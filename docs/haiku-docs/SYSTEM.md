<!-- model: opus -->
# System Visualization & Reference

## The Complete 3-Column Paradigm

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE (1200px)                             │
├────────────┬─────────────────┬──────────────────────────────────────────────┤
│            │                 │                                              │
│  400px     │    400px        │            400px                             │
│ CONTEXT    │   SUMMARY       │           DETAIL                             │
│            │                 │                                              │
│ ┌────────┐ │  ┌───────────┐  │  ┌──────────────────────┐                   │
│ │ Opus   │ │  │ Haiku     │  │  │ Sonnet               │                   │
│ │        │ │  │ (or Human)│  │  │                      │                   │
│ │Strategy│ │  │           │  │  │ Validation +         │                   │
│ │        │ │  │ Examples  │  │  │ Synthesis            │                   │
│ │• What  │ │  │ • Code    │  │  │ ✓ ✓ ⚠ ✗             │                   │
│ │• Why   │ │  │ • Diagrams│  │  │ • Gaps               │                   │
│ │• How   │ │  │ • Output  │  │  │ • Suggestions        │                   │
│ │        │ │  │           │  │  │ • Next steps         │                   │
│ │Click→  │ │  │ [Expand]  │  │  │ [Navigate]           │                   │
│ │[More]  │ │  │           │  │  │                      │                   │
│ └────────┘ │  └───────────┘  │  └──────────────────────┘                   │
│            │                 │                                              │
│ Model:     │  Model:         │  Model:                                      │
│ Opus 4     │  Haiku 4.5      │  Sonnet 4.5                                  │
│ $15/M      │  $0.80/M        │  $3/M                                        │
│            │                 │                                              │
└────────────┴─────────────────┴──────────────────────────────────────────────┘
              └───────────────────┬──────────────────────────┘
                                  │
                          RESPONSIVE LAYOUT:
                          Tablet: 2 panes (C + R)
                          Mobile: 1 pane (C) with nav
```

## Data Flow: The Orchestration

```
USER QUERY
  "Design authentication system"
         │
         ▼
    ┌─────────────────────────────┐
    │ OPUS (Expensive, Thinking)  │
    │                             │
    │ Output (200 tokens):        │
    │ ┌─────────────────────────┐ │
    │ │ Core components:        │ │
    │ │ • User model            │ │
    │ │ • JWT middleware        │ │
    │ │ • Rate limiting         │ │
    │ │                         │ │
    │ │ Haiku should create:    │ │
    │ │ 1. Schema example       │ │
    │ │ 2. Middleware code      │ │
    │ │ 3. Rate limit handler   │ │
    │ └─────────────────────────┘ │
    └────────┬────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
  ┌────┐  ┌────┐  ┌────┐    Parallel execution
  │HAI1│  │HAI2│  │HAI3│    (all at once)
  └──┬─┘  └──┬─┘  └──┬─┘
     │       │       │
     │ Results: 3 code examples + explanations
     │
     └───────────┬─────────────
                 │
                 ▼
         ┌──────────────────────┐
         │ SONNET (Moderate)    │
         │ (Review & Validate)  │
         │                      │
         │ Input: Opus + Haiku  │
         │ Output (500 tokens): │
         │                      │
         │ ✓ Schema correct     │
         │ ✓ Middleware secure  │
         │ ⚠ Rate limit timing  │
         │ ✗ Missing logout     │
         │                      │
         │ Suggestions:         │
         │ • Add grace period   │
         │ • Implement revocation
         │ • Add audit logs     │
         └──────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │ RENDER TO 3 PANES            │
    │                              │
    │ Left:  Opus (strategy)       │
    │ Center: Haiku (examples)     │
    │ Right: Sonnet (validation)   │
    │                              │
    │ User sees complete picture   │
    │ in <2 minutes                │
    └──────────────────────────────┘

COST BREAKDOWN:
  Opus:   200 tokens × $15/M = $0.003  (Strategic layer)
  Haiku:  3000 tokens × $0.8/M = $0.0024 (Parallel execution)
  Sonnet: 500 tokens × $3/M = $0.0015 (Review layer)
  ────────────────────────────
  TOTAL: ~$0.007 (vs $0.06 for all-Opus = 91% savings)
```

## Three Pillars Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    3-COLUMN PARADIGM                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  PILLAR 1       │    │  PILLAR 2       │                │
│  │  COLUMNS        │    │  DUAL           │                │
│  │  ────────       │    │  REPRESENTATION │                │
│  │                 │    │  ───────────    │                │
│  │ • 400px width   │    │                 │                │
│  │ • Newspaper fmt │    │ • Summary layer │                │
│  │ • Readable      │    │ • Detail layer  │                │
│  │ • Constrained   │    │ • Human-first   │                │
│  │ • Forced clarity│    │ • AI-complete   │                │
│  │                 │    │ • Navigation    │                │
│  └─────────────────┘    └─────────────────┘                │
│           ▲                      ▲                           │
│           │                      │                           │
│           └──────────┬───────────┘                           │
│                      │                                       │
│                      ▼                                       │
│           ┌──────────────────────┐                          │
│           │  PILLAR 3            │                          │
│           │  ORCHESTRATION       │                          │
│           │  ──────────────      │                          │
│           │                      │                          │
│           │ • Opus thinking      │                          │
│           │ • Haiku execution    │                          │
│           │ • Sonnet validation  │                          │
│           │ • Model roles        │                          │
│           │ • Token efficiency   │                          │
│           │ • Parallel workflow  │                          │
│           └──────────────────────┘                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘

RESULT: A system that is
  ✓ Readable (columns work)
  ✓ Learnable (summary first)
  ✓ Efficient (orchestrated models)
  ✓ Scalable (parallel execution)
  ✓ Transparent (model attribution)
  ✓ Economical (87% cost reduction)
```

## Document Structure

```
haiku-docs/
├── INDEX.md (you are here)
│
├── home.md + home-detail.md
│   └── Gateway to everything
│
├── vision/
│   ├── vision.md (Why columns matter)
│   ├── problem-statement.md
│   └── solution-overview.md
│
├── three-pillars/
│   ├── pillar-1/ (Column format)
│   │   ├── pillar-1-column-output.md
│   │   ├── pillar-1-detail.md
│   │   └── 400px-width-math.md
│   │
│   ├── pillar-2/ (Dual representation)
│   │   ├── pillar-2-dual-representation.md
│   │   ├── pillar-2-detail.md
│   │   ├── human-layer.md
│   │   ├── ai-layer.md
│   │   └── navigation-between-layers.md
│   │
│   └── pillar-3/ (Model orchestration)
│       ├── pillar-3-model-orchestration.md
│       ├── pillar-3-detail.md
│       ├── opus-role-essence.md
│       ├── haiku-role-illustration.md
│       ├── sonnet-role-review.md
│       └── token-economics.md
│
├── architecture/
│   ├── information-flow.md
│   ├── viewport-semantics.md
│   ├── data-model.md
│   └── token-economics.md
│
├── implementation/
│   ├── extending-current-system.md
│   ├── markdown-conventions.md
│   ├── model-metadata.md
│   ├── prompt-patterns.md
│   └── future-vision/
│       ├── cursor-integration.md
│       ├── claude-code-integration.md
│       └── chatgpt-plugin.md
│
└── use-cases/
    ├── code-review.md
    ├── research.md
    ├── debugging.md
    └── learning.md

TOTAL: 35+ documents, dual-layered (70+ if counting detail)
```

## Key Navigation Pattern

```
User at HOME:
  "What is this?"
         ↓
  Read summary (5 min) → Click "See details"
         ↓
User sees HOME-DETAIL
  "How does this work?"
         ↓
  Read core section → Click [link to Pillar 1]
         ↓
User at PILLAR 1 (summary)
  "What's the first idea?"
         ↓
  Read pillar (3 min) → Click "Explore details"
         ↓
User at PILLAR 1-DETAIL
  "How deep can I go?"
         ↓
  Read full context → Click [link to Pillar 2]
  
PATTERN: Summary → Decide → Detail → Link → Next
```

## Integration Points

```
Agentic AI Tools (Cursor, Claude Code)
         ↓
Generate content using orchestration pattern
         ↓
Create navigable nodes (summary + detail)
         ↓
Render in 3-pane viewport
         ↓
Left pane:  Opus strategy
Center pane: Haiku examples
Right pane:  Sonnet validation
         ↓
User sees complete picture immediately
```

---

**Start exploring:** Pick your path from [INDEX.md](INDEX.md) based on your role.
