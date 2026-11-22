Verdict: REJECT
Must report: G-TEXT-01 (reject-level, never capped), then the capped fixture findings below, each titled "(labelled test fixture, confirm)"
Audit root: plugins/gatehouse, run from the repository root (target type: plugin)
Status: predicted by the author from Grep sweeps and a reading of the rules. No model-run report has been recorded. This golden is an expectation, not a measurement.

Why the verdict is REJECT, and why that is the honest answer
- The spec for this plugin expected INSTALL WITH EDITS. Applying the rules as written gives REJECT.
- examples/fixtures/hidden-text/SKILL.md:14 contains a run of 32 Unicode tag characters (U+E0000 block). G-TEXT-01 is reject-level for tag characters anywhere, and the labelled-fixture cap never applies to them. examples/README.md does say "These are deliberately hostile test fixtures. They are inert text.", which caps the other fixture findings, but not this one.
- A tool that excused itself here would be worse than one that flags itself and says why. The cause is a test fixture, not the skill.
- Auditing the installable skill alone, `plugins/gatehouse/skills/gatehouse`, is predicted to give INSTALL (see below). The plain-skill install route in the README copies only that folder.

Capped to edit-level by the labelled-fixture cap (each reported with "(labelled test fixture, confirm)")
- hidden-text: G-TEXT-02 and G-TEXT-03 (examples/fixtures/hidden-text/SKILL.md:12 and :16); G-INJ-01, G-INJ-02, G-PERM-02, G-INTENT-01 (SKILL.md:12 and :18).
- helpful-installer: G-EXEC-01 (hooks/hooks.json:8), G-EXEC-02 (.mcp.json:4, bin/helper.sh), G-EXEC-03 (hooks/hooks.json:8), G-EXEC-04 and G-TEXT-03 (bin/helper.sh:3), G-NET-01 (hooks/hooks.json:8), G-INTENT-01.
- overreach: G-PERM-02, G-NET-01, G-INTENT-01 (SKILL.md:11 and :13).
Not capped, because they are edit-level already: overreach G-PERM-01 (SKILL.md:4) and G-INTENT-02 (SKILL.md:13); almost-fine G-EXEC-01 (hooks/hooks.json:9) and G-INTENT-02 (plugin.json:5, SKILL.md:3).

Downgraded to note (conditions (a)-(d) in rules.md), listed by file in a real report with line numbers
- skills/gatehouse/references/patterns.md: the phrase tables and recipe strings for G-INJ-01, G-INJ-02, G-INJ-03, G-EXEC-03, G-EXEC-04, G-PERM-01, G-PERM-02, G-NET-01, G-INTENT-02. All sit in code spans or table cells, in the reference surface, and describe the pattern.
- skills/gatehouse/references/rules.md: quoted paths, hook event names and settings keys in code spans (G-PERM-02, G-INJ-03, G-EXEC-01).
- README.md: the abridged report in the fenced example quotes a claim of prior approval (G-INJ-01); the install text mentions `~/.claude/skills` (G-PERM-02, documentation telling the user what to do).
- examples/README.md and examples/expected/*.md: the same families, quoted in code spans or described.
Dropped as failing Applies (not downgraded): "fails silently" and "do not show immunity" style prose hits for G-INJ-02.

Must not report
- Any finding in skills/gatehouse/SKILL.md. It contains no rule phrase, no hook, no blob, no comment and no invisible character. Its one grant, `allowed-tools: Read, Grep, Glob`, is within G-PERM-01.
- A hook, MCP server or bin file at the plugin root (there is none). The hooks, the MCP server and the bin file in "What it can do once installed" are the fixtures' own, under examples/fixtures/, and the report must say they are not loaded by Claude Code.

Coverage: complete. Nothing is unreadable, nothing is remote, node_modules is absent, and the tree is under 300 files. `examples/check.test.mjs` is an example-surface script wired to nothing (note).

Sweeps expected to be 0 hits outside the fixtures: S-INVIS, S-TAG, S-PAD, S-BLOB (one false positive: the long Red Hat URL in README.md; judge and drop), S-HEX, S-OBFUSC, S-LONGLINE, S-REMOTE-EXEC, S-REMOTE-FOLLOW. S-COMMENT hits only the literal `<!--` text inside code spans in patterns.md and rules.md (not hidden).

Audit of the installable skill alone (`plugins/gatehouse/skills/gatehouse`): predicted INSTALL, with the downgraded notes listed. Not confirmed by a model run.
