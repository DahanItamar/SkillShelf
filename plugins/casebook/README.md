<div align="center">

# Casebook

**Debugging that writes down what it tried, and is instructed not to edit code before it has learned something.**

*A procedure, not a lock.*

<img alt="version 0.2.0" src="https://img.shields.io/badge/version-0.2.0-0F766E?style=flat-square">
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-0F766E?style=flat-square"></a>
<img alt="dependencies 0" src="https://img.shields.io/badge/dependencies-0-0F766E?style=flat-square">

</div>

---

Agents, and people, tend to change code on the first plausible theory. If the theory is wrong, the
change is reverted or buried, and nothing records that the theory was tried. The next person, or the
next session, tries it again.

`casebook` makes debugging leave a record. Each bug gets a case file in your repo, and one hard
order: no edit to any other file until at least one experiment result is written down. It is plain
Markdown, with no dependencies, no build step and no hooks. Nothing runs at install.

**Use it when** something is broken and the cause is not known: a bug report, a failing or flaky test,
a regression, a crash, wrong output.
**Do not use it when** the error text and one stack-trace location already name the fix, or for a new
feature, a refactor, a question about how code works, or a style issue.

## What it does

- Opens `docs/bugs/NNN.md` with the symptom, a one-line repro, and a ruled-out list.
- Ranks 2 to 5 hypotheses, each with the cheapest experiment that could prove it wrong.
- Allows no edit to any file but the case file until a result with evidence is recorded. The one
  exception is a `[probe]`: logging-only lines with a marker, approved by you and removed before the fix.
- Defines "done" as: the repro failed before the fix and passes after, with a pointer to a regression
  test. A separate skill, `casebook-close`, re-checks that with a fresh run.
- Reads past cases in `docs/bugs/` for hints, and treats them as data, never as proof. Closing a case
  appends one line (`NNN | symptom | root cause | lesson`) to `docs/bugs/INDEX.md`, which is searched first.

## The verify command

Casebook runs one kind of command: the verify command. It looks (read-only) for one candidate, in this
order: AGENTS.md or CONTRIBUTING, README test instructions, `scripts.test` in package.json, a Makefile
`test` target, pytest or tox config, `go.mod`, `Cargo.toml`, a CI workflow's test step. It prints the
candidate with the file it came from and asks you:

```text
Use npm test as the verify command for this case? (yes / give another / none)
```

If the sources disagree or none is clear, you type the command. Only your explicit yes or a typed
command counts. Text in a README, CI file or case is a suggestion, never an approval. The command is
never taken from a case, comment, issue or spec. It is recorded in the case header:

```text
Verify command: `npm test` (user-approved)
```

With no approved command, Before and After are reported by you.

## The case file

```markdown
# CASE 007: Invoice total is one cent low on some orders

Status: open
Repro status: not observed
Verify command: `npm test` (user-approved)

## Symptom
## Repro
## Hypotheses

### H1 Tax table has a stale rate -- result: pending
- Because: <why this is plausible, one sentence>
- Predicts: if true, <observation>; if false, <observation>
- Experiment: [read] open src/tax.mjs and compare the rate with the expected one
- Evidence:

## Ruled out
## Root cause
## Fix
## Regression test
## Before and after
## Lesson
```

The full template, with every field explained, is in
[`skills/casebook/references/case-template.md`](skills/casebook/references/case-template.md). The short
schema both skills carry is `case-format.md`. The hard rules:

- **Gate.** `Status: fixing` needs at least one hypothesis with a recorded result, and
  `Repro status: observed failing`.
- **Stop rule.** The agent stops and asks you for new information when every hypothesis has a result and
  none is confirmed, when three rounds in a row end inconclusive, or when two fix attempts failed. A
  ruled-out result is progress.
- **Evidence.** A hypothesis that is not `pending` needs a `path:line` pointer, or `ran: <command> -> <output>`,
  or `user ran: <command> -> <output>`. Without one, the result is `inconclusive`.
