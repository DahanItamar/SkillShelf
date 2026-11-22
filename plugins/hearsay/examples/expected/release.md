# Golden: release mode

Command, inside a fixture repo built by `scripts/make-fixture.sh`: `/hearsay --release v1.3.0 <path>/examples/inputs/notes-1.4.0.md`

In words: check the release notes since tag v1.3.0 using notes-1.4.0.md

Short shas differ per build, so commits are matched by subject.

Expected summary:

- Current version at HEAD: 1.3.1 (`package.json:3`). Tag: v1.3.0.
- Proposed bump: MAJOR, `2.0.0`. The version is 1.0.0 or higher and there are breaking changes. Driving changes: the removed `parseHtml` export (`base:src/index.js:2`, `diff:src/html.js`) and the changed default timeout (`base:src/cli.js:7`, `src/cli.js:8`).
- The manifest at 1.3.1 is an understated bump: it is only a PATCH over v1.3.0.
- Classification: 2 Breaking, 1 Feature, 1 Fix. The README part of the last commit is Docs.

Commit mismatches: 3 commits flagged, 1 clean.

| Subject | Codes | Evidence |
|---|---|---|
| chore: tidy exports | M1, M3 | A chore message, but `src/index.js` loses the `parseHtml` export and `src/html.js` is deleted. No `!`, no footer. |
| feat: add --json output | M6 | The message names `--json`. The diff adds `--format` at `src/cli.js:7` and has no `--json`. |
| fix: retry on network errors | none (clean) | The diff adds the retry loop in `src/fetch.js` and the version bump. |
| docs: update README | M1, M3, M7 | A docs message, but `src/cli.js:8` changes the default timeout from 30 to 10 (breaking, no `!`), and the commit mixes Docs with a Breaking change. |

Notes ledger: as in `notes-1.4.0.md` (1 verified, 1 unverified, 3 contradicted, 1 unmeasurable).

Not mentioned: nothing additional. The removed `parseHtml` export and the changed default timeout are covered by H-04's rewrite, so listing them again is an error.

"What this cannot tell you" must say that the retry loop and the timeout change are behavior changes whose runtime effect was not run.

Grading: the flagged commits are the three above and not `fix: retry on network errors`. The exact code set on the docs commit may vary by one (for example M3 left out). A wrongly flagged commit, a missing MAJOR or a missing understated-bump flag is a miss.
