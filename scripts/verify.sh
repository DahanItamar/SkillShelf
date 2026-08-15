#!/bin/sh
# ACSM structural verification.
#
# POSIX shell and standard utilities only. No language runtime, no package
# manager, no lockfile. Adding a dependency here means amending SPEC.md section 4.
#
# Exit codes (SPEC.md section 6.5):
#   0  every check passed
#   1  at least one check failed; each printed as FAIL <check>: <path>:<line>
#   2  the script could not run — wrong directory, or the tree is not there

set -u

FAILURES=0

# fail <check> <path> <line> <message>
fail() {
	printf 'FAIL %s: %s:%s %s\n' "$1" "$2" "$3" "$4"
	FAILURES=$((FAILURES + 1))
}

note() {
	printf '  %s\n' "$1"
}

# --- runnable? -------------------------------------------------------------
# Exit 2 rather than 1: a script that cannot look is not a script that looked
# and found nothing wrong.

if [ ! -d skills/acsm ]; then
	printf 'cannot run: skills/acsm not found — run from the repository root\n' >&2
	exit 2
fi

if [ ! -f skills/acsm/SKILL.md ]; then
	printf 'cannot run: skills/acsm/SKILL.md is missing\n' >&2
	exit 2
fi

printf 'ACSM verify\n'

TMPF=./.verify.tmp
trap 'rm -f "$TMPF" "$TMPF.fm" "$TMPF.lk" "$TMPF.aw" "$TMPF.in" "$TMPF.ph"' EXIT INT TERM

# Module files are `references/<n>-<slug>.md` with n in 1..8 (SPEC.md AC-051).
# Other files may live in references/ — audit-flow.md is procedure, not a module,
# and carries no module number, no jurisdiction and no citation. Module-shaped
# checks are scoped to the numbered glob for exactly that reason.
MODULE_GLOB='skills/acsm/references/[1-8]-*.md'

list_md() {
	find . -path ./.git -prune -o -type f -name '*.md' -print
}

list_text() {
	find . -path ./.git -prune -o -type f \
		\( -name '*.md' -o -name '*.yml' -o -name '*.yaml' \
		-o -name '*.json' -o -name '*.sh' \) -print
}

# --- encoding: UTF-8 without BOM, LF only ----------------------------------
# The disclaimer block in templates/ is verified by byte comparison. A CRLF
# checkout fails that on an otherwise clean tree, which is the hardest kind of
# CI failure to read, so the encoding is checked before anything depends on it.

list_text > "$TMPF"
while IFS= read -r f; do
	bom=$(dd if="$f" bs=1 count=3 2>/dev/null | od -An -tx1 | tr -d ' \n')
	if [ "$bom" = "efbbbf" ]; then
		fail encoding "$f" 1 "UTF-8 byte-order mark present; must be UTF-8 without BOM"
	fi
	if ! tr -d '\r' < "$f" | cmp -s - "$f"; then
		crline=$(grep -n "$(printf '\r')" "$f" | head -n 1 | cut -d: -f1)
		fail encoding "$f" "${crline:-1}" "carriage return present; line endings must be LF"
	fi
done < "$TMPF"

# --- frontmatter: every skill file carries the keys its kind requires -------

frontmatter() {
	f=$1
	shift
	if [ ! -f "$f" ]; then
		return 0
	fi
	if [ "$(sed -n '1p' "$f")" != "---" ]; then
		fail frontmatter "$f" 1 "no YAML frontmatter; line 1 is not ---"
		return 0
	fi
	sed -n '2,/^---$/p' "$f" > "$TMPF.fm"
	for k in "$@"; do
		if ! grep -q "^$k:" "$TMPF.fm"; then
			fail frontmatter "$f" 1 "missing required key: $k"
		fi
	done
}

frontmatter skills/acsm/SKILL.md name description

for f in $MODULE_GLOB; do
	[ -e "$f" ] || continue
	frontmatter "$f" module domain jurisdictions last_verified instruments
done

