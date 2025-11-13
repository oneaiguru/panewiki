<!-- model: sonnet -->
# Token Economics: The Math

## Pricing Reality

```
Claude Opus 4:     $15.00 / 1M tokens
Claude Sonnet 4.5: $3.00  / 1M tokens
Claude Haiku 4.5:  $0.80  / 1M tokens

Cost ratio: Opus is 18.75× more expensive than Haiku
```

## Example 1: Design Authentication System

### Approach A: All-Opus (Naive)

```
1. Opus: Architecture overview      500 tokens
2. Opus: User model code            1000 tokens
3. Opus: Middleware code            1000 tokens
4. Opus: Endpoint examples          1000 tokens
5. Opus: Security review            500 tokens
────────────────────────────────────
Total: 4000 tokens × $15/M = $0.06
```

**Time:** 8 calls × 5 seconds = 40 seconds

### Approach B: Three-Model Orchestration

```
1. Opus: Architecture (200 tokens)           → $0.003
2. Haiku: User model (1000 tokens)           → $0.001
3. Haiku: Middleware (1000 tokens)           → $0.001
4. Haiku: Endpoints (1000 tokens)            → $0.001
5. Sonnet: Security review (500 tokens)      → $0.0015
─────────────────────────────────────────────
Total: ~5700 tokens across models = $0.0075
```

**Cost reduction: 87.5%** ($0.06 → $0.0075)

**Time:** 1 Opus + 3 parallel Haiku + 1 Sonnet = ~15 seconds
(4 parallel calls = speed improvement too!)

## Example 2: Code Review (PR Analysis)

### Approach A: All-Sonnet (Current)

```
User opens PR with 5 files (2000 lines total)

Sonnet: "Analyze all changes" → ~3000 tokens
Result: Summary of changes

Cost: 3000 × $3/M = $0.009
```

**User sees:** Wall of text, hard to prioritize

### Approach B: Orchestrated (New)

```
1. Opus: "Summarize these changes"      200 tokens → $0.003
2. Haiku: "Highlight file 1"           800 tokens → $0.001
3. Haiku: "Highlight file 2"           800 tokens → $0.001
4. Haiku: "Highlight file 3"           800 tokens → $0.001
5. Sonnet: "Validate against standards" 400 tokens → $0.0012
───────────────────────────────────────
Total: ~4000 tokens = $0.0072
```

**Cost reduction: 20%** ($0.009 → $0.0072)

**User experience:** 3 panes, clickable file summaries, validation results

**Time:** Sequential (1) + Parallel (3) + Sequential (1) = ~12 seconds

## Example 3: Research Query (Papers)

### Approach A: Single Opus Call

```
Opus: "Research AI agent patterns"
Request: 5000 tokens (context)
Response: 3000 tokens (answer)
─────────
Total: 8000 tokens × $15/M = $0.12
```

**Result:** One long document, user must read all

### Approach B: Orchestrated

```
1. Opus: "Top 5 patterns"              300 tokens → $0.0045
2. Haiku: "Pattern A summary"          600 tokens → $0.00075
3. Haiku: "Pattern B summary"          600 tokens → $0.00075
4. Haiku: "Pattern C summary"          600 tokens → $0.00075
5. Haiku: "Pattern D summary"          600 tokens → $0.00075
6. Haiku: "Pattern E summary"          600 tokens → $0.00075
7. Sonnet: "Compare patterns"          400 tokens → $0.0012
───────────────────────────────────────
Total: ~4300 tokens = $0.0066
```

**Cost reduction: 94.5%** ($0.12 → $0.0066)

**Result:** Left pane (strategy), Center (summaries), Right (comparison)

## The General Formula

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

**Orchestration not applicable when:**
- User just wants one quick answer
- Conversation is real-time chat
- Single model is appropriate

## Hidden Benefits (Beyond Cost)

### 1. Speed (Parallelization)

```
Sequential: 1 Opus + 3 Haiku calls = 20 seconds
Parallel:   1 Opus + [3 Haiku in parallel] + 1 Sonnet = 12 seconds
            = 40% time improvement
```

### 2. Quality (Multi-pass verification)

```
All-Opus: 1 pass (no verification)
Orchestrated: 3 passes (Opus strategy → Haiku execution → 
               Sonnet validation) = higher quality
```

### 3. Transparency (Model attribution)

```
User learns:
"Opus did strategic thinking ($0.003)"
"Haiku did execution ($0.004)"
"Sonnet did validation ($0.002)"
Total: See exactly where money went
```

### 4. Scalability (Clear bottlenecks)

```
If Opus is slow: Reduce token limit per call
If Haiku is slow: Use smaller models for parallel work
If Sonnet is slow: Cache validation results
System makes optimization visible.
```

---

**Reference:** [Model Orchestration](../three-pillars/pillar-3-model-orchestration) | **See:** [Implementation](extending-current-system)
