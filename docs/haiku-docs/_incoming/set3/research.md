<!-- model: haiku -->
# Use Case: Research Workflow

## The Scenario

User: "Research AI agent patterns"

**Old way:** Search papers, read PDFs, synthesize manually
**New way:** Opus summarizes, Haiku extracts patterns, Sonnet compares

## 3-Pane Research Flow

```
┌──────────────┬────────────────┬──────────────┐
│ STRATEGY     │ EXAMPLES       │ COMPARISON   │
│ (Opus)       │ (Haiku)        │ (Sonnet)     │
├──────────────┼────────────────┼──────────────┤
│ Top 5        │ Pattern A:     │ ✓ Pattern A  │
│ patterns:    │ ReAct          │ best for     │
│              │ • Reasoning    │ complex      │
│ • ReAct      │ • Acting       │ tasks        │
│ • Chain      │ • Observing    │              │
│   of Thought │                │ ⚠ Pattern B  │
│ • Tree       │ Pattern B:     │ slower in    │
│   Search     │ Chain of       │ practice     │
│ • Reflection │ Thought        │              │
│ • Autonomy   │ • Step-by-step │ ✓ Pattern C  │
│              │ • Self-critique│ most robust  │
│ Cost: $0.003 │ • Verification│              │
│              │                │ Cost: $0.0015
│              │ Cost: $0.001   │
│              │ each           │
└──────────────┴────────────────┴──────────────┘
```

## Workflow

1. **User enters query:** "Compare AI agent frameworks"
2. **Opus identifies:** 5 key patterns to research
3. **Haiku extracts:** Real code examples for each pattern
4. **Sonnet compares:** Pros/cons, use cases, performance

## Result

User sees:
- Strategy (which patterns matter)
- Examples (how they work)
- Comparison (when to use each)

Time: 20 minutes (vs 2+ hours manual)

---

**Compare:** [Code Review](code-review.md) | **Learn:** [Model Orchestration](../three-pillars/pillar-3/pillar-3-model-orchestration.md)
