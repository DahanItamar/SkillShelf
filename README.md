<div align="center">

# claude-skills

**Four Claude Code skills, one marketplace. Plain Markdown that Claude reads: no dependencies, no build step, nothing that runs at install.**

[![ci](https://github.com/DahanItamar/claude-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/DahanItamar/claude-skills/actions/workflows/ci.yml)
[![plugins](https://img.shields.io/badge/plugins-4-1f6feb)](.claude-plugin/marketplace.json)
[![dependencies](https://img.shields.io/badge/dependencies-0-2da44e)](#install)
[![licence](https://img.shields.io/badge/licence-MIT-8957e5)](LICENSE)

</div>

## The skills

| Skill | What it does | Version |
|---|---|---|
| [**acsm**](plugins/acsm) | Works out which compliance and security rules actually apply to your project (US, EU, UK/APAC, Israel, payments, accessibility, desktop binaries), audits the repo against exactly those, and drafts the documents they require. | 0.1.0 |
| [**uilint**](plugins/uilint) | A linter for the UI states everyone forgets: loading, empty, error, success and partial. 43 rules applied while the interface is written; it blocks "done" only on the ones that silently hurt users. | 1.2.0 |
| [**spec-architect**](plugins/spec-architect) | A six-stage spec chain: constitution, spec, tasks, implement, drift, refactor. Every requirement gets a stable `AC-###` id that every later stage cites. Start with `/spec-start`. | 3.2.0 |
| [**readme-architect**](plugins/readme-architect) | Writes a README from evidence: runs the project first, then fills a tight skeleton with real output, observed numbers and a diagram of how it works. No badge walls, no invented benchmarks. | 2.0.0 |

Each folder under [`plugins/`](plugins) keeps its own README, spec and full commit history.

## Install

Requires **Claude Code**. Add the marketplace once, then install only the skills you want:

```bash
/plugin marketplace add DahanItamar/claude-skills

/plugin install acsm@claude-skills
/plugin install uilint@claude-skills
/plugin install spec-architect@claude-skills
/plugin install readme-architect@claude-skills
```

In the VS Code extension the command is `/plugins` (plural) and opens a dialog.

### Moving from the old repos

These skills used to live in separate repos (`DahanItamar/acsm`, `uilint`, `spec-architect`, `readme-architect`). If you installed one from there, remove the old marketplace and add this one:

```bash
/plugin marketplace remove uilint          # repeat for each old one
/plugin marketplace add DahanItamar/claude-skills
/plugin install uilint@claude-skills
```

## Repository layout

```
.claude-plugin/marketplace.json   lists the four plugins
plugins/
  acsm/              compliance routing, audit and drafting
  uilint/            UI-state linter
  spec-architect/    six-stage spec chain
  readme-architect/  evidence-based READMEs
```

CI runs acsm's structural verification, spec-architect's before-and-after proof, and a check that every marketplace entry resolves to a plugin with a matching name and version.

## Licence

MIT. acsm's document templates are additionally released under CC0; see [plugins/acsm/LICENSE-TEMPLATES](plugins/acsm/LICENSE-TEMPLATES).
