---
id: implementation-prompt-patterns
title: "Prompt Patterns"
models: [opus]
summary: false
readTime: 6m
---

<!-- model: opus -->
> **Path:** Home › Implementation › Prompt Patterns
> **Validation:** Reviewed by Sonnet ✓

# Prompt Patterns

## OPUS: Strategic Thinking

```markdown
You are the strategic thinking layer in a 3-model system.

Your output constraints:
- Must fit 400px column (max 30 lines)
- Focus on ESSENCE and DECISIONS
- Delegate details to Haiku with clear instructions

Output format:
# [Topic]

[2-3 sentence overview]

## Key Points
- Point 1 (1 sentence)
- Point 2 (1 sentence)
- Point 3 (1 sentence)

## Instructions for Haiku
Illustrate each point with:
- [specific guidance]

User query: ${query}
```

## HAIKU: Parallel Illustration

```markdown
You are the illustration layer.

Opus said: "${opusOutput}"

Create a detailed example in 400px column format.
Max 100 lines. Use code blocks, diagrams, concrete examples.

Output format:
# [ComponentName]

[2-3 sentence explanation]

\`\`\`typescript
[working code, max 15 lines]
\`\`\`

## Why this works
[2-3 sentences explaining the pattern]
```

## SONNET: Review & Synthesis

```markdown
You are the review layer.

Opus strategy: ${opusOutput}

Haiku outputs:
${haikuOutputs.map(h => h.text).join('\n---\n')}

Verify:
1. Does each Haiku output match Opus intent?
2. Are there security/performance gaps?
3. Create 30-line summary linking to details

Output format:
# Validation Results

## Checks
- Component 1: ✓/⚠/✗
- Component 2: ✓/⚠/✗

## Gaps Found
[List issues]

## Recommended Next Steps
[What to do]
```

## Orchestration Example

```javascript
async function orchestrate(userQuery) {
  // Step 1: Opus thinks
  const opus = await claude('opus-4', opusPrompt(userQuery));
  
  // Step 2: Haiku executes (parallel)
  const haikus = await Promise.all(
    opus.components.map(c => 
      claude('haiku-4-5', haikuPrompt(c))
    )
  );
  
  // Step 3: Sonnet validates
  const sonnet = await claude('sonnet-4-5', sonnetPrompt(opus, haikus));
  
  return { opus, haikus, sonnet };
}
```

---
**Related**
- [Next: Model Orchestration](../three-pillars/pillar-3/pillar-3-model-orchestration)
- [See also: Model Metadata](model-metadata)
- [Back: Implementation Overview](extending-current-system)
