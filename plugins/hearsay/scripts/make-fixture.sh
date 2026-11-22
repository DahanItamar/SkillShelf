#!/bin/sh
# Hearsay: build a throwaway git repository for release-mode examples.
#
# Usage: sh scripts/make-fixture.sh <new-directory>
#
# Writes only inside <new-directory>, which must not exist yet. Commits with an
# inline identity, so no global git config is read or changed. Needs git and
# POSIX utilities. Nothing is fetched or pushed.
#
# History it builds: tag v1.3.0 on the base, then four commits:
#   chore: tidy exports
#   feat: add --json output
#   fix: retry on network errors
#   docs: update README
# Exit codes: 0 built, 1 refused or failed, 2 usage error.

set -eu

if [ $# -ne 1 ]; then
	printf 'usage: sh scripts/make-fixture.sh <new-directory>\n' >&2
	exit 2
fi

DEST=$1
HERE=$(cd "$(dirname "$0")/.." && pwd)

if [ -e "$DEST" ]; then
	printf 'refusing: %s already exists\n' "$DEST" >&2
	exit 1
fi
if [ ! -d "$HERE/examples/pagegrab" ] || [ ! -d "$HERE/examples/changes" ]; then
	printf 'cannot run: examples/pagegrab or examples/changes is missing\n' >&2
	exit 2
fi

mkdir -p "$DEST"
DEST=$(cd "$DEST" && pwd)
cp -R "$HERE/examples/pagegrab/." "$DEST/"
cd "$DEST"

g() {
	git -c user.name=fixture -c user.email=fixture@example.invalid \
		-c commit.gpgsign=false -c core.autocrlf=false -c core.hooksPath=/dev/null "$@"
}

# The tree above is HEAD. Undo the combined diff to get the base.
g apply -R "$HERE/examples/changes/pagegrab.diff"

g init -q
g add -A
g commit -q -m "Initial import at 1.3.0"
g tag v1.3.0

step() {
	g apply "$HERE/examples/changes/$1"
	g add -A
	g commit -q -m "$2"
}
step commit-1-chore-tidy-exports.diff "chore: tidy exports"
step commit-2-feat-json-output.diff "feat: add --json output"
step commit-3-fix-retry.diff "fix: retry on network errors"
step commit-4-docs-readme.diff "docs: update README"

if ! diff -r -x .git "$HERE/examples/pagegrab" "$DEST" >/dev/null; then
	printf 'fixture does not match examples/pagegrab at HEAD\n' >&2
	exit 1
fi
printf 'built %s (tag v1.3.0 plus 4 commits)\n' "$DEST"
