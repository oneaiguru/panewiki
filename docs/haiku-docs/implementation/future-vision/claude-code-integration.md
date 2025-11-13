<!-- model: haiku -->
# Future Vision: Claude Code Integration

## Vision

Claude Code generates code and navigable documentation side-by-side.

## How It Works

### 1. User Command

```bash
claude-code "Build REST API for social network"
```

### 2. Claude Code generates

```
✓ Database schema (migrations)
✓ API endpoints (CRUD)
✓ Authentication
✓ Tests
✓ Documentation (3-pane)
```

### 3. Output Structure

```
project/
├─ src/
│  ├─ routes/
│  ├─ models/
│  └─ middleware/
├─ docs/
│  └─ api-overview.md (with dual layers)
└─ .claude-meta
   └─ generated-docs.json
```

### 4. User sees

**Terminal output:**
```
Generated 12 files
Created documentation: docs/api-overview.md
3-pane viewer: claude-docs viewer docs/
```

**Viewer shows:**
```
Left pane: Why this architecture
Center pane: File summaries
Right pane: Quality checks
```

## Integration Points

1. **Claude Code hook:** After generation
2. **Emit metadata:** Which files, what changed
3. **Call orchestration:** Opus → Haiku → Sonnet
4. **Write docs:** Markdown to project folder
5. **Generate viewer config**

## Benefits

- ✓ Generated code comes with docs
- ✓ Architecture explained
- ✓ Quality verified
- ✓ Easy handoff to team

---

**Related:** [Cursor Integration](cursor-integration.md) | [ChatGPT Plugin](chatgpt-plugin.md)
