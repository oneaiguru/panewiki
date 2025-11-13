<!-- model: haiku -->
# Future Vision: ChatGPT Plugin

## Vision

3-column interface as ChatGPT plugin for better content organization.

## How It Works

### 1. User installs plugin

ChatGPT Plugin Store → Search "3-Column Reader"

### 2. User asks question

```
"Explain machine learning with examples"
```

### 3. Plugin activates

```
1. Detects complex topic
2. Routes to Opus → Haiku → Sonnet
3. Receives structured response
4. Renders in 3 panes
```

### 4. User sees

```
Left: ML overview (strategy)
Center: Algorithms with code (examples)
Right: Comparison matrix (validation)
```

## Technical Implementation

### Manifest

```json
{
  "name": "3-Column Reader",
  "version": "1.0",
  "operations": [
    "GET /orchestrate",
    "GET /render-ui"
  ]
}
```

### Flow

```
ChatGPT
  ↓
Plugin receives query
  ↓
POST to /orchestrate
  ↓
Opus + Haiku + Sonnet
  ↓
Response: JSON with 3 layers
  ↓
Plugin renders 3-pane UI
```

## Benefits

- ✓ Works in ChatGPT directly
- ✓ Consistent formatting
- ✓ Better comprehension
- ✓ Transparent model usage
- ✓ Cost tracking built-in

## Pricing Model

- Free: Public documents, shared view
- Pro: Private documents, cost tracking
- Enterprise: Custom styling, API access

---

**Related:** [Cursor Integration](cursor-integration.md) | [Claude Code Integration](claude-code-integration.md)
