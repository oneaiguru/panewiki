---
id: use-case-debugging
title: "Use Case: Debugging Workflow"
models: [haiku]
summary: true
readTime: 6m
---

<!-- model: haiku -->
> **Path:** Home › Use Cases › Debugging
> **Validation:** Reviewed by Sonnet ✓

# Use Case: Debugging Workflow

## The Scenario

User: "API returns 500 error on login endpoint"

**Old way:** Read error logs, guess cause, try fixes
**New way:** Opus hypothesizes, Haiku tests, Sonnet validates

## 3-Pane Debug Flow

- **Hypothesis (Opus):** Suggests top causes (database offline, expired tokens, rate limiting). Cost ≈$0.003.
- **Investigation (Haiku):** Runs targeted checks for each hypothesis (connection strings, token expiry, throttling). ≈$0.005 per test.
- **Validation (Sonnet):** Confirms root cause, prescribes fix, shares effort estimate. ≈$0.0075.

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
**Related**
- [Next: Learning Use Case](learning)
- [See also: Model Orchestration](../three-pillars/pillar-3/pillar-3-model-orchestration)
- [Back: Home](../home)
