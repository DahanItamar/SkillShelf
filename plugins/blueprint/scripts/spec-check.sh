#!/bin/sh
# Optional, maintainer-run checker for checks 1-4, 3b and 6 of the spec-check skill.
# Never run by install, never wired to a hook. Reads files, writes only a
# temporary directory, runs no command found in your repository.
#
#   sh scripts/spec-check.sh                          # docs/ layout, run from the repo root
#   sh scripts/spec-check.sh SPEC.md TASKS.md ...     # explicit files (no REPORT.md or directory checks)
#
# Flags (first, before any file):
#   --main     also report leftover provisional ids (docs/changes/0000-*, AC-NEW-n in 2.1).
#              Use it on main or in a merge queue; feature branches may legitimately hold them.
#   --tests    list active ids whose literal "AC-###" appears in no test file (informational).
#   --strict   count the --tests lines in Orphans: N.
#
# Prints orphan lines, informational lines starting "info:" (not counted), then "Orphans: N",
# then a final "RESULT orphans=N status=pass|fail" line (status=unknown when it cannot decide).
# Exit 0 when N is 0, 1 when N is above 0, 2 when it cannot decide ("Orphans: unknown").

set -u
main=0; tests=0; strict=0
while [ $# -ge 1 ]; do
  case $1 in --main) main=1 ;; --tests) tests=1 ;; --strict) strict=1 ;; *) break ;; esac
  shift
