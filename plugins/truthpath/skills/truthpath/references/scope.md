# Scope

Truthpath reads production code. This file says what to read, what to skip, and which commands are allowed.

## Target types

| The user gives | What to do |
| --- | --- |
| Pasted diff text | Treat it as a diff. Find the files it touches and read them in full. |
| A `.diff` or `.patch` file | Read the file, then treat it as pasted diff text. |
| "my changes" | `git diff HEAD` plus every untracked production file from `git ls-files --others --exclude-standard`, each treated as entirely added (every line is in the diff). If `git diff HEAD` fails because the repository has no commits, treat every production file from `git ls-files` and `git ls-files --others --exclude-standard` as added. |
| "this branch" | Base = the base the user named, else the first that exists of `origin/HEAD`, `main`, `master`, `develop` (test with `git merge-base <ref> HEAD`). Confirm it in one line; if none exists, ask one question. Then `git diff <base>...HEAD`. |
| A file or a directory path | Directory mode: two-pass read (search, then read hits in full) as in SKILL.md Step 3. |
| A pull request checked out locally | Treat it as a branch (same base rule). |
| Nothing | If there are uncommitted changes or untracked files, treat it as "my changes". Otherwise ask one question: "Scan which: a path, a branch compared to its base, or a diff?" |

## Allowed commands

Only these read-only git commands may be run to get a diff or a file list:

- `git diff`
- `git diff --staged`
- `git diff <base>...HEAD`
- `git show <ref>`
- `git ls-files`
- `git ls-files --others --exclude-standard`
- `git merge-base`

Nothing else is run: no tests, no build, no application, no package manager, no script from the scanned code. This list applies to commands only. Reading files and searching the whole repository for callers with your own search or read ability is allowed and is not a shell command.

## Diff mode: the anchor rule

- Report only findings whose anchor line is added or changed in the diff. Use new-file line numbers.
- Still read the whole changed file, and the callers of the changed code, for context.
- A problem that exists only in unchanged lines is not reported, except the two cases below. Count it, and say in the summary line how many pre-existing candidates were outside the diff. A location already cited by a reported finding's `Depends on` line is not counted.
- The anchor is the line where the failure is dropped or turned into the success-shaped result (see Step 5 of SKILL.md). If that line is added or changed, the finding is in scope even when the failing call it wraps was already there.

- **New caller of an existing fake-success function.** If an added or changed line consumes the result of a function whose unchanged body matches a pattern, report at the caller, with the line `depends on pre-existing TP-NN at <file>:<line>`. Grade it by the normal certainty rule.
- **Deleted error handling.** If removed lines held a status check, a raise, a rethrow or a log, and the remaining code now drops the failure, it is a candidate anchored at the nearest remaining added or changed line. Say what was removed.
- Untracked files have no diff header: every line counts as added.

## Exclusions

Skip these paths. They are not production code.

- Test and fixture directories: `test/`, `tests/`, `__tests__/`, `spec/`, `__mocks__/`, `mocks/`, `fixtures/`, `testdata/`, `e2e/`, `cypress/`
- Test file names: `*.test.*`, `*.spec.*`, `*_test.go`, `test_*.py`, `*_test.py`, `conftest.py`, `*.stories.*`
- Dependencies and build output: `node_modules/`, `vendor/`, `dist/`, `build/`, `.git/`
- Generated or minified files (a header saying generated, or a `.min.` name), `*.min.*`, `*.map`
- Lockfiles: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock`, `Cargo.lock`, `go.sum`, `Gemfile.lock`
- Size cap: any file over about 1 MB or 20,000 lines is searched, not read, and is named in the scope line. The "about 1500 lines" read-in-full rule for other files is unchanged.

Mocks and fakes are expected in test code, so test files can never be included in this version. The one exception is production wiring (TP-09): when production code (a config default, a dependency-injection binding, a build target, an entry point or an import) selects a `mocks/` or `fixtures/` module, report that production line, and add a warning to the scope line that production imports the skipped directory. If the user asks to scan them, reply with the one-line refusal in SKILL.md.

List every skipped test file in the scope line, or give a count if there are many. When a `mocks/` or `fixtures/` directory is skipped, print it in the scope line with `skipped as test dir; say "<dir> ships" if it is production`.

## User override for production directories

A user may name a directory as production even when it matches the list, for example "examples/ ships" or "the build folder is hand-written". That overrides the directory exclusions for that run, and only for the directory they named. It never applies to test directories or test file names.

## Large scope

Above 200 production files (a default, not evidence), ask the user to narrow the scope, or to confirm a folder-by-folder pass. Do not silently read a sample and report as if it were everything.

## Scope line

Print it first. Examples:

```text
Scope: my changes (2 production files changed and read in full, 1 untracked file treated as new; 0 skipped as test code)
Scope: directory src/ (8 production files read; 1 big file searched, not read in full; mocks/ skipped as test dir; say "mocks/ ships" if it is production)
Scope: directory src/ (8 production files read; 1 skipped as test code: test/orders.test.js)
Scope: diff main...HEAD (3 production files changed and read in full; 0 skipped as test code)
```
