# Changelog

All notable changes to this plugin. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [3.4.0] - 2026-11-22

### Added
- `scripts/spec-check.sh`: an optional POSIX `sh` checker for checks 1 to 4 of `spec-check` (cited ids exist, every active criterion is closed, no duplicate ids, `preserves` citations resolve). It prints the same `Orphans: N` line and exits non-zero on orphans. You run it yourself; nothing runs it at install. A test against the fixture is in `examples/spec-check-fixture/spec-check.test.mjs`.
- Teams and parallel branches: proposals written on a branch use provisional ids (`0000-slug`, `AC-NEW-n`), and `/spec-drift` assigns the real ordinal and `AC-###` numbers at merge.
- A small-change lane: a change that touches at most three criteria and adds no data model or interface becomes one `PROPOSAL.md` with its tasks inline.
- A first-match-wins order for `spec-start` routing, and a rule that flags an unchecked task list with no recent commits as possibly abandoned.
- A "What it weighs" table in the README, in bytes.

### Changed
- `spec-implement` prints the verify command and asks you to confirm it before the first task, and again if it changes. In a non-interactive run it runs the command only if the constitution has a `Reviewed:` line. `spec-refactor` follows the same rule.
- `spec-architect` has one question rule: three to five in the first round, eight in total.
- `spec-check` check 6 matches `closes AC-###`; the task number is optional text.
- The CI recipe in the README runs `scripts/spec-check.sh` instead of a model call.
- The README comparison table fills cells only where a source is linked, and says the sources are third-party write-ups.
- The scope is stated: one spec set per repository root.

### Removed
- The `Verify:` header line in `TASKS.md` examples. `spec-implement` never used it.
- The emoji in the README, the CI badge, and the relative links to other plugins.

## [3.3.0] - 2026-11-22

The first version recorded in this repository's git history. It arrived with the rename of the skills to the `spec-*` names and the move of the plugin to `plugins/blueprint`.

- Eight skills: `spec-start`, `spec-constitution`, `spec-architect`, `spec-tasks`, `spec-implement`, `spec-drift`, `spec-refactor` and the opt-in `spec-check`.
- `spec-check` ends with a fixed `Orphans: N` line, and prints `Orphans: unknown` when it cannot run.
- A hand-built `spec-check` fixture and an executable illustration under `examples/proof/`.

Versions before 3.3.0 are not itemised: the git history of this repository does not record them.
