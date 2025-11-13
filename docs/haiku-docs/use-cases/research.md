---
id: use-case-research
title: "Use Case: Research Workflow"
models: [haiku]
summary: true
readTime: 7m
---

<!-- model: haiku -->
> **Path:** Home › Use Cases › Research
> **Validation:** Reviewed by Sonnet ✓

# Use Case: Research Workflow

## The Scenario

User: "Research AI agent patterns"

**Old way:** Search papers, read PDFs, synthesize manually
**New way:** Opus summarizes, Haiku extracts patterns, Sonnet compares

## 3-Pane Research Flow

- **Strategy (Opus):** Lists top 5 agent patterns (ReAct, Chain of Thought, Tree Search, Reflection, Autonomy). Cost ≈$0.003.  
- **Examples (Haiku):** Breaks down each pattern with reasoning, acting, observing, self-critique. ≈$0.005 per pattern.  
- **Comparison (Sonnet):** Marks which pattern fits (✓ / ⚠), calls out trade-offs, recommends next steps. ≈$0.0075.  

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
**Related**
- [Next: Debugging](debugging)
- [See also: Model Orchestration](../three-pillars/pillar-3/pillar-3-model-orchestration)
- [Back: Home](../home)
