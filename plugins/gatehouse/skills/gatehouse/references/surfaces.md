# Surfaces

What to inventory, and how each file is classified. Class is decided by the path relative to the audit
root. A fixture audited as the root has its own files as root surfaces.

## Target type

Detect it from the audit root, in this order:

- **Marketplace**: has `.claude-plugin/marketplace.json`. Audit every plugin whose `source` is a relative path inside the root. For a plugin whose `source` is a remote repository, URL, package or git ref, write `NOT AUDITED: remote source <defanged source>`; coverage becomes incomplete.
- **Plugin**: has `.claude-plugin/plugin.json`.
- **Skill**: has `SKILL.md` at the root or at `skills/*/SKILL.md`.
- **None of these**: stop with one line: "No SKILL.md, plugin.json or marketplace.json found under <path>; nothing to audit as a skill." Do not improvise an audit of arbitrary code.

## Surface classes

| Class | Files |
|---|---|
| Instruction | `SKILL.md`, `skills/**`, `commands/**`, `agents/**`, `CLAUDE.md`, `.claude/**`. Content here enters Claude's context. |
| Reference | Files under `references/`, and any file that an instruction-surface file links to as material to load. They enter context like instructions and are scored like instructions, but they may use the downgrade in `rules.md` because they are often data about patterns. |
| Execution | `hooks/hooks.json`, a `hooks` key in `plugin.json`, hooks in skill, command or agent frontmatter, `.mcp.json` or an `mcpServers` key, language-server config, monitors, mods, `bin/**`, `settings.json`, `.claude/settings*.json`, `package.json` scripts (`preinstall`, `install`, `postinstall`, `prepare`), `Makefile`, `install.*`, `*.sh`, `*.ps1`, `*.py`, `*.js`, `*.mjs`, `*.ts`, `.github/workflows/**` |
| Metadata | `plugin.json`, `marketplace.json`, frontmatter fields |
| Documentation | `README*`, `CHANGELOG*`, `docs/**`, `LICENSE*` |
| Example | `examples/**`, `fixtures/**`, `test/**`, `tests/**` |
| Unreadable | Binaries, or any file Read cannot present as text. List by name, size and extension. Never guess their content. |

A file that fits two classes takes the more dangerous one (execution, then instruction, then
metadata, then reference, then documentation, then example). The labelled-fixture cap in `rules.md` depends on location, not on class. This list follows the "what a plugin can
do" section of Anthropic's Plugin security and trust page (hooks, monitors, mods, MCP and language
servers, `bin/`, skills, commands and agents, updates). Check that page when it changes.

Paths in the table are anchored at the audit root, except extension globs such as `*.sh`, which match anywhere. A plugin nested deeper (a fixture, a vendored copy) is still found by its manifest and the rules still apply to its content; a file there is classed by where it sits relative to the audit root, and the labelled-fixture cap applies if it sits under an example folder.

A plugin loader discovers only `skills/`, `commands/`, `agents/`, `hooks/hooks.json`, `.mcp.json`,
`bin/` and the manifest at the plugin root. A file under `examples/` is read by Gatehouse as text but
is not loaded by Claude Code.

## Project-scope config in the target

If the target contains `.claude/settings.json`, `.mcp.json` or `CLAUDE.md`, put it in the capability
inventory with one line: opening that folder as a Claude Code working directory would load it.
Tell the user to audit from a different working directory.

## Caps and coverage

- List all file names with Glob. Always read the metadata and execution surfaces in full.
- More than 300 files: read in priority order (metadata, execution, instruction, documentation, example) and record exactly what was not read.
- Skip `.git/` and `node_modules/` and list them as skipped. A skipped `node_modules/` makes coverage incomplete.
- Symlinks cannot be detected with Read, Grep and Glob. Say so under Limits. Do not pretend otherwise.
- Documentation files are read up to 400 lines each; for a longer file read the head and rely on the sweeps. Example-surface files are read only where a sweep hit them, or where the surface is small.
- Coverage is incomplete if any of these holds: a file is unreadable, a remote plugin source was not audited, `node_modules/` was skipped, the file cap left files unread, or `SKILL.md` or `plugin.json` could not be read.
