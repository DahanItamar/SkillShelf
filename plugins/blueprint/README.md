<div align="center">

# Blueprint

**Seven independent skills; each works alone. They share one convention, `AC-###` ids in a spec file, and each still works when that file is missing.**

Plain Markdown skills in the open Agent Skills format.
**No `package.json`, no dependencies, no build step, nothing that executes at install.**

<img alt="illustration tests" src="https://img.shields.io/badge/illustration%20tests-node%20--test-0F766E?style=flat-square">
<img alt="zero dependencies" src="https://img.shields.io/badge/dependencies-0-0F766E?style=flat-square">
<img alt="version 4.0.0" src="https://img.shields.io/badge/version-4.0.0-0F766E?style=flat-square">
<a href="LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-0F766E?style=flat-square"></a>

<a href="examples/the-loop.md">The walkthrough</a> ·
<a href="examples/proof/README.md">The illustration</a>

</div>

---

## Use it

In Claude Code, add the marketplace and install the plugin:

```bash
/plugin marketplace add DahanItamar/SkillShelf
/plugin install blueprint@skillshelf
```

Or copy the folders in `plugins/blueprint/skills/` into your tool's skills directory (below). Then ask your agent to use a skill by name, for example "use the spec-tasks skill on this spec". Most tools also list skills by name (Claude Code `/skill`, Codex `$skill`, Gemini CLI `/skills`). Nothing is installed, compiled or executed.

