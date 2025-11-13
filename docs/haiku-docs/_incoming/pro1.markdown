**Yes.** Focused fixes below—concise, copy‑pasteable, and ready to drop into the repo.

------

## 1) `data-model.md` — cost calculation bug

- **Buggy line (exact):**
   `total: totalTokens * avgRate`  
- **Correction (TypeScript):** Use explicit per‑model pricing and sum USD; don’t invent an average.

```ts
// pricing.ts
export const PRICING = {
  OPUS_PER_TOKEN_USD:   15 / 1_000_000,
  HAIKU_PER_TOKEN_USD:  0.80 / 1_000_000,
  SONNET_PER_TOKEN_USD: 3 / 1_000_000,
} as const;
// cost.ts
import { PRICING } from './pricing';

type NodeCost = {
  tokens: { opus: number; haiku: number; sonnet: number; total: number };
  usd:    { opus: number; haiku: number; sonnet: number; total: number };
};

export function calculateNodeCost(node: NavigableNode): NodeCost {
  const opusT   = node.modelMetadata.opus?.tokens   ?? 0;
  const haikuT  = (node.modelMetadata.haiku?.tokens ?? 0) * (node.canParallelize ?? 1);
  const sonnetT = node.modelMetadata.sonnet?.tokens ?? 0;

  const opusUSD   = opusT   * PRICING.OPUS_PER_TOKEN_USD;
  const haikuUSD  = haikuT  * PRICING.HAIKU_PER_TOKEN_USD;
  const sonnetUSD = sonnetT * PRICING.SONNET_PER_TOKEN_USD;

  return {
    tokens: { opus: opusT, haiku: haikuT, sonnet: sonnetT, total: opusT + haikuT + sonnetT },
    usd:    { opus: opusUSD, haiku: haikuUSD, sonnet: sonnetUSD, total: opusUSD + haikuUSD + sonnetUSD }
  };
}
```

> Rates align with **Token Economics**: Opus $15/M, Haiku $0.80/M, Sonnet $3/M. 

------

## 2) `information-flow.md` — error paths & retries

Add these branches and the decision tree.

**A. Parallel Haiku with timeouts and partials**

```
Opus (200 tok)
     │
     ▼
Dispatch N Haiku jobs ────────────────────────────────────────────┐
     │                                                            │
     ├─ Haiku#1 → ✅ done <30s                                    │
     ├─ Haiku#2 → ⏳ >30s → RETRY(1, backoff 1.5×) → ✅/❌         │
     └─ Haiku#3 → ❌ hard error → mark FAILED                     │
                                                                 │
Aggregate results:
- If all ✅ → proceed to Sonnet
- If some ❌/⏳ → show PARTIAL (e.g., 2/3 ready) + "Retry failed"
```

**B. Sonnet validation failure path**

```
Sonnet validate (500 tok)
        │
        ├─ PASS → ship summary/detail
        └─ FAIL → classify:
               • CRITICAL → block; show issues; offer "Auto-fix (re-run Haiku)"
               • WARN     → show issues; allow user to proceed
```

**C. Retry logic (decision tree)**

```
Start
 │
 ├─ Haiku timeout (>30s)?
 │     └─ Yes → Retry once (1.5× backoff) → still failing?
 │             └─ Yes → mark FAILED; continue with partials; expose "Retry failed"
 │
 ├─ Partial results (k/N)?
 │     └─ Yes → render partial UI badges + toast "k/N ready"; user can continue or retry
 │
 └─ Sonnet FAIL?
       └─ Yes → If CRITICAL → block + suggest targeted Haiku re-runs
                 If WARN → display issues + allow proceed
```

------

## 3) `pillar-1-detail.md` — citations (references section)

Append this **References** section (exact URLs):

```md
## References

- Nielsen Norman Group — *F‑Shaped Pattern for Reading Web Content* (eyetracking evidence for scanning/shorter lines improving consumption). https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/  

- Government Digital Service (GOV.UK) — *Avoid long lines of copy* (“A good rule of thumb is a maximum of 75 characters per line...”). https://designnotes.blog.gov.uk/2014/08/11/avoid-long-lines-of-copy/  

- Dyson, M. C., & Haselgrove, M. (2001). *The influence of reading speed and line length on the reading of text from computer screens.* International Journal of Human‑Computer Studies, 54, 585–612. DOI: https://doi.org/10.1006/ijhc.2001.0458  :contentReference[oaicite:4]{index=4}
```

> Note: NNG does not publish a single numeric “65‑char” rule; their eyetracking research supports scannable, shorter lines. The numeric ranges are supported by GDS guidance and peer‑reviewed work (Dyson & Haselgrove).

------

## 4) `code-review.md` — hardened auth example (≤15 lines)

**Login (rate‑limited) with bcrypt (or argon2) + RS256**

```js
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
```

**JWT verify middleware (RS256 public key, 5 lines)**

```js
export const requireAuth = (req, res, next) => {
  const m = req.headers.authorization?.match(/^Bearer\s+(.+)$/);
  if (!m) return res.status(401).json({ error: 'Unauthorized' });
  try { req.user = jwt.verify(m[1], process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] }); return next(); }
  catch { return res.status(401).json({ error: 'Unauthorized' }); }
};
```

------

## 5) `pillar-1-detail.md` — minimal CSS guidance (≤20 lines)

```css
/* 400px columns */
.viewport { display:flex; gap:16px; align-items:flex-start; }
.column  { width:400px; max-width:100%; }

/* Alternative: readable measure */
.readable { max-width:65ch; }

/* Responsive: 3→2→1 columns */
@media (max-width:1024px){ .column{ flex:1 1 48%; width:auto; } }
@media (max-width:640px) { .viewport{ flex-direction:column; } .column{ width:auto; } }

/* Motion accessibility */
@media (prefers-reduced-motion:reduce){
  *{ scroll-behavior:auto; animation:none; transition:none; }
}
```

------

### Done ✅

- Bug called out and fixed with concrete TS.
- Error‑path diagrams + retry rules added.
- Proper citations added with exact URLs.
- Security example tightened (bcrypt/argon2, rate limit, RS256).
- CSS snippet provided (400px + 65ch + responsive + a11y).