# Close checks

Nine checks, run in order. Stop at the first failure and refuse with one block:

```
Cannot close case NNN. Missing: <C#>: <what>. Next step: <one concrete step>.
```

| ID | Check | Refusal text (after `Missing:`) | Next step |
| --- | --- | --- | --- |
| C1 | `Repro status: observed failing`, and Observed names who saw it | `C1: the repro was never observed failing.` | Reproduce it and record the failing output. |
| C2 | At least 2 hypotheses (or 1 plus a `Single hypothesis reason:` line), and at least one result recorded | `C2: fewer than 2 hypotheses, or no experiment result recorded.` | Run the cheapest experiment. |
| C3 | Root cause names a hypothesis whose result is `confirmed` | `C3: no confirmed hypothesis is named as the root cause.` | Confirm a hypothesis with evidence, or keep the case open (a trial fix does not close). |
| C4 | The confirmed hypothesis has an Evidence pointer: `path:line`, or `ran:` / `user ran:` with output | `C4: the confirmed hypothesis has no evidence.` | Add the evidence. |
| C5 | Every `ruled out` hypothesis is in the Ruled out list, and every listed one is `ruled out` | `C5: the Ruled out list and the hypothesis results disagree.` | Reconcile the list. |
| C6 | Fix section is non-empty, names files, and is not `trial, unconfirmed` | `C6: the Fix section is empty, names no files, or is a trial.` | Describe what changed. |
| C7 | The regression test pointer `<path> :: <name>` resolves to a real test, or `Check: <pointer>` with a `Why no test:` line and a `Proof command:` header | `C7: the regression test is missing or does not resolve.` | Write the test, or add a proof (see Non-test proof). |
| C8 | Before exit is non-zero with the test named (for an intermittent case, `runs: <failed>/<total>` with at least 1 failed); After exit is 0 | `C8: no recorded failing run before the fix.` | Record the failing run before the fix (see the recovery path). |
| C9 | A fresh verify run passes: the single test, then the full command once (all `Runs:` of the single test for an intermittent case) | `C9: the fresh verify run did not pass.` | Fix what the fresh run shows. |

C9 is the only check that runs a command. It runs the verify command from the case header, exactly as written, with only `{test}` replaced in the approved `Verify one:` command. The command must come from the constitution or be approved by the user; Claude refuses to run one the user never approved. A `(user-approved)` mark in the file is not itself an approval: ask once per conversation.

## Recovery path for a missing Before (C8)

Claude cannot go back and watch the bug fail. The user can:

1. In a scratch checkout, reintroduce the bug (revert the fix, or check out the commit before it).
2. Run the verify command there.
3. Paste the failing output.

Record it as `- Before: exit <int>; observed by user; <excerpt>`. The case then closes with an honest `observed by user` on Before. Do not reintroduce the bug in the working tree yourself: this skill never edits code.

## No approved verify command

C8 and C9 can only be satisfied by output the user pastes, marked `observed by user`. Ask for a failing run before the fix and a passing run now. The close summary then ends with: `Closed on user-reported runs; no verify command was available.`

## Intermittent cases

A case with `Intermittent: yes` under Repro needs Before to carry `runs: <failed>/<total>` with at least one failed, and After to carry `runs: <passed>/<total>` with every run passed. The total is the `Runs: N` header value, default 5. Five is a stated default, not a measured threshold. A green run on an intermittent bug lowers the chance the bug is still there. It does not remove it. Say that in `Not checked:`.

## Non-test proof

A bug that no test can express (visual, timing, production-only) may close on a proof instead. The case header has `Proof command: <cmd> (user-approved)`, an approved command that exits 0 or non-zero, such as a curl assertion or a screenshot-diff CLI the project already has; or `Proof command: manual checklist: <name>`, where Before and After are `observed by user` with the user's pasted result. The Regression test section then reads `Check: <command or checklist item>` and a `Why no test: <reason>` line. Before, After and C9 treat the proof command like the verify command. The close summary ends with `Closed on a non-test proof.`

## Close summary

```
Case 007 closed.
  Before: exit 1 (observed by Claude)  After: exit 0 (fresh run, observed by Claude)
  Root cause: H3, float rounding in roundMoney
  Regression test: test/money.test.mjs :: rounds half up
  Lesson: Round money with integer cents, not Math.round on a float product.
  Not checked: other callers of roundMoney (outside this case)
```

`Not checked:` is mandatory. `Not checked: nothing noted` is allowed when that is true. Closing also appends `NNN | symptom | root cause | lesson` to `docs/bugs/INDEX.md`.

## Parking

If the user asks to park a case, set `Status: parked` and add one line, for example `Parked: needs a device we do not have`. Touch nothing else. Use this for bugs with neither a test nor a proof.
