#!/bin/sh
# Maintainer-run drift check. Not loaded at run time; nothing executes at install.
# Usage: sh check.sh   (from any directory). Exits non-zero on drift.
# Note: the &logo= badge pattern in references/identity-block.md is guidance for the READMEs the
# skill writes. The no-logo rule applies only to this marketplace's own README badges.
cd "$(dirname "$0")" || exit 2
fail=0
bad() { echo "DRIFT: $1"; fail=1; }
commas() { awk -v n="$1" 'BEGIN{s=sprintf("%d",n);o="";while(length(s)>3){o="," substr(s,length(s)-2) o;s=substr(s,1,length(s)-3)}print s o}'; }
k() { awk -v n="$1" 'BEGIN{printf "%.1fk", n/4000}'; }
size() { wc -c < "$1" | tr -d ' '; }
lines() { wc -l < "$1" | tr -d ' '; }

skill=$(size SKILL.md)
refs=0; reflines=0
for f in references/*.md; do refs=$((refs + $(size "$f"))); reflines=$((reflines + $(lines "$f"))); done
skip=$(( $(size references/identity-block.md) + $(size references/visuals.md) ))
utility=$((skill + refs - skip))
full=$((skill + refs))
skilllines=$(lines SKILL.md)

for pair in "SKILL.md bytes:$skill" "reference bytes:$refs" "utility run bytes:$utility" "full load bytes:$full" \
            "SKILL.md lines:$skilllines" "reference lines:$reflines"; do
  v=${pair##*:}; c=$(commas "$v")
  grep -q "$c" README.md || bad "README lacks ${pair%%:*} = $c"
done
for v in "$skill" "$utility" "$full"; do
  t=$(k "$v"); grep -q "$t tokens\|$t token" README.md || bad "README lacks token figure $t for $v bytes"
done

# every relative link and src in README.md resolves
{ grep -o 'href="[^"]*"' README.md; grep -o 'src="[^"]*"' README.md; grep -o ']([^)]*)' README.md; } |
  sed 's/^href="//; s/^src="//; s/^](//; s/"$//; s/)$//' | sort -u | while read -r l; do
  case "$l" in http*|'#'*|mailto:*|'') continue;; esac
  [ -e "${l%%#*}" ] || echo "BROKEN LINK: $l"
done | { found=0; while read -r line; do echo "$line"; found=1; done; [ "$found" = 0 ]; } || bad "broken README link"

# the style-source name must not appear in the skill or its references
if grep -n 'Winnow' SKILL.md references/*.md; then bad "Winnow in SKILL.md or references"; fi

# Replay the committed example ledger. Runs only when docs/example/docs/EVIDENCE.md exists.
# Rows follow references/evidence-rules.md. A row with replay = yes runs from docs/example/fixture
# with sh; its output is the extracted value. Exact match unless the tolerance is +/-N%.
led=docs/example/docs/EVIDENCE.md
if [ -f "$led" ]; then
  trim() { printf '%s' "$1" | sed 's/^ *//; s/ *$//'; }
  sed 's/\\|/@PIPE@/g' "$led" | grep '^|' | while IFS='|' read -r _ claim cmd val tol _ rp _; do
    [ "$(trim "$rp")" = yes ] || continue
    tol=$(trim "$tol"); val=$(trim "$val")
    case "$tol" in volatile*) continue;; esac
    cmd=$(trim "$cmd" | sed 's/^`//; s/`$//; s/@PIPE@/|/g')
    got=$(cd docs/example/fixture && sh -c "$cmd" 2>/dev/null | tr -d ' \n')
    pct=$(printf '%s' "$tol" | sed -n 's|^+/-\([0-9]*\)%.*|\1|p')
    if [ -n "$pct" ]; then
      awk -v g="$got" -v v="$val" -v p="$pct" 'BEGIN{d=g-v;if(d<0)d=-d;exit !(v!=0 && d*100<=p*v)}' ||
        echo "STALE: $(trim "$claim") (stored $val, got $got)"
    else
      [ "$got" = "$val" ] || echo "STALE: $(trim "$claim") (stored $val, got $got)"
    fi
  done | { n=0; while read -r line; do echo "$line"; n=1; done; [ "$n" = 0 ]; } || bad "example ledger has stale rows"
  # every number in the example README must appear in the ledger
  if [ -f docs/example/README.md ]; then
    grep -o '[0-9][0-9.,]*[0-9]\|[0-9]' docs/example/README.md | sort -u | while read -r n; do
      grep -qF "$n" "$led" || echo "NOT IN LEDGER: $n"
    done | { n=0; while read -r line; do echo "$line"; n=1; done; [ "$n" = 0 ]; } || bad "example README number missing from ledger"
  fi
fi

[ "$fail" = 0 ] && echo "OK: $skill / $refs / $utility / $full bytes, $skilllines / $reflines lines"
exit "$fail"
