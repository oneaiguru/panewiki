---
id: home-detail
title: Home Detail - The 3-Column Interface for AI (Full Context)
models: [opus, haiku, sonnet]
summary: false
readTime: 15m
---

<!-- model: opus, haiku, sonnet -->
> **Path:** Home › Home Detail

# The 3-Column Interface for AI (Full Context)

## The Fundamental Problem

Current AI tools generate too much content upfront. You ask for help designing an authentication system. The AI responds with 10,000 tokens. Your brain processes ~100 tokens before deciding what's relevant.

**Result:** You scroll forever, lose context, and ask again.

### Real Example: Code Review Workflow

**Old approach (linear scrolling):**
```
1. AI generates full explanation → 5000 tokens
2. User scrolls through everything  → 20 minutes
3. User still unsure what matters   → Re-asks question
4. Another 5000 tokens              → More scrolling
Total time: 40 minutes, 70% content never read
```

**New approach (3-column interface):**
```
1. Opus summarizes strategy     → 200 tokens, left pane
2. Haiku illustrates examples   → 3000 tokens, center pane (parallel)
3. Sonnet validates quality     → 500 tokens, right pane
User scans left (30 sec) → Reads center (5 min) → Checks right (2 min)
Total time: 10 minutes, 90% content engaged
```

**The difference:** Structure beats volume.

## The Complete Solution: Three Core Ideas

### 1. Column Output Format (400px Width)

**Newspaper columns work.** 200+ years of print media proved narrow columns improve comprehension.

**Why 400px is optimal:**
- 60-75 characters per line (proven reading speed sweet spot)
- ~30-40 lines per screen (single-glance content)
- Fits mobile, tablet, desktop (responsive by design)

**What happens with wide text:**
- 100+ character lines → Eye strain increases 15%
- Hard to track from end of line back to next line start
- Users skim instead of read
- Comprehension drops

**The science:** Nielsen Norman Group, GOV.UK Design System, and peer-reviewed research (Dyson & Haselgrove, 2001) all converge on 60-75 character optimal line length.

### 2. Dual Representation (Summary + Detail)

Everything exists in TWO layers:

**Human Layer (Summary):**
- 30 lines that fit one screen
- Core concept in 2-3 sentences
- 3-5 key points
- Read time: 30 seconds
- Purpose: Decision making

**AI Layer (Detail):**
- 100 lines with complete context
- Full implementation details
- Edge cases and rationale
- Read time: 5 minutes
- Purpose: Deep understanding

**Why this works:**
Human cognition processes hierarchically. We scan → skim → drill. Dual representation matches how brains work.

**Navigation pattern:**
```
User lands on summary
  ↓
Reads 30 lines (30 seconds)
  ↓
Clicks "See details" if relevant
  ↓
Center pane expands to show detail
  ↓
User reads specific sections
  ↓
Links to related topics
```

### 3. Model Orchestration (Three Models, Three Roles)

**Modern LLM pricing creates opportunity:**

| Model | Input Cost | Output Cost | Role |
|-------|-----------|-------------|------|
| Haiku 4.5 | $1 / M | $5 / M | Execution (cheap, parallel) |
| Sonnet 4.5 | $3 / M | $15 / M | Validation (moderate, reliable) |
| Opus 4.1 | $15 / M | $75 / M | Strategy (expensive, best reasoning) |

**The insight:** Not all AI work needs Opus-level reasoning.

**Three distinct roles:**

**OPUS: Strategic Thinking**
- Identifies core components
- Makes architectural decisions
- Output: 150-300 tokens (essence only)
- Cost: $0.003 - $0.006 per call

**HAIKU: Parallel Execution**
- Generates working examples
- Creates consistent patterns
- Runs multiple calls simultaneously
- Cost: $0.001 - $0.005 per call
- 4 parallel Haiku calls = same time as 1 call

**SONNET: Validation & Synthesis**
- Reviews all outputs for correctness
- Identifies gaps and inconsistencies
- Synthesizes into coherent feedback
- Cost: $0.0015 - $0.008 per call

## Real-World Example: Complete Walkthrough

**User query:** "Design authentication system for a social network"

### Step 1: Opus Strategic Thinking (2 seconds)

**Prompt to Opus:**
```
User wants authentication for social network.
Output: Core components + instructions for Haiku (max 30 lines).
```

**Opus response** (200 tokens, $0.003):
```
# Authentication System

Core idea: Stateless JWT tokens eliminate server sessions,
scale to millions of concurrent users.

Three components needed:
1. User model (identity + credentials storage)
2. JWT middleware (stateless token validation)
3. Rate limiting (prevent brute-force attacks)

Instructions for Haiku:
- Component 1: Show user schema + signup flow
- Component 2: Show JWT generation + validation middleware
- Component 3: Show rate limit implementation with 5 req/min
```

### Step 2: Haiku Parallel Execution (3 seconds total)

**Three parallel Haiku calls** (each gets Opus output + specific instruction):

**Haiku Call 1** (1000 tokens, $0.005):
```typescript
// User model with bcrypt hashing
const userSchema = new Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  createdAt: Date
});

async function signup(email, password) {
  const hash = await bcrypt.hash(password, 10);
  return User.create({ email, passwordHash: hash });
}
```

