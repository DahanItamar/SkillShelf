#!/bin/sh
# Regwise structural verification.
#
# POSIX shell and standard utilities only. No language runtime, no package
# manager, no lockfile. Adding a dependency here means amending SPEC.md section 4.
#
# Exit codes (SPEC.md section 6.5):
#   0  every check passed
#   1  at least one check failed; each printed as FAIL <check>: <path>:<line>
#   2  the script could not run — wrong directory, or the tree is not there

set -u

# Optional argument: a plugin directory to check (for third-party jurisdiction plugins).
if [ $# -ge 1 ]; then
	cd "$1" || { printf 'cannot run: cannot enter %s\n' "$1" >&2; exit 2; }
fi

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

if [ ! -d skills/regwise ]; then
	printf 'cannot run: skills/regwise not found — run from the repository root\n' >&2
	exit 2
fi

if [ ! -f skills/regwise/SKILL.md ]; then
	printf 'cannot run: skills/regwise/SKILL.md is missing\n' >&2
	exit 2
fi

printf 'Regwise verify\n'

TMPD=$(mktemp -d 2>/dev/null) || { printf 'cannot run: mktemp -d failed\n' >&2; exit 2; }
TMPF=$TMPD/t
trap 'rm -rf "$TMPD"' EXIT INT TERM

# Module files are `references/<n>-<slug>.md` with n in 1..8 (SPEC.md AC-051).
# Other files may live in references/ — audit-flow.md is procedure, not a module,
# and carries no module number, no jurisdiction and no citation. Module-shaped
# checks are scoped to the numbered glob for exactly that reason.
MODULE_GLOB='skills/regwise/references/[1-8]-*.md'

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

frontmatter skills/regwise/SKILL.md name description

for f in $MODULE_GLOB; do
	[ -e "$f" ] || continue
	frontmatter "$f" module domain jurisdictions last_verified instruments
done

for f in skills/regwise/templates/*.md; do
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

limit skills/regwise/SKILL.md 300
for f in skills/regwise/references/*.md; do [ -e "$f" ] || continue; limit "$f" 600; done

# --- modules: exactly eight, numbered 1 through 8 --------------------------

for i in 1 2 3 4 5 6 7 8; do
	found=0
	for f in skills/regwise/references/$i-*.md; do
		[ -e "$f" ] && found=$((found + 1))
	done
	if [ "$found" -eq 0 ]; then
		fail modules skills/regwise/references 1 "no module file numbered $i"
	elif [ "$found" -gt 1 ]; then
		fail modules skills/regwise/references 1 "$found module files numbered $i; expected one"
	fi
done

for f in skills/regwise/references/*.md; do
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

DISC=skills/regwise/templates/_disclaimer.txt

if [ -d skills/regwise/templates ]; then
	if [ ! -f "$DISC" ]; then
		fail disclaimer "$DISC" 1 "canonical disclaimer is missing"
	else
		for f in skills/regwise/templates/*.md; do
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

for f in skills/regwise/templates/*.md; do
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

if [ ! -f skills/regwise/references/citations.md ]; then
	fail citations skills/regwise/references/citations.md 1 "citation index is missing"
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
			if ! grep -Fq "$nm" skills/regwise/references/citations.md; then
				fail citations "$f" "$ln" "instrument absent from skills/regwise/references/citations.md: $nm"
			fi
		done < "$TMPF.in"
	done
fi
for f in skills/regwise/templates/*.md; do [ -e "$f" ] || continue; limit "$f" 400; done

desc=$(sed -n 's/^description:[[:space:]]*//p' skills/regwise/SKILL.md | head -n 1)
dlen=$(printf '%s' "$desc" | wc -c | tr -d ' ')
if [ "$dlen" -gt 500 ]; then
	fail size skills/regwise/SKILL.md 2 "description is $dlen bytes, hard limit 500"
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

# --- routing fixtures: Expected modules match the router rule table --------
# Each examples/*.config.yml declares `# Expected: modules ...`. The rule table in
# SKILL.md section 2 is evaluated here, so a rule change that moves a module fails.

cfg_get() {
	sed -n "s/^$2:[[:space:]]*//p" "$1" | head -n 1 | sed 's/[[:space:]]*#.*//'
}

rule_fires() {
	# $1 condition text from the router table, backticks removed
	case "$1" in
		"appType == LocalDesktop") [ "$T_APP" = LocalDesktop ] ;;
		"appType == ConnectedDesktop") [ "$T_APP" = ConnectedDesktop ] ;;
		"appType == E-commerce") [ "$T_APP" = E-commerce ] ;;
		"rank >= 1") [ "$T_RANK" -ge 1 ] ;;
		"enterpriseFlag") [ "$T_ENT" = 1 ] ;;
		"aiIntegration != None") [ "$T_AI" != None ] ;;
		"markets include EU") case "$T_MK" in *EU*|*Global*) true ;; *) false ;; esac ;;
		"markets include Israel") case "$T_MK" in *Israel*|*Global*) true ;; *) false ;; esac ;;
		"markets include US") case "$T_MK" in *US*|*Global*) true ;; *) false ;; esac ;;
		"markets include UK_APAC") case "$T_MK" in *UK_APAC*|*Global*) true ;; *) false ;; esac ;;
		"appType != HeadlessAPI") [ "$T_APP" != HeadlessAPI ] ;;
		"infrastructure != LocalOnPrem") [ "$T_INF" != LocalOnPrem ] ;;
		"rank >= 2 or Stripe/billing signal in repo") [ "$T_RANK" -ge 2 ] ;;
		*) return 2 ;;
	esac
}

