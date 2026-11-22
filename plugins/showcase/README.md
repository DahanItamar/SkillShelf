<div align="center">

# Showcase

**A skill that writes your README after running your project, not after reading your folder names.
Every number in what it produces is one it observed, and anything it could not observe it tells you
it could not observe.**

It writes `README.md`, plus optional `docs/SETUP.md` and `docs/ARCHITECTURE.md`. Ask in your own
words: *"write a README for this"*, *"my README is out of date, audit it"*, *"audit my README
without changing it"*, *"make this presentable before I make it public"*.

Plain Markdown. **No dependencies, no build step, no runtime. Nothing executes at install; the skill
runs your project's tests or dev server only after its run-safety gate.**

<img alt="version 2.3.0" src="https://img.shields.io/badge/version-2.3.0-0F766E?style=flat-square">
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-0F766E?style=flat-square"></a>
<img alt="zero dependencies" src="https://img.shields.io/badge/dependencies-0-0F766E?style=flat-square">

<a href="#run-it">Run it</a> ·
<a href="#see-the-result">Result</a> ·
<a href="#cost-and-safety">Cost and safety</a> ·
<a href="SKILL.md">Skill</a> ·
<a href="CHANGELOG.md">Changelog</a>

</div>

---

## Run it

There is nothing to run at install. It is Markdown that Claude Code reads. Install as a plugin:

```bash
/plugin marketplace add DahanItamar/SkillShelf
/plugin install showcase@skillshelf
/reload-plugins
```

The plugin wrapper is optional. The skill itself uses no Claude-only features and follows the open
Agent Skills standard (`SKILL.md` with `name` and `description`).

### Use it in other tools

Codex, Cursor, GitHub Copilot and Gemini CLI read the same skill. Copy only `SKILL.md` and
`references/` into a folder named `showcase` under that tool's skills directory (the folder name
must match the `name` field):

```bash
git clone https://github.com/DahanItamar/SkillShelf.git
mkdir -p <skills-dir>/showcase
cp SkillShelf/plugins/showcase/SKILL.md <skills-dir>/showcase/
cp -r SkillShelf/plugins/showcase/references <skills-dir>/showcase/
```

The per-tool skills directories are listed in the [Install section of the repository
README](../../README.md#install). Then ask: *"write a README for this"*.

## See the result

[`examples/`](examples/README.md) holds a small worked example: a tiny fixture (an 11-line shell
utility with four tests), the README written for it, and its evidence ledger. It is a
**hand-authored reference example following the skill's rules**, not generated output; its numbers
were observed by running the ledger's commands. Check them yourself:

```sh
sh scripts/replay.sh examples/docs/EVIDENCE.md examples/fixture
```

No output and exit status 0 means every replayable row still holds. This script runs the commands
in the ledger, so only point it at a ledger you trust. It is an optional maintainer or CI check; the
skill does not need it.

## Cost and safety

- **Cost.** `SKILL.md` is 16,212 bytes at 2.3.0 and loads on every run. The eight reference files
  total 58,076 bytes and load only at the phase that needs them. A utility run skips
  `identity-block.md`, `visuals.md` and `modes.md`: 51,462 bytes. A run that loads everything is
  74,288 bytes. Sizes are measured with `wc -c` and rechecked by `check.sh`.
  **Token figures are estimates at 4 bytes per token:** about 4.1k tokens for `SKILL.md`, about
  12.9k tokens for a utility run and about 18.6k tokens for a full load. No end-to-end run cost was
  measured; these are load sizes only. The stranger test is offered, not default, and roughly
  doubles the run's cost.
- **Safety.** Phase 1 runs the project, which executes its code. It runs only a repository that is
  yours (you wrote it, your organisation owns it, or you said "yes, run it" for it in this session).
  Any other clone needs an explicit yes, and the default for third-party code is Static mode. It
  offers a throwaway copy or a container first, asks before network, paid, remote-database,
  migration, deploy or credential-bearing steps, keeps servers on 127.0.0.1, reads `.env.example`
  and never `.env`, and stops what it started. With no confirmation it executes nothing and writes
  from the tests, marking runtime facts `unverified`. The gate is a prompt-level rule, not a
  sandbox. The checklist and a one-line "allowed first commands" card an organisation can approve
  once are at the top of [`references/run-recipes.md`](references/run-recipes.md).
- **Privacy.** It redacts secrets and also avoids personal data (record fields, emails, ids),
  internal hostnames, IPs and account ids, prefers seeded data, and greps its draft for
  email-, IP-, token- and long-digit-shaped strings before writing. This lowers the leak risk. It
  does not replace review and is not a compliance claim.

## Limits

- The port check has a command per OS (Linux, macOS, Windows PowerShell); if none works it is
  marked `unverified`.
- With no tests, it writes from the examples.
- If the project needs credentials, those facts are `unverified`.
- Badge URLs in the READMEs it writes may carry `&logo=`. The no-logo rule applies only to this
  marketplace's own README badges.

## Under the hood

The core idea: ask a model for a README and it writes *"robust error handling"* and *"blazing
fast"*, which carry no information. So the workflow runs the project, collects real output and
numbers, and only then writes. Where it cannot run something, it says so and writes from the tests,
with no invented timings or screenshots. Every element (badge, section, diagram, image) must carry a
checkable fact or be cut; a capability section with no diagram, table, output, measurement or image
becomes one bullet.

- **Progressive disclosure.** `SKILL.md` is 298 lines and loads every invocation; the eight
  reference files are 1,253 lines and load only at the phase that needs them. Each is complete by
  itself and none depends on another being loaded.
- **Fixed handover.** Every run ends with the same six-row table: paths written, numbers,
  unverified claims, screenshots, `Verified on`, stranger test. A row that did not run says `not run`.
- **Audit first.** If a README exists, it shows a keep / change / cut table before writing.
  Audit-only mode runs a fixed six-item check, writes nothing and does not run the project.
- **It never runs a git command that writes.** No commit, no push, no tag.
- **Screenshots are asked about, never guessed.** If capture fails or is declined, it writes
  `docs/SCREENSHOTS.md` and says plainly that this was the one thing it could not do.
- **Write surface.** `README.md`, `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/brand/*.svg`,
  `docs/assets/screens/*.png`, `docs/SCREENSHOTS.md`, `docs/EVIDENCE.md`. Nothing else.
- **Mermaid ahead of any image format.** It renders on GitHub, is text in the diff and needs no
  file to rot.

`CHANGELOG.md` is this plugin's history. `check.sh` and `scripts/replay.sh` are maintainer-run
checks and are not loaded at run time.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
