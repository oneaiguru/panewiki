<!-- model: haiku -->
# Future Vision: Cursor Integration

## Vision

Cursor generates code that automatically creates navigable 3-pane documentation.

## How It Works

### 1. User Command

```
@codebase add-auth-system
```

### 2. Cursor generates code

```
✓ user-model.ts (50 lines)
✓ auth-middleware.ts (80 lines)
✓ auth-routes.ts (120 lines)
✓ types.ts (30 lines)
```

### 3. System creates documentation

```
Opus: Explains architectural choices
Haiku: Generates 4 example files
Sonnet: Validates and creates overview
```

### 4. User sees in 3 panes

```
Left: Why auth was added, architecture
Center: Which files were generated, summaries
Right: Validation results, gaps found
```

## Integration Points

1. **Cursor hook:** After code generation
2. **Call Opus:** "Summarize these changes"
3. **Call Haiku:** "Explain each file"
4. **Call Sonnet:** "Find security gaps"
5. **Render:** 3-pane view in Cursor UI

## Benefits

- ✓ Documentation generated automatically
- ✓ Code changes explained in context
- ✓ Quality checks included
- ✓ Team onboarding faster

---

**Related:** [Claude Code Integration](claude-code-integration.md) | [ChatGPT Plugin](chatgpt-plugin.md)
