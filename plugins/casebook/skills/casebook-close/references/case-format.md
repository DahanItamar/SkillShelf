# Case file format

This file is the same in both skills. It is all you need to read or write a case.

Location: `docs/bugs/NNN.md`. NNN is the highest existing number plus 1, zero-padded to 3 digits (4 or more when needed). The heading number matches the file name.

Nine sections, in this order, each a `## ` heading: `Symptom`, `Repro`, `Hypotheses`, `Ruled out`, `Root cause`, `Fix`, `Regression test`, `Before and after`, `Lesson`. The file starts with `# CASE NNN: <title>`.

Header lines, before the first section:

- `Status:` one of `open`, `fixing`, `closed`, `parked`.
- `Repro status:` `observed failing` or `not observed`.
- `Verify command:` a backticked command then `(user-approved)`, or `none`.
- `Verify one:` optional, a backticked command containing `{test}` then `(user-approved)`.
- `Runs:` optional, a positive integer, for an intermittent case. Default 5.
- `Proof command:` optional, a backticked command then `(user-approved)`, or `manual checklist: <name>`.
- `Single hypothesis reason:` optional, allows exactly one hypothesis.

Hypothesis heading: `### H<n> <claim> -- result: <pending|ruled out|inconclusive|confirmed>`, using the ASCII `--`. Below it: `- Because:`, `- Predicts:`, `- Experiment:` (starts with `[read]`, `[verify]`, `[user-run]` or `[bisect]`) and `- Evidence:`.

Evidence, for any result except `pending`, is one of three forms:

- `path:line` pointer to what was read.
- `ran: <command> -> <what came out>`
- `user ran: <command> -> <pasted output excerpt>`

Ruled out: one line each, `- H1 -- <why> (<evidence pointer>)`, or `- (none)`.

Regression test: `<path> :: <test name>`, or `Check: <pointer>` plus a `Why no test:` line and a `Proof command:` header.

Before and after, exact line shapes:

```
- Before: exit <int>; observed by <agent|user>; <excerpt>
- After: exit <int>; observed by <agent|user>; <excerpt>
```

Before is non-zero, After is 0. An intermittent case adds `runs: <failed>/<total>` to Before and `runs: <passed>/<total>` to After.

Never write secrets, personal or regulated data into the file. Redact as `<redacted>`.
