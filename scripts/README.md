# Documentation Linting Scripts

These scripts enforce documentation standards for the panewiki haiku-docs system.

## Scripts

### docs-lint.js

**Purpose:** Enforces structural standards across all markdown docs.

**Rules checked:**
1. YAML frontmatter (id, title, models, summary, readTime)
2. Breadcrumb navigation (`> **Path:** ...`)
3. Validation badge (`> **Validation:** ...`)
4. Related footer with 3 links (Next/See also/Back)
5. Extension-less links (no `.md` in internal links)
6. No deprecated $0.80 Haiku pricing

**Usage:**
```bash
node scripts/docs-lint.js
```

**Skip list:** Files exempted from checks (complex technical docs with special formatting needs).

---

### diagram-width-check.sh

**Purpose:** Catches ASCII diagrams wider than 50 characters (readability constraint).

**What it checks:**
- Lines containing box-drawing characters (┌┐└┘├┤┬┴│─═)
- Ignores breadcrumbs and blockquotes
- Only flags lines with 3+ box characters AND >50 chars total

**Usage:**
```bash
bash scripts/diagram-width-check.sh
```

**Skip list:** Files with intentionally wide content:
- 3-column workflow diagrams (use-cases/*)
- Full UI mockups (SYSTEM.md - 78 chars for complete layout)
- Cost calculation tables
- File tree diagrams
- Research papers with detailed tables

**Note:** This script has an extensive skip list because many docs intentionally use wide layouts to show parallel workflows (Opus | Haiku | Sonnet columns) or complete system mockups. It's primarily useful for catching violations in NEW simple documentation files.

---

## When to Run

**Before committing:**
```bash
node scripts/docs-lint.js && bash scripts/diagram-width-check.sh
```

**In CI:**
Add to `.github/workflows/docs.yml` or similar.

---

## Adding Files to Skip Lists

If a file legitimately needs to break rules:

1. **For docs-lint.js:** Add to `SKIP` set with explanation comment
2. **For diagram-width-check.sh:** Add to `skip` array with reason

**Good reasons to skip:**
- Complex technical diagrams (TypeScript interfaces, flow charts)
- 3-column parallel workflow demonstrations
- Cost/pricing comparison tables
- Full system UI mockups
- Research papers with detailed citations

**Bad reasons to skip:**
- "The linter is annoying" - fix the doc instead
- "I don't have time" - make time for quality
- "Rules don't apply to me" - they apply to everyone

---

## Maintaining Standards

When adding new docs:
1. Follow the patterns in existing docs
2. Run linters before committing
3. If you need to skip, document WHY
4. Update this README if rules change
