<!-- model: opus, sonnet -->
# Pillar 3: Model Orchestration (Full Context)

## The Three-Model Paradigm

Modern LLM pricing creates opportunity for optimization:

```
Claude Opus 4:      $15 / 1M input tokens
Claude Sonnet 4.5:  $3  / 1M input tokens
Claude Haiku 4.5:   $0.80 / 1M input tokens
```

**Not all work is worth Opus-level cost.**

Different tasks need different models:
- Strategic thinking → Opus (slow, expensive, best reasoning)
- Execution/examples → Haiku (fast, cheap, parallel-able)
- Review/synthesis → Sonnet (moderate cost, good reasoning)

## Model Roles Defined

### OPUS: Strategic Thinking Layer

**What Opus is best at:**
- Complex reasoning
- Architectural decisions
- Trade-off analysis
- "What are the key components?"
- "What are the failure modes?"

**What Opus should NOT do:**
- Generate 10 code examples
- Illustrate the same concept 4 times
- Perform repetitive work

**Opus output constraints:**
- 150-300 tokens (forced brevity)
- Must be pure essence
- Must instruct other models on next steps

**Prompt pattern for Opus:**
```markdown
You are the strategic thinking layer.

CONSTRAINT: Output must fit in 400px column (max 30 lines).

Your job: Identify core components and key insights.
Delegate execution to other models.

Output format:
# [Topic]

[2-3 sentence core idea]

## Core Components
- Component A: [what it is]
- Component B: [what it is]
- Component C: [what it is]

## Instructions for Haiku
For each component, create a working example:
- Component A: Show pattern X with code
- Component B: Show pattern Y with diagram
- Component C: Show pattern Z with explanation

User query: ${query}
```

**Example output:**
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

**Cost:** ~$0.003 (200 tokens at $15/M)

### HAIKU: Parallel Execution Layer

**What Haiku is best at:**
- Generating working examples
- Creating consistent code patterns
- Illustrating concepts with code
- Running in parallel
- Fast iteration

