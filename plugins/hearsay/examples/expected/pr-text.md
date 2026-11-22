# Golden: pr-text.md

Command: `/hearsay <path>/examples/inputs/pr-text.md --diff <path>/examples/changes/pagegrab.diff`, run inside a fixture repo.

In words: fact-check pr-text.md against the diff file pagegrab.diff

Expected: 3 claims, all contradicted.

| # | Claim | Kind | Verdict | Evidence | Note |
|---|---|---|---|---|---|
| H-01 | "Refactor only, no functional change." | Scope | contradicted | src/fetch.js:1-14, src/cli.js:8, src/cli.js:7 | The diff adds a retry loop, changes the default timeout from 30 to 10 and adds a `--format` option. Behavior changed. |
| H-02 | "Adds tests for the retry loop." | Tests | contradicted | diff:src/fetch.js | Closed set: the complete diff file list has no test file. The retry loop is at `src/fetch.js:5-12`. |
| H-03 | "Renames fetchPage to getPage." | Change | contradicted | src/fetch.js:3, src/index.js:1 | `fetchPage` is still defined at `src/fetch.js:3` and exported at `src/index.js:1`. No `getPage` anywhere. |

Rewrites expected:

- H-01: replace with what the diff shows (adds a retry, changes the default timeout, adds `--format`), or delete.
- H-02: delete, or "No tests are added in this change."
- H-03: delete.
