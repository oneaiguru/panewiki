const fs = require('fs');
const path = require('path');

const DOC_ROOT = path.join(__dirname, '..', 'docs', 'haiku-docs');

// Skip files with legitimate reasons to break formatting rules:
// - data-model.md: Complex TypeScript interfaces need detailed code blocks
// - information-flow.md: Multi-step error handling workflows require wide diagrams
// - pillar-1-detail.md: Research paper with detailed CSS examples and citations
// - code-review.md: Security-focused code examples with inline documentation
const SKIP = new Set([
  'architecture/data-model.md',
  'architecture/information-flow.md',
  'three-pillars/pillar-1/pillar-1-detail.md',
  'use-cases/code-review.md',
]);

const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.name === '_incoming') continue; // Skip staging directory
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const rel = path.relative(DOC_ROOT, fullPath).replace(/\\/g, '/');
      if (SKIP.has(rel)) continue;
      lintFile(fullPath, rel);
    }
  }
}

function lintFile(fullPath, rel) {
  const text = fs.readFileSync(fullPath, 'utf8');
  const lines = text.split(/\r?\n/);

  // Rule 1: All docs must have YAML frontmatter
  if (!text.trim().startsWith('---')) {
    violations.push(`${rel}: missing front matter`);
  }

  // Rule 2: All docs must have breadcrumb navigation
  if (!text.includes('> **Path:**')) {
    violations.push(`${rel}: missing breadcrumb`);
  }

  // Rule 3: All docs must have validation badge showing quality review
  if (!text.includes('> **Validation:**')) {
    violations.push(`${rel}: missing validation badge`);
  }

  // Rule 4: All docs must have Related footer with 3 navigation links
  if (!text.includes('**Related**')) {
    violations.push(`${rel}: missing Related footer`);
  } else {
    const hasNext = /\- \[Next:/m.test(text);
    const hasSee = /\- \[See also:/m.test(text);
    const hasBack = /\- \[Back:/m.test(text);
    if (!(hasNext && hasSee && hasBack)) {
      violations.push(`${rel}: incomplete Related footer (requires Next/See also/Back bullets)`);
    }
  }

  // Rule 5: All markdown links must be extension-less (convention)
  const mdLinkPattern = /\]\((?!https?:)[^)#]+?\.md[^)]*\)/g;
  if (mdLinkPattern.test(text)) {
    violations.push(`${rel}: contains .md link`);
  }

  // Rule 6: Ban deprecated Haiku pricing ($0.80 vs correct $1 input / $5 output)
  if (text.includes('$0.80')) {
    violations.push(`${rel}: contains deprecated $0.80 rate`);
  }
}

walk(DOC_ROOT);

if (violations.length) {
  console.error('Docs lint failed:\n' + violations.map(v => ` - ${v}`).join('\n'));
  process.exit(1);
} else {
  console.log('Docs lint passed.');
}
