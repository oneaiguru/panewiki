---
id: implementation-markdown-conventions
title: "Markdown Conventions"
models: [haiku]
summary: true
readTime: 4m
---

<!-- model: haiku -->
> **Path:** Home › Implementation › Conventions
> **Validation:** Reviewed by Sonnet ✓

# Markdown Conventions

## Model Attribution

Every document must show which model created it:

```markdown
<!-- model: opus -->
# Topic

<!-- model: haiku -->
# Topic

<!-- model: opus, haiku -->
# Combined Output
```

## Header Style

**Rule:** 3-5 words, sentence case

```markdown
✓ # Authentication Overview
✓ ## Why This Matters
✗ # This is a very long header that explains everything
```

## Link Patterns

**Summary → Detail:**
```markdown
[See details](auth-flow-detail)
```

**Navigate to sibling:**
```markdown
[Explore](../jwt-tokens)
```

**Cross-reference:**
```markdown
[Learn more](../../architecture/data-model)
```

## Metadata

Use frontmatter for dual docs:

```markdown
---
id: auth-flow
models: [opus, haiku]
summary: true
detail: auth-flow-detail
cost: $0.019
readTime: 5m
---
```

## Code Blocks

Max 15 lines per block:

```typescript
// GOOD: Fits column
const auth = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('No token');
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch { res.status(401).send('Invalid'); }
};
```

## Lists

Use bullets, max 7 items:

```markdown
Core components:
• User schema
• JWT middleware
• Rate limiting
• Session handler
• Token rotation
```

---
**Related**
- [Next: Model Metadata](model-metadata)
- [See also: Prompt Patterns](prompt-patterns)
- [Back: Implementation Overview](extending-current-system)
