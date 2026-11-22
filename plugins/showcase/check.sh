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

[ "$fail" = 0 ] && echo "OK: $skill / $refs / $utility / $full bytes, $skilllines / $reflines lines"
exit "$fail"