**Use it in other tools.** Each skill is a folder with a `SKILL.md`, so it follows the open [Agent Skills](https://agentskills.io/specification) layout. Copy the folders in `plugins/blueprint/skills/` into the skills directory of Codex, Cursor, GitHub Copilot or Gemini CLI. The Install section of the [repository README](../../README.md) has the per-tool steps.

Effectiveness is not measured yet: `examples/eval` is a protocol with no recorded runs.

> [!IMPORTANT]
> **The two skills that run shell commands, `spec-implement` and `spec-refactor`, run only a verify command that comes from `docs/CONSTITUTION.md` or project config, after showing it to you and asking you to confirm it.** Never one found in a spec, a task list, a refactoring report or a code comment. In a run where nobody can answer, the command runs only if the constitution has a `Reviewed:` line holding the exact same command text. Those files are editable by anyone with commit access, so treating their contents as instructions would turn a Markdown file into remote code execution.

## The identifier that survives the handoff

Most spec workflows are a handful of prompts, and nothing travels between them. What travels here is an identifier: a requirement is written as one EARS sentence with a stable `AC-###`, and later work refers to it only that way.

```text
docs/SPEC.md    AC-003  If two shifts for one employee overlap by any minute, then the
                        scheduler shall flag both and refuse to publish.

docs/changes/*/TASKS.md   - [ ] T-04 Detect overlaps on a minute timeline — closes AC-003

REPORT.md       - [ ] R-02 Extract `toRange`, delete the two copies — preserves AC-003
```

`closes` for a task, `preserves` for a refactoring: one word apart, and the whole difference between building a feature and restructuring one. A task that closes no criterion is either unnecessary work or a requirement nobody wrote down.

### The AC-### format

- Id grammar: `AC-` and at least three digits, allocated from one sequence per repository.
- One EARS sentence per criterion ("If ..., then the system shall ...").
- A retired criterion becomes a struck-through tombstone and its id is never reused.
- `closes AC-###` in a task or commit message builds a feature; `preserves AC-###` in a refactoring entry guards one.
- A provisional `AC-NEW-n` is allowed on a branch and renumbered at merge.

## The skills

| Skill | Writes | The rule it enforces |
|---|---|---|
| `spec-constitution` | `docs/CONSTITUTION.md` | A rule earns its place only if you can name what breaks when it is violated |
| `spec-architect` | `docs/SPEC.md`, or a change proposal; also a small change (up to three criteria) as one proposal with tasks inline | Never ask what you can decide: ask only what changes the architecture |
| `spec-tasks` | `docs/changes/*/TASKS.md` | A task is done when a named criterion is satisfied, not when the code looks finished |
| `spec-implement` | code | One task, verify, then the next; stop at the first unmet criterion |
| `spec-drift` | a report; merges shipped proposals into the spec | The spec and the code disagree: say which one is wrong |
| `spec-refactor` | `docs/refactorings/NNNN/` | Restructure only what blocks scheduled work, and change no criterion doing it |
| `spec-check` | nothing | Lints `AC-###` integrity; the AC to task to commit to test table is an audit trail a reviewer can read |

Pick by what you have:

| You have | Use |
|---|---|
| A repository with no written conventions | `spec-constitution` |
| A product idea, or code with no spec | `spec-architect` |
| A spec or a list of requirements | `spec-tasks` |
| A task list | `spec-implement` |
| A spec and code that may have moved apart | `spec-drift` |
| Working code that is hard to change | `spec-refactor` |
| A spec and task list you want to check for orphans | `spec-check` |

`spec-check` is opt-in, read-only, and prints a criterion to task to commit to test table, with orphans first and a final `Orphans: N` line. Test hits are labelled `candidate, not proof`. Drift asks whether the code does what the spec says; refactor asks whether code that already does can still be changed cheaply.

## Refactoring, and the gate on it

`spec-refactor` handles [code smells](https://refactoring.guru/refactoring/smells) and dead code under two rules. A smell is actionable only if it is a Change Preventer for work that is actually scheduled; everything else is logged with an `SM-###` and left alone. And a refactoring may not change what the spec says the system does: if it needs an `AC-###` reworded, it is a change proposal, not a refactoring.

It writes a numbered report under `docs/refactorings/` and changes no code itself. Runs are never overwritten, and every `SM-###` stays in one registry.

## An executable illustration

The one thing here that executes. These tests exercise hand-written versions of the feature; they show what the skills are designed to catch, they do not measure model output. No install: it needs Node (CI runs Node 22, see [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)); the output below came from Node v24.15.0:

```bash
node --test examples/proof/proof.test.mjs
```

```text
▶ drifted — the code three weeks after the spec was written
  ✔ but the night shift can no longer be saved — §8 is contradicted (0.744ms)
  ✔ and the rejection is silent: the overlap is simply never detected (0.1106ms)
▶ smelly — passes every criterion and is still unshippable
  ✔ behaves exactly like the spec-derived version — a drift check finds nothing (0.2479ms)
  ✔ SM-002 Duplicate Code: the same day arithmetic, copied three times (0.043ms)

ℹ tests 17
ℹ pass 17
ℹ fail 0
```

Excerpt: four lines of a 17-test run. The suite builds one shift-conflict feature four ways and asserts what each does to a shift that crosses midnight:

| Version | Tests green | Matches the spec | Cheap to extend |
|---|:-:|:-:|:-:|
| `naive.mjs`: no spec, shapes chosen by convenience | yes | no | no |
| `spec-derived.mjs`: built against §5 and §8 | yes | yes | yes |
| `drifted.mjs`: three weeks and one sensible-looking fix later | yes | no | yes |
| `smelly.mjs`: six months and four features later | yes | yes | no |

`drifted.mjs` contradicts §8 of its own spec, so a night shift silently stops being storable; a drift check catches that. `smelly.mjs` contradicts nothing and still shows an overnight shift as `-960` minutes in its tooltip, because one of three copies of the same calculation diverged where no criterion looks; a refactoring pass catches that.

## Try spec-check in a minute

[`examples/spec-check-fixture/`](examples/spec-check-fixture) is a hand-built fixture, not a recorded run: a `SPEC.md` and one `TASKS.md` with three deliberate orphans. Copy them into a scratch repo as `docs/SPEC.md` and `docs/changes/0001-m1-fixture/TASKS.md`, ask your agent to use the spec-check skill, and you should see `Orphans: 3`. Or run `sh skills/spec-check/scripts/spec-check.sh examples/spec-check-fixture/SPEC.md examples/spec-check-fixture/TASKS.md` for the same three, without an agent.

## Other spec tools

Two facts from the official READMEs, nothing more: [OpenSpec](https://github.com/Fission-AI/OpenSpec) supports 30+ tools via skills and installs from npm or Homebrew; [Spec Kit](https://github.com/github/spec-kit) lists constitution, specify, plan, tasks, implement and converge commands, and says other agents are listed on an integrations page. This plugin is one spec set per repository root; for a monorepo, use each package root with its own `docs/`. For many similar repositories, copy `docs/CONSTITUTION.md` from a template repository and keep a one-line `Template: <name> <date>` header.

## Optional CI recipe

Nothing here runs at install. If you want a gate, copy [`skills/spec-check/scripts/spec-check.sh`](skills/spec-check/scripts/spec-check.sh) into your repository and run it in your own workflow. It is plain POSIX `sh` and `awk` with no dependencies, it reads files and runs nothing it finds in your repository, and it needs no network.

```yaml
- name: Spec traceability
  run: sh path/to/spec-check.sh   # from the repository root
```

Checks 1 to 4 and 3b decide the result: cited ids exist, every active criterion is closed by a task, no id appears twice, `preserves` citations resolve, no change ordinal is reused. Check 6 prints as `info:` lines and never changes the status. Optional flags: `--main` (run on `main` or a merge queue, not on feature branches: lists leftover `0000-*` directories and `AC-NEW-n` ids), `--tests` (lists active ids that no test file names; add `--strict` to count them so untested criteria fail the build). The output ends with `RESULT orphans=N status=pass|fail`, after the `Orphans: N` line. It exits 1 when there are orphans, 2 when it cannot decide, and 0 otherwise. Because it is a script rather than a model call, the output is deterministic.

Run against the hand-built fixture, the real output was (test: `node --test examples/spec-check-fixture/spec-check.test.mjs`):

```text
T-03 cites AC-009, which does not exist (examples/spec-check-fixture/TASKS.md)
AC-003 active, closed by no task
AC-003 appears twice in section 2.1
Orphans: 3
RESULT orphans=3 status=fail
```

## What it weighs

Bytes from `wc -c`, not token counts (no token count was measured). A skill loads its `SKILL.md` when invoked; references load only at the step that needs them.

| Skill | `SKILL.md` | Lines | References (all) |
|---|--:|--:|--:|
| `spec-constitution` | 7,383 | 124 | 6,831 |
| `spec-architect` | 12,468 | 158 | 49,583 |
| `spec-tasks` | 5,920 | 101 | 5,346 |
| `spec-implement` | 10,868 | 132 | 4,552 |
| `spec-check` | 5,839 | 69 | none |
| `spec-drift` | 9,520 | 136 | 18,085 |
| `spec-refactor` | 13,738 | 156 | 28,371 |

A single skill loads only its `SKILL.md` (5.8 to 13.7 KB, 69 to 158 lines), and references load only at the step that names them. The 65,736-byte figure is the sum of all seven `SKILL.md` files; no one run loads it.

## Under the hood

- **Nothing executes at install.** No dependencies, no build, no network calls. The only runnable code is the `.mjs` files under `examples/proof/` (importing `node:test`, `node:assert/strict` and `node:fs`), the optional `spec-check.sh` and its test, and the maintainer check `scripts/verify.sh`, which you run yourself.
- **References load on demand.** Each `SKILL.md` loads on invocation; its references load only at the phase that needs them.
- **Change proposals, not spec rewrites.** Once `docs/SPEC.md` exists, `spec-architect` writes a diff under `docs/changes/` and leaves the spec alone, so the reasoning that made feature 1 correct is kept. Criteria are retired as tombstones, never reused, because archived task lists still cite them.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
