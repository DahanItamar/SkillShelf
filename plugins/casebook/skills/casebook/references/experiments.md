# Running experiments

Every experiment has a kind tag at the start of its `Experiment:` line. The kind decides who runs it.

## The three kinds

### `[read]` - Claude runs it

Reading files, grep, and read-only git inspection (`log`, `blame`, `show`, `diff`). Allowed before and after the gate. Nothing is changed.

Evidence is a `path:line` pointer to what you read, for example `src/invoice.mjs:31 calls roundMoney once`.

### `[verify]` - Claude runs it

The constitution's verify command, exactly as written. No added arguments, no filters, no environment tricks, no wrapper script. If the full command is too slow to be a useful experiment, make it a `[user-run]` instead of editing the command.

Evidence is `ran: <command> -> <what came out>`, with the failing test name when there is one.

### `[user-run]` - the user runs it, Claude never does

Anything else: a script, a curl, a REPL line, a debugger, an instrumented build, a command not named in the constitution. Claude writes the exact command or steps in the case file and asks the user to run it and paste the result. Claude does not execute it, even if it looks harmless.

Wording for the ask:

```
I only run the verify command from the constitution. Please run this and paste the output: <command>
If true, expect: <prediction>. If false, expect: <other prediction>.
```

Record the pasted output as `user ran: <command> -> <excerpt>`. Redact secrets and customer data as `<redacted>`.

## Forbidden before the gate

- Adding log lines.
- Temporary patches.
- "Try it and see" edits.
- Changing a test, fixture or config to see what happens.

A log-line experiment is a `[user-run]` the user performs on their own copy. Claude describes where to add the line and what to look for. Claude does not make the edit.

## Flaky bugs

Run the verify command up to 3 times to observe the pattern. Record the counts you actually saw, for example `ran: npm test x3 -> 2 passed, 1 failed`. Set `Intermittent: yes` under Repro. Never record a count that was not run. A pass does not clear an intermittent bug; it only lowers the chance that it is still there.

## Cheapest first

1. Read the failing line and the code around it.
2. Read recent changes to that area (`git log`, `git diff`, read-only).
3. Compare a working case with a failing one: inputs, config, data.
4. Run the verify command, to see the failure or to confirm a state.
5. Ask for a user-run probe: a one-line script, a REPL check, a request, an instrumented copy.

Run one experiment at a time. Write the prediction first, run it, and record the result in the case file straight away. If you notice something else on the way, add it as a new hypothesis rather than chasing it now.
