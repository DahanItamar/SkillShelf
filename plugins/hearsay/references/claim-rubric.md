# Claim rubric

Read at step 2. It decides what to extract and how.

## What is a claim

A clause that a reasonable person could contradict by pointing at a file, running something or
measuring something. The test: **could someone point at a file and say this contradicts it?** If not,
and no measurement could either, it is not a claim.

## Kinds

Tag each claim with one kind. The letter is for reading the rubric; the word goes in the Kind column.

| Id | Kind | Examples |
|---|---|---|
| C | change | added, removed, renamed, moved, deprecated, changed default |
| I | interface | export, CLI flag, config key, env var, route, exit code, file format |
| B | behavior | "retries", "returns 404 when", "fixes the crash when" |
| K | compatibility | "no breaking changes", "backward compatible", "requires Node 20", "supports Python 3.9+" |
| D | dependency or platform | "zero dependencies", "uses SQLite", "adds Windows support" |
| T | tests | "adds tests for X", "all tests pass", "100% coverage" |
| O | docs | "docs updated", "see docs/x.md" |
| M | metric | countable ("200 tests") versus performance ("3x faster") |
| R | reference | file, path, link, issue or PR number, version |
| S | scope | "only touches X", "no functional change", "refactor only" |

## Time frames

- A **state claim** is true of the HEAD tree. README feature lists are state claims.
- A **change claim** is true of base..HEAD. Release notes, changelogs and PR text are change claims.

Match the evidence to the frame. "Adds X" where X already exists in the base is contradicted: cite the
base `path:line`. A change claim is never verified by finding the thing at HEAD without also checking
that it was not already in the base.

## Extraction rules

- **Atomize.** "Adds `--json` and retries three times" is two claims, H-01 and H-02.
- **Quote verbatim.** The Claim cell must be a substring of the source. Do not tidy or translate.
- **Keep hedges.** "Should be faster" is extracted; it is usually unmeasurable.
- **Quantifiers** (all, every, never, always, fully) need an exhaustive search. One counterexample
  contradicts the claim.
- **Negatives** ("no network calls", "zero dependencies") are verified only by a stated search: the
  terms and paths searched, with zero hits. Write that search in the Note column.
- **Future or roadmap statements** are not claims about HEAD. Skip them. If a README feature list
  presents one as present, extract it as a state claim.
- **Not claims:** headings, dates, greetings and marketing adjectives with no testable core. Count
  them and report "N prose lines skipped" under "Not checked".
- **A version number** is a claim only in release mode, where it is checked against the manifest and
  the proposed bump.
- **A changelog** is checked for one section: the one the user names; else the one equal to the
  manifest version; else `Unreleased` if it is the newest; else the newest. Report "N other sections
  not checked".
- **Cap.** At most 40 ledger rows. If there are more claims, keep the riskiest (compatibility, scope,
  interface, behavior, then the rest) and report the rest by kind (see ledger-template). `--rows 41-80`
  re-extracts in the same order and skips the first 40 rows.

## Cheap mechanical checks first (README feature lists)

Do these before anything that needs judgment. Each is a quick read.

- Script and command names exist in the manifest `scripts` or `bin`.
- Relative links and file references resolve.
- The version badge or text matches the manifest.
- Stated runtime versions match `engines`, `python_requires`, the `go` directive or `rust-version`.
- The stated license matches the LICENSE file.

A failed mechanical check is usually contradicted with a closed set (the manifest read in full).

## Worked splits

| Sentence | Claims |
|---|---|
| "Refactor only, no functional change." | One scope claim (S): the whole sentence |
| "Adds `--format` and drops the old `--json` alias." | H-01 "Adds `--format`" (I), H-02 "drops the old `--json` alias" (C) |
| "Faster and more reliable." | H-01 "Faster" (M), H-02 "more reliable" (M); both usually unmeasurable |
| "Coming soon: Windows support." | Not a claim about HEAD. Skipped. |
