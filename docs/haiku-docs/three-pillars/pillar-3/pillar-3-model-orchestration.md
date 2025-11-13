<!-- model: opus -->
# Pillar 3: Model Orchestration

## Three Models, Three Roles

```
┌─────────┬──────────┬─────────┐
│ OPUS    │ HAIKU    │ SONNET  │
│ THINK   │ EXECUTE  │ VERIFY  │
├─────────┼──────────┼─────────┤
│ Strategy│ Examples │ Reviews │
│ Essence │ Parallel │ Quality │
│ $15/M   │ $0.25/M  │ $3/M    │
└─────────┴──────────┴─────────┘
```

## The Workflow

**1. User Query**
→ "Design authentication system"

**2. Opus (Strategic)**
→ "3 layers: model, middleware, endpoints"
   (200 tokens, ~$0.003)

**3. Haiku (Parallel)**
→ 4 parallel calls, each illustrates one layer
   (4 × 1000 tokens, ~$0.001 each)

**4. Sonnet (Review)**
→ "Validates all 4 outputs, finds gaps"
   (500 tokens, ~$0.0015)

**Total:** ~$0.019 vs $0.15+ for all-Opus

## Why This Works

**Economics:**
- Opus expensive + limited output = strategic thinking only
- Haiku cheap + parallel = execution at scale
- Sonnet moderate + synthesis = quality gate

**Quality:**
- User sees Opus strategy (best reasoning)
- Sees Haiku examples (practical implementation)
- Sees Sonnet review (quality assurance)

---

**Learn:** [Opus Role](opus-role-essence.md) | **Explore:** [Haiku Illustration](haiku-role-illustration.md) | **Review:** [Sonnet Validation](sonnet-role-review.md)
