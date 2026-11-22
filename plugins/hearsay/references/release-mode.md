# Release mode

Read in release mode (a previous tag and an optional notes file), together with `public-surface.md`. Everything here is
read-only and uses only the git allowlist in `SKILL.md`.

## 1. Preflight

- No tag given: infer it with `git describe --tags --abbrev=0` (with a package directory, add `--match` for the package tag form, `pkg@*` or `pkg-v*`; in a multi-manifest repo without one, say "tag inferred from the newest tag of any package, may be wrong, pass the previous tag"). Print "base inferred from latest tag
  <t>" in the header so the user can correct it. No tags at all: ask for a base ref.
- Resolve the tag: `git rev-parse --verify <tag>^{commit}`.
- If it does not resolve, print `git tag --list` (newest 5 by version) and stop. Make no other claim.
- If `git rev-parse --is-shallow-repository` prints `true`, warn that history may be incomplete.
- Print the commit count and the changed-file count for `<tag>..HEAD`.

## 2. Gather

- Commits: `git log --no-ext-diff --no-textconv --no-merges --format=%h%x09%s <tag>..HEAD`, plus full bodies where a message needs
  checking for a `BREAKING CHANGE` footer.
- Files: `git diff --no-ext-diff --no-textconv --name-status -M <tag> HEAD`.
- Diff range: if `git --no-optional-locks status --porcelain` is dirty, use `git diff --no-ext-diff --no-textconv <tag>` (working
  tree against the tag) so citations match the files; else `<tag> HEAD`. Print which one in the header. With a dirty tree also run
  `git ls-files --others --exclude-standard` (untracked files never appear in `git diff`), treat each
  listed file as added (read it) and add it to the closed set; if the list is long, say so under Not
  checked.
- Per-file diffs, and `git show --no-ext-diff --no-textconv <tag>:<path>` for the base side of any file you cite.
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
`BREAKING CHANGE` footer) and its diff (`git show --no-ext-diff --no-textconv --stat --format= <sha>`, plus hunks where needed).
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

- If a notes file is given, use it. Otherwise use CHANGELOG.md with the section rule in `SKILL.md`
  step 1. State the section in the header. If
  neither exists, print "no notes found to check" and skip this step.
- Run the normal ledger on the notes with the diff source `<tag>..HEAD`.
- Then the reverse check. These go under **Not mentioned**, each with its `path:line` and a suggested
  line (rewrite rule 8): Breaking and Feature changes that no note mentions; a Fix whose diff touches
  auth, crypto, input validation, path handling or data loss, marked `needs-maintainer` for severity
  (say "touches validation code, maintainer to judge", never "a security fix" from the diff alone); and a
  Dependency floor change (`engines`, `python_requires`, minimum toolchain), which is Breaking. Internal
  changes are never listed.
- Do not list a change twice. If a contradicted row's rewrite already states the change, it is covered
  and is not repeated under Not mentioned.
- List at most 10 items under Not mentioned, Breaking first, then Feature, then sensitive-area fixes,
  grouped by file when several share one; count the rest as "N more not listed" in Not checked.

## 7. Output, in this order

1. Header (tag, HEAD sha, commit and file counts, files reviewed, shallow warning if any).
2. Proposed bump, with the current version and the driving changes.
3. Classification table: change, class, evidence, `needs-maintainer` flag.
4. Commit mismatches table: short sha, subject, codes, evidence. Then "N commits clean".
5. The notes ledger (`ledger-template.md`).
6. Not mentioned.
7. Rewrites.
8. "What this cannot tell you": behavior changes, dynamic registration, anything marked
   `needs-maintainer`. With `--no-merges`, changes made only while resolving a merge are in the file
   diff but belong to no listed commit, so the commit-message check cannot cover them; squash-merge
   histories are unaffected.

## Monorepo: package directory

Restrict `git log` and `git diff` to `-- <dir>`, read the manifest in that dir, and match tags of the
form `<pkg>@<ver>` or `<pkg>-v<ver>` with `git tag --list '<pkg>*'`. Without `--path` in a repo with
several manifests, say "multiple manifests found" and scope to the one the notes name, or ask. This
handles only the common layouts; say under Not checked what it did not handle.

## Degraded cases

- Not a git repository: say that change claims are unverified and state claims were checked against
  the files only. Release mode cannot run.
- No tags at all: say so and ask for a base ref.
- Tag is HEAD: "no commits since the tag"; classify nothing.
