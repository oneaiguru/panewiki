const fs = require('fs');
const path = require('path');

const DOC_ROOT = path.join(__dirname, '..', 'docs', 'haiku-docs');
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
    if (entry.name === '_incoming') continue;
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

  if (!text.trim().startsWith('---')) {
    violations.push(`${rel}: missing front matter`);
  }

  if (!text.includes('> **Path:**')) {
    violations.push(`${rel}: missing breadcrumb`);
  }

  if (!text.includes('> **Validation:**')) {
    violations.push(`${rel}: missing validation badge`);
  }

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

  const mdLinkPattern = /\]\((?!https?:)[^)#]+?\.md[^)]*\)/g;
  if (mdLinkPattern.test(text)) {
    violations.push(`${rel}: contains .md link`);
  }

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