sed -n 's/^| \(R[0-9][0-9]\) | \(.*\) | \([0-9, ]*\) |$/\1|\2|\3/p' skills/regwise/SKILL.md | tr -d '`' > "$TMPF.rt"
for fx in examples/*.config.yml; do
	[ -e "$fx" ] || continue
	exp=$(sed -n 's/^# Expected: modules //p' "$fx" | head -n 1 | tr -d ' ')
	[ -n "$exp" ] || { fail routing "$fx" 1 "no '# Expected: modules' line"; continue; }
	T_APP=$(cfg_get "$fx" appType)
	T_AI=$(cfg_get "$fx" aiIntegration)
	T_INF=$(cfg_get "$fx" infrastructure)
	T_MK=$(cfg_get "$fx" targetMarkets)
	T_ENT=0
	case "$(cfg_get "$fx" dataSensitivity)" in
		Public) T_RANK=0 ;;
		StandardPII) T_RANK=1 ;;
		PaymentFinancial) T_RANK=2 ;;
		SensitiveHealth) T_RANK=3 ;;
		EnterpriseB2B) T_RANK=1; T_ENT=1 ;;
		*) fail routing "$fx" 1 "unknown dataSensitivity"; continue ;;
	esac
	got=""
	while IFS='|' read -r rid cond loads; do
		[ -n "$rid" ] || continue
		rule_fires "$cond"
		rc=$?
		if [ "$rc" -eq 2 ]; then
			fail routing skills/regwise/SKILL.md 1 "verify.sh does not know rule condition: $rid $cond"
		elif [ "$rc" -eq 0 ]; then
			got="$got,$loads"
		fi
	done < "$TMPF.rt"
	got=$(printf '%s' "$got" | tr -d ' ' | tr ',' '\n' | grep -v '^$' | sort -un | tr '\n' ',' | sed 's/,$//')
	if [ "$got" != "$exp" ]; then
		fail routing "$fx" 1 "router gives modules $got, fixture expects $exp"
	fi
done

# --- seeded fixture: every expected row ID exists in a module --------------

for ef in examples/*/EXPECTED-FINDINGS.md; do
	[ -f "$ef" ] || continue
	grep -o 'AUDIT-[0-9]-[0-9][0-9]' "$ef" | sort -u > "$TMPF.ex"
	while IFS= read -r rid; do
		[ -n "$rid" ] || continue
		if ! grep -q "^| $rid " $MODULE_GLOB; then
			fail fixture "$ef" 1 "row does not exist in any module: $rid"
		fi
	done < "$TMPF.ex"
done

# --- version drift: fail ---------------------------------------------------
# plugin.json, the marketplace entry and the root README table are one release.
# Only meaningful inside the full marketplace checkout; skipped when the plugin is alone.

mp=../../.claude-plugin/marketplace.json
rd=../../README.md
if [ -f .claude-plugin/plugin.json ]; then
	pv=$(sed -n 's/^[[:space:]]*"version":[[:space:]]*"\([^"]*\)".*/\1/p' .claude-plugin/plugin.json | head -n 1)
	if [ -f "$mp" ]; then
		mv=$(awk '/"name": "regwise"/ { f = 1 } f && /"version"/ { gsub(/[^0-9.]/, "", $2); print $2; exit }' "$mp")
		if [ -n "$mv" ] && [ "$mv" != "$pv" ]; then
			fail version "$mp" 1 "marketplace.json lists regwise $mv, plugin.json says $pv"
		fi
	fi
	if [ -f "$rd" ]; then
		rv=$(sed -n 's/^| \[\*\*[Rr]egwise\*\*\].*| *\([0-9][0-9.]*\) *|[[:space:]]*$/\1/p' "$rd" | head -n 1)
		if [ -n "$rv" ] && [ "$rv" != "$pv" ]; then
			fail version "$rd" 1 "root README lists regwise $rv, plugin.json says $pv"
		fi
	fi
fi

# --- README claims about SKILL.md length -----------------------------------

skl=$(wc -l < skills/regwise/SKILL.md | tr -d ' ')
rl=$(sed -n 's/.*SKILL\.md`\{0,1\}\]\{0,1\}([^)]*) is \([0-9][0-9]*\) lines.*/\1/p' README.md | head -n 1)
if [ -n "$rl" ] && [ "$rl" != "$skl" ]; then
	fail readme README.md 1 "README says SKILL.md is $rl lines; it is $skl"
fi

# --- staleness: warn, never fail -------------------------------------------

days_of() {
	y=${1%%-*}; r=${1#*-}; m=${r%%-*}; d=${r#*-}
	m=${m#0}; d=${d#0}
	[ "$m" -le 2 ] && { y=$((y - 1)); m=$((m + 12)); }
	echo $((365 * y + y / 4 - y / 100 + y / 400 + (153 * (m - 3) + 2) / 5 + d))
}
today=$(days_of "$(date +%Y-%m-%d)")
for f in $MODULE_GLOB; do
	[ -e "$f" ] || continue
	lv=$(sed -n 's/^last_verified:[[:space:]]*//p' "$f" | head -n 1)
	[ -n "$lv" ] || continue
	age=$((today - $(days_of "$lv")))
	if [ "$age" -gt 180 ]; then
		printf 'WARN stale: %s last_verified %s is %s days old (see docs/REFRESH.md)\n' "$f" "$lv" "$age"
	fi
done

# --- report ----------------------------------------------------------------

if [ "$FAILURES" -gt 0 ]; then
	printf '\n%s check(s) failed\n' "$FAILURES"
	exit 1
fi

printf 'ok\n'
exit 0
