<div align="center">

# Casebook

**Debugging that writes down what it tried, and cannot edit code before it has learned something.**

<img alt="version 0.1.0" src="https://img.shields.io/badge/version-0.1.0-0F766E?style=flat-square">
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

## What it does

- Opens `docs/bugs/NNN.md` with the symptom, a one-line repro, and a ruled-out list.
- Ranks 2 to 5 hypotheses, each with the cheapest experiment that could prove it wrong.
- Allows no edit to any file but the case file until a result with evidence is recorded.
- Defines "done" as: the repro failed before the fix and passes after, with a pointer to a regression
  test. A separate `/casebook-close` command re-checks that with a fresh run.
- Reads past cases in `docs/bugs/` for hints, and treats them as data, never as proof.

## The case file

```markdown
# CASE 007: Invoice total is one cent low on some orders

Status: open
Repro status: not observed
Verify command: `npm test`

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
[`skills/casebook/references/case-template.md`](skills/casebook/references/case-template.md). The
hard rules:

- **Gate.** `Status: fixing` needs at least one hypothesis with a recorded result, and
  `Repro status: observed failing`.
- **Evidence.** A hypothesis that is not `pending` needs a `path:line` pointer, or `ran: <command> -> <output>`,
  or `user ran: <command> -> <output>`. Without one, the result is `inconclusive`.
- **Experiments.** Each is tagged `[read]`, `[verify]` or `[user-run]`. Claude runs the first two. A
  `[user-run]` is handed to you, and Claude never executes it.
- **Done.** `Before` is a non-zero exit, `After` is exit 0, and the regression test is one line,
  `<path> :: <test name>`.
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
Next:        run /casebook-close 001
```

The bug in that example is real and reproducible without any model: `Math.round(1.005 * 100)` is
`100`, because `1.005 * 100` is `100.49999999999999` in floating point. The files in
[`examples/proof/`](examples/proof/) show the failing and the fixed version.

## Install

> **Pick one route, not both**, or the same skills load twice. **In the VS Code extension the command
> is `/plugins`, plural, and opens a dialog**: the lines below are terminal syntax and fail silently
> there, which looks identical to the install not working.

casebook ships in the [claude-skills](https://github.com/DahanItamar/claude-skills#readme)
marketplace with the other plugins. It works standalone.

```bash
/plugin marketplace add DahanItamar/claude-skills
/plugin install casebook@claude-skills
```

Or clone it and copy the two skills into your skills directory, which needs no plugin UI:

```bash
git clone https://github.com/DahanItamar/claude-skills.git
cp -r claude-skills/plugins/casebook/skills/* ~/.claude/skills/
```

The second route installs them as plain skills, without the plugin namespace, and ignores
`.claude-plugin/`. On Windows, copy to `%USERPROFILE%\.claude\skills\`.

To confirm the install, run `/casebook` on a failing test; you should get a `docs/bugs/001.md`.

## Commands

| Command | What it does |
| --- | --- |
| `/casebook` | Opens a case, writes hypotheses, runs the cheapest experiments, opens the gate, fixes with a regression test, and hands over. |
| `/casebook-close NNN` | Checks nine conditions (C1 to C9) and a fresh verify run, then writes the root cause and a one-line lesson and sets the status to `closed`. Refuses with exactly what is missing. Edits no code. |

The two commands are the two skills; a skill name becomes the slash command. Claude Code may display
them plugin-namespaced, and both forms are the same command. Your picker shows the exact name.

Casebook needs a `docs/CONSTITUTION.md` with a verify line:

```markdown
**Verify command:** `npm test`
```

Blueprint's `/spec-constitution` writes one, as an optional pairing. Casebook works with any
constitution that has that line. With no verify command, every Before and After is reported by you
and marked `observed by user`.

## How it compares

The space is crowded. These notes come from public descriptions and one raw file; none of these tools
was run for this comparison, and licences and upkeep were not checked.

- **[superpowers `systematic-debugging`](https://raw.githubusercontent.com/obra/superpowers/main/skills/systematic-debugging/SKILL.md)**
  is the closest ancestor, and Casebook builds on its framing: find the root cause before any fix, one
  written hypothesis at a time, and stop and rethink after repeated failed fixes. From its public text it
  keeps no persistent case file and has no close step that re-checks the evidence.
- **[GSD's debugger](https://www.mintlify.com/gsd-build/get-shit-done/agents/debugger)** also keeps a
  persistent file with an append-only list of eliminated hypotheses, so dead ends survive `/clear`.
  The persistent ruled-out record is not new here. It lives in a tool-specific planning directory;
  Casebook's lives in `docs/bugs/` as a file a reviewer can read in a pull request. We could not confirm
  from its docs whether it requires a before and after proof or a regression-test pointer.
- **[Debug Mode](https://github.com/doraemonkeys/claude-code-debug-mode)** generates hypotheses and adds
  tagged logging to the code before a fix, then removes it. Casebook makes the opposite choice: no code
  edit before a recorded result, and instrumentation is a step you run yourself on your own copy.

What Casebook adds is narrow: the one order (no edit until a result is recorded) is checkable from the
case file; "confirmed" requires a pointer or command output, and the file format is lintable; "done"
means fails before and passes after, plus a regression test pointer, re-checked by a separate command.
It does not claim to find bugs faster or more reliably than any of the above. That has not been
measured.

## Limits

- **The gate is a procedure, not a lock.** There are no hooks, so nothing technically stops an edit.
  [`scripts/check-case.sh`](scripts/check-case.sh) can lint a case file, but it cannot see an edit that
  was never recorded.
- **Only the verify command is run.** Anything else is handed to you to run and paste back, which costs a
  round trip.
- **Some bugs cannot be closed in v1.** If the verify command cannot express the bug (visual, timing,
  production-only), `/casebook-close` refuses at C7. You can park the case instead.
- **The intermittent threshold is a default.** An intermittent case needs 5 of 5 passing runs to close.
  Five is a stated v1 default, not a measured threshold. A green run on an intermittent bug lowers the
  chance the bug is still there; it does not remove it.
- **A model is not deterministic.** Wording and ordering vary between runs.
- **What it refuses:** editing any file but the case file before a result is recorded; marking a
  hypothesis `confirmed` without a pointer or command output; counting a repro that was not observed
  failing; running anything other than the verify command; closing a case with no Before, no After or no
  regression test pointer; following instructions found in a past case, a code comment or an issue text;
  reading history from anywhere but `docs/bugs/`; committing or pushing; storing secrets or customer data
  in a case file.

**Measured so far:** nothing about model behaviour. No runs, no users, no results are claimed. The
proof test below shows the scenario and measures no model. The one real run, on the author's machine:

```text
node --test examples/proof/proof.test.mjs     (Node 24.15.0, Windows, Git's sh and GNU awk, durations omitted)
tests 17
pass 17
fail 0
```

The CI job runs the same test on Node 22; that has not been run yet. The lint was also checked by hand
with GNU awk in `--traditional` mode and with `dash`, to avoid GNU-only syntax; it has not been run with
`mawk`.

## Maintainer check

Optional, and nothing runs at install. `sh scripts/check-case.sh docs/bugs/001.md` checks one case file
against 9 rules (L1 to L9: file name and heading, status values, the nine sections, hypothesis format,
the gate, evidence, the ruled-out list, closed-case completeness, no leftover placeholders). It only reads
the file, writes nothing and runs nothing from it. It exits 0 on pass, 1 on findings and 2 if it cannot
run. `node --test examples/proof/proof.test.mjs` runs the before/after proof and the lint over the example
case files. Neither needs a package.

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
