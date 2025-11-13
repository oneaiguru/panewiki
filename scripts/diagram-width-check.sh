#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FAIL=0

# Pattern: Box-drawing characters used in ASCII diagrams
pattern='[┌┐└┘├┤┬┴│╔╗╚╝─═]'

# Skip files with legitimately wide diagrams or tables:
# - data-model.md: Complex TypeScript interface diagrams
# - information-flow.md: Multi-step workflow diagrams with error paths
# - pillar-1-detail.md: Research paper with detailed examples and tables
# - code-review.md: Code examples with detailed inline comments
# - home-detail.md: Complete walkthrough with wide cost breakdown tables
# - 400px-width-math.md: Mathematical proofs with calculation tables
# - SYSTEM.md: Full UI mockup showing 3-column layout (intentionally ~78 chars)
# - use-cases/*: 3-column workflow diagrams showing Opus/Haiku/Sonnet parallel work
# - viewport-semantics.md: Viewport layout diagrams
# - token-economics.md: Cost calculation tables
# - pricing.md, batch-api-guide.md: Pricing/cost tables
skip=(
  "architecture/data-model.md"
  "architecture/information-flow.md"
  "architecture/viewport-semantics.md"
  "architecture/token-economics.md"
  "appendix/pricing.md"
  "appendix/batch-api-guide.md"
  "three-pillars/pillar-1/pillar-1-detail.md"
  "three-pillars/pillar-1/400px-width-math.md"
  "three-pillars/pillar-2/human-layer.md"
  "three-pillars/pillar-2/ai-layer.md"
  "three-pillars/pillar-3/pillar-3-detail.md"
  "use-cases/code-review.md"
  "use-cases/research.md"
  "use-cases/debugging.md"
  "use-cases/learning.md"
  "home-detail.md"
  "home.md"
  "SYSTEM.md"
  "INDEX.md"
)

is_skipped() {
  local rel="$1"
  for item in "${skip[@]}"; do
    if [[ "$rel" == "$item" ]]; then
      return 0
    fi
  done
  return 1
}

tmp_file="$ROOT/.diagram-width-errors"
rm -f "$tmp_file"

while IFS= read -r -d '' file; do
  rel="${file#${ROOT}/docs/haiku-docs/}"
  rel="${rel#./}"
  if is_skipped "$rel"; then
    continue
  fi
  line_no=0
  while IFS= read -r line; do
    line_no=$((line_no + 1))

    # Skip breadcrumbs and blockquotes (start with >)
    if [[ $line =~ ^\> ]]; then
      continue
    fi

    # Check lines with box-drawing characters
    if [[ $line =~ $pattern ]]; then
      chars=${#line}

      # Count how many box-drawing chars in the line
      box_char_count=$(echo "$line" | grep -o "$pattern" | wc -l || echo 0)

      # Only flag if line is >50 chars AND has substantial diagram content (3+ box chars)
      if (( chars > 50 && box_char_count >= 3 )); then
        printf '%s:%s:%s\n' "$rel" "$line_no" "$line" >>"$tmp_file"
        FAIL=1
      fi
    fi
  done <"$file"
done < <(find "$ROOT/docs/haiku-docs" -type f -name '*.md' -not -path '*/_incoming/*' -print0)

if [[ $FAIL -eq 1 ]]; then
  echo "Diagram width check failed (diagrams >50 chars):" >&2
  cat "$tmp_file" >&2
  rm -f "$tmp_file"
  exit 1
else
  echo "Diagram width check passed."
  rm -f "$tmp_file"
fi
