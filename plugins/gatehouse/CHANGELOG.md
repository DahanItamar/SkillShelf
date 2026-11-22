# Changelog

Release checklist: version in `plugin.json` == the gatehouse entry (version and description) in the root `.claude-plugin/marketplace.json` == the head of this file == the README version badge; the README rule count == `grep -c '^### G-' skills/gatehouse/references/rules.md` (16 today); `node --test examples/check.test.mjs` passes; a fresh `examples/results/<model>-<date>.md` is committed per model release; repeat the name search (GitHub repositories and code, plus the marketplace directories) before tagging. Nothing here runs at install.

## 0.1.0 - 2026-11-22
- First version. A read-only auditor for a skill, plugin or marketplace folder that is already on disk. Sixteen rules in six groups (text, injection, exec, perm, net, intent), a fixed report template, and one of three verdicts from a published table: INSTALL, INSTALL WITH EDITS, REJECT.
- Uses only Read, Grep and Glob. No hooks, no `bin/`, no MCP, nothing to install or run.
- Four fixtures with golden expectations in `examples/`, a maintainer-run `node --test` structure check with no packages, and goldens for the four sibling plugins and for itself.
- Name search on 2026-11-22: one web search and two GitHub repository searches for "gatehouse" with Claude skill or plugin terms found nothing by that name. Not exhaustive; repeat before release.
- Not yet measured: no model-run audit has been recorded. See `examples/results/`.