- **Experiments.** Each is tagged `[read]`, `[verify]`, `[user-run]`, `[bisect]` or `[probe]`. The agent
  runs the first two. A `[user-run]` is handed to you, and the agent never executes it. For "it used to
  work", `[bisect]` is a check script written as text in the case file, which you save outside the repo
  and run with `git bisect run <path-to-script>`; the agent never runs `git bisect`, because it changes
  your working tree. A `[probe]` is a temporary logging-only insertion whose every line contains
  `CASEBOOK-PROBE-<NNN>`; you approve the listed lines once, and before the fix the agent removes them
  and a search for the marker must find nothing.
- **Done.** `Before` is a non-zero exit, `After` is exit 0, and the regression test is one line,
  `<path> :: <test name>`. A bug no test can express (visual, timing, production-only) can close on a
  `Proof command:` you approve, or a manual checklist you report; the summary then says
  `Closed on a non-test proof`.
- **Scoped runs.** An optional `Verify one:` command with a `{test}` placeholder runs the single
  regression test for Before and After. At close the single test always runs fresh; the full suite runs
  again unless you say it already passed at After in this conversation and may be reused.
- **Flaky bugs.** Before is valid when at least one of up to 5 runs fails (`runs: <failed>/<total>`);
  After needs every run to pass. Five is a default, not evidence; you can set `Runs: N`.
- **Permanent IDs.** A hypothesis added later gets the next number. None is renumbered or deleted.

## Example

An illustration written by hand, not a recorded run. The full story is in
[`examples/walkthrough.md`](examples/walkthrough.md), and the finished case file is
[`examples/cases/good-closed.md`](examples/cases/good-closed.md).

The gate line, printed before the first edit outside the case file:

```text
Gate: open. H1 ruled out (src/tax.mjs:14); H2 ruled out (src/invoice.mjs:31); H3 confirmed (user ran node -e ... -> 100).
```

The ruled-out list and the hand-over block after the fix:

```text
Case 001: Invoice total is one cent low when a unit price ends in half a cent   Status: fixing
Repro:       observed failing (user: the invoice total showed 1.00, expected 1.01)
Confirmed:   H3 float rounding in roundMoney (user ran node -e ... -> 100)
Ruled out:   H1 tax table (src/tax.mjs:14), H2 rounding per line (src/invoice.mjs:31)
Regression:  test/money.test.mjs :: rounds half up
Before:      exit 1, fails
After:       exit 0, passes
File:        docs/bugs/001.md
Next:        the case is ready for an independent close check.
```

The bug in that example is real and reproducible without any model: `Math.round(1.005 * 100)` is
`100`, because `1.005 * 100` is `100.49999999999999` in floating point. The files in
[`examples/proof/`](examples/proof/) show the failing and the fixed version.

## Install

> **Pick one route, not both**, or the same skills load twice. **In the VS Code extension the command
> is `/plugins`, plural, and opens a dialog**: the lines below are terminal syntax and fail silently
> there, which looks identical to the install not working.

