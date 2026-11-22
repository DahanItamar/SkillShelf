# Scope

Truthpath reads production code. This file says what to read, what to skip, and which commands are allowed.

## Target types

| The user gives | What to do |
| --- | --- |
| Pasted diff text | Treat it as a diff. Find the files it touches and read them in full. |
| A `.diff` or `.patch` file | Read the file, then treat it as pasted diff text. |
| "my changes", "this branch" | Get a diff with the allowed git commands below. |
| A file or a directory path | Directory mode: read every production file in it. |
| A pull request checked out locally | Treat it as a branch: `git diff <base>...HEAD`. |
| Nothing | If there are uncommitted changes, use `git diff HEAD`. Otherwise ask one question: "Scan which: a path, a branch compared to its base, or a diff?" |

## Allowed commands

Only these read-only git commands may be run to get a diff or a file list:

- `git diff`
- `git diff --staged`
- `git diff <base>...HEAD`
- `git show <ref>`
- `git ls-files`
- `git merge-base`

Nothing else is run: no tests, no build, no application, no package manager, no script from the scanned code.

## Diff mode: the anchor rule

- Report only findings whose anchor line is added or changed in the diff. Use new-file line numbers.
- Still read the whole changed file, and the callers of the changed code, for context.
- A problem that exists only in unchanged lines is not reported. Count it, and say in the summary line how many pre-existing candidates were outside the diff.
- The anchor is the line where the failure is dropped or turned into the success-shaped result (see Step 5 of SKILL.md). If that line is added or changed, the finding is in scope even when the failing call it wraps was already there.

## Exclusions

Skip these paths. They are not production code.

- Test and fixture directories: `test/`, `tests/`, `__tests__/`, `spec/`, `__mocks__/`, `mocks/`, `fixtures/`, `testdata/`, `e2e/`, `cypress/`
- Test file names: `*.test.*`, `*.spec.*`, `*_test.go`, `test_*.py`, `*_test.py`, `conftest.py`, `*.stories.*`
- Dependencies and build output: `node_modules/`, `vendor/`, `dist/`, `build/`, `.git/`
- Generated or minified files (a header saying generated, or a `.min.` name)

Mocks and fakes are expected in test code, so test files can never be included in this version. If the user asks to scan them, reply with the one-line refusal in SKILL.md.

List every skipped test file in the scope line, or give a count if there are many.

## User override for production directories

A user may name a directory as production even when it matches the list, for example "examples/ ships" or "the build folder is hand-written". That overrides the directory exclusions for that run, and only for the directory they named. It never applies to test directories or test file names.

## Large scope

Above 200 production files (a default, not evidence), ask the user to narrow the scope, or to confirm a folder-by-folder pass. Do not silently read a sample and report as if it were everything.

## Scope line

Print it first. Examples:

```text
Scope: directory src/ (8 production files read; 1 skipped as test code: test/orders.test.js)
Scope: diff main...HEAD (3 production files changed and read in full; 0 skipped as test code)
```