for f in skills/acsm/templates/*.md; do
	[ -e "$f" ] || continue
	frontmatter "$f" document jurisdictions satisfies placeholders license
done

# --- size: the hard limits in SPEC.md section 4 ----------------------------
# Crossing one on SKILL.md means obligation text has leaked into the router,
# which is what defeats progressive disclosure.

limit() {
	[ -f "$1" ] || return 0
	n=$(wc -l < "$1" | tr -d ' ')
	if [ "$n" -gt "$2" ]; then
		fail size "$1" "$2" "$n lines exceeds the hard limit of $2"
	fi
}

limit skills/acsm/SKILL.md 300
for f in skills/acsm/references/*.md; do [ -e "$f" ] || continue; limit "$f" 600; done

# --- modules: exactly eight, numbered 1 through 8 --------------------------

for i in 1 2 3 4 5 6 7 8; do
	found=0
	for f in skills/acsm/references/$i-*.md; do
		[ -e "$f" ] && found=$((found + 1))
	done
	if [ "$found" -eq 0 ]; then
		fail modules skills/acsm/references 1 "no module file numbered $i"
	elif [ "$found" -gt 1 ]; then
		fail modules skills/acsm/references 1 "$found module files numbered $i; expected one"
	fi
done

for f in skills/acsm/references/*.md; do
	[ -e "$f" ] || continue
	b=$(basename "$f")
	case "$b" in
		[1-8]-*) ;;
		[0-9]*) fail modules "$f" 1 "numbered module file outside the range 1-8" ;;
	esac
done

# --- audit blocks: present, and every check carries all six fields ---------

for f in $MODULE_GLOB; do
	[ -e "$f" ] || continue
	if ! grep -q '^## Audit' "$f"; then
		fail audit "$f" 1 "no ## Audit section"
		continue
	fi
	if ! grep -q '^| AUDIT-' "$f"; then
		fail audit "$f" 1 "## Audit section contains no checks"
	fi
	awk -F'|' '/^\| AUDIT-/ && NF - 2 != 6 { print NR }' "$f" > "$TMPF.aw"
	while IFS= read -r ln; do
		[ -n "$ln" ] || continue
		fail audit "$f" "$ln" "audit check does not carry all six fields"
	done < "$TMPF.aw"
done

# --- templates: the disclaimer is byte-identical and comes first -----------
# Frontmatter is metadata, not content, so the comparison starts at the first
# non-blank line after it. The block is one line by design: byte comparison of
# a multi-line block fails on trailing whitespace nobody can see.

DISC=skills/acsm/templates/_disclaimer.txt

if [ -d skills/acsm/templates ]; then
	if [ ! -f "$DISC" ]; then
		fail disclaimer "$DISC" 1 "canonical disclaimer is missing"
	else
		for f in skills/acsm/templates/*.md; do
			[ -e "$f" ] || continue
			if [ "$(sed -n '1p' "$f")" = "---" ]; then
				start=$(sed -n '2,$p' "$f" | grep -n '^---$' | head -n 1 | cut -d: -f1)
				start=$((start + 2))
			else
				start=1
			fi
			first=$(sed -n "${start},\$p" "$f" | grep -n . | head -n 1)
			off=${first%%:*}
			line=${first#*:}
			ln=$((start + off - 1))
			if [ "$line" != "$(cat "$DISC")" ]; then
				fail disclaimer "$f" "$ln" "first content is not the canonical disclaimer block"
			fi
		done
	fi
fi

# --- templates: bracketed tokens are placeholders and nothing else ---------
# Scoped to the body: `jurisdictions: ["US", "EU"]` in frontmatter is YAML
# syntax, not a token in the document. AC-054 bans everything else, which
# means template bodies carry no Markdown links.

for f in skills/acsm/templates/*.md; do
	[ -e "$f" ] || continue
	if [ "$(sed -n '1p' "$f")" = "---" ]; then
		start=$(sed -n '2,$p' "$f" | grep -n '^---$' | head -n 1 | cut -d: -f1)
		start=$((start + 2))
	else
		start=1
	fi
	sed -n "${start},\$p" "$f" | grep -no '\[[^]]*\]' > "$TMPF.ph" 2>/dev/null || true
	while IFS= read -r hit; do
		[ -n "$hit" ] || continue
		off=${hit%%:*}
		tok=${hit#*:}
		case "$tok" in
			'[INSERT_'*']')
				body=${tok#\[INSERT_}
				body=${body%\]}
				case "$body" in
					*[!A-Z0-9_]*) fail placeholder "$f" $((start + off - 1)) "malformed placeholder: $tok" ;;
					'') fail placeholder "$f" $((start + off - 1)) "empty placeholder: $tok" ;;
				esac
				;;
			*) fail placeholder "$f" $((start + off - 1)) "bracketed token is not a placeholder: $tok" ;;
		esac
	done < "$TMPF.ph"
done

# --- citation index: every instrument a module names appears in it ---------

if [ ! -f docs/CITATIONS.md ]; then
	fail citations docs/CITATIONS.md 1 "citation index is missing"
else
	for f in $MODULE_GLOB; do
		[ -e "$f" ] || continue
		grep -n '^  - name:' "$f" > "$TMPF.in" 2>/dev/null || true
		while IFS= read -r hit; do
			[ -n "$hit" ] || continue
			ln=${hit%%:*}
			nm=${hit#*name: }
			nm=${nm#\"}
			nm=${nm%\"}
			if ! grep -Fq "$nm" docs/CITATIONS.md; then
				fail citations "$f" "$ln" "instrument absent from docs/CITATIONS.md: $nm"
			fi
		done < "$TMPF.in"
	done
fi
for f in skills/acsm/templates/*.md; do [ -e "$f" ] || continue; limit "$f" 400; done

desc=$(sed -n 's/^description:[[:space:]]*//p' skills/acsm/SKILL.md | head -n 1)
dlen=$(printf '%s' "$desc" | wc -c | tr -d ' ')
if [ "$dlen" -gt 500 ]; then
	fail size skills/acsm/SKILL.md 2 "description is $dlen bytes, hard limit 500"
fi

# --- links: every relative link resolves -----------------------------------
# A routing rule pointing at a module that does not exist loads nothing and
# reports success, which is the worst failure this repository can have.

list_md > "$TMPF"
while IFS= read -r f; do
	d=$(dirname "$f")
	grep -no ']([^)]*)' "$f" > "$TMPF.lk" 2>/dev/null || true
	while IFS= read -r hit; do
		[ -n "$hit" ] || continue
		ln=${hit%%:*}
		t=${hit#*:}
		t=${t#](}
		t=${t%)}
		t=${t%%#*}
		case "$t" in
			http://* | https://* | mailto:* | '') continue ;;
		esac
		if [ ! -e "$d/$t" ]; then
			fail link "$f" "$ln" "relative link does not resolve: $t"
		fi
	done < "$TMPF.lk"
done < "$TMPF"

# --- report ----------------------------------------------------------------

if [ "$FAILURES" -gt 0 ]; then
	printf '\n%s check(s) failed\n' "$FAILURES"
	exit 1
fi

printf 'ok\n'
exit 0
