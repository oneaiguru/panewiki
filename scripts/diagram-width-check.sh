#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FAIL=0
pattern='[┌┐└┘├┤┬┴│╔╗╚╝─═]' 
skip=("architecture/data-model.md" "architecture/information-flow.md" "three-pillars/pillar-1/pillar-1-detail.md" "use-cases/code-review.md")

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
    if [[ $line =~ $pattern ]]; then
      chars=${#line}
      if (( chars > 40 )); then
        printf '%s:%s:%s\n' "$rel" "$line_no" "$line" >>"$tmp_file"
        FAIL=1
      fi
    fi
  done <"$file"
done < <(find "$ROOT/docs/haiku-docs" -type f -name '*.md' -not -path '*/_incoming/*' -print0)

if [[ $FAIL -eq 1 ]]; then
  echo "Diagram width check failed:" >&2
  cat "$tmp_file" >&2
  rm -f "$tmp_file"
  exit 1
else
  echo "Diagram width check passed."
  rm -f "$tmp_file"
fi
