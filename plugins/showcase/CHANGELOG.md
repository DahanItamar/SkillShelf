# Changelog

All notable changes to this plugin. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
- `check.sh` replays a committed example ledger (`docs/example/docs/EVIDENCE.md`) when one exists and lists stale rows.

### Fixed
- Phase 6 no longer contradicts Audit only and Static mode: run facts are listed as `not rechecked`.
- README byte counts were 32 bytes too high.

### Planned
- A verified before/after example on a small fixture, once one can be produced by running the skill and rechecked with `check.sh`. None exists yet.

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
