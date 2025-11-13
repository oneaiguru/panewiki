<!-- model: haiku -->
# Use Case: Debugging Workflow

## The Scenario

User: "API returns 500 error on login endpoint"

**Old way:** Read error logs, guess cause, try fixes
**New way:** Opus hypothesizes, Haiku tests, Sonnet validates

## 3-Pane Debug Flow

```
┌──────────────┬────────────────┬──────────────┐
│ HYPOTHESIS   │ INVESTIGATION  │ VALIDATION   │
│ (Opus)       │ (Haiku)        │ (Sonnet)     │
├──────────────┼────────────────┼──────────────┤
│ 3 likely     │ Check #1:      │ ✓ Database   │
│ causes:      │ Database       │ connection   │
│              │ • Connection   │ is the issue │
│ 1. Database  │   string       │              │
│    offline   │ • Query        │ Fix:         │
│              │   syntax       │ Add retry    │
│ 2. Auth      │ • Timeout      │ logic        │
│    token     │                │ (line 42)    │
│    expired   │ Check #2:      │              │
│              │ Auth token     │ Time: 5 min  │
│ 3. Rate      │ • Expiration   │ to implement │
│    limit     │ • Validation   │              │
│              │                │ Cost: $0.001 │
│ Cost: $0.003 │ Check #3:      │              │
│              │ Rate limiting  │              │
│              │ • Request count│              │
│              │ • Time window  │              │
│              │                │              │
│              │ Cost: $0.001   │              │
│              │ each           │              │
└──────────────┴────────────────┴──────────────┘
```

## Workflow

1. **User reports:** Error code and context
2. **Opus hypothesizes:** 3 most likely causes (based on error type)
3. **Haiku tests:** Each hypothesis with specific checks
4. **Sonnet validates:** Which hypothesis is correct, suggests fix

## Result

- Root cause identified: 5 minutes
- Fix suggested: with code location
- Implementation: clear next steps

---

**Compare:** [Code Review](code-review.md) | **Learn:** [Model Orchestration](../three-pillars/pillar-3/pillar-3-model-orchestration.md)
