---
id: system-reference
title: "System Visualization & Reference"
models: [opus]
summary: false
readTime: 10m
---

<!-- model: opus -->
> **Path:** Home › System Reference
> **Validation:** Reviewed by Sonnet ✓

# System Visualization & Reference

## Visual Overview

```
┌────────┬────────┬────────┐
│ 400px  │ 400px  │ 400px  │
│ Opus   │ Haiku  │ Sonnet │
│ Why    │ What   │ Verify │
└────────┴────────┴────────┘
```
_Alt: Three equal columns showing Opus (strategy), Haiku (execution), and Sonnet (validation) panes._

Rates follow [Pricing](appendix/pricing): Opus handles premium planning input, Haiku produces low-cost output, and Sonnet performs mid-tier validation. Every pane surfaces the model attribution plus the validation badge so readers know who authored and who reviewed the section.

### Interaction Legend

- `✓` — Pass: requirement satisfied
- `⚠` — Warning: needs follow-up
- `✗` — Fail: blocking issue
- `[Expand]` — Reveal detail layer (100+ lines)
- `[Navigate]` — Jump to linked document

## Data-Flow Orchestration

```
┌──────────┐
│ User ask │
└────┬─────┘
     │ prompt
┌────▼────┐
│  Opus   │ Essence (≈200 in)
└────┬────┘
     │ plans
┌────▼────┐
│ Haiku 1 │ Examples
├─────────┤
│ Haiku 2 │ Parallel
├─────────┤
│ Haiku 3 │ Output (≈3K out)
└────┬────┘
     │ bundles results
┌────▼────┐
│ Sonnet  │ Review (≈500 out)
└────┬────┘
     │ synthesis
┌────▼────┐
│  User   │ Reads columns
└─────────┘
```
_Alt: Linear flow from user prompt to Opus planning, parallel Haiku runs, Sonnet validation, then user consumption._

**Token profile (scenario from [Pricing](appendix/pricing))**
- Opus: ~200 input tokens → ≈$0.003
- Haiku: three 1K output batches → ≈$0.045 total at $5/M out
- Sonnet: 500 output tokens → ≈$0.0075 at $15/M out
- **Total ≈$0.055**, ≈81% cheaper than all-Opus output ($0.30)

## Document Stack

- **INDEX** — Navigation hub for all personas
- **HOME / home-detail** — Gateway pair explaining summary vs. detail
- **Vision set** — [vision](vision/vision), [problem-statement](vision/problem-statement), [solution-overview](vision/solution-overview)
- **Three Pillars**
  - Pillar 1: [pillar-1-column-output](three-pillars/pillar-1/pillar-1-column-output), [pillar-1-detail](three-pillars/pillar-1/pillar-1-detail), _pending:_ 400px-width-math (tracked in [MISSING_FILES](MISSING_FILES))
  - Pillar 2: [pillar-2-dual-representation](three-pillars/pillar-2/pillar-2-dual-representation), [pillar-2-detail](three-pillars/pillar-2/pillar-2-detail), [human-layer](three-pillars/pillar-2/human-layer), [ai-layer](three-pillars/pillar-2/ai-layer), [navigation-between-layers](three-pillars/pillar-2/navigation-between-layers)
  - Pillar 3: [pillar-3-model-orchestration](three-pillars/pillar-3/pillar-3-model-orchestration), [pillar-3-detail](three-pillars/pillar-3/pillar-3-detail), [opus-role-essence](three-pillars/pillar-3/opus-role-essence), [haiku-role-illustration](three-pillars/pillar-3/haiku-role-illustration), [sonnet-role-review](three-pillars/pillar-3/sonnet-role-review)
- **Architecture** — [information-flow](architecture/information-flow), [viewport-semantics](architecture/viewport-semantics), [data-model](architecture/data-model), [token-economics](architecture/token-economics)
- **Implementation** — [extending-current-system](implementation/extending-current-system), [markdown-conventions](implementation/markdown-conventions), [model-metadata](implementation/model-metadata), [prompt-patterns](implementation/prompt-patterns), future-vision set: [cursor-integration](implementation/future-vision/cursor-integration), [claude-code-integration](implementation/future-vision/claude-code-integration), [chatgpt-plugin](implementation/future-vision/chatgpt-plugin)
- **Use cases** — [code-review](use-cases/code-review), [research](use-cases/research), [debugging](use-cases/debugging), [learning](use-cases/learning)

## Navigation Pattern

```
Home summary
   ↓ decide relevance
Home detail
   ↓ pick pillar
Pillar summary
   ↓ expand detail
Pillar detail
   ↓ jump via breadcrumb
Next doc
```
_Alt: Readers move summary → detail → next topic through breadcrumbs._

## Integration Points

```
Agentic tool (Cursor / Claude Code)
          ↓
Opus prompt templates
          ↓
Parallel Haiku executions
          ↓
Sonnet validation hook
          ↓
Render via 3-pane viewport
          ↓
Telemetry + cost tracking
```
_Alt: Toolchain from IDE prompts through validation into the three-pane renderer._

These integration hand-offs ensure every generated node captures model metadata, validation state, and links back to source prompts for transparency.

## Legend & Conventions Recap

- **Breadcrumbs** (`> **Path:** …`) anchor location inside the system.
- **Validation badge** signals Sonnet (or human) review status.
- **Column width** hard-capped at 400px (diagram enforced via `scripts/diagram-width-check.sh` in CI).
- **Links** are extension-less (e.g., `token-economics`) to keep URL routing clean.

---

**Start exploring:** Pick your path from [INDEX](INDEX) based on your role.

---
**Related**
- [Next: Index](INDEX)
- [See also: Quick Start](QUICK_START)
- [Back: Home](home)
