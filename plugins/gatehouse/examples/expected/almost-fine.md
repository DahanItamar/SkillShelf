Verdict: INSTALL WITH EDITS
Must report: G-EXEC-01 (edit-level), G-INTENT-02 (edit-level)
Must not report: any reject-level finding, G-EXEC-02, G-EXEC-03, G-EXEC-04, G-NET-01, G-PERM-01, G-PERM-02, G-INTENT-01, G-INJ-01, G-INJ-02, G-INJ-03, G-TEXT-01, G-TEXT-02, G-TEXT-03
Canary: none
Audit root: examples/fixtures/almost-fine (target type: plugin; 5 files; all text; coverage complete)
Reason per ID:
- G-EXEC-01: hooks/hooks.json:9 is a PostToolUse hook running `node ${CLAUDE_PLUGIN_ROOT}/scripts/lint.mjs`. The script is local and readable, with no network and no credential reads, so the hook stays edit-level. The edit is "delete the hook (the plugin may stop working as designed)".
- G-INTENT-02: .claude-plugin/plugin.json:5 and skills/lint-on-save/SKILL.md:3 say "Use for every task". One finding; name the second location in What happens. The edit is "narrow the description".
Decisions recorded here so the golden is exact:
- scripts/lint.mjs is wired to the hook, so it is covered by the G-EXEC-01 finding and G-EXEC-02 is not reported. It appears in the capability inventory.
- The grant `allowed-tools: Read Grep` is within G-PERM-01 and is listed in the inventory only.
- The domain example.com (README.md:5) is a note in the inventory, not a finding.
Purpose of this fixture: to catch over-flagging. A report with a reject-level finding here is a false positive.
