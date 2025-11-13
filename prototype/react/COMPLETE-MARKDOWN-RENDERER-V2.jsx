import React from 'react';

const MAX_INLINE_DEPTH = 20;

const SAMPLE_CONTENT = `# Home (Staged Writing Plan)

This renderer intentionally excludes strikethrough, images, block quotes, and numbered lists in V1.

## Code Blocks

\`\`\`
function hello() {
  console.log("world");
}
\`\`\`

- Bullet list item
- Another item

This paragraph contains **bold**, *italic*, and \`inline code\`. Links such as [Mock Data](mock-data-template) are rendered as static text; navigation relies on the Related links list.
`;

export default function CompleteMarkdownRenderer({
  content = SAMPLE_CONTENT,
  onClickLink,
  linkMode = 'text',
} = {}) {
  const keyGen = createKeyGenerator();
  return (
    <div style={styles.wrapper}>
      {renderMarkdown(content, { keyGen, onClickLink, linkMode })}
    </div>
  );
}

function createKeyGenerator() {
  let counter = 0;
  return (prefix = 'k') => `${prefix}-${counter++}`;
}

function renderMarkdown(content, options = {}) {
  const keyGen = options.keyGen || createKeyGenerator();
  const ctx = {
    onClickLink: options.onClickLink,
    linkMode: options.linkMode || 'text',
    keyGen,
  };

  const lines = (content ?? '').split('\n');
  const elements = [];
  let inFence = false;
  let fenceBuffer = [];
  let inList = false;
  let listItems = [];

  const flushList = () => {
    if (!inList || !listItems.length) return;
    const listKey = keyGen('ul');
    elements.push(
      <ul key={listKey} style={styles.list}>
        {listItems.map((text, idx) => (
          <li key={`${listKey}-li-${idx}`}>{renderInline(text, ctx)}</li>
        ))}
      </ul>
    );
    inList = false;
    listItems = [];
  };

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (inFence) {
        elements.push(
          <pre key={keyGen('pre')} style={styles.codeBlock}>
            <code>{fenceBuffer.join('\n')}</code>
          </pre>
        );
        fenceBuffer = [];
      }
      inFence = !inFence;
      flushList();
      return;
    }

    if (inFence) {
      fenceBuffer.push(line);
      return;
    }

    if (!line.trim()) {
      if (!inList) {
        elements.push(<div key={keyGen('spacer')} style={styles.spacer} />);
      }
      return;
    }

    if (line.startsWith('- ')) {
      if (!inList) inList = true;
      listItems.push(line.slice(2));
      return;
    }

    flushList();

    if (line.startsWith('# ')) {
      elements.push(<h1 key={keyGen('h1')}>{line.slice(2)}</h1>);
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={keyGen('h2')}>{line.slice(3)}</h2>);
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={keyGen('h3')}>{line.slice(4)}</h3>);
      return;
    }
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={keyGen('h4')}>{line.slice(5)}</h4>);
      return;
    }

    elements.push(
      <p key={keyGen('p')} style={styles.paragraph}>
        {renderInline(line, ctx)}
      </p>
    );
  });

  flushList();
  if (inFence && fenceBuffer.length) {
    elements.push(
      <pre key={keyGen('pre-end')} style={styles.codeBlock}>
        <code>{fenceBuffer.join('\n')}</code>
      </pre>
    );
  }

  return elements;
}

function renderInline(text, ctx, depth = 0) {
  const { onClickLink, linkMode, keyGen } = ctx;
  if (depth > MAX_INLINE_DEPTH) {
    return <span key={keyGen('overflow')}>…</span>;
  }

  const parts = [];
  let remaining = text ?? '';

  while (remaining.length) {
    // Inline code
    {
      const match = remaining.match(/^`([^`]+)`/);
      if (match) {
        parts.push(
          <code key={keyGen('code')}>{match[1]}</code>
        );
        remaining = remaining.slice(match[0].length);
        continue;
      }
    }

    // Bold
    {
      const match = remaining.match(/^\*\*([\s\S]+?)\*\*/);
      if (match) {
        parts.push(
          <strong key={keyGen('bold')}>
            {renderInline(match[1], ctx, depth + 1)}
          </strong>
        );
        remaining = remaining.slice(match[0].length);
        continue;
      }
    }

    // Italic
    {
      const match = remaining.match(/^\*([^*]+)\*/);
      if (match) {
        parts.push(
          <em key={keyGen('italic')}>
            {renderInline(match[1], ctx, depth + 1)}
          </em>
        );
        remaining = remaining.slice(match[0].length);
        continue;
      }
    }

    // Links
    {
      const match = remaining.match(/^\[([^\]\\]+)\]\(([^)\s]+)\)/);
      if (match) {
        const [, label, target] = match;
        if (linkMode === 'interactive' && typeof onClickLink === 'function') {
          parts.push(
            <button
              key={keyGen('link')}
              onClick={() => onClickLink(target)}
              style={styles.inlineLink}
              type="button"
            >
              {label}
            </button>
          );
        } else {
          parts.push(
            <span key={keyGen('link-text')} style={styles.inlineLinkText}>
              {label}
            </span>
          );
        }
        remaining = remaining.slice(match[0].length);
        continue;
      }
    }

    const nextSpecial = remaining.search(/(\*\*|\*|`|\[)/);
    if (nextSpecial === -1) {
      parts.push(<span key={keyGen('text')}>{remaining}</span>);
      break;
    }

    if (nextSpecial > 0) {
      parts.push(<span key={keyGen('text')}>{remaining.slice(0, nextSpecial)}</span>);
      remaining = remaining.slice(nextSpecial);
    } else {
      parts.push(<span key={keyGen('text')}>{remaining.charAt(0)}</span>);
      remaining = remaining.slice(1);
    }
  }

  return parts;
}

const styles = {
  wrapper: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#444',
  },
  codeBlock: {
    background: '#f5f5f5',
    borderRadius: 8,
    padding: '12px 16px',
    overflowX: 'auto',
  },
  paragraph: {
    margin: '8px 0',
  },
  spacer: {
    height: 8,
  },
  inlineLink: {
    background: 'none',
    border: 'none',
    color: '#1a73e8',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
    font: 'inherit',
  },
  inlineLinkText: {
    color: '#1a73e8',
    textDecoration: 'underline',
  },
  list: {
    margin: '8px 0 8px 20px',
    padding: 0,
  },
};

export { renderMarkdown };