**What Haiku should NOT do:**
- Make architectural decisions
- Design system-level trade-offs
- Validate quality (doesn't have context)

**Haiku output constraints:**
- 800-1200 tokens per call
- Practical, working code
- Clear explanation of "why"

**Prompt pattern for Haiku:**
```markdown
You are the execution layer.

Opus provided this strategy: "${opusOutput}"

Your task: Create a working example.

Output format:
# ${componentName}

[2-3 sentence explanation]

\`\`\`typescript
[working code, max 15 lines]
\`\`\`

## Why this works
[2-3 sentences explaining the pattern]

## Integration point
[How this connects to other components]
```

**Key feature: Can run in parallel**

```javascript
const haikuPromises = opusComponents.map(comp => 
  callHaiku(`Create example for ${comp.name}`)
);
const haikuResults = await Promise.all(haikuPromises);
// All 4 components generated simultaneously
```

**Cost:** ~$0.001 per call × 4 calls = $0.004 total
(Cheaper than ONE Opus call because Haiku is 18× cheaper)

### SONNET: Review & Validation Layer

**What Sonnet is best at:**
- Verifying correctness
- Spotting gaps or inconsistencies
- Synthesizing multiple inputs
- Practical trade-off analysis

**What Sonnet should NOT do:**
- Initial ideation (use Opus)
- Generation at scale (use Haiku)
- Deep architectural review (use Opus)

**Sonnet output constraints:**
- 400-600 tokens
- Validation findings
- Synthesis for user

**Prompt pattern for Sonnet:**
```markdown
You are the review layer.

Opus strategy: "${opusOutput}"

Haiku examples:
${haikuOutputs.map(h => `- ${h.name}: ${h.explanation}`).join('\n')}

Your task:
1. Do Haiku examples match Opus intent?
2. Are there security gaps?
3. What's missing?

Output format:
# Validation Summary

## Checks
- Component 1: ✓ / ⚠ / ✗
- Component 2: ✓ / ⚠ / ✗
- Component 3: ✓ / ⚠ / ✗

## Gaps Found
[List any issues]

## Recommended Next Steps
[What should happen next]
```

**Cost:** ~$0.002 (500 tokens at $3/M)

## The Complete Workflow

### Step 1: Orchestration Dispatch

```javascript
async function generateWithOrchestration(userQuery) {
  // Step 1: Strategic thinking
  const opusResponse = await claude('opus-4', opusPrompt(userQuery));
  const opusData = parseJSON(opusResponse);
  
  // opusData = {
  //   essence: "...",
  //   components: ["model", "middleware", "ratelimit"],
  //   instructions: ["show X", "show Y", "show Z"]
  // }
  
  console.log('✓ Opus strategy (200 tokens, $0.003)');
}
```

### Step 2: Parallel Haiku Execution

```javascript
  // Step 2: Parallel illustration
  const haikuPromises = opusData.components.map((comp, i) =>
    claude('haiku-4-5', haikuPrompt(comp, opusData.instructions[i]))
  );
  
  const haikuResults = await Promise.all(haikuPromises);
  // All 4 components generated in parallel
  // Total time: time of 1 call (~2 seconds)
  // vs sequential: 4 calls × 2s = 8 seconds
  
  console.log('✓ Haiku examples (4×1000 tokens, $0.004 total)');
```

### Step 3: Sonnet Synthesis

```javascript
  // Step 3: Validation & synthesis
  const sonnetResponse = await claude(
    'sonnet-4-5',
    sonnetPrompt(opusData, haikuResults)
  );
  const sonnetData = parseJSON(sonnetResponse);
  
  console.log('✓ Sonnet review (500 tokens, $0.002)');
  
  // Total cost breakdown:
  // Opus:   $0.003 (3%)
  // Haiku:  $0.004 (21%)
  // Sonnet: $0.002 (11%)
  // Other:  ~$0.010 (65% - prompt formatting, system messages)
  // TOTAL:  ~$0.019
  
  // VS: All-Opus approach:
  // 10 Opus calls = $0.15 (8× more expensive)
  
  return {
    strategy: opusData.essence,         // Left pane
    examples: haikuResults,             // Center pane
    validation: sonnetData.checks,      // Right pane
    cost: '$0.019'
  };
}
```

## Token Economics in Detail

### Cost Comparison: Design System API

**Scenario:** User asks "Design REST API for social network"

#### Approach 1: All-Opus (Naive)

```
1. Opus generates architecture    → 500 tokens
2. Opus generates example schema  → 1000 tokens
3. Opus generates example queries → 1000 tokens
4. Opus generates error handling  → 800 tokens
5. Opus generates validation      → 700 tokens

Total: 4000 tokens × $15/M = $0.06
```

#### Approach 2: Three-Model Orchestration

```
1. Opus generates architecture    → 200 tokens × $15/M = $0.003
2. Haiku generates schema         → 1000 tokens × $0.80/M = $0.001
3. Haiku generates queries        → 1000 tokens × $0.80/M = $0.001
4. Haiku generates errors         → 1000 tokens × $0.80/M = $0.001
5. Sonnet validates all           → 500 tokens × $3/M = $0.0015

Total: ~$0.0075
Cost reduction: 87.5% (!)
```

### Why the Reduction Works

1. **Opus thinks once** (expensive, brief)
   - Instead of: generating examples 4 times

2. **Haiku executes in parallel** (cheap, parallel)
   - Instead of: sequential Opus calls

3. **Sonnet validates** (moderate cost, catches issues)
   - Instead of: user catching errors in all-Opus output

4. **Information compression**
   - Opus output: 200 tokens (essence)
   - Haiku input: Uses same 200 token essence
   - Result: Haiku generates 4× more content for 20% cost

## Displaying Model Origin in Interface

**User needs to see: Who generated what?**

```
Left pane (Strategy):
┌──────────────────────┐
│ <!-- model: opus --> │ ← User sees this
│                      │
│ # REST API Design    │
│                      │
│ Three core layers... │
└──────────────────────┘

Center pane (Examples):
┌──────────────────────┐
│ <!-- model: haiku --> │ ← "Illustrated by Haiku"
│                      │
│ Schema Example       │
│ [code block]         │
└──────────────────────┘

Right pane (Review):
┌──────────────────────┐
│ <!-- model: sonnet -->│ ← "Reviewed by Sonnet"
│                      │
│ ✓ Schema solid      │
│ ⚠ Error handling... │
└──────────────────────┘
```

**Benefits:**
- Transparency (users learn which model to trust for what)
- Educational (teaching people optimal AI usage)
- Accountability (clear attribution)

---

**See also:** [Token Economics Deep Dive](../architecture/token-economics) | [Implementation Patterns](../implementation/model-metadata) | **Back:** [Home](../../home)
