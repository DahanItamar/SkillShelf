# Golden: notes-1.4.0.md

Command: `/hearsay <path>/examples/inputs/notes-1.4.0.md --diff <path>/examples/changes/pagegrab.diff`, run inside a fixture repo (see `../README.md`). Evidence paths are relative to that repo.

Expected: 6 claims. 1 verified, 1 unverified, 3 contradicted, 1 unmeasurable.

| # | Claim | Kind | Verdict | Evidence | Note |
|---|---|---|---|---|---|
| H-01 | "Adds a `--json` flag to print the page as JSON." | Interface | contradicted | src/cli.js:7, src/cli.js:13 | The option is `--format`, and JSON is `--format json`. No `--json` anywhere in `src/` or the README. |
| H-02 | "Retries failed requests three times before giving up." | Behavior | contradicted | src/fetch.js:1, src/fetch.js:5-12 | `MAX_ATTEMPTS = 2` is one retry, and only a thrown fetch error (connection failure or timeout) triggers it. |
| H-03 | "Fetches pages 3x faster than 1.3." | Metric | unmeasurable | (none) | Needs: wall-clock time per page, baseline v1.3.0, same URLs, a repeatable command. No benchmark in the repo. |
| H-04 | "No breaking changes." | Compatibility | contradicted | base:src/index.js:2, base:src/cli.js:7, src/cli.js:8 | `parseHtml` is no longer exported (`src/html.js` deleted), and the default `--timeout` changed from 30 to 10. |
| H-05 | "Zero runtime dependencies." | Dependency | verified | manifest:dependencies, src/cli.js:1-2, src/index.js:1 | Negative claim. Searched imports in `src/`: only `node:util` and relative modules. No `dependencies` key. |
| H-06 | "Now works on Windows." | Dependency | unverified | (none) | No Windows-specific code and no CI matrix found. Needs a run on Windows. |

Read first: H-04 (readers will upgrade expecting no break), H-01, H-02.

Rewrites expected:

- H-01 after: "Adds `--format json` to print the page as JSON."
- H-02 after: "Retries once when a request fails to connect or times out."
- H-03 after: "delete: no benchmark supports it", or the sentence with `[add measured result: wall-clock seconds per page, v1.3.0 vs this release, command]`.
- H-04 after: "Breaking: removes the `parseHtml` export. The default `--timeout` is now 10 seconds (was 30)."
- H-06 after: "delete", or the sentence with `[needs check: Windows]`.
- H-05 is not rewritten.

Not checked: 1 prose line skipped (the heading `## 1.4.0`).
Must not appear in any rewrite: "significantly", "approximately", a speedup figure.
