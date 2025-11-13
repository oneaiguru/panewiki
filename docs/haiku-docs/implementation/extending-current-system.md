---
id: implementation-extending-system
title: "Implementation: Extending Current System"
models: [sonnet]
summary: false
readTime: 6m
---

<!-- model: sonnet -->
> **Path:** Home › Implementation › Extending System
> **Validation:** Reviewed by Sonnet ✓

# Implementation: Extending Current System

## The Data Model Extension

Current node:
```javascript
{
  id: "auth-flow",
  title: "Authentication Flow",
  content: "..."
}
```

Extended node (NEW):
```javascript
{
  id: "auth-flow",
  title: "Authentication Flow",
  
  // NEW: Dual representation
  summary: "30 lines, human layer",
  detail: "100 lines, AI context",
  
  // NEW: Model identity
  modelSource: "haiku",
  modelMetadata: {
    opus: { prompt: "...", tokens: 200 },
    haiku: { prompt: "...", tokens: 1000 },
    sonnet: { prompt: "...", tokens: 500 }
  },
  
  // Navigation
  linkedFrom: ["security"],
  linkedTo: ["jwt-tokens", "session-management"],
  linkedDetailOnly: ["cryptographic-proofs"]
}
```

## Integration Points

1. **Render layer:** Show summary by default, "See details" expands
2. **API layer:** Store both summary and detail
3. **Navigation:** Track breadcrumb and link graph
4. **Cost tracking:** Log tokens per model per document

---
**Related**
- [Next: Markdown Conventions](markdown-conventions)
- [See also: Data Model](../architecture/data-model)
- [Back: Home](../home)
