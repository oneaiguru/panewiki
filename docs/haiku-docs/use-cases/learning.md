---
id: use-case-learning
title: "Use Case: Learning Workflow"
models: [haiku]
summary: true
readTime: 6m
---

<!-- model: haiku -->
> **Path:** Home › Use Cases › Learning
> **Validation:** Reviewed by Sonnet ✓

# Use Case: Learning Workflow

## The Scenario

User: "Learn OAuth 2.0 flow"

**Old way:** Long tutorial, must read everything
**New way:** Opus explains concept, Haiku shows examples, Sonnet teaches progression

## 3-Pane Learning Flow

- **Concept (Opus):** Explains OAuth 2.0 fundamentals (users never share passwords, auth codes, scopes). Cost ≈$0.003 per [Pricing](../appendix/pricing).  
- **Examples (Haiku):** Provides flow diagrams + code for authorization code, implicit, and refresh patterns (≈$0.005 per example).  
- **Progression (Sonnet):** Outlines Level 1/2/3 mastery plus challenges (≈$0.0075).  

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

## Progression Rubric

**Level 1 · Conceptual (10 min)**
- [ ] Explain why OAuth avoids sharing passwords
- [ ] Label auth code → token exchange steps
- [ ] Answer quiz: *“What is a scope?”*, *“Who issues refresh tokens?”*, *“When does PKCE matter?”*

**Level 2 · Applied (20 min)**
- [ ] Implement authorization-code flow with refresh tokens
- [ ] Add three scopes and describe each permission
- [ ] Quiz yourself with: *“What fails if redirect URI mismatches?”*, *“How do you revoke tokens?”*, *“Where do you store state?”*

**Level 3 · Secure (30 min)**
- [ ] Add PKCE + rotating refresh tokens
- [ ] Document threat model + mitigations
- [ ] Quiz prompts: *“How to detect token replay?”*, *“Which logs prove consent?”*, *“What happens if code is intercepted?”*

## Spaced Recall Hooks

- **Day 1:** Rebuild the summary column from memory (5 min)
- **Day 3:** Recreate the Haiku examples without looking; compare deltas
- **Day 7:** Run Sonnet-style validation on your own implementation—log ✓/⚠/✗ results and new gaps

---
**Related**
- [Next: Research Use Case](research)
- [See also: Dual Representation](../three-pillars/pillar-2/pillar-2-detail)
- [Back: Home](../home)
