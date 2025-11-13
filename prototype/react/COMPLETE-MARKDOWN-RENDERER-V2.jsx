export default function CompleteMarkdownRenderer() {
  const content = `# Main Header

This is regular text with **bold** and *italic* and ***bold italic***.

## Second Level Header

You can have inline code like \`const x = 5\` in your text.

Also ~~strikethrough~~ works here.

### Third Level Header

And you can have links like this link in your text.

#### Fourth Level Header

Images show as [Image: diagram.png].

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

Numbered list:
1. First
2. Second
3. Third

## Blockquotes

> This is a blockquote with **bold** and *italic* inside it
> Second line of quote

## Mixed Content

A paragraph with **bold**, *italic*, \`code\`, and a link here.

Another paragraph with ~~strikethrough~~ text.

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

    // Headers
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
    } else if (line.startsWith('#### ')) {
      elements.push(
        <div key={i} style={getHeaderStyle(4)}>
          {renderInline(line.substring(5))}
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
    // Blockquote
    else if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].substring(2));
        i++;
      }
      elements.push(
        <div key={i} style={{
          paddingLeft: '12px',
          color: '#999999',
          margin: '12px 0',
          borderLeft: '2px solid #999999'
        }}>
          {quoteLines.map((ql, idx) => (
            <div key={idx}>
              {renderInline(ql)}
            </div>
          ))}
        </div>
      );
    }
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
    // Numbered list
    else if (/^\d+\. /.test(line)) {
      const listItems = [];
      let num = 1;
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const match = lines[i].match(/^\d+\. (.*)$/);
        listItems.push(match ? match[1] : '');
        i++;
        num++;
      }
      elements.push(
        <div key={i} style={{ margin: '12px 0' }}>
          {listItems.map((item, idx) => (
            <div key={idx} style={{ paddingLeft: '20px', color: '#808080' }}>
              {idx + 1}. {renderInline(item)}
            </div>
          ))}
        </div>
      );
    }
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
  const colors = ['#000000', '#333333', '#666666', '#999999'];
  return {
    color: colors[level - 1],
    fontWeight: 'bold',
    margin: '16px 0 8px 0'
  };
}

function renderInline(text) {
  const parts = [];
  let lastIndex = 0;

  // Pattern: **bold**, *italic*, `code`, ~~strikethrough~~, [Image: name]
  // Links now just show text: [text](url) → text (blue)
  const combinedRegex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~|\[([^\]]+)\]\(([^\)]+)\)|\[Image: ([^\]]+)\]/g;
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
    // Strikethrough
    else if (match[4]) {
      parts.push(
        <span key={`s-${match.index}`} style={{ textDecoration: 'line-through' }}>
          {match[4]}
        </span>
      );
    }
    // Link - SHOW ONLY TEXT (blue, underlined)
    else if (match[5]) {
      parts.push(
        <span key={`l-${match.index}`} style={{ color: '#1a73e8', textDecoration: 'underline' }}>
          {match[5]}
        </span>
      );
    }
    // Image
    else if (match[7]) {
      parts.push(
        <span key={`img-${match.index}`} style={{ color: '#999999' }}>
          [Image: {match[7]}]
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
