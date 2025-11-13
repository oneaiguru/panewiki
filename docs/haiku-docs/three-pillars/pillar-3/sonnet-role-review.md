---
id: pillar-3-sonnet-role
title: "Sonnet Role: The Review Layer"
models: [sonnet]
summary: true
readTime: 4m
---

<!-- model: sonnet -->
> **Path:** Home › Three Pillars › Pillar 3 › Sonnet
> **Validation:** Reviewed by Sonnet ✓

# Sonnet Role: The Review Layer

## What Sonnet Does

Sonnet is the **review and validation layer**. Its job: verify outputs and find gaps.

## What Sonnet Is Best At

- Verifying correctness
- Spotting gaps or inconsistencies
- Synthesizing multiple inputs
- Practical trade-off analysis
- Quality assurance

## What Sonnet Should NOT Do

- Initial ideation (use Opus)
- Generation at scale (use Haiku)
- Deep architectural review (use Opus)

## Output Format

**Constraint:** Fits in 400px column

```
# Validation Results

## Checks
- Component 1: ✓ / ⚠ / ✗
- Component 2: ✓ / ⚠ / ✗
- Component 3: ✓ / ⚠ / ✗

## Gaps Found
[List any issues]

## Recommended Next Steps
[What should happen next]
```

## Cost

≈$0.0075 (500 tokens at the Sonnet output rate; see [Pricing](../../appendix/pricing))

## Token Usage

- Input: Opus + Haiku outputs (1200+ tokens)
- Output: 400-600 tokens per call
- Total: ~500 tokens per call

## Example Output

```
# Validation Results

## Checks
- User model structure: ✓ Correct
- JWT middleware: ✓ Secure
- Rate limiting: ⚠ Timing issues
- Logout handler: ✗ Missing

## Gaps Found
Token expiration: Tokens never invalidate server-side
Security: No brute-force protection on login
Edge case: Concurrent token refreshes not handled

## Recommended Next Steps
1. Add token blacklist for logout
2. Implement rate limiting (5 req/min)
3. Add mutex for refresh token handling
4. Add audit logging
```

## Integration

Sonnet input: Everything Opus + Haiku created
Sonnet output: Synthesis document + validation findings

User sees in 3 panes:
- Left: Opus strategy
- Center: Haiku examples
- Right: Sonnet validation

---
**Related**
- [Next: Model Orchestration](pillar-3-model-orchestration)
- [See also: Haiku Role](haiku-role-illustration)
- [Back: Opus Role](opus-role-essence)
