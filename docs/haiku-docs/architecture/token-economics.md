<!-- model: sonnet -->
# Token Economics: The Math

## Pricing Reality

```
Claude Opus 4:     $15.00 / 1M tokens
Claude Sonnet 4.5: $3.00  / 1M tokens
Claude Haiku 4.5:  $0.80  / 1M tokens

Cost ratio: Opus is 18.75× more expensive than Haiku
```

## Example: Design Authentication System

### All-Opus (Naive)
```
1. Opus: Architecture          500 tokens
2. Opus: User model code      1000 tokens
3. Opus: Middleware code      1000 tokens
4. Opus: Endpoint examples    1000 tokens
5. Opus: Security review       500 tokens
────────────────────────────────
Total: 4000 tokens × $15/M = $0.06
```

### Three-Model Orchestration
```
1. Opus: Architecture (200)           → $0.003
2. Haiku: User model (1000)           → $0.001
3. Haiku: Middleware (1000)           → $0.001
4. Haiku: Endpoints (1000)            → $0.001
5. Sonnet: Security review (500)      → $0.0015
─────────────────────────────────────
Total: ~5700 tokens = $0.0075 (87.5% cheaper)
```

## General Formula

For any task with N components:

```
Naive cost:     (N + 1) × N_tokens × $15/M

Orchestrated:   
  Opus:    1 × 200 × $15 / 1M
  Haiku:   N × 1000 × $0.80 / 1M
  Sonnet:  1 × 500 × $3 / 1M

For N=5:
  Naive:   6 × 3000 × $15/M = $0.27
  Orch:    200×15 + 5×1000×0.8 + 500×3 / 1M = $0.011
  
  Reduction: 95.9%
```

## When Orchestration Matters Most

**High savings when:**
- Task has multiple similar components (N > 3)
- Each component needs separate illustration
- Quality validation adds value

**Savings diminish when:**
- Task is simple (single component)
- No parallel work possible
- Validation not critical

---

**Reference:** [Model Orchestration](../three-pillars/pillar-3/pillar-3-model-orchestration.md) | **Learn:** [Information Flow](information-flow.md)
