# Close checks

Nine checks, run in order. Stop at the first failure and refuse with one block:

```
Cannot close case NNN. Missing: <C#>: <what>. Next step: <one concrete step>.
```

| ID | Check | Refusal text (after `Missing:`) | Next step |
| --- | --- | --- | --- |
| C1 | `Repro status: observed failing`, and Observed names who saw it | `C1: the repro was never observed failing.` | Reproduce it and record the failing output. |
| C2 | At least 2 hypotheses, and at least one result recorded | `C2: fewer than 2 hypotheses, or no experiment result recorded.` | Run the cheapest experiment. |
| C3 | Root cause names a hypothesis whose result is `confirmed` | `C3: no confirmed hypothesis is named as the root cause.` | Confirm a hypothesis with evidence, or keep the case open (a trial fix does not close). |
| C4 | The confirmed hypothesis has an Evidence pointer: `path:line`, or `ran:` / `user ran:` with output | `C4: the confirmed hypothesis has no evidence.` | Add the evidence. |
| C5 | Every `ruled out` hypothesis is in the Ruled out list, and every listed one is `ruled out` | `C5: the Ruled out list and the hypothesis results disagree.` | Reconcile the list. |
| C6 | Fix section is non-empty, names files, and is not `trial, unconfirmed` | `C6: the Fix section is empty, names no files, or is a trial.` | Describe what changed. |
| C7 | The regression test pointer `<path> :: <name>` resolves to a real test | `C7: the regression test is missing or does not resolve.` | Write the test. |
| C8 | Before exit is non-zero with the test named; After exit is 0 | `C8: no recorded failing run before the fix.` | Record the failing run before the fix (see the recovery path). |
| C9 | A fresh verify run passes (5 of 5 if the case is intermittent) | `C9: the fresh verify run did not pass.` | Fix what the fresh run shows. |

C9 is the only check that runs a command. It runs the verify command from the constitution, exactly as written, and nothing else.

## Recovery path for a missing Before (C8)

Claude cannot go back and watch the bug fail. The user can:

1. In a scratch checkout, reintroduce the bug (revert the fix, or check out the commit before it).
2. Run the verify command there.
3. Paste the failing output.

Record it as `- Before: exit <int>; observed by user; <excerpt>`. The case then closes with an honest `observed by user` on Before. Do not reintroduce the bug in the working tree yourself: this skill never edits code.

## No verify command in the constitution

C8 and C9 can only be satisfied by output the user pastes, marked `observed by user`. Ask for a failing run before the fix and a passing run now. The close summary then ends with: `Closed on user-reported runs; no verify command was available.`

## Intermittent cases

A case with `Intermittent: yes` under Repro needs After to carry `runs: <passed>/<total>`, and a fresh C9 run of 5 out of 5 passing. Five is a stated v1 default, not a measured threshold. A green run on an intermittent bug lowers the chance the bug is still there. It does not remove it. Say that in `Not checked:`.

## Close summary

```
Case 007 closed.
  Before: exit 1 (observed by Claude)  After: exit 0 (fresh run, observed by Claude)
  Root cause: H3, float rounding in roundMoney
  Regression test: test/money.test.mjs :: rounds half up
  Lesson: Round money with integer cents, not Math.round on a float product.
  Not checked: other callers of roundMoney (outside this case)
```

`Not checked:` is mandatory. `Not checked: nothing noted` is allowed when that is true.

## Parking

If the user asks to park a case, set `Status: parked` and add one line, for example `Parked: needs a device we do not have`. Touch nothing else. Use this for bugs the verify command cannot express (a visual glitch, timing, production-only).
