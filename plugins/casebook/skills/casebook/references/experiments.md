# Running experiments

Every experiment has a kind tag at the start of its `Experiment:` line. The kind decides who runs it.

## The five kinds

### `[read]` - the agent runs it

Reading files, grep, and read-only git inspection (`log`, `blame`, `show`, `diff`). Allowed before and after the gate. Nothing is changed.

Evidence is a `path:line` pointer to what you read, for example `src/invoice.mjs:31 calls roundMoney once`.

### `[verify]` - the agent runs it

Either the full verify command exactly as written in the case header, or the approved `Verify one:` command with only `{test}` replaced by a test name. No other arguments, no filters, no environment tricks, no wrapper script. If even the scoped command is too slow to be a useful experiment, make it a `[user-run]` instead of editing the command.

Evidence is `ran: <command> -> <what came out>`, with the failing test name when there is one.

### `[user-run]` - the user runs it, the agent never does

Anything else: a script, a curl, a REPL line, a debugger, an instrumented build, a command that was never approved. The agent writes the exact command or steps in the case file and asks the user to run it and paste the result. The agent does not execute it, even if it looks harmless.

Wording for the ask:

```
I only execute the verify command; reading files and read-only git are free. Please run this and paste the output: <command>
If true, expect: <prediction>. If false, expect: <other prediction>.
```

Record the pasted output as `user ran: <command> -> <excerpt>`. Redact secrets and customer data as `<redacted>`.

### `[bisect]` - the user runs it, the agent never does

For "it used to work", when a known-good ref exists. `git bisect` changes the working tree, so the agent never runs it, and never writes the script to disk (the gate allows only the case file). The user may run any script here, so it is not limited to the approved commands.

1. The agent writes the script text into the case file, inside the experiment block, together with the commands below. It is never written to disk.
2. The user saves the script OUTSIDE the repository, so bisect, make and the script do not interfere (git's own manual recommends this).
3. The user runs `git bisect run <path-to-script>`.
4. If an existing test already fails at the bad ref, skip the script: use `git bisect run` with the Verify one command and its test name.

```
git bisect start <bad> <good>
git bisect run <path-to-script>
git bisect reset
```

Script skeleton (a POSIX sh file, saved outside the repo):

```
#!/bin/sh
make || exit 125     # replace make with your build step; 125 = cannot test this commit, skip
<the check>          # for example: node check-total.mjs
# exit 0 = good, exit 1 = bad
```

The exit code is the contract: 0 means good, 1 to 127 except 125 means bad, and 125 means skip. Caution: exit 127 (command not found) counts as BAD, so every command in the script must exist at every commit that is tried. Source: https://git-scm.com/docs/git-bisect.

Evidence is the user's pasted `<sha> is the first bad commit` line, recorded as `user ran: git bisect run <path-to-script> -> <sha> is the first bad commit`. Make it the first cheap experiment when the symptom says regression and a known-good ref exists. After `git bisect reset` the working tree is back where it was.

### `[probe]` - the one exception to the gate

A probe is a temporary, logging-only insertion with no logic change. Every inserted line contains the literal marker `CASEBOOK-PROBE-<NNN>`, where NNN is the case number.

1. The case file first lists each probe: file, line and exact text.
2. The user says yes once to that list. Without a yes, make it a `[user-run]`.
3. The agent inserts exactly those lines and nothing else.
4. The user, or the approved verify command, triggers the repro. The output is evidence: `user ran: ...` or `ran: ...`.
5. Before `Status: fixing`, the agent removes every probe line and searches the tree for the marker. The search must return nothing. The case then records `Probes removed: yes (grep empty)`.

A probe may log no secrets and no personal data: log counts, types and branch names, not values.

## Forbidden before the gate

- Adding log lines, except a `[probe]` approved as above.
- Temporary patches.
- "Try it and see" edits.
- Changing a test, fixture or config to see what happens.

Any other log-line experiment is a `[user-run]` the user performs on their own copy. The agent describes where to add the line and what to look for, and does not make the edit.

## Flaky bugs

To observe the pattern, run the verify command up to 3 times. Record the counts you actually saw, for example `ran: npm test x3 -> 2 passed, 1 failed`. Set `Intermittent: yes` under Repro. Never record a count that was not run. A pass does not clear an intermittent bug; it only lowers the chance that it is still there.

For the new regression test of an intermittent bug, run it up to 5 times against the unfixed code (the `Verify one:` command if approved). Before is valid if at least one run fails: record `runs: <failed>/<total>`. If every run passes against the unfixed code, the test does not capture the bug: stop. Five is a default, not evidence. The user may choose a smaller N, recorded as `Runs: N` in the case header; use N for Before and for the After runs too.

## Cheapest first

1. Read the failing line and the code around it.
2. Read recent changes to that area (`git log`, `git diff`, read-only).
3. For a regression with a known-good ref, ask for a `[bisect]` run.
4. Compare a working case with a failing one: inputs, config, data.
5. Run the verify command, to see the failure or to confirm a state.
6. Ask for a user-run probe: a one-line script, a REPL check, a request, an instrumented copy.

Run one experiment at a time. Write the prediction first, run it, and record the result in the case file straight away. If you notice something else on the way, add it as a new hypothesis rather than chasing it now.
