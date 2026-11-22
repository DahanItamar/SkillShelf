# Changelog

All notable changes to this plugin. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.3.0] - 2026-11-22

### Fixed
- `scripts/replay.sh` was vacuous: its pipe-escaping step mangled the ledger on GNU sed, no row was ever replayed, and it printed nothing and exited 0 even for a corrupted ledger. Earlier "replays clean" wording gave no evidence. It now replays rows, prints `replayed N of M rows`, and exits non-zero on a stale row or when it replays zero rows. `check.sh` has a negative test that corrupts a stored value and requires a `STALE` report.

### Added
- `examples/`: a small fixture, the README written for it and its evidence ledger. It is a hand-authored reference example following the skill's rules, not generated output.
- `scripts/replay.sh`, an optional maintainer or CI check that replays a ledger (it runs the ledger's commands, so only use a ledger you trust).
- `references/modes.md`, loaded only for non-Write modes or special shapes, with a fixed six-item Audit only checklist and one output table.
- README section "Use it in other tools".
- Redaction now covers personal data, internal hostnames, IPs and account ids, prefers seeded data, and adds a pre-write scan. This lowers the leak risk; it is not a compliance claim.
- Regulated-repository rule in the run-safety gate and a `regulated` key for `.showcase.md` that can only tighten the gate. A prompt-level rule, not a sandbox or a compliance claim.
- `examples/redaction.md`: a worked pre-write scan with synthetic data and the filled handover table; `check.sh` reruns the scan against it.
- `check.sh` validates the SKILL.md frontmatter and that every reference named in SKILL.md exists.

### Changed
- Handover is one fixed six-row table, always present; rows that did not run say `not run`.
- Run-safety gate tightened: own means you wrote it, your organisation owns it, or you said yes in this session; other clones default to Static. A throwaway copy or container is offered first. The detailed checklist moved to `references/run-recipes.md`.
- The port check runs only when a server was started.
- Stranger test leads with a reread in a scratch copy; a fresh-context helper is optional. Wording is tool-neutral.
- Hard rules: delete only run artifacts you created; the process-document ban applies to the repository being documented.
- `SKILL.md` is smaller (16,523 bytes, from 18,897).
- README shortened.

### Removed
- `docs/` maintainer files (spec, constitution, task lists) no longer ship inside the plugin folder, so a copy of the folder carries less.

## [2.2.0] - 2026-11-22

### Changed
- Phase 1 ownership rule is explicit; a run nobody can answer falls to Static mode.
- Banner names the mode and lists only the phases that run.
- Static mode states what Phase 3 collects.
- Run-safety gate: tests run only on the user's own repository or after confirmation; no confirmation means no execution.
- Static mode: say "do not run anything" and the skill writes from code and tests, marking every runtime fact unverified.
- Modes table in Phase 0. Audit only now runs Phase 0 plus the Phase 6 checks, reads only what the README points at, and no longer runs the project.
- Stranger test is offered with its cost and runs only if you say yes.
- Refresh compares extracted values with a stated tolerance for volatile fields, instead of hashing raw output.
- Port check commands for Linux, macOS and Windows in `references/run-recipes.md`.
- Sample blocks are marked as samples and use a neutral name; one-colour badge guidance.

### Added
- `.showcase.md` format in `references/readme-template.md`.
- `check.sh`, a maintainer-run script that rechecks the sizes and line counts quoted in the README, its links, and sample names. It is not loaded at run time.
- This changelog.
- Evidence ledger schema (columns, default tolerances) in `references/evidence-rules.md`.
- Agency and shared-preset guidance for `.showcase.md`.
- `check.sh` replays a committed example ledger when one exists and lists stale rows.

### Fixed
- Phase 6 no longer contradicts Audit only and Static mode: run facts are listed as `not rechecked`.
- README byte counts were 32 bytes too high.

## [2.1.0] - 2026-11-22

Date is the first one in this repository's git history for this plugin.

### Changed
- The badge rule tests the badge, not the row.

### Added
- Run-safety gate before the project is run.
- Audit-only mode, which writes nothing.
- `docs/EVIDENCE.md` refresh: a later run replays the ledger and edits only stale facts.
- Internal service skeleton in `references/readme-template.md`.

## [2.0.0]

Release date not recorded in this repository's history.

### Changed
- Version 1 banned badge rows outright. Version 2 replaced that ban with admission tests: an element is kept only if it carries a checkable fact.
