---
id: pillar-1-detail
title: Pillar 1 Detail - Column Output Format
models: [haiku]
summary: false
readTime: 6m
---

<!-- model: haiku -->
> **Path:** Home › Three Pillars › Pillar 1 Detail
# Pillar 1: Column Output Format (Full Context)

## Readability Science Behind 400px

### The Line Length Problem

**Wide text reduces comprehension:**
- 100 character lines: eye strain, harder to track
- 60-80 character lines: optimal reading speed
- 40 character lines: too narrow, forces wrapping

**Empirical data:**
- Newspapers: 65-75 characters (proven over 200+ years)
- Web best practice: 50-75 characters (Nielsen Norman Group)
- Typography science: 8-12 words per line (optimal)

**400px column = exactly 60-80 characters** depending on font.

### Why Newspapers Chose This

Newspapers were the first mass-media format optimized for reading comprehension. They discovered (empirically, pre-internet) that narrow columns with wide margins were readable. This wasn't about printer limitations—it was about human cognition.

Modern web design ignored this. Designed for tablets, then realized: "Wait, people actually read better in columns."

Apps like Tofu (macOS reading app) use newspaper-style columns. Result: people read more, retain more, engage longer.

## The 400px Architecture

```
1200px total viewport
├─ 400px left pane (context/strategy)
├─ 400px center pane (examples/code)
├─ 400px right pane (validation/details)
└─ Scrollbar (48px, overlaid)
```

Apply this CSS skeleton to guarantee the columns stay readable:

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

### Why 3×400px?

1. **Fits desktop** (1200px standard width)
2. **Responsive down** (on tablet: 2 panes visible, center + right)
3. **Mobile** (1 pane full width)
4. **Forces discipline** (can't hide clutter in extra space)

## Format Specification

### Headers (Structural)

**Rule 1: 3-5 words, sentence case**
```
✓ "Why Columns Matter"        (3 words)
✓ "Token Economics Overview"  (3 words)
❌ "This is a very long header that explains everything" (too many words)
```

**Why?**
- Scannability (users skim headers first)
- Fits column (doesn't wrap awkwardly)
- Forces clarity (can't hide confusion in verbose headers)

**Hierarchy:**
```
# H1: Main topic (1 per document)
## H2: Major sections (2-3 per document)
### H3: Subsections (used sparingly)
```

### Paragraphs (Content)

**Rule 2: 2-3 sentences maximum**

```
❌ AVOID:
"The authentication system we're implementing involves several
interconnected layers including a user model layer, a middleware
layer for request validation, a JWT token layer for stateless
sessions, and a rate limiting layer for security. Each of these
layers has specific responsibilities that must be carefully
orchestrated to ensure proper functionality."

✓ PREFER:
"Three auth layers form the system:
• User model (identity)
• JWT middleware (validation)
• Rate limiting (security)"
```

**Why?**
- 2-3 sentences = 1 visual "chunk"
- Forces writer to find essential idea
- Readers can process and decide: drill deeper or continue?

### Lists (Organization)

**Rule 3: Bullet points, 3-7 items, short text**

```
✓ Auth needs:
  • User schema (store credentials)
  • JWT middleware (validate requests)
  • Rate limiting (prevent abuse)
  • Error handling (graceful failures)

❌ AVOID:
  • User schema - this is where we store user credentials and all
    related information including profile data, preferences, etc.
  • JWT middleware - a piece of software that validates incoming
    requests by checking for valid JWT tokens in headers...
```

**Why?**
- Bullet points break up text visually
- 5-7 items is cognitive limit for working memory
- Short bullets force clarity

### Code Blocks

**Rule 4: Maximum 15 lines per block**

```typescript
// GOOD: Shows pattern clearly
async function authenticate(req, res) {
  const token = req.headers.authorization;
  if (!validateToken(token)) return res.status(401).send('Invalid');
  req.user = parseToken(token);
  next();
}

// BAD: Too much, doesn't fit column, loses reader
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) throw new Error('Invalid token structure');
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) throw new Error('User inactive');
    req.user = user;
    const auditLog = new AuditLog({ userId: user.id, action: 'login' });
    await auditLog.save();
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: error.message });
  }
}
```

**Why?**
- 15 lines fills ~60% of column vertically
- Readers can see start AND end without scrolling
- Forces focusing on the core pattern, not edge cases

### Diagrams (Visualization)

**Rule 5: ASCII art only, respects column width**

```
✓ Fits column (35-40 characters wide max)
┌───────────────────────────┐
│ Component                 │
└──────────┬────────────────┘
           │
      ┌────┴────┐
      ▼         ▼
  ┌─────┐   ┌─────┐
  │ Sub1│   │ Sub2│
  └─────┘   └─────┘

❌ Doesn't fit column (too wide)
┌─────────────────────────────────────────────────────┐
│ This diagram is wider than 400px and will break the │
│ layout and force horizontal scrolling               │
└─────────────────────────────────────────────────────┘
```

**ASCII tools:**
- Box drawing: ┌ ┐ └ ┘ ─ │
- Arrows: ↓ ↑ ← → ▼ ▲
- Connectors: ├ ┤ ┬ ┴ ┼ ┌ 

## How This Enforces Quality

**The constraint IS the clarification mechanism.**

When forced to write for 400px:
- Can't hide unclear thinking in verbose explanations
- Must prioritize ruthlessly
- Forced to find the essence
- Result: Better writing, clearer thinking

Compare:
```
❌ Verbose (no constraint):
"The system architecture involves multiple interconnected
components that work together to provide authentication services
through various mechanisms including..."

✓ Constrained (400px):
"Three core components:
• Auth model
• JWT validation  
• Rate limiting"
```

The 400px column doesn't just change APPEARANCE—it changes THINKING.

## Integration with Documentation System

This format specification applies to:

1. **Summary documents** (human layer)
   - Follow all rules strictly
   - Make every word count
   - Links to detail

2. **Detail documents** (AI layer)
   - Can be longer (100 lines)
   - Still respects column structure
   - Still uses same heading/list/code rules

3. **All generated content**
   - Whether Opus, Haiku, or Sonnet
   - Whether summary or detail
   - Consistent visual language across system

## References

- Nielsen Norman Group — *F‑Shaped Pattern for Reading Web Content* (eyetracking evidence for scanning/shorter lines improving consumption). https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/  

- Government Digital Service (GOV.UK) — *Avoid long lines of copy* (“A good rule of thumb is a maximum of 75 characters per line...”). https://designnotes.blog.gov.uk/2014/08/11/avoid-long-lines-of-copy/  

- Dyson, M. C., & Haselgrove, M. (2001). *The influence of reading speed and line length on the reading of text from computer screens.* International Journal of Human‑Computer Studies, 54, 585–612. DOI: https://doi.org/10.1006/ijhc.2001.0458  :contentReference[oaicite:4]{index=4}

> Note: NNG does not publish a single numeric “65-char” rule; their eyetracking research supports scannable, shorter lines. The numeric ranges are supported by GDS guidance and peer-reviewed work (Dyson & Haselgrove).

---

**Related:** [Column Output Overview](pillar-1-column-output) | [400px Math Details](400px-width-math) | [Pillar 2: Dual Representation](../pillar-2/pillar-2-dual-representation)
