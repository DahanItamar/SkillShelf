# Golden: readme-features.md

Command: `/hearsay <path>/examples/inputs/readme-features.md`, run inside a fixture repo. These are state claims against HEAD; no diff is needed.

Expected: 5 claims. 2 verified, 1 unverified, 2 contradicted, 0 unmeasurable.

| # | Claim | Kind | Verdict | Evidence | Note |
|---|---|---|---|---|---|
| H-01 | "Zero dependencies." | Dependency | verified | manifest:dependencies, src/cli.js:1-2, src/index.js:1 | Negative claim. Imports searched in `src/`: built-ins and relative modules only. No `dependencies` key. |
| H-02 | "Requires Node 20 or newer." | Compatibility | verified | package.json:7 | `engines.node` is `>=20`. |
| H-03 | "Supports JSON output via `--json`." | Interface | contradicted | src/cli.js:7 | The option is `--format`; `--format json` gives JSON. No `--json`. |
| H-04 | "Run `npm test` to run the suite." | Tests | contradicted | manifest:scripts | Closed set: the manifest was read in full and has no `scripts` key, so no `test` script. |
| H-05 | "Caches responses on disk." | Behavior | unverified | (none) | No implementation found: searched `cache`, `writeFile`, `mkdir` across `src/`, zero hits. Absence in an open tree is not contradiction. |

Rewrites expected:

- H-03 after: "Supports JSON output via `--format json`."
- H-04 after: "delete: the manifest defines no test script", or an instruction that matches a real one.
- H-05 after: "delete", or the line with `[needs check: disk caching]`.
- H-01 and H-02 are not rewritten.

Grading notes: H-05 must not be contradicted. H-04 is contradicted only because the manifest is a closed set read in full.
