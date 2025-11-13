<!-- model: haiku -->
# Use Case: Learning Workflow

## The Scenario

User: "Learn OAuth 2.0 flow"

**Old way:** Long tutorial, must read everything
**New way:** Opus explains concept, Haiku shows examples, Sonnet teaches progression

## 3-Pane Learning Flow

```
┌──────────────┬────────────────┬──────────────┐
│ CONCEPT      │ EXAMPLES       │ PROGRESSION  │
│ (Opus)       │ (Haiku)        │ (Sonnet)     │
├──────────────┼────────────────┼──────────────┤
│ OAuth 2.0:   │ Flow diagram   │ Level 1:     │
│              │ (ASCII art)    │ Understand   │
│ Core idea:   │                │ concepts     │
│ Users don't  │ Example 1:     │              │
│ share        │ Authorization  │ Level 2:     │
│ passwords    │ Code flow      │ Implement    │
│              │ with code      │ basic flow   │
│ Key concepts:│                │              │
│ • Auth codes │ Example 2:     │ Level 3:     │
│ • Tokens     │ Implicit flow  │ Secure with  │
│ • Scopes     │                │ PKCE         │
│              │ Example 3:     │              │
│ Cost: $0.003 │ Token refresh  │ Challenges:  │
│              │ pattern        │ Check your   │
│              │                │ knowledge    │
│              │ Cost: $0.001   │              │
│              │ each           │ Cost: $0.001 │
└──────────────┴────────────────┴──────────────┘
```

## Workflow

1. **User selects:** Topic to learn
2. **Opus explains:** Core concept in simple terms
3. **Haiku provides:** Graduated examples (simple → complex)
4. **Sonnet suggests:** Next steps and challenges

## Result

Learning path:
- Summary (concept explanation)
- Examples (practical code)
- Progression (where to go next)
- Challenges (test understanding)

Time: Self-paced, typically 30-60 min per topic

---

**Compare:** [Code Review](code-review.md) | **Learn:** [Dual Representation](../three-pillars/pillar-2/pillar-2-detail.md)
