---
id: pillar-2-detail
title: "Pillar 2: Dual Representation (Detail)"
models: [opus, haiku]
summary: false
readTime: 15m
---

<!-- model: opus, haiku -->
> **Path:** Home › Three Pillars › Pillar 2 › Detail
> **Validation:** Reviewed by Sonnet ✓

# Pillar 2: Dual Representation (Full Context)

## The Cognitive Science

### Why Dual Representation Works

**Human cognition has limits:**
- Working memory: ~4-7 items
- Processing window: ~100 tokens at a glance
- Reading strategy: Scan → Skim → Drill

**AI cognition is different:**
- Context window: 2000-4000 tokens typical
- Can hold complete systems in mind
- Doesn't need to "scan"

**The solution:** Layer information for human cognition, preserve for AI reasoning.

### The Research

Studies on information architecture show:

1. **Summary-first improves comprehension** (Nielsen Norman)
   - Users scan summary (30 seconds)
   - Decide whether to read full text
   - Comprehension improves 40%+ vs "start with full text"

2. **Progressive disclosure reduces cognitive load** (UX research)
   - Show essential information first
   - Make details available on demand
   - Users engage MORE with supplementary details

3. **Hierarchical information is memorable** (Miller's Law)
   - 7±2 items is cognitive limit
   - Summary gives 5-7 key points
   - Detail provides elaboration per point

## Architecture: Human Layer vs AI Layer

### Human Layer (Summary)

**Purpose:** Decision and action
**Length:** ~30 lines (fits column + screen)
**Time to read:** 30 seconds
**Audience:** User making decisions

**What goes in summary:**
- Core concept (1-2 sentences)
- 3-5 key points
- Why it matters
- Links to details
- Call to action (click for details)

**Example:**
```
# JWT Implementation

Core idea: Stateless session tokens
improve scalability.

Key implementation:
• Generate token on login
• Validate on each request
• Rotate before expiration
• Handle refresh tokens

Why this works: No server state
needed for 1M+ concurrent users.

[See implementation details ↓]
```

### AI Layer (Detail)

**Purpose:** Complete context
**Length:** ~100 lines (full reference)
**Time to read:** 5 minutes deep dive
**Audience:** AI maintaining context, humans wanting full picture

**What goes in detail:**
- Everything in summary
- Complete implementation
- Edge cases
- Rationale for each decision
- Links to related topics
- Code examples
- Diagrams

**Example:**
```
# JWT Implementation (Full)

## Core Concept

JWT (JSON Web Tokens) provides stateless
authentication. Server signs token with
secret; client presents token. No
database lookup needed per request.

## Why Stateless Scales

Traditional sessions: Store session data
in DB/Redis. Each request: 1 DB lookup.
At 1M requests/sec: 1M lookups/sec.

JWT: Validate signature only. No lookup.
At 1M requests/sec: signature checks only.

This difference = 10x lower latency.

## Implementation

Step 1: User logs in
  POST /login { user, pass }
  Backend: Hash password, compare
  If match: Create token
    token = jwt.sign({ userId, email }, SECRET)
    Return: { token, expiresIn: 3600 }

Step 2: User makes request
  Header: Authorization: Bearer {token}
  Middleware: jwt.verify(token, SECRET)
  If valid: Continue request
  If invalid: Return 401

Step 3: Token expiration
  Token contains: exp: 1700000000
  Middleware checks: now > exp?
  If expired: Return 401, user logs in again

## Edge Cases

Token compromise: How to revoke?
  Option A: Blacklist on server (kills "stateless")
  Option B: Accept risk, issue short-lived tokens
  Option C: Add version field, rotate secret
  
Refresh tokens: How to handle?
  Token expires in 1 hour
  Refresh token expires in 30 days
  Client: When token expires, use refresh
  Server: Issue new token using refresh

Multiple services: How to share secret?
  Shared secret: All services have same secret
  Public key: One service signs, others verify
  Key rotation: Update across all services

## Security Checklist

✓ Use strong algorithm (RS256, not HS256 alone)
✓ Secure secret (32+ bytes, random)
✓ Validate signature (always)
✓ Check expiration (always)
✓ Set short expiration (1-24 hours)
✓ Use HTTPS only (prevent token theft)
✓ Refresh tokens separately (prevent reuse)
✓ Clear tokens on logout (client-side)

## Performance Notes

Token validation: ~0.1ms per request
At 1M requests/sec: 100ms CPU time
Signature check: Cryptographic (lightweight)
No database calls: Scaling advantage

## Related Topics

[Token Refresh Strategy](../refresh-tokens)
[Security Best Practices](../jwt-security)
[Multi-Service Setup](../distributed-jwt)
```

## Navigation Between Layers

### User Experience Flow

```
1. User lands on "JWT Implementation"
   (sees summary - 30 lines)
   
2. User reads summary (30 seconds)
   "Core idea: stateless tokens.
    Key points: login, validate, rotate.
    [Click for details]"
   
3. User clicks "See details" link
   (center pane shifts, shows detail document)
   
4. Breadcrumb updates: [home] → [jwt] (detail)
   (user knows: "I'm viewing full context")
   
5. User reads relevant section from detail
   (e.g., "Token Expiration" subsection)
   
6. Detail has link: "See also: Refresh Tokens"
   (user clicks, navigates to new document)
   
7. New document loads (summary view again)
   (breadcrumb: [home] → [refresh-tokens])
   
8. User can click back → returns to JWT detail
   (browser history still works)
```

### Navigation Metadata

Each node tracks:
```javascript
{
  id: "jwt-implementation",
  
  // Layer information
  summary: { content: "...", lines: 30 },
  detail: { content: "...", lines: 95 },
  
  // Navigation context
  currentLayer: "summary",  // or "detail"
  breadcrumb: ["home", "jwt-implementation"],
  
  // Related navigation
  linkedFrom: ["authentication-overview"],
  linkedTo: ["refresh-tokens", "security-practices"],
  linkedDetailOnly: ["jwt-math-proofs"],  // only in detail view
  
  // Indicators
  showDetailLink: true,
  detailLineCount: 95,
}
```

## When NOT to Create Detail Layer

**Not every document needs detail.** Some ideas are simple:

```
✓ CREATE DETAIL for:
  • Complex topics (> 1 idea per sentence)
  • Multi-step processes
  • Tutorials with edge cases
  • Technical specifications
  
❌ SKIP DETAIL for:
  • Simple definitions
  • Single key points
  • List-based content
  • Quick references
```

**Result:** System self-documents whether deeper content exists.

## Writing Strategy

### For Summary
1. Start with ONE core sentence
2. Identify 3-5 key sub-points
3. Answer: "Why should I care?"
4. Link to detail
5. Done (30 lines)

### For Detail
1. Expand each key point (1 → 5 sentences)
2. Add context: "Why this decision?"
3. Include implementation details
4. Show edge cases
5. Link to related topics
6. Done (100 lines)

---
**Related**
- [Next: Pillar 3 Summary](../pillar-3/pillar-3-model-orchestration)
- [See also: Pillar 2 Summary](pillar-2-dual-representation)
- [Back: Home](../../home)