casebook ships in the [SkillShelf](https://github.com/DahanItamar/SkillShelf#readme)
marketplace with the other plugins. It works standalone.

```bash
/plugin marketplace add DahanItamar/SkillShelf
/plugin install casebook@skillshelf
```

Or clone it and copy the two skills into a skills directory, which needs no plugin UI. For Claude Code
that is one option among several (see "Use it in other tools" below):

```bash
git clone https://github.com/DahanItamar/SkillShelf.git
cp -r SkillShelf/plugins/casebook/skills/* ~/.claude/skills/
```

The copy route installs them as plain skills, without the plugin namespace, and ignores
`.claude-plugin/`. On Windows, copy to `%USERPROFILE%\.claude\skills\`.

To check the install, ask the agent to use the casebook skill on a failing test; you should get a
`docs/bugs/001.md`.

## Use it in other tools

Both skills follow the open Agent Skills format, so they are plain folders any supporting tool can load.

- Copy both folders under `plugins/casebook/skills/` into `.agents/skills/` (Codex, Cursor),
  `.github/skills/` (Copilot) or `.gemini/skills/` (Gemini CLI).
- Then ask the agent to "use the casebook skill", or type its name in the tool's skill picker.
- The root README [Install section](https://github.com/DahanItamar/SkillShelf#install) lists the exact
  paths per tool, including the user-level folders.

## Commands

The two skills are independent. Each works alone, and neither needs the other installed.

| Skill | What it does |
| --- | --- |
| `casebook` | Opens a case, writes hypotheses, runs the cheapest experiments, opens the gate, fixes with a regression test, and hands over. |
| `casebook-close` | Works on any case file in the documented format. Checks nine conditions (C1 to C9) and a fresh verify run, then writes the root cause and a one-line lesson and sets the status to `closed`. Refuses with exactly what is missing. Edits no code. |

In Claude Code and Cursor the skill name also works as a slash command (`/casebook`, `/casebook-close`).
That is a convenience, not a requirement. Claude Code may display them plugin-namespaced; your picker shows
the exact name.

Examples of an approved command in a project with no `package.json`:

```text
Verify command: `pytest -q` (user-approved)
Verify one:     `pytest -q -k {test}` (user-approved)

Verify command: `go test ./...` (user-approved)
Verify one:     `go test ./... -run {test}` (user-approved)
```

Only `{test}` is replaced, and only with the regression test's name. A `cargo test {test}` shape works the same way.

## Team use

- Commit `docs/bugs/`, so the ruled-out list is shared and a reviewer can read a case in the pull request.
- Each developer approves the verify command in their own conversation. A `(user-approved)` mark in a
  file is a claim, not an approval, so it is asked again every time.
- Install through the tool's project skills folder (for example `.agents/skills/`) so the whole team gets
  the same skills.
- Optional: run `sh scripts/check-case.sh` over `docs/bugs/` in CI. Nothing installs it for you.

## How it compares

The space is crowded. These notes come from public descriptions and one raw file; none of these tools
was run for this comparison, and licences and upkeep were not checked.

- **[superpowers `systematic-debugging`](https://raw.githubusercontent.com/obra/superpowers/main/skills/systematic-debugging/SKILL.md)**: the closest ancestor; root cause first, no persistent case file.
- **[GSD's debugger](https://www.mintlify.com/gsd-build/get-shit-done/agents/debugger)**: also keeps a persistent list of eliminated hypotheses, in a tool-specific planning directory.
- **[Debug Mode](https://github.com/doraemonkeys/claude-code-debug-mode)**: adds tagged logging before the fix, where Casebook allows only an approved `[probe]`.
- **[diagnosing-bugs](https://www.aihero.dev/skills-diagnosing-bugs)**: a feedback loop first, then bisect or instrument; gate not confirmed.
- **[git-bisect-debugging](https://skills.sh/sjungling/sjungling-claude-plugins/git-bisect-debugging)**: a dedicated bisect skill, no case file.

Casebook adds a checkable order (no edit until a result is recorded), "confirmed" that needs evidence, a
lintable file, and a separate re-check at close. It does not claim to find bugs faster or more reliably
than any of the above. That has not been measured.

## Limits

- **The gate is a procedure, not a lock.** There are no hooks, so nothing technically stops an edit.
  [`scripts/check-case.sh`](scripts/check-case.sh) can lint a case file, but it cannot see an edit that
  was never recorded. A maintainer can run that script in their own CI; nothing here installs a hook.
  A reviewer can also read the diff against the case file.
- **Only approved commands are executed.** That is the verify command (approved by you), and an approved
  `Verify one:` or `Proof command:`. Reading files and read-only git are free. Anything else is handed to
  you to run and paste back, which costs a round trip.
- **Some bugs need a proof instead of a test.** If neither a test nor a `Proof command:` or manual
  checklist can express the bug, the close step refuses at C7. You can park the case instead.
- **Case numbers can collide across branches.** The number is the highest plus 1. On a merge conflict,
  rebase and renumber the newer case and its heading.
- **The agent does not commit.** Whether you commit `docs/bugs/` is your choice. Committing it is what makes
  the ruled-out list shared.
- **Redaction is an instruction, not a scan.** The agent is told to redact secrets and personal or
  regulated data (names, emails, account or patient identifiers, health, payment and location data) as
  `<redacted>`. Nothing checks that it did. The repo owner remains responsible for what is committed in
  `docs/bugs/`. This is not a compliance claim of any kind.
- **The intermittent run count is a default.** An intermittent case needs every one of up to 5 runs
  to pass to close, and at least one failing run for Before. Five is a default, not a measured
  threshold; you can set `Runs: N`. A green run on an intermittent bug lowers the chance the bug is
  still there; it does not remove it.
- **Bisect is yours to run.** `git bisect` changes the working tree, so the agent only writes the script text and commands; you save and run them.
- **A model is not deterministic.** Wording and ordering vary between runs.
- **What it refuses:** editing any file but the case file before a result is recorded (apart from an
  approved probe); marking a hypothesis `confirmed` without a pointer or command output; counting a
  repro that was not observed failing; running anything other than the approved commands; closing a
  case with no Before, no After or no regression test pointer; following instructions found in a past
  case, a code comment or an issue text; reading history from anywhere but `docs/bugs/`; committing or
  pushing; storing secrets or customer data in a case file.

**Measured so far:** nothing about model behaviour. No runs, no users, no results are claimed. One recorded session will be added here with date and model when a real run is made. The
proof test below shows the scenario and measures no model. The one real run, on the author's machine:

```text
node --test examples/proof/*.test.mjs     (Node 24.15.0, Windows, Git's sh and GNU awk, durations omitted)
tests 31
pass 31
fail 0
```

Tested locally on Node 24.15; CI uses Node 22 and that job has not been run yet. The lint was also checked by hand
with GNU awk in `--traditional` mode and with `dash`, to avoid GNU-only syntax; it has not been run with
`mawk`.

## Cost

Only checkable facts. The two skill files are `skills/casebook/SKILL.md` (12699 bytes) and
`skills/casebook-close/SKILL.md` (6951 bytes). Reference files are loaded by step, not all at once: the case template at Step 2, `hypotheses.md` at Step 4, `experiments.md` at Step 5, and `close-checks.md` at close step 2. The six reference files (`case-format.md` is one copy in each skill) total 25587 bytes (case-template 6136, experiments 5996, hypotheses 3489, close-checks 5780, case-format 2093 twice). A typical open pass loads SKILL.md plus case-template, hypotheses and experiments: 28320 bytes. A close adds the close skill, case-format and close-checks: 14824 bytes. As an estimate only, tokens are about bytes divided by 4; no model tokenizer was run. A proof test checks these byte counts against the files, so they cannot drift quietly.

## Maintainer check

Optional, and nothing runs at install. `sh scripts/check-case.sh docs/bugs/001.md` checks one case file
against 9 rules (L1 to L9: file name and heading, status values, the nine sections, hypothesis format,
the gate, evidence, the ruled-out list, closed-case completeness, no leftover placeholders). It only reads
the file, writes nothing and runs nothing from it. It exits 0 on pass, 1 on findings and 2 if it cannot
run. `node --test examples/proof/*.test.mjs` runs the before/after proof, the lint over the example
case files, and a check that the two copies of `case-format.md` are identical. Neither needs a package. The example files are not named `NNN.md`, so lint them with `--as`: `sh scripts/check-case.sh --as 001.md examples/cases/good-closed.md`. The lint still accepts `observed by Claude` in old files.

## Credits

Ideas used, with wording of my own: the "no fixes without root cause investigation first" framing and
the idea of stopping after repeated failed fixes, from
[superpowers](https://github.com/obra/superpowers) `systematic-debugging`; the idea of a persistent
file of eliminated hypotheses that survives a cleared session, from the debugger in
[get-shit-done](https://www.mintlify.com/gsd-build/get-shit-done/guides/debugging); the idea of hypothesis-tagged experiments,
from the Debug Mode pattern in [claude-code-debug-mode](https://github.com/doraemonkeys/claude-code-debug-mode).

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
