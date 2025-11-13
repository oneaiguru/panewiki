export default function CompleteMarkdownRenderer() {
  // Sample content exercising the supported subset for V1
  const content = `# Main Header

This is regular text with **bold** and *italic* and ***bold italic***.

## Second Level Header

You can have inline code like \`const x = 5\` in your text.

This renderer intentionally excludes strikethrough, images, block quotes, and numbered lists in V1.

### Third Level Header

And you can have links like this link in your text.

### Third-Level Only (No H4+)

## Code Blocks

Here's a code block:

\`\`\`
function hello() {
  console.log("world");
}
\`\`\`

## Lists

Bullet list:
- First item
- Second item
- Third item

Numbered lists and block quotes are not rendered specially in V1.

## Mixed Content

A paragraph with **bold**, *italic*, \`code\`, and a link [Go Home](ADR-009 Home Position Navigation) shown as blue underlined text.

Another paragraph noting exclusions.

> Quote with **emphasis**
`;

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      fontSize: '14px',
      lineHeight: '1.6',
      backgroundColor: '#fff',
      color: '#333',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <MarkdownRenderer content={content} />
    </div>
  );
}

// V1 subset: headers (#, ##, ###), bold (**), inline code (`), bullet lists (- item),
// fenced code blocks (```), and links displayed as blue underlined text
// (not clickable in V1; navigation wiring comes in a later step).
function MarkdownRenderer({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      elements.push(<div key={i} style={{ height: '8px' }} />);
      i++;
      continue;
    }

    // Headers (H1–H3 only)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      elements.push(
        <div key={i} style={getHeaderStyle(1)}>
          {renderInline(line.substring(2))}
        </div>
      );
      i++;
    } else if (line.startsWith('## ') && !line.startsWith('### ')) {
      elements.push(
        <div key={i} style={getHeaderStyle(2)}>
          {renderInline(line.substring(3))}
        </div>
      );
      i++;
    } else if (line.startsWith('### ') && !line.startsWith('#### ')) {
      elements.push(
        <div key={i} style={getHeaderStyle(3)}>
          {renderInline(line.substring(4))}
        </div>
      );
      i++;
    }
    // Code block
    else if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} style={{
          backgroundColor: '#f5f5f5',
          padding: '12px',
          margin: '12px 0',
          color: '#000',
          whiteSpace: 'pre',
          overflow: 'auto'
        }}>
          {codeLines.join('\n')}
        </div>
      );
      i++;
    }
    // Block quotes excluded in V1 (fall through to paragraph)
    // Bullet list
    else if (line.startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].substring(2));
        i++;
      }
      elements.push(
        <div key={i} style={{ margin: '12px 0' }}>
          {listItems.map((item, idx) => (
            <div key={idx} style={{ paddingLeft: '20px', color: '#808080' }}>
              - {renderInline(item)}
            </div>
          ))}
        </div>
      );
    }
    // Numbered lists excluded in V1 (fall through to paragraph)
    // Regular paragraph
    else {
      elements.push(
        <div key={i} style={{ color: '#808080', margin: '12px 0' }}>
          {renderInline(line)}
        </div>
      );
      i++;
    }
  }

  return <div>{elements}</div>;
}

function getHeaderStyle(level) {
  const colors = ['#000000', '#333333', '#666666'];
  return {
    color: colors[level - 1],
    fontWeight: 'bold',
    margin: '16px 0 8px 0'
  };
}

function renderInline(text) {
  const parts = [];
  let lastIndex = 0;

  // Pattern: **bold**, *italic*, `code`, [text](target)
  // Excludes: strikethrough, images (V1)
  const combinedRegex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^\)]+)\)/g;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Bold
    if (match[1]) {
      parts.push(
        <span key={`b-${match.index}`} style={{ fontWeight: 'bold' }}>
          {match[1]}
        </span>
      );
    }
    // Italic
    else if (match[2]) {
      parts.push(
        <span key={`i-${match.index}`} style={{ fontStyle: 'italic' }}>
          {match[2]}
        </span>
      );
    }
    // Inline code
    else if (match[3]) {
      parts.push(
        <span key={`c-${match.index}`} style={{ color: '#c41a16' }}>
          {match[3]}
        </span>
      );
    }
    // Link - SHOW ONLY TEXT (blue, underlined)
    else if (match[4]) {
      parts.push(
        <span key={`l-${match.index}`} style={{ color: '#1a73e8', textDecoration: 'underline' }}>
          {match[4]}
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
