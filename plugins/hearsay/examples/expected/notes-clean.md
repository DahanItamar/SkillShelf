# Golden: notes-clean.md (clean control)

Command: `/hearsay <path>/examples/inputs/notes-clean.md --diff <path>/examples/changes/pagegrab.diff`, run inside a fixture repo.

Expected: 2 claims, 2 verified, nothing else.

| # | Claim | Kind | Verdict | Evidence | Note |
|---|---|---|---|---|---|
| H-01 | "Adds a `--format` option that accepts `json`." | Interface | verified | src/cli.js:7, src/cli.js:13 | `--format` is defined and `json` is the value that selects JSON output. It is not in the base: `base:src/cli.js:7` is the timeout option. |
| H-02 | "Removes the `parseHtml` export." | Change | verified | base:src/index.js:2, diff:src/html.js | The export is on the base side and is absent from `src/index.js`. |

The output ends with "No rewrites needed." There is no "Read first" section and no invented finding.
