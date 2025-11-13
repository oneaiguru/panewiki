<!-- model: opus -->
# Pillar 2: Dual Representation

## The Core Idea

Everything exists in two layers:

```
Summary Layer        Detail Layer
(What you read)    (Full context)
├─ 30 lines       ├─ 100 lines
├─ Key points     ├─ Complete reasoning
├─ Jump-off point ├─ Reference material
└─ 30 seconds     └─ 5 minutes
```

## Why Two Layers?

**Human brain:** Processes ~100 tokens at once
**AI generation:** Works with full 2000-token context
**Mismatch:** Solved by dual representation

## The Navigation Pattern

User reads summary → Clicks "See details" → Center pane expands → Full content visible → Breadcrumb shows (summary→detail)

## Example

**Summary (what you see first):**
```
Auth system needs:
• User model
• JWT middleware
• Rate limiting
```

**Detail (click for full context):**
```
User model: Stores user identity and credentials
JWT middleware: Validates requests using bearer tokens
Rate limiting: Prevents brute force attacks
Security considerations: Token rotation, expiration...
[Full implementation details follow]
```

---

**Learn:** [How Layers Work](pillar-2-detail.md) | **Compare:** [Pillar 1: Columns](../pillar-1/pillar-1-column-output.md) | **Next:** [Pillar 3: Model Orchestration](../pillar-3/pillar-3-model-orchestration.md)