**Haiku Call 2** (1000 tokens, $0.005):
```typescript
// JWT middleware with RS256
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_PUBLIC_KEY,
                          { algorithms: ['RS256'] });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Haiku Call 3** (1000 tokens, $0.005):
```typescript
// Rate limiting with express-rate-limit
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  message: 'Too many login attempts'
});

app.post('/login', loginLimiter, async (req, res) => {
  // Login logic here
});
```

**Total Haiku cost:** $0.015 (3 calls × $0.005)

### Step 3: Sonnet Validation (2 seconds)

**Prompt to Sonnet:**
```
Opus strategy: [full Opus output]
Haiku implementations: [all 3 Haiku outputs]

Validate: Do implementations match strategy? Any security gaps?
```

**Sonnet response** (500 tokens, $0.0075):
```
# Validation Results

## Implementation Checks
✓ User model: Correct bcrypt usage (10 rounds appropriate)
✓ JWT middleware: Proper RS256 + public key verification
✓ Rate limiting: 5 req/min prevents brute-force

## Security Gaps Found
⚠ Missing: Token expiration not shown in example
⚠ Missing: Refresh token rotation pattern
⚠ Missing: Logout handler (client-side only won't blacklist)

## Recommendations
1. Add `expiresIn: '1h'` to JWT signing
2. Implement refresh token with 30-day expiration
3. Consider token versioning for revocation

## Overall Quality: 85/100
Ready for development with noted improvements.
```

### Total Cost Breakdown

```
Opus strategy:      200 tokens  × $0.015/1K = $0.003
Haiku examples:     3000 tokens × $0.005/1K = $0.015
Sonnet validation:  500 tokens  × $0.015/1K = $0.0075
────────────────────────────────────────────
TOTAL: $0.0255

VS All-Opus approach:
4500 tokens × $0.015/1K = $0.0675

Savings: 62% cheaper + better quality (parallel + validation)
```

## Why This Becomes a Product Paradigm

### 1. Educational Interface

Users don't just GET answers—they LEARN optimal AI usage:
- See which model generated what (transparency)
- Understand cost implications (Opus vs Haiku pricing visible)
- Learn when to use which model
- Develop intuition for AI orchestration

### 2. Cost Transparency

Every response shows:
- Token count per model
- Cost per model
- Total cost
- Savings vs naive approach

**Result:** Teams optimize naturally because costs are visible.

### 3. Quality Assurance Built-In

Sonnet validation catches:
- Security vulnerabilities
- Logic errors
- Missing edge cases
- Inconsistencies across Haiku outputs

**Result:** Higher quality output than single-model approach.

### 4. Team Learning Tool

When teams use this interface:
- Junior developers see Opus architectural thinking
- Mid-level developers study Haiku implementation patterns
- Senior developers review Sonnet's validation criteria
- Everyone learns from multi-model collaboration

## Getting Started

### For Users (5 minutes)
1. Read [Vision Overview](vision/vision) - Why this matters
2. Try [Code Review Use Case](use-cases/code-review) - See it in action
3. Explore the three pillars below

### For Developers (45 minutes)
1. Study [Data Model](architecture/data-model) - Node structure
2. Review [Implementation Guide](implementation/extending-current-system) - Integration
3. Copy [Prompt Patterns](implementation/prompt-patterns) - Ready-to-use prompts
4. Check [Token Economics](architecture/token-economics) - Cost calculations

### For AI Researchers (90 minutes)
1. Deep dive: [Pillar 1 Detail](three-pillars/pillar-1/pillar-1-detail) - Column science
2. Deep dive: [Pillar 2 Detail](three-pillars/pillar-2/pillar-2-detail) - Dual representation
3. Deep dive: [Pillar 3 Detail](three-pillars/pillar-3/pillar-3-detail) - Model orchestration
4. Study [Information Flow](architecture/information-flow) - Complete system

## The Three Pillars

**Pillar 1: Column Output Format**
- [Summary](three-pillars/pillar-1/pillar-1-column-output) (5 min)
- [Detail](three-pillars/pillar-1/pillar-1-detail) (15 min)
- [Math Proof](three-pillars/pillar-1/400px-width-math) (10 min)

**Pillar 2: Dual Representation**
- [Summary](three-pillars/pillar-2/pillar-2-dual-representation) (5 min)
- [Detail](three-pillars/pillar-2/pillar-2-detail) (15 min)

**Pillar 3: Model Orchestration**
- [Summary](three-pillars/pillar-3/pillar-3-model-orchestration) (5 min)
- [Detail](three-pillars/pillar-3/pillar-3-detail) (20 min)

---

**Next Steps:** [Vision Overview](vision/vision) | **Learn Pillars:** [Column Format](three-pillars/pillar-1/pillar-1-column-output) | [Dual Representation](three-pillars/pillar-2/pillar-2-dual-representation) | [Model Orchestration](three-pillars/pillar-3/pillar-3-model-orchestration) | **Try Example:** [Code Review Use Case](use-cases/code-review)
