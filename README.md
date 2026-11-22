<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/skillshelf-dark.svg">
  <img src="docs/brand/skillshelf-light.svg" alt="SkillShelf logo: a bookcase with one skill pulled out" width="96">
</picture>

# SkillShelf

**AI coding skills that each stand on their own. Install only what you need.**

Plain Markdown in the open Agent Skills format. Works in Claude Code, Codex, Cursor, GitHub Copilot and Gemini CLI. No dependencies, nothing runs when you install.

<a href="https://github.com/DahanItamar/SkillShelf/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/DahanItamar/SkillShelf/ci.yml?branch=main&style=flat-square&label=verify&color=0F766E" alt="Verify workflow status" /></a>
<img src="https://img.shields.io/badge/skills-6-0F766E?style=flat-square" alt="6 skills" />
<img src="https://img.shields.io/badge/works%20in-5%20tools-0F766E?style=flat-square" alt="Works in 5 tools" />
<img src="https://img.shields.io/badge/dependencies-0-0F766E?style=flat-square" alt="Zero dependencies" />
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0F766E?style=flat-square" alt="License: MIT" /></a>

<p>
  <a href="#the-skills">The skills</a> ·
  <a href="#install">Install</a> ·
  <a href="#license">License</a>
</p>

</div>

## The skills

| Skill | What it does | Version |
|---|---|---|
| [**Regwise**](plugins/regwise) | Works out which compliance and privacy rules apply to your project, audits the repo against exactly those, and drafts the documents they need. | 0.4.0 |
| [**Edgecase**](plugins/edgecase) | Catches the UI states everyone forgets: loading, empty, error, success and partial. 34 rules, split into blocking and non-blocking. | 1.6.0 |
| [**Blueprint**](plugins/blueprint) | Spec-driven development in seven independent skills. Every requirement gets an id that the later skills cite. | 4.0.0 |
| [**Showcase**](plugins/showcase) | Writes your README after running your project. Every number in it is one it observed. | 2.3.0 |
| [**Casebook**](plugins/casebook) | Debugging with a case file: a repro, ranked guesses with one experiment each, and no code changes until one is tested. | 0.2.0 |
| [**Truthpath**](plugins/truthpath) | Finds code that looks finished but quietly fakes success, such as swallowed errors and placeholder data. Read-only. | 0.1.0 |

Each skill has its own README with examples and limits.

## Install

Pick your tool. Each skill is a folder with a `SKILL.md`; copy only the ones you want.

<details open>
<summary><b>Claude Code</b> &nbsp;plugin marketplace, updates included</summary>

```bash
/plugin marketplace add DahanItamar/SkillShelf
/plugin install edgecase@skillshelf     # or regwise, blueprint, showcase, casebook, truthpath
```

</details>

<details>
<summary><b>OpenAI Codex</b> &nbsp;~/.codex/skills or .agents/skills</summary>

```bash
git clone https://github.com/DahanItamar/SkillShelf
cp -r SkillShelf/plugins/edgecase ~/.codex/skills/      # for you, in every project
cp -r SkillShelf/plugins/edgecase .agents/skills/       # or for one project, shared with your team
```

</details>

<details>
<summary><b>Cursor</b> &nbsp;.cursor/skills or .agents/skills</summary>

```bash
git clone https://github.com/DahanItamar/SkillShelf
cp -r SkillShelf/plugins/edgecase .cursor/skills/
```

Cursor picks skills up on start. Type `/` in Agent chat to run one by name.

</details>

<details>
<summary><b>GitHub Copilot</b> &nbsp;.github/skills or ~/.copilot/skills</summary>

```bash
git clone https://github.com/DahanItamar/SkillShelf
cp -r SkillShelf/plugins/edgecase .github/skills/
```

</details>

<details>
<summary><b>Gemini CLI</b> &nbsp;.gemini/skills or ~/.gemini/skills</summary>

```bash
git clone https://github.com/DahanItamar/SkillShelf
cp -r SkillShelf/plugins/edgecase .gemini/skills/
```

Run `/skills` inside Gemini CLI to see what loaded.

</details>

**Which folders to copy.** Edgecase and Showcase are one folder each. The others keep their skills one level down:

| Skill | Copy |
|---|---|
| Regwise | `plugins/regwise/skills/regwise` |
| Edgecase | `plugins/edgecase` |
| Blueprint | every folder in `plugins/blueprint/skills/` (seven skills) |
| Showcase | `plugins/showcase` |
| Casebook | every folder in `plugins/casebook/skills/` |
| Truthpath | `plugins/truthpath/skills/truthpath` |

> [!TIP]
> Codex and Cursor both read `.agents/skills/`, so one copy in a repo serves a mixed team.

<details>
<summary>Installed one of these under an old name?</summary>

acsm is now Regwise, uilint is Edgecase, spec-architect is Blueprint and readme-architect is Showcase, and the marketplace is now `skillshelf`. In Claude Code, remove the old plugin and marketplace, then install from SkillShelf. Regwise still reads an existing `acsm.config.yml`.

</details>

## License

MIT. Regwise's document templates are also released under CC0; see [plugins/regwise/LICENSE-TEMPLATES](plugins/regwise/LICENSE-TEMPLATES).
