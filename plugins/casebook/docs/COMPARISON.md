# How Casebook compares

Checked on: 2026-11-22, from public descriptions and one raw file only. None of these tools was run, and licences and upkeep were not checked. It may be out of date.

- **[superpowers `systematic-debugging`](https://raw.githubusercontent.com/obra/superpowers/main/skills/systematic-debugging/SKILL.md)**: the closest ancestor; root cause first, no persistent case file.
- **[GSD's debugger](https://www.mintlify.com/gsd-build/get-shit-done/agents/debugger)**: also keeps a persistent list of eliminated hypotheses, in a tool-specific planning directory.
- **[Debug Mode](https://github.com/doraemonkeys/claude-code-debug-mode)**: adds tagged logging before the fix, where Casebook allows only an approved `[probe]`.
- **[diagnosing-bugs](https://www.aihero.dev/skills-diagnosing-bugs)**: a feedback loop first, then bisect or instrument; gate not confirmed.
- **[git-bisect-debugging](https://skills.sh/sjungling/sjungling-claude-plugins/git-bisect-debugging)**: a dedicated bisect skill, no case file.

Casebook adds a checkable order (no edit until a result is recorded), "confirmed" that needs evidence, a
lintable file, and a separate re-check at close. It does not claim to find bugs faster or more reliably
than any of the above. That has not been measured.

