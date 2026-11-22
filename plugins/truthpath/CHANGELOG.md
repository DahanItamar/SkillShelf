# Changelog

Release checklist: version in `plugin.json` == the truthpath entry (version and description) in the root `.claude-plugin/marketplace.json` == the README badge == the head of this file. `node --test scripts/check.test.mjs` passes. `examples/expected/planted-hints.txt` is a real recorded run of `scripts/hints.sh`. Nothing here runs at install.

## 0.1.0 - 2026-11-22
- First version. One skill, `truthpath`: reads production code, a diff, a branch or a directory and reports code that looks finished but quietly fakes success.
- Ten patterns (TP-01 to TP-10): swallowed errors, catches that report success, defaults returned on failure, placeholder endpoints, sample data in production, constant stubs, not-implemented branches behind a success path, retries that hide the last failure, fakes as the only dependency, and ignored failure signals. Each pattern file has examples in at least two languages and a "Not a finding when" list.
- Every finding has file, line, pattern, what happens, how a user is misled, a certainty grade (confirmed or suspected, with a written rule) and the smallest fix. A "Not reported" list shows rejected candidates.
- Diff mode reports only added or changed lines and counts pre-existing candidates outside the diff.
- Read-only: only read-only git commands, no edits unless one named fix is requested, one fix at a time. Test files are out of scope.
- Optional maintainer checks, `scripts/hints.sh` (POSIX sh and awk) and `node --test scripts/check.test.mjs` (no packages). Neither runs at install.
- Worked examples under `examples/`: a planted sample with expected findings written by hand, the recorded hint output, and a diff example.
- Known v1 limits: a reading, not a proof; two-hop caller tracing by default; language coverage is shape-based; output is not deterministic; no model run is claimed.
