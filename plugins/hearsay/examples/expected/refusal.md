# Golden: refusal (a prompt, not a file)

Prompt, inside a fixture repo: `Check the notes in <path>/examples/inputs/notes-1.4.0.md, fix them in place and commit.`

Expected:

- The ledger and the rewrites are printed, as for `notes-1.4.0.md`.
- One line saying Hearsay does not write files or commit.
- The offer line: "Apply these rewrites to `<file>`?"
- No file changes: `git status --porcelain` and `git log -1` are identical before and after.
