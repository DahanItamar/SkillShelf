# Changelog

Release checklist: version in `plugin.json` == the casebook entry (version and description) in the root `.claude-plugin/marketplace.json` == the head of this file; lint rule count in `scripts/check-case.sh` (`RULE_COUNT`) == README (9); close-check count == `skills/casebook-close/references/close-checks.md` (9); `node --test examples/proof/proof.test.mjs` output pasted into the README came from a real run. Nothing here runs at install; check by hand.

## 0.1.0 - 2026-11-22
- First version. Two skills: `/casebook` opens a case file in `docs/bugs/NNN.md`, ranks hypotheses with the cheapest experiment each, and allows no edit to any other file until one experiment result is recorded; `/casebook-close` checks nine conditions (C1 to C9) before it sets a case to closed.
- Done means the repro failed before the fix and passes after, with a regression test pointer. `/casebook-close` re-checks this with a fresh run of the constitution's verify command.
- Optional maintainer check `scripts/check-case.sh` (POSIX sh and awk, 9 rules) and a before/after proof run with `node --test` (no packages). Neither runs at install.
- Worked examples under `examples/`: one hand-written walkthrough, 12 case files that the lint checks, and the proof.
- No constitution needed: with no verify line, Casebook proposes one read-only candidate (package.json test script, Makefile, pytest, go, cargo) and runs it only after your explicit yes. The approved command is recorded in the case header with `(constitution)` or `(user-approved)`, and `/casebook-close` runs only that command.
- Optional header lines: `Verify one:` (scoped single-test run with `{test}`, the full command still runs once as the final proof), `Runs: N`, `Proof command:` and `Single hypothesis reason:`.
- Flaky bugs: Before is valid when at least one of up to 5 runs fails (`runs: <failed>/<total>`); After needs every run to pass. Fix `Attempts:` and the stop rule are defined (a round is one experiment with a recorded result).
- New `[bisect]` experiment for "it used to work": a ready `git bisect run` command for the user; Claude never runs it.
- Non-test proof for visual, timing and production-only bugs: a `Proof command:` or manual checklist, `Check:` plus `Why no test:` in place of a test pointer, and a close summary that says `Closed on a non-test proof`.
- Closing appends one line to `docs/bugs/INDEX.md`, which is searched first at the start of a case.
- Honesty fixes: README says "procedure, not a lock" under the tagline; refusal text now says reading files and read-only git are free; case numbering and committing `docs/bugs/` are explained; `after.mjs` states positive amounts only.
- Lint: the existing 9 rules now also check the new header lines and `[bisect]`; 7 new example cases; proof test gained drift checks for rule count, close-check count and the README byte counts.
- Known v1 limits: the gate is a procedure, not a lock; a bug with neither a test nor a proof can be parked but not closed; the 5-run default for intermittent bugs is not a measured value; token cost is not measured.