done
explicit=0; [ $# -ge 1 ] && explicit=1
tmp=$(mktemp -d 2>/dev/null) || { echo "Orphans: unknown (no temporary directory)"; echo "RESULT orphans=unknown status=unknown"; exit 2; }
trap 'rm -rf "$tmp"' EXIT HUP INT TERM
: > "$tmp/tasks"; : > "$tmp/reports"

if [ $# -ge 1 ]; then
  spec=$1; shift
  for f in "$@"; do echo "$f" >> "$tmp/tasks"; done
else
  spec=docs/SPEC.md
  for f in docs/changes/*/TASKS.md docs/changes/archive/*/TASKS.md docs/changes/*/PROPOSAL.md docs/changes/archive/*/PROPOSAL.md; do [ -f "$f" ] && echo "$f" >> "$tmp/tasks"; done
  for f in docs/refactorings/*/REPORT.md docs/refactorings/archive/*/REPORT.md; do [ -f "$f" ] && echo "$f" >> "$tmp/reports"; done
fi

unknown() { echo "Orphans: unknown ($1)"; echo "RESULT orphans=unknown status=unknown"; exit 2; }
[ -f "$spec" ] || unknown "$spec not found"

# Leading ids of table rows and bullets inside section 2.1. State A = active, T = tombstone (~~AC-###~~).
# Only the leading id counts: a tombstone reason may cite another id.
lead_ids='
  match($0, /^[ \t]*(\|[ \t]*|[-*][ \t]+)(~~)?AC-(NEW-)?[0-9]+/) {
    s = substr($0, RSTART, RLENGTH); st = (s ~ /~~/) ? "T" : "A"
    match(s, /AC-(NEW-)?[0-9]+/); print substr(s, RSTART, RLENGTH), st
  }'
awk '
  /^#+[ \t]/ { n = 0; while (substr($0, n + 1, 1) == "#") n++ }
  /^#+[ \t]+(§[ \t]*)?2\.1([ \t.]|$)/ { inside = 1; lvl = n; next }
  inside && /^#+[ \t]/ { if (n <= lvl) inside = 0 }
  inside { print }
' "$spec" | awk "$lead_ids" > "$tmp/spec_ids"
[ -s "$tmp/spec_ids" ] || unknown "no AC-### ids in section 2.1 of $spec"
awk '{ print $1 }' "$tmp/spec_ids" | sort -u > "$tmp/known"
awk '$2 == "A" { print $1 }' "$tmp/spec_ids" | sort -u > "$tmp/active"

: > "$tmp/orphans"; : > "$tmp/closed"

# Citations after "closes" (tasks) or "preserves" (reports), cut at the first " — " or " -- ".
cites='
  match($0, /^[ \t]*- \[[ xX]\] [TR]-[0-9]+/) {
    item = substr($0, RSTART, RLENGTH); sub(/^.*\] /, "", item)
    k = index($0, WORD " "); if (!k) next
    seg = substr($0, k + length(WORD) + 1)
    c = index(seg, " — "); if (c) seg = substr(seg, 1, c - 1)
    c = index(seg, " -- "); if (c) seg = substr(seg, 1, c - 1)
    while (match(seg, /AC-(NEW-)?[0-9]+/)) { print item, substr(seg, RSTART, RLENGTH); seg = substr(seg, RSTART + RLENGTH) }
  }'

# Check 1: every cited id exists in 2.1 (or in the sibling PROPOSAL.md, for a proposal task list).
while IFS= read -r f; do
  d=$(dirname "$f"); cp "$tmp/known" "$tmp/known_here"
  if [ -f "$d/PROPOSAL.md" ]; then awk "$lead_ids" "$d/PROPOSAL.md" | awk '{ print $1 }' >> "$tmp/known_here"; fi
  awk -v WORD=closes "$cites" "$f" > "$tmp/cites_here"
  awk '{ print $2 }' "$tmp/cites_here" >> "$tmp/closed"
  awk -v F="$f" 'NR == FNR { k[$1] = 1; next } !($2 in k) { print $1 " cites " $2 ", which does not exist (" F ")" }' "$tmp/known_here" "$tmp/cites_here" >> "$tmp/orphans"
done < "$tmp/tasks"

# Check 2: every active criterion is closed by a task.
sort -u "$tmp/closed" > "$tmp/closed_u"
awk 'NR == FNR { c[$1] = 1; next } !($1 in c) { print $1 " active, closed by no task" }' "$tmp/closed_u" "$tmp/active" >> "$tmp/orphans"

# Check 3: no id appears twice in 2.1 (this also catches a tombstoned id reused as active).
awk '{ n[$1]++ } END { for (i in n) if (n[i] > 1) print i, n[i] }' "$tmp/spec_ids" | sort |
  while read -r id n; do
    if [ "$n" = 2 ]; then echo "$id appears twice in section 2.1"; else echo "$id appears $n times in section 2.1"; fi
  done >> "$tmp/orphans"

# Check 4: every preserves AC-### in a REPORT.md resolves to an active criterion.
while IFS= read -r f; do
  awk -v WORD=preserves "$cites" "$f" |
    awk -v F="$f" 'NR == FNR { a[$1] = 1; next } !($2 in a) { print $1 " preserves " $2 ", which is not an active criterion (" F ")" }' "$tmp/active" -
done < "$tmp/reports" >> "$tmp/orphans"

# Check 3b: a four-digit change ordinal is never reused, archive included (0000 is provisional).
if [ "$explicit" -eq 0 ]; then
  for d in docs/changes/[0-9][0-9][0-9][0-9]-* docs/changes/archive/[0-9][0-9][0-9][0-9]-*; do [ -d "$d" ] && basename "$d" | cut -c1-4; done |
    grep -v ^0000 | sort | uniq -d | while read -r o; do echo "ordinal $o used by more than one change directory"; done >> "$tmp/orphans"
fi

# With --main: leftover provisional ids mean the /spec-drift merge step was skipped.
if [ "$main" -eq 1 ] && [ "$explicit" -eq 0 ]; then
  for d in docs/changes/0000-*; do [ -d "$d" ] && echo "$d exists, run /spec-drift merge"; done >> "$tmp/orphans"
  grep ^AC-NEW- "$tmp/known" | while read -r id; do echo "$id in SPEC.md section 2.1"; done >> "$tmp/orphans"
fi

: > "$tmp/info"
# With --tests: active ids whose literal id appears in no test file.
if [ "$tests" -eq 1 ]; then
  find . -type f \( -name "*test*" -o -name "*spec*" -o -path "*/tests/*" -o -path "*/test/*" -o -path "*/__tests__/*" \) \
    -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "./docs/*" -not -name "*.md" -not -name "spec-check.sh" > "$tmp/testfiles"
  while read -r id; do
    hit=0
    while IFS= read -r tf; do grep -Eq "$id([^0-9]|$)" "$tf" 2>/dev/null && { hit=1; break; }; done < "$tmp/testfiles"
    [ "$hit" -eq 0 ] && echo "$id no titled test"
  done < "$tmp/active" > "$tmp/notest"
  if [ "$strict" -eq 1 ]; then cat "$tmp/notest" >> "$tmp/orphans"; else sed "s/^/info: /" "$tmp/notest" >> "$tmp/info"; fi
fi

# Check 6 (informational): closed criteria with no "closes AC-###" in git history.
if [ "$explicit" -eq 0 ] && git log -1 >/dev/null 2>&1; then
  git log --format=%B > "$tmp/log" 2>/dev/null
  while read -r id; do
    grep -Eq "closes $id([^0-9]|$)" "$tmp/log" || echo "info: $id no conforming commit"
  done < "$tmp/closed_u" >> "$tmp/info"
fi

n=$(wc -l < "$tmp/orphans" | tr -d ' ')
if [ "$n" -gt 0 ]; then cat "$tmp/orphans"; fi
cat "$tmp/info"
echo "Orphans: $n"
if [ "$n" -eq 0 ]; then echo "RESULT orphans=0 status=pass"; else echo "RESULT orphans=$n status=fail"; fi
[ "$n" -eq 0 ]
