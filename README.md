<div align="center">

# claude-skills

**Four Claude Code skills that do one job each, and do it properly.**

Plain Markdown that Claude reads. No dependencies, no build step, nothing runs when you install.

<a href="https://github.com/DahanItamar/claude-skills/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/DahanItamar/claude-skills/ci.yml?branch=main&style=flat-square&label=verify&color=0F766E" alt="Verify workflow status" /></a>
<img src="https://img.shields.io/badge/plugins-4-0F766E?style=flat-square" alt="4 plugins" />
<img src="https://img.shields.io/badge/dependencies-0-0F766E?style=flat-square" alt="Zero dependencies" />
<img src="https://img.shields.io/badge/Claude%20Code-marketplace-0F766E?style=flat-square" alt="Claude Code plugin marketplace" />
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0F766E?style=flat-square" alt="License: MIT" /></a>

<p>
  <a href="#the-skills">The skills</a> ·
  <a href="#install">Install</a> ·
  <a href="#how-they-fit-together">How they fit together</a> ·
  <a href="#license">License</a>
</p>

</div>

## The skills

| Skill | What it does | Version |
|---|---|---|
| [**Regwise**](plugins/regwise) | Works out which compliance and security rules actually apply to your project (US, EU, UK and APAC, Israel, payments, accessibility, desktop binaries), audits the repo against exactly those, and drafts the documents they require. | 0.2.0 |
| [**Edgecase**](plugins/edgecase) | Catches the UI states everyone forgets: loading, empty, error, success and partial. 40 rules applied while the interface is written; it blocks "done" only on the ones that silently hurt users. | 1.4.0 |
| [**Blueprint**](plugins/blueprint) | Spec-driven development in six stages: constitution, spec, tasks, implement, drift, refactor. Every requirement gets an `AC-###` id that every later stage cites. Start with `/spec-start`. | 3.3.0 |
| [**Showcase**](plugins/showcase) | Writes your README after running your project. Every number in it is one it observed, and anything it could not observe, it says so. | 2.1.0 |

Each skill has its own README with examples, limits and what it will not do.

## Install

You need **Claude Code**. Add the marketplace once, then install only the skills you want:

```bash
/plugin marketplace add DahanItamar/claude-skills

/plugin install regwise@claude-skills
/plugin install edgecase@claude-skills
/plugin install blueprint@claude-skills
/plugin install showcase@claude-skills
```

In the VS Code extension the command is `/plugins` (plural) and opens a dialog.

<details>
<summary>Installed one of these under its old name?</summary>

The skills were renamed: acsm is now Regwise, uilint is Edgecase, spec-architect is Blueprint and readme-architect is Showcase. Remove the old plugin and install the new one:

```bash
/plugin uninstall uilint          # the old name
/plugin install edgecase@claude-skills
```

Regwise still reads an existing `acsm.config.yml`, so saved answers carry over.

</details>

## How they fit together

```mermaid
flowchart LR
    B["Blueprint<br/>spec and tasks"] --> R["Regwise<br/>which laws apply"]
    R --> E["Edgecase<br/>UI states while building"]
    E --> S["Showcase<br/>README from real output"]
```

Each skill works on its own. Used together, Blueprint's acceptance criteria give the others something to check against: Regwise adds the compliance pass after the task list, Edgecase runs while the interface is written, and Showcase documents what actually shipped.

## Repository layout

```
.claude-plugin/marketplace.json   lists the four plugins
plugins/
  regwise/     compliance routing, audit and drafting
  edgecase/    UI-state linter
  blueprint/   spec-driven development chain
  showcase/    evidence-based READMEs
```

CI runs Regwise's structural verification, Blueprint's before-and-after proof, and a check that every marketplace entry resolves to a plugin with a matching name and version.

## License

MIT. Regwise's document templates are also released under CC0; see [plugins/regwise/LICENSE-TEMPLATES](plugins/regwise/LICENSE-TEMPLATES).
