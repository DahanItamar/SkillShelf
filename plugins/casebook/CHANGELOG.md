# Changelog

Release checklist: version in `plugin.json` == the casebook entry (version and description) in the root `.claude-plugin/marketplace.json` == the head of this file; lint rule count in `scripts/check-case.sh` (`RULE_COUNT`) == README (9); close-check count == `skills/casebook-close/references/close-checks.md` (9); `node --test examples/proof/proof.test.mjs` output pasted into the README came from a real run. Nothing here runs at install; check by hand.

## 0.1.0 - 2026-11-22
- First version. Two skills: `/casebook` opens a case file in `docs/bugs/NNN.md`, ranks hypotheses with the cheapest experiment each, and allows no edit to any other file until one experiment result is recorded; `/casebook-close` checks nine conditions (C1 to C9) before it sets a case to closed.
- Done means the repro failed before the fix and passes after, with a regression test pointer. `/casebook-close` re-checks this with a fresh run of the constitution's verify command.
- Optional maintainer check `scripts/check-case.sh` (POSIX sh and awk, 9 rules) and a before/after proof run with `node --test` (no packages). Neither runs at install.
- Worked examples under `examples/`: one hand-written walkthrough, 12 case files that the lint checks, and the proof.
- Known v1 limits: the gate is a procedure, not a lock; bugs the verify command cannot express can be parked but not closed; the 5-run threshold for intermittent bugs is a default, not a measured value.
