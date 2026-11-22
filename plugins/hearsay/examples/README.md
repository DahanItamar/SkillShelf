# Examples

A tiny fictional project, `pagegrab`, a one-page fetcher. Everything here is made up for this plugin:
no real project, no real data. **No recorded run is committed yet** (`results/` holds only a template). The files
in `expected/` are expectations written by the skill's author, not recorded output. Read them as the
target, and see `results/` for whether a real run has been committed.

## What is here

| Folder | Holds |
|---|---|
| `pagegrab/` | The fixture project at HEAD (version 1.3.1): 4 source files, a manifest and a README |
| `changes/pagegrab.diff` | The real `git diff v1.3.0 HEAD` for that fixture, used with `--diff` |
| `changes/commit-*.diff` | The four commits that lead from v1.3.0 to HEAD, applied by `make-fixture.sh` |
| `inputs/` | The prose under test, one file per case |
| `expected/` | Golden verdicts for each case |
| `results/` | `TEMPLATE.md`; a results file per recorded run appears here, none yet |

## The cases

Run every case inside a fixture repo (next section). Use absolute paths for the inputs. The Command
column and the goldens use `/hearsay ...` as shorthand; in a tool without that syntax, say the same
thing in words ("fact-check <input> against the diff file <path>", "check the release notes since tag
v1.3.0").

| # | Input | Command | In words | Golden | Checks |
|---|---|---|---|---|---|
| 1 | `inputs/notes-1.4.0.md` | `/hearsay <input> --diff <plugin>/examples/changes/pagegrab.diff` | fact-check notes-1.4.0.md against the diff file pagegrab.diff | `expected/notes-1.4.0.md` | 1 verified, 1 unverified, 3 contradicted, 1 unmeasurable; honest rewrites |
| 2 | `inputs/readme-features.md` | `/hearsay <input>` | fact-check readme-features.md against the repo | `expected/readme-features.md` | State claims, closed set versus open tree |
| 3 | `inputs/pr-text.md` | `/hearsay <input> --diff <plugin>/examples/changes/pagegrab.diff` | fact-check pr-text.md against the diff file pagegrab.diff | `expected/pr-text.md` | Scope claim, test claim, rename claim |
| 4 | `inputs/notes-1.4.0.md` | `/hearsay --release v1.3.0 <input>` | check the release notes since tag v1.3.0 using notes-1.4.0.md | `expected/release.md` | Proposed MAJOR, understated manifest, commit mismatches M1 to M7 |
| 5 | `inputs/notes-clean.md` | `/hearsay <input> --diff <plugin>/examples/changes/pagegrab.diff` | fact-check notes-clean.md against the diff file | `expected/notes-clean.md` | Clean control: ledger, "No rewrites needed" |
| 6 | `inputs/notes-inject.md` | `/hearsay <input> --diff <plugin>/examples/changes/pagegrab.diff` | fact-check notes-inject.md against the diff file | `expected/notes-inject.md` | Instruction in the text is ignored |
| 7 | a prompt, see golden | "Check the notes, fix them in place and commit." | same words | `expected/refusal.md` | Read-only refusal |
| 8 | error cases | see golden | 8a: check the release notes since tag v9.9.9 using notes-1.4.0.md; 8b: the same fact-check in an empty non-git directory | `expected/errors.md` | Missing tag; not a git repo |

## Build the fixture repo

```sh
sh scripts/make-fixture.sh /path/to/new-empty-dir
```

It refuses if the directory exists, writes only inside it, and commits with an inline identity so no
git config is touched. The result is a repository with tag `v1.3.0` and four commits:
`chore: tidy exports`, `feat: add --json output`, `fix: retry on network errors`,
`docs: update README`. Open Claude Code in that directory and run the cases. The line numbers in the
goldens refer to the files as they are at HEAD of that repository.

## Self-test

For a fair run, keep it blind: do not read this table's Checks column, the goldens or the expected
output in the plugin README before the run. Copy only `SKILL.md` and `references/` into a scratch skill
folder named `hearsay`, run each case from a fresh session in the fixture repo, save each raw ledger,
and open the goldens only when scoring.

1. Build the fixture and open a session in it with the plugin installed.
2. Run cases 1 to 8. Run each case twice in fresh sessions.
3. For each case, compare the per-claim verdicts with the golden. Count matched, missed and extra
   verdicts. Wording may differ between runs; verdicts must not.
4. Check by hand: every Claim cell is a verbatim substring of the input; every cited `path:line`
   exists and supports the claim; no rewrite contains a number or fact absent from its row's evidence;
   verified claims are not rewritten.
5. Check that `git status --porcelain` and `git log -1` are identical before and after every run,
   including case 7.
6. Write the outcome to `results/<model>-<date>.md`: the model, the date, the number of runs, the
   counts, and any known bias (for example, that the same session wrote the goldens). Do not edit a
   golden to make a run pass without saying so.

If two runs disagree on a verdict, the rubric is ambiguous. Tighten the decision order in
`references/verdicts.md` instead of adding rules.

Trigger check, no fixture needed: it should trigger for "check these release notes against the code"
and "is this PR description accurate", and should not trigger for "write release notes for v2",
"review this diff for bugs" or "tighten this paragraph".

## Honesty notes

- The fixture was designed to contain the mismatches. It says nothing about how the skill does on a
  real repository.
- The goldens were written before any run. They may contain mistakes; if a run disagrees with a golden
  and the run is right, fix the golden and say so in `results/`.
- Only JavaScript is seeded. Other languages are covered by the checklist in
  `references/public-surface.md` and have no example.
