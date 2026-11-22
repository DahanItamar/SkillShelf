#!/bin/sh
# Hearsay structural verification.
#
# Run from plugins/hearsay:   sh scripts/verify.sh
# Optional argument: a path to the plugin directory.
#
# POSIX shell and standard utilities only. No package manager, nothing fetched,
# nothing installed. It reads files and, for check S15, builds one throwaway git
# repository in a temporary directory (skipped when git is not available).
#
# Exit codes:
#   0  every check passed
#   1  at least one check failed; each is printed as FAIL <check>: <detail>
#   2  the script could not run (wrong directory)

set -u

if [ $# -ge 1 ]; then
	cd "$1" || { printf 'cannot run: cannot enter %s\n' "$1" >&2; exit 2; }
fi

if [ ! -f SKILL.md ] || [ ! -f .claude-plugin/plugin.json ]; then
	printf 'cannot run: SKILL.md or .claude-plugin/plugin.json not found; run from plugins/hearsay\n' >&2
	exit 2
fi

FAILURES=0
fail() {
	printf 'FAIL %s: %s\n' "$1" "$2"
	FAILURES=$((FAILURES + 1))
}
note() {
	printf '  note: %s\n' "$1"
}

TMPD=$(mktemp -d 2>/dev/null) || { printf 'cannot run: mktemp -d failed\n' >&2; exit 2; }
trap 'rm -rf "$TMPD"' EXIT INT TERM

printf 'Hearsay verify\n'

# Text files only, never .git.
TEXTFILES=$TMPD/textfiles
find . -path ./.git -prune -o -type f \
	\( -name '*.md' -o -name '*.json' -o -name '*.sh' -o -name '*.js' -o -name '*.diff' \
	-o -name '*.yml' -o -name '.gitattributes' -o -name 'LICENSE' \) -print > "$TEXTFILES"

# --- S1 layout --------------------------------------------------------------
for f in .claude-plugin/plugin.json .gitattributes CHANGELOG.md LICENSE README.md SKILL.md \
	references/claim-rubric.md references/verdicts.md references/ledger-template.md \
	references/rewrite-rules.md references/release-mode.md references/public-surface.md \
	examples/README.md examples/results/.gitkeep scripts/verify.sh scripts/make-fixture.sh \
	examples/pagegrab/package.json examples/pagegrab/README.md examples/pagegrab/src/cli.js \
	examples/pagegrab/src/fetch.js examples/pagegrab/src/index.js examples/changes/pagegrab.diff \
	examples/inputs/notes-1.4.0.md examples/inputs/readme-features.md examples/inputs/pr-text.md \
	examples/inputs/notes-clean.md examples/inputs/notes-inject.md \
	examples/expected/notes-1.4.0.md examples/expected/readme-features.md \
	examples/expected/pr-text.md examples/expected/release.md examples/expected/notes-clean.md \
	examples/expected/notes-inject.md examples/expected/refusal.md examples/expected/errors.md; do
	[ -f "$f" ] || fail S1 "missing $f"
done
for f in examples/changes/commit-1-chore-tidy-exports.diff examples/changes/commit-2-feat-json-output.diff \
	examples/changes/commit-3-fix-retry.diff examples/changes/commit-4-docs-readme.diff; do
	[ -f "$f" ] || fail S1 "missing $f"
done
[ -e examples/pagegrab/src/html.js ] && fail S1 "examples/pagegrab/src/html.js must be absent at HEAD"

# --- S2 name and versions ---------------------------------------------------
json_field() { # json_field <file> <key>: first value of "key": "value"
	sed -n "s/^[[:space:]]*\"$2\": *\"\\([^\"]*\\)\".*/\\1/p" "$1" | head -1
}
PNAME=$(json_field .claude-plugin/plugin.json name)
PVER=$(json_field .claude-plugin/plugin.json version)
[ "$PNAME" = "hearsay" ] || fail S2 "plugin.json name is '$PNAME', expected hearsay"
CLVER=$(sed -n 's/^## \([0-9][0-9.]*\).*/\1/p' CHANGELOG.md | head -1)
[ -n "$PVER" ] && [ "$PVER" = "$CLVER" ] || fail S2 "plugin.json version '$PVER' != CHANGELOG head '$CLVER'"

ROOTMKT=../../.claude-plugin/marketplace.json
if [ -f "$ROOTMKT" ]; then
	MVER=$(awk '/"name": *"hearsay"/ {f=1} f && /"version"/ {gsub(/.*"version": *"/,""); gsub(/".*/,""); print; exit}' "$ROOTMKT")
	if [ -z "$MVER" ]; then
		note "hearsay is not in the root marketplace.json yet (S2, S12, S13 root parts not checked)"
	else
		[ "$MVER" = "$PVER" ] || fail S2 "marketplace version '$MVER' != plugin.json '$PVER'"
		grep -q '"description": *"Five ' "$ROOTMKT" || fail S13 "marketplace description does not start with Five"
		grep -qi 'five' ../../README.md 2>/dev/null || fail S13 "root README does not say five plugins"
		grep -q 'plugins/hearsay' ../../.github/workflows/ci.yml 2>/dev/null \
			&& grep -q 'verify.sh' ../../.github/workflows/ci.yml 2>/dev/null \
			|| fail S12 "ci.yml has no hearsay job that runs verify.sh"
	fi
else
	note "no root marketplace.json next to this plugin; root checks skipped"
fi

# --- S3 frontmatter ---------------------------------------------------------
FM=$TMPD/fm
awk 'NR==1 && $0=="---" {inside=1; next} inside && $0=="---" {exit} inside {print}' SKILL.md > "$FM"
[ "$(head -1 SKILL.md)" = "---" ] || fail S3 "SKILL.md does not start with ---"
FMLINES=$(wc -l < "$FM" | tr -d ' ')
[ "$FMLINES" = "2" ] || fail S3 "frontmatter has $FMLINES lines, expected exactly name and description"
[ "$(sed -n 1p "$FM")" = "name: hearsay" ] || fail S3 "first frontmatter line is not 'name: hearsay'"
DESC=$(sed -n 's/^description: //p' "$FM")
[ -n "$DESC" ] || fail S3 "description missing or not on one line"
DLEN=$(printf '%s' "$DESC" | wc -c | tr -d ' ')
[ "$DLEN" -le 1024 ] || fail S3 "description is $DLEN characters, limit 1024"
printf '%s' "$DESC" | grep -q 'Does NOT trigger' || fail S3 "description lacks 'Does NOT trigger'"
# --- S11 -------------------------------------------------------------------
grep -qi 'allowed-tools' "$FM" && fail S11 "allowed-tools in frontmatter"

# --- S4 size ----------------------------------------------------------------
SZ=$(wc -c < SKILL.md | tr -d ' ')
LN=$(wc -l < SKILL.md | tr -d ' ')
[ "$SZ" -le 9216 ] || fail S4 "SKILL.md is $SZ bytes, limit 9216"
[ "$LN" -le 160 ] || fail S4 "SKILL.md is $LN lines, limit 160"

# --- S5 references ----------------------------------------------------------
grep -o 'references/[A-Za-z0-9._-]*\.md' SKILL.md | sort -u > "$TMPD/named"
while read -r r; do
	[ -f "$r" ] || fail S5 "SKILL.md names $r which does not exist"
done < "$TMPD/named"
for r in references/*.md; do
	grep -q "^$r\$" "$TMPD/named" || fail S5 "$r is not named in SKILL.md"
done

# --- S6 no emoji ------------------------------------------------------------
b() { printf "\\$1"; }
LOW=$(b 220); HIGH=$(b 237)
EMO1="$(b 360)[$LOW-$HIGH]"
EMO2="$(b 342)[$(b 214)-$(b 217)$(b 230)-$(b 236)$(b 254)$(b 255)]"
EMO3="$(b 357)$(b 270)$(b 217)"
while read -r f; do
	if LC_ALL=C grep -qE "$EMO1|$EMO2|$EMO3" "$f"; then
		fail S6 "emoji or symbol character in $f"
	fi
done < "$TEXTFILES"

# --- S7 no private data -----------------------------------------------------
BS=$(b 134)
P1="[A-Za-z]:[$BS]"
P2="/ho"; P2="${P2}me/"
P3="/Us"; P3="${P3}ers/"
P4='[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}'
P5='(^|[^0-9.])[0-9]{1,3}(\.[0-9]{1,3}){3}([^0-9.]|$)'
P6="to"; P6="${P6}ken="
P7="(^|[^A-Za-z0-9])s"; P7="${P7}k-[A-Za-z0-9]{8,}"
while read -r f; do
	for p in "$P1" "$P2" "$P3" "$P5" "$P6" "$P7"; do
		if grep -qE -- "$p" "$f"; then fail S7 "private-looking text in $f (pattern class matched)"; fi
	done
	if grep -E -- "$P4" "$f" | grep -v 'example\.invalid' | grep -q .; then
		fail S7 "email-like text in $f"
	fi
done < "$TEXTFILES"

# --- S8 README badges -------------------------------------------------------
if [ -f README.md ]; then
	grep -o 'https://img\.shields\.io[^"]*' README.md > "$TMPD/badges" || true
	[ -s "$TMPD/badges" ] || fail S8 "README has no shields.io badge"
	while read -r u; do
		case $u in *style=flat-square*) ;; *) fail S8 "badge not flat-square: $u" ;; esac
		case $u in *0F766E*) ;; *) fail S8 "badge colour is not 0F766E: $u" ;; esac
		case $u in *logo=*) fail S8 "badge has a logo parameter: $u" ;; esac
	done < "$TMPD/badges"
fi

# --- S9 license -------------------------------------------------------------
grep -q 'MIT License' LICENSE && grep -q 'Copyright (c) 2026 Itamar Dahan' LICENSE \
	|| fail S9 "LICENSE lacks 'MIT License' or the copyright line"

# --- S10 nothing executes at install ----------------------------------------
[ -d hooks ] && fail S10 "hooks directory present"
grep -q '"hooks"' .claude-plugin/plugin.json && fail S10 "hooks key in plugin.json"
BIG=$(find . -path ./.git -prune -o -type f -size +200k -print)
[ -z "$BIG" ] || fail S10 "file larger than 200 KB: $BIG"

# --- S14 cited paths in goldens exist ---------------------------------------
for g in examples/expected/*.md; do
	sed 's/base:[^ ,`)]*//g' "$g" | grep -oE '[A-Za-z0-9_./-]+:[0-9]+(-[0-9]+)?' | sort -u > "$TMPD/cites"
	while read -r c; do
		path=${c%%:*}
		rest=${c#*:}
		last=${rest##*-}
		[ -f "examples/pagegrab/$path" ] || { fail S14 "$g cites $c but examples/pagegrab/$path does not exist"; continue; }
		have=$(wc -l < "examples/pagegrab/$path" | tr -d ' ')
		[ "$last" -le "$have" ] || fail S14 "$g cites $c but the file has $have lines"
	done < "$TMPD/cites"
done

# --- S15 fixture builds -----------------------------------------------------
if command -v git >/dev/null 2>&1; then
	if sh scripts/make-fixture.sh "$TMPD/fx" > "$TMPD/fx.log" 2>&1; then
		N=$(git -C "$TMPD/fx" rev-list --count HEAD 2>/dev/null)
		[ "$N" = "5" ] || fail S15 "fixture has $N commits, expected 5"
		git -C "$TMPD/fx" rev-parse --verify v1.3.0 >/dev/null 2>&1 || fail S15 "fixture has no tag v1.3.0"
		[ "$(git -C "$TMPD/fx" diff --name-only v1.3.0 HEAD | wc -l | tr -d " ")" = "6" ] \
			|| fail S15 "expected 6 files changed between v1.3.0 and HEAD"
	else
		fail S15 "make-fixture.sh failed: $(tail -1 "$TMPD/fx.log")"
	fi
else
	note "git not found; fixture build (S15) skipped"
fi

if [ "$FAILURES" -eq 0 ]; then
	printf 'OK: all checks passed\n'
	exit 0
fi
printf '%s check(s) failed\n' "$FAILURES"
exit 1
