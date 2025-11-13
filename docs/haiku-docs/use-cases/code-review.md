<!-- model: haiku -->
# Use Case: Code Review Workflow

## The Real Problem

GitHub PR: "Add authentication to API" (5 files, 2000 lines)

**Old way:** Read all files sequentially
- 20 min: Understanding what changed
- 10 min: Why it changed
- 10 min: Checking for gaps
- Total: 40 minutes, still confused

**New way:** Orchestrated review

## 3-Pane Code Review In Action

```
┌──────────────┬─────────────────┬──────────────┐
│ OPUS LAYER   │ HAIKU LAYER     │ SONNET LAYER │
│ (Strategy)   │ (Examples)      │ (Validation) │
├──────────────┼─────────────────┼──────────────┤
│ PR adds 3    │ File summaries: │ ✓ Security   │
│ features:    │                 │   checks ok  │
│              │ • user-model.ts │              │
│ • User model │   (50 lines)    │ ✓ JWT flow   │
│ • Auth       │   └ Summary:    │   solid      │
│ • Endpoints  │   Stores user   │              │
│              │   identity      │ ⚠ Missing:   │
│ Why:         │                 │ • Rate limit │
│ Stateless    │ • auth.ts       │   (line 45)  │
│ scales to    │   (80 lines)    │ • Logout     │
│ 1M concurrent│   └ Summary:    │   handler    │
│ users        │   Validates JWT │              │
│              │   tokens        │ Suggested    │
│ Time: 30 sec │                 │ fixes:       │
│              │ • routes.ts     │ [Copy fix]   │
│              │   (120 lines)   │ [Apply fix]  │
│              │   └ Summary:    │              │
│              │   Auth handlers │ Time: 2 min  │
│              │                 │              │
│              │ Time: 5 min     │              │
│              │ (just read all) │              │
└──────────────┴─────────────────┴──────────────┘
```

## Real Code Flow

### Before PR (What Needs Changing)

```javascript
// Current endpoints - NO auth
app.get('/users', (req, res) => {
  const users = db.query('SELECT * FROM users');
  res.json(users);  // Anyone can access!
});

app.post('/posts', (req, res) => {
  const post = db.create(req.body);
  res.json(post);   // Anyone can post!
});
```

### After PR (Orchestrated Solution)

```javascript
// OPUS: "Add auth at 3 layers"
// HAIKU-1: Implement user model
const userSchema = new Schema({
  id: UUID,
  email: String,
  passwordHash: String,
  createdAt: Date
});

// HAIKU-2: Harden auth surface
// /login: 5 req/min, bcrypt verify, RS256 sign (≤15 lines)
import rateLimit from 'express-rate-limit'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
export const loginLimiter = rateLimit({ windowMs: 60_000, max: 5 });            // rate limit
app.post('/login', loginLimiter, async (req, res) => {                           // 1
  const { email, password } = req.body;                                          // 2
  const user = await Users.findOne({ email }).lean();                            // 3
  if (!user || !(await bcrypt.compare(password, user.hash)))                     // 4
    return res.status(401).json({ error: 'Unauthorized' });                      // 5
  const key = process.env.JWT_PRIVATE_KEY;                                       // 6
  const token = jwt.sign({ sub: user._id, org: user.orgId }, key,                // 7
                         { algorithm: 'RS256', expiresIn: '1h' });               // 8
  return res.json({ token });                                                    // 9
});                                                                              // 10
// Tip: swap to argon2 by using `import { verify } from 'argon2'` & `await verify(user.hash, password)`

export const requireAuth = (req, res, next) => {
  const m = req.headers.authorization?.match(/^Bearer\s+(.+)$/);
  if (!m) return res.status(401).json({ error: 'Unauthorized' });
  try { req.user = jwt.verify(m[1], process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] }); return next(); }
  catch { return res.status(401).json({ error: 'Unauthorized' }); }
};

// HAIKU-3: Apply to routes
app.get('/users', requireAuth, (req, res) => {
  const users = db.query(
    'SELECT * FROM users WHERE org = ?',
    [req.user.orgId]
  );
  res.json(users);  // Only authenticated users see data
});
```

## The Workflow

### 1. User Opens PR (See Opus Layer)

Left pane shows 30-second strategy:
```
"This PR adds authentication. 
Three components:
• User model (identity)
• JWT middleware (validation)
• Route protection (enforcement)

Why: Stateless auth scales to 1M+ concurrent.

See details →"
```

**User time:** 30 seconds, understands direction

### 2. User Reviews Center Pane (Haiku Examples)

Click each file:
```
user-model.ts (50 lines)
────────────────
Stores user identity:
• Email + password hash
• Created timestamp
• Organization link

[See full code →]

auth.ts (80 lines)
────────────────
Validates JWT tokens:
• Extracts from Authorization header
• Verifies signature
• Attaches user to request

[See full code →]

routes.ts (120 lines)
────────────────
Applies middleware:
• GET /users: Requires auth
• POST /posts: Requires auth
• POST /login: No auth (entry point)

[See full code →]
```

**User time:** 5 minutes scanning, decides which to read fully

### 3. User Checks Right Pane (Sonnet Validation)

```
VALIDATION RESULTS

✓ User model structure correct
  └ Matches database schema

✓ JWT flow secure
  └ Signature verified on each request

⚠ Rate limiting missing
  └ Malicious user could brute-force login
  └ Fix: Add 5-request/minute limit (line 45)

✗ Logout handler absent
  └ Tokens never expire server-side
  └ Fix: Add token blacklist or use refresh-only pattern

SECURITY SCORE: 75/100
READY FOR MERGE: No (2 critical gaps)

Suggested next steps:
1. [Apply rate limiting fix]
2. [Add logout handler]
3. [Re-run validation]
```

**User time:** 2 minutes for validation + decision

## Cost & Time Breakdown

### Time Savings

```
OLD CODE REVIEW:
1. Read all 5 files:       20 minutes
2. Understand strategy:    10 minutes
3. Check for gaps:         10 minutes
──────────────────────────
Total:                     40 minutes

NEW 3-PANE REVIEW:
1. Read Opus strategy:     30 seconds
2. Skim Haiku summaries:   5 minutes
3. Review Sonnet checks:   2 minutes
4. Deep dive gaps (as needed): 3 minutes
──────────────────────────
Total:                     10.5 minutes (74% faster)
```

### Cost Savings (API Usage)

```
OLD: Sonnet analyzes all 2000 lines
     2000 tokens × $3/M = $0.006

NEW: Opus strategy (200 tokens)
     Haiku summaries (3000 tokens parallel)
     Sonnet validation (500 tokens)
     ─────────────────
     Total: ~$0.0065 (9% cheaper, but far better UX)
```

## Why This Matters For Teams

✓ **Reviewers spend 74% less time** → more PRs reviewed daily
✓ **Consistent quality checks** → Sonnet catches gaps humans miss
✓ **Transparency** → Author sees exactly what was checked
✓ **Education** → Team learns optimal code patterns
✓ **Faster feedback** → Authors get results in 2 minutes not 2 hours

---

**Compare with:** [Research Workflow](research) | **Learn:** [Model Orchestration](../three-pillars/pillar-3-model-orchestration) | **See:** [Token Economics](../architecture/token-economics)
