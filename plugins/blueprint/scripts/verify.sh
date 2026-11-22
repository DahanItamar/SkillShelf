#!/bin/sh
# Blueprint structural check. Maintainer-run, POSIX sh. Skills never call it.
# Run from plugins/blueprint:  sh scripts/verify.sh   (exit 0 = pass, 1 = fail)
[ -d skills ] || { echo "run from plugins/blueprint"; exit 2; }
fail=0
bad() { echo "FAIL $1"; fail=1; }
names=$(ls skills)
n=0
for d in $names; do
  n=$((n + 1)); f=skills/$d/SKILL.md
  [ -f "$f" ] || { bad "$d: no SKILL.md"; continue; }
  nm=$(sed -n 's/^name: *//p' "$f" | head -1)
  [ "$nm" = "$d" ] || bad "$d: frontmatter name is '$nm'"
  dl=$(sed -n 's/^description: *//p' "$f" | head -1 | wc -c)
  [ "$dl" -gt 1 ] && [ "$dl" -le 1025 ] || bad "$d: description length $dl"
  [ "$(wc -l < "$f")" -le 500 ] || bad "$d: SKILL.md over 500 lines"
  grep -rnE '(^|[ `(])/spec-[a-z]|AskUserQuestion|claude -p' skills/$d && bad "$d: slash command or Claude-only wording"
  for o in $names; do
    [ "$o" = "$d" ] && continue
    grep -rnE "$o([^a-z-]|\$)" skills/$d && bad "$d: names sibling skill $o"
  done
done
case $n in 1) w=One;; 2) w=Two;; 3) w=Three;; 4) w=Four;; 5) w=Five;; 6) w=Six;; 7) w=Seven;; 8) w=Eight;; 9) w=Nine;; *) w=$n;; esac
grep -qi "\"description\": \"$w " .claude-plugin/plugin.json || bad "plugin.json description does not start with '$w'"
[ $fail -eq 0 ] && echo "ok: $n skills"
exit $fail
