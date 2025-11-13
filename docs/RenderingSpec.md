# Markdown Rendering Specification (V1 Prototype)

This document describes the exact rendering behavior for the React prototype (ADR-008). It is distinct from the authoring guidance in `docs/AuthoringConventions.md`.

## Supported Markdown Features

| Feature        | Notes                                                                 |
|----------------|-----------------------------------------------------------------------|
| Headers        | `#`, `##`, `###`, `####`                                              |
| Bold           | `**text**`                                                            |
| Inline code    | `` `code` ``                                                          |
| Bullet list    | Lines starting with `- ` (no nesting yet)                             |
| Fenced blocks  | Triple backticks ``` ``` containing preformatted text                |
| Links          | `[Text](target-id)` where `target-id` is a peer basename (no `.md`)   |

Explicitly **not rendered** in V1: numbered lists, tables, blockquotes, images, strikethrough, nested lists.

## Parsing Rules

1. **Code fences win.** Any text between triple backticks is emitted verbatim and never parsed for links or formatting.
2. **Inline code wins inside text.** Inline code prevents bold/link parsing inside the backticks.
3. **Links are the navigation source of truth.** Every `[text](target-id)` becomes either:
   - a styled span (read-only mode), or
   - a `<button>` that calls `onClickLink(targetId)` if the callback is provided.
4. **Escaping.** Use `\[` and `\]` to render literal brackets; the parser unescapes them.

## Reference Implementation (excerpt)

```javascript
const linkRegex = /\\[([^\\]]+)\\]\\(([^)]+)\\)/g;

function renderMarkdown(content, { onClickLink } = {}) {
  const blocks = splitIntoBlocks(content); // respects fenced code
  return blocks.map(block => block.type === 'code'
    ? <pre key={block.key}>{block.text}</pre>
    : renderParagraph(block.text, onClickLink)
  );
}

function renderParagraph(text, onClickLink) {
  const parts = [];
  let lastIndex = 0;
  for (const match of text.matchAll(linkRegex)) {
    const [full, textLabel, target] = match;
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      typeof onClickLink === 'function'
        ? <button key={`${match.index}-link`}
            onClick={() => onClickLink(target)}
            className="md-link"
          >{textLabel}</button>
        : <span key={`${match.index}-link`} className="md-link">{textLabel}</span>
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <span className="md-inline" key={text}>{parts}</span>;
}
```

See `prototype/react/COMPLETE-MARKDOWN-RENDERER-V2.jsx` for the full implementation wired to `onClickLink`.

## Styling Requirements

Define the following classes in `App.css`:

```css
.md-link {
  color: #1a73e8;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.md-inline code {
  font-family: 'Source Code Pro', monospace;
  background: #f3f3f3;
  padding: 0 4px;
  border-radius: 4px;
}

pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  overflow: auto;
}
```

## Validation

Run the link integrity check (see `docs/LinkIntegrity.md`) before regenerating `docsData.js`. The renderer clamps unknown targets and logs a warning instead of crashing.
