# Changelog

## 0.1.0 - 2026-11-22
- First version, not yet released. A read-only auditor for a skill, plugin or marketplace folder that is already on disk. Sixteen rules in six groups, a fixed report template, and one of three verdicts from a published table: INSTALL, INSTALL WITH EDITS, REJECT.
- Runs nothing and fetches nothing. No hooks, no `bin/`, no MCP. Written to the open Agent Skills standard for Claude Code, Codex, Cursor, Copilot and Gemini CLI; only Claude Code has been tried.
- Reads and searches in a tool-neutral way, with byte-level recipes for invisible characters that a shell `grep` can run.
- Report quoting: target names, versions and the stated purpose are printed only in a code span or a fenced quote. A reject-level finding offers no edit.
- Covers other tools' instruction files (`AGENTS.md`, `GEMINI.md`, Cursor and Copilot rules) and executables by folder (`scripts/`, `bin/`) and extension.
- Fewer false rejects: directional marks in Hebrew, Arabic and Indic text are allowed, a quoted injection phrase in a skill is an edit rather than a reject, and a bare "reviewer" no longer matches.
- Fixtures with golden expectations in `examples/`, including a Hebrew right-to-left fixture that should come out as INSTALL.
- Not yet measured: no model-run audit has been recorded. See `examples/results/`. The reference-token figure (about 10k tokens of references) is a size-based estimate. `/gatehouse` versus `/gatehouse:gatehouse` and `plugin details` have not been observed live.
