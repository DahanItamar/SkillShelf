# Release mode

Read with `--release <prev-tag> [notes-path]`, together with `public-surface.md`. Everything here is
read-only and uses only the git allowlist in `SKILL.md`.

## 1. Preflight

- Resolve the tag: `git rev-parse --verify <tag>^{commit}`.
- If it does not resolve, print `git tag --list` (newest 5 by version) and stop. Make no other claim.
- If `git rev-parse --is-shallow-repository` prints `true`, warn that history may be incomplete.
- Print the commit count and the changed-file count for `<tag>..HEAD`.

## 2. Gather

- Commits: `git log --no-merges --format=%h%x09%s <tag>..HEAD`, plus full bodies where a message needs
  checking for a `BREAKING CHANGE` footer.
- Files: `git diff --name-status -M <tag> HEAD`.
- Per-file diffs, and `git show <tag>:<path>` for the base side of any file you cite.
- Large ranges: if there are more than 200 files or about 5,000 changed lines, review in priority
  order: public-surface files, manifests, then the rest. State "reviewed N of M files" in the header.

## 3. Classify each change

Use `public-surface.md`. Classes: Breaking, Feature, Fix, Dependency, Docs, Internal.

- Mark any classification that depends on runtime behavior the reading cannot settle as
  `needs-maintainer`. Do not guess.
- A commit that is reverted inside the range is excluded. Say which, and which commit reverts it.
- Classify the change, not the commit message. The message is checked separately in step 5.

## 4. Propose the bump

The highest class wins.

1. Any Breaking change: MAJOR. For a version below 1.0.0, a breaking change gives MINOR and a feature
   gives PATCH. Name this as the 0.x convention; SemVer itself makes no promise below 1.0.0.
2. Else any Feature: MINOR.
3. Else any Fix or visible Dependency change: PATCH.
4. Else only Docs or Internal: "no release needed; PATCH if you publish anyway".

Show: the current version (the manifest at HEAD, else the tag), the proposed version, and the driving
changes, each with `path:line`. Flag:

- a manifest version that disagrees with the tag;
- a bump already set in the manifest that is lower than the proposal ("understated bump").

Never say "safe to release". Say what the evidence supports and what is `needs-maintainer`.

## 5. Commit-message check

For each commit read the message (including any Conventional Commits type, scope, `!` and
`BREAKING CHANGE` footer) and its diff (`git show --stat --format= <sha>`, plus hunks where needed).
Flag only with diff evidence, citing the short sha and `path:line`.

| Code | Mismatch |
|---|---|
| M1 | understated: a `fix`, `chore`, `docs` or `refactor` message, but the diff adds public surface or changes behavior |
| M2 | overstated: a `feat` or `fix` message, but the diff touches only tests, docs, comments or formatting |
| M3 | a breaking change in the diff with no `!` and no `BREAKING CHANGE` footer |
| M4 | breaking is declared, but the diff shows no breaking change (low confidence) |
| M5 | scope: the message scope names an area the diff does not touch |
| M6 | phantom: the message names a file, symbol or flag the diff does not contain |
| M7 | mixed: one commit holds unrelated changes of different classes |

A vague message ("wip") is not a mismatch unless it hides a breaking change. A commit can carry
several codes. Clean commits are counted, not listed. M6 is the commit-level form of a description that
claims a change the diff does not contain.

## 6. Notes

- If `notes-path` is given, use it. Otherwise use the newest section of CHANGELOG.md. If neither
  exists, print "no notes found to check" and skip this step.
- Run the normal ledger on the notes with the diff source `<tag>..HEAD`.
- Then the reverse check. Breaking or Feature changes that no note mentions go under **Not mentioned**,
  each with its `path:line` and a suggested line (rewrite rule 8). Internal changes are never listed.
- Do not list a change twice. If a contradicted row's rewrite already states the change, it is covered
  and is not repeated under Not mentioned.

## 7. Output, in this order

1. Header (tag, HEAD sha, commit and file counts, files reviewed, shallow warning if any).
2. Proposed bump, with the current version and the driving changes.
3. Classification table: change, class, evidence, `needs-maintainer` flag.
4. Commit mismatches table: short sha, subject, codes, evidence. Then "N commits clean".
5. The notes ledger (`ledger-template.md`).
6. Not mentioned.
7. Rewrites.
8. "What this cannot tell you": behavior changes, dynamic registration, anything marked
   `needs-maintainer`.

## Degraded cases

- Not a git repository: say that change claims are unverified and state claims were checked against
  the files only. Release mode cannot run.
- No tags at all: say so and ask for a `--base <ref>`.
- Tag is HEAD: "no commits since the tag"; classify nothing.
