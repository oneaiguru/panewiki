let globalInlineKey = 0;

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

export default function CompleteMarkdownRenderer({ content = SAMPLE_CONTENT } = {}) {
  return (
    <div style={styles.wrapper}>
      {renderMarkdown(content)}
    </div>
  );
}

function renderMarkdown(content) {
  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let listBuffer = [];
  const flushList = (key) => {
    if (!listBuffer.length) return;
    elements.push(
      <ul key={`list-${key}`} style={styles.list}>
        {listBuffer.map((text, idx) => (
          <li key={`li-${key}-${idx}`}>{renderInline(text)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} style={styles.codeBlock}>
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
      }
      inCodeBlock = !inCodeBlock;
      flushList(index);
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (!line.trim()) {
      // Stay in list if currently aggregating list items
      if (!listBuffer.length) {
        elements.push(<div key={`spacer-${index}`} style={styles.spacer} />);
      }
      return;
    }

    if (line.startsWith('# ')) {
      flushList(index);
      elements.push(<h1 key={`h1-${index}`}>{line.slice(2)}</h1>);
      return;
    }
    if (line.startsWith('## ')) {
      flushList(index);
      elements.push(<h2 key={`h2-${index}`}>{line.slice(3)}</h2>);
      return;
    }
    if (line.startsWith('### ')) {
      flushList(index);
      elements.push(<h3 key={`h3-${index}`}>{line.slice(4)}</h3>);
      return;
    }
    if (line.startsWith('#### ')) {
      flushList(index);
      elements.push(<h4 key={`h4-${index}`}>{line.slice(5)}</h4>);
      return;
    }

    if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
      return;
    }

    flushList(index);
    elements.push(
      <p key={`p-${index}`} style={styles.paragraph}>
        {renderInline(line)}
      </p>
    );
  });

  flushList('end');
  return elements;
}

function renderInline(text) {
  const parts = [];
  let remaining = text;

  while (remaining.length) {
    if (remaining.startsWith('**')) {
      const end = remaining.indexOf('**', 2);
      if (end !== -1) {
        const boldText = remaining.slice(2, end);
        parts.push(
          <strong key={`bold-${globalInlineKey++}`}>
            {renderInline(boldText)}
          </strong>
        );
        remaining = remaining.slice(end + 2);
        continue;
      }
    }

    if (remaining.startsWith('*')) {
      const end = remaining.indexOf('*', 1);
      if (end !== -1) {
        const italicText = remaining.slice(1, end);
        parts.push(
          <em key={`italic-${globalInlineKey++}`}>
            {renderInline(italicText)}
          </em>
        );
        remaining = remaining.slice(end + 1);
        continue;
      }
    }

    if (remaining.startsWith('`')) {
      const end = remaining.indexOf('`', 1);
      if (end !== -1) {
        parts.push(
          <code key={`code-${globalInlineKey++}`}>
            {remaining.slice(1, end)}
          </code>
        );
        remaining = remaining.slice(end + 1);
        continue;
      }
    }

    if (remaining.startsWith('[')) {
      const closingBracket = remaining.indexOf(']');
      const openParen = remaining.indexOf('(', closingBracket);
      const closeParen = remaining.indexOf(')', openParen);
      if (
        closingBracket !== -1 &&
        openParen === closingBracket + 1 &&
        closeParen !== -1
      ) {
        parts.push(
          <span key={`link-${globalInlineKey++}`} style={styles.inlineLink}>
            {remaining.slice(1, closingBracket)}
          </span>
        );
        remaining = remaining.slice(closeParen + 1);
        continue;
      }
    }

    const nextSpecial = remaining.search(/(\*\*|`|\[)/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    }

    if (nextSpecial > 0) {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    } else {
      parts.push(remaining[0]);
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
    maxWidth: '100%',
  },
  paragraph: {
    margin: '8px 0',
  },
  spacer: {
    height: 8,
  },
  inlineLink: {
    color: '#1a73e8',
    textDecoration: 'underline',
  },
  list: {
    margin: '8px 0 8px 20px',
  },
};
