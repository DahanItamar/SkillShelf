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
- Scope includes untracked new files (`git ls-files --others --exclude-standard`), branch base discovery, and a two-pass read (search, then read hits and changed files in full) with a note for large files left unread.
- New "Blast radius" field (money, data-loss, auth, user-text, ops-only) and ordering by certainty, blast radius, path and line. Optional "Check it yourself" line.
- Diff mode also reports a new caller of an existing fake-success function and deleted error handling.
- Optional by request: `.truthpath-accepted.md` baseline (matched by file, pattern and snippet) and a `json` or `sarif` block in chat. No report file is written; the only write is the one accepted line.
- Fixed contradictions: caller search may use the whole repository, one summary rule with an optional pre-existing clause, "read-only until you name one fix", "fix all" refused only when no list is named.
- Language table in the catalogue (shell, Rust, Java, Kotlin, C#, Swift, Python suppress, JS allSettled). Shorter description. README: marketplace-safe install check, cost per run, comparison moved below Limits and dated.
- Re-grade pass: after grading, each suspected finding whose missing link is a file or function in the repository is read once and re-graded; "Still suspected" now applies only to links that cannot be read.
- TP-09 through production wiring: production code that selects a `mocks/` or `fixtures/` module is reported at the production line, with a scope-line warning; README Limits states the remaining test-fake gap plainly.
- "Only new" with a baseline file prints accepted matches as a count. Pre-existing count excludes locations cited in a "Depends on" line (add-refund example now shows 0). No-HEAD repositories handled. Lockfiles, `*.min.*`, `*.map` and files over about 1 MB or 20,000 lines are skipped or only searched.
- Blast radius order explained as a first-fit triage aid; optional `data-loss (audit-trail)` tag. "Check it yourself" is a sketch of at most 3 lines.
- README: "runs only read-only git commands" replaces "runs nothing"; cost line gives an estimated token figure with its method; hint walkthrough moved below Usage; new "Score your own model" section. No model run is recorded yet.
- Maintainer checks: `scripts/score.mjs` scorer, plus assertions for the summary count, the fixed-load size and the README wording.
- Known v1 limits: a reading, not a proof; two-hop caller tracing by default; language coverage is shape-based; output is not deterministic; no model run is claimed.
