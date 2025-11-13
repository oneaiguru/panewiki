<!-- model: opus -->
# Opus Role: The Essence Layer

## What Opus Does

Opus is the **strategic thinking layer**. Its job: identify core components and key insights.

## What Opus Is Best At

- Complex reasoning
- Architectural decisions
- Trade-off analysis
- "What are the key components?"
- "What are the failure modes?"

## What Opus Should NOT Do

- Generate 10 code examples
- Illustrate the same concept 4 times
- Perform repetitive work

## Output Format

**Constraint:** Must fit in 400px column (max 30 lines)

```
# Topic

[2-3 sentence core idea]

## Core Components
- Component A: [what it is]
- Component B: [what it is]
- Component C: [what it is]

## Instructions for Haiku
For each component:
- Component A: Show pattern X with code
- Component B: Show pattern Y with diagram
- Component C: Show pattern Z with explanation
```

## Cost

~$0.003 (200 tokens at $15/M)

## Token Usage

- Input: User query (few tokens)
- Output: 150-300 tokens (forced brevity)
- Total: ~200 tokens per call

## Example Output

```
# Authentication System

Core idea: Stateless tokens eliminate
server-side sessions, scale to millions.

Core components:
- User model (identity storage)
- JWT middleware (stateless validation)
- Rate limiting (security)

Instructions for Haiku:
- Component 1: Show user schema + signup
- Component 2: Show middleware validation
- Component 3: Show rate limit check
```

---

**Related:** [Haiku Role](haiku-role-illustration.md) | [Sonnet Role](sonnet-role-review.md) | [Model Orchestration](pillar-3-model-orchestration.md)
