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
  grep -rnE '[.][.]/[A-Za-z]' skills/$d && bad "$d: contains ../ (leaves its folder)"
  for r in $(grep -rhoE '(references|scripts)/[A-Za-z0-9_*.-]+' skills/$d | sed 's/[.]$//' | sort -u); do
    case $r in *'*'*) continue;; esac
    [ -f "skills/$d/$r" ] || bad "$d: names $r, which is not in its own folder"
  done
  for r in $(grep -rhoE '`[a-z][a-z0-9-]*[.]md`' skills/$d | tr -d '`' | sort -u); do
    [ -n "$(find skills/$d -name "$r")" ] || bad "$d: names $r, which is not in its own folder"
  done
  for o in $names; do
    [ "$o" = "$d" ] && continue
    grep -rnE "$o([^a-z-]|\$)" skills/$d && bad "$d: names sibling skill $o"
  done
done
has() { grep -qF "$2" "skills/$1/SKILL.md" || bad "$1: missing security text: $2"; }
for d in spec-implement spec-refactor; do
  has $d 'Verify command not run: not confirmed in a non-interactive run.'
  has $d 'Reviewed line does not match the command'
done
has spec-constitution '**Reviewed:**'
case $n in 1) w=One;; 2) w=Two;; 3) w=Three;; 4) w=Four;; 5) w=Five;; 6) w=Six;; 7) w=Seven;; 8) w=Eight;; 9) w=Nine;; *) w=$n;; esac
grep -qi "\"description\": \"$w " .claude-plugin/plugin.json || bad "plugin.json description does not start with '$w'"
[ $fail -eq 0 ] && echo "ok: $n skills"
exit $fail
