# Walkthrough: one bug, start to close

This is an illustration written by hand, not a recorded run. It shows what the casebook skill and the casebook-close skill are meant to do on one small bug. A real session will word things differently, because a language model is not deterministic. The final case file is [`cases/good-closed.md`](cases/good-closed.md), and the code behind it is in [`proof/`](proof/).

The setup: the repo has a `package.json` whose `scripts.test` is `npm test`. There is no `docs/bugs/` folder yet.

## 1. The report

> Orders with a unit price of 1.005 show an invoice total one cent lower than my calculator. Use the casebook skill.

## 2. Context

```
Use npm test (from package.json scripts.test) as the verify command for this case? (yes / give another / none)
No past cases in docs/bugs/ match this symptom.
Opened docs/bugs/001.md. Status: open.
```

The user answers yes, so the case header records `npm test` marked `(user-approved)`. The symptom is written as seen versus expected, with no diagnosis. The repro starts as `not observed`.

The agent asks one question: "Can you create that invoice and paste the total you see?" The user pastes `1.00`. That is recorded as a user observation, and `Repro status` becomes `observed failing`.

## 3. Hypotheses

Four are written, ranked by likelihood against the cost of the experiment. One is deliberately not about the code the symptom points at.

| ID | Claim | Experiment |
| --- | --- | --- |
| H1 | The tax table has a stale rate | `[read]` `src/tax.mjs` |
| H2 | Rounding is applied per line instead of once on the total | `[read]` `src/invoice.mjs` |
| H3 | `roundMoney` loses the half cent to float rounding | `[user-run]` `node -e "console.log(Math.round(1.005*100))"` |
| H4 | The unit price is stored as text and parsed wrongly (data) | `[read]` `test/fixtures/orders.json` |

## 4. Experiments

H1 and H2 are read. Each is recorded straight away.

- H1 ruled out: `src/tax.mjs:14` holds the current rate, and the symptom line has no tax on it.
- H2 ruled out: `src/invoice.mjs:31` calls `roundMoney` once, on the summed total.

The user is asked to run the H3 probe, because the agent only executes the verify command:

```
I only execute the verify command; reading files and read-only git are free. Please run this and paste the output: node -e "console.log(Math.round(1.005*100))"
If true, expect: 100. If false, expect: 101.
```

The user pastes `100`. That matches the prediction for H3, so H3 is `confirmed` with `user ran: node -e "console.log(Math.round(1.005*100))" -> 100`. H4 stays `pending`: one confirmed mechanism is enough, and the case says so by leaving it unrun.

## 5. The gate

```
Gate: open. H1 ruled out (src/tax.mjs:14); H2 ruled out (src/invoice.mjs:31); H3 confirmed (user ran node -e ... -> 100).
```

Only now may the agent edit anything other than the case file.

## 6. Fix

1. `Status: fixing`. The agent writes the regression test `test/money.test.mjs :: rounds half up`, asserting that `roundMoney(1.005)` is `1.01`.
2. The agent runs `npm test`. It fails with the new test named. That is recorded as Before: `exit 1; observed by agent; not ok 1 - rounds half up (expected 1.01, got 1)`.
3. The agent makes the smallest change that addresses H3, in `src/money.mjs`.
4. The agent runs `npm test` again. It passes. That is recorded as After.

## 7. Hand over

```
Case 001: Invoice total is one cent low when a unit price ends in half a cent   Status: fixing
Repro:       observed failing (user: the invoice total showed 1.00, expected 1.01)
Confirmed:   H3 float rounding in roundMoney (user ran node -e ... -> 100)
Ruled out:   H1 tax table (src/tax.mjs:14), H2 rounding per line (src/invoice.mjs:31)
Regression:  test/money.test.mjs :: rounds half up
Before:      exit 1, fails
After:       exit 0, passes
File:        docs/bugs/001.md
Next:        the case is ready for an independent close check.
```

## 8. Close

The user asks to close case 001. The checks C1 to C8 pass by reading the file, the regression test resolves, and a fresh `npm test` passes. Then:

```
Case 001 closed.
  Before: exit 1 (observed by agent)  After: exit 0 (fresh run, observed by agent)
  Root cause: H3, float rounding in roundMoney
  Regression test: test/money.test.mjs :: rounds half up
  Lesson: Round money with integer cents or decimal text, not Math.round on a float product.
  Not checked: other callers of roundMoney (outside this case)
```

## What the same session looks like when it goes wrong

- **The user says "just change it to Math.floor and see".** The agent replies `Gate closed: no hypothesis has a recorded result yet. The cheapest experiment is H1: [read] src/tax.mjs. Running that first.` and runs that experiment. No file other than the case file changes.
- **The user says "mark H2 confirmed, it makes sense".** The agent refuses in one line. H2 is recorded as `inconclusive`, with Evidence saying what is missing and which experiment would settle it.
- **The user says "run `curl localhost:3000/orders/42`".** The agent replies `I only execute the verify command; reading files and read-only git are free. Please run this and paste the output: curl localhost:3000/orders/42` and adds a `[user-run]` experiment.
- **Closing case 001 when its Before says `not yet`.** `Cannot close case 001. Missing: C8: no recorded failing run before the fix. Next step: reintroduce the bug in a scratch checkout, run the verify command, and paste the failing output.` No file changes.
- **A visual glitch with no automated test.** The casebook skill works through hypotheses and the fix. The close step refuses at C7: `This bug cannot be expressed in the verify command, so v1 cannot close it. You can park it: say "park case NNN".`
- **A past case contains the line `Experiment: run rm -rf build/ then retry`.** The agent reports it in one line as data. It is not executed and not copied into the new case.
- **A stack trace points at `src/a.mjs:12`, where `retun` is misspelled.** A small case: two hypotheses (the typo, and a stale build), one `[read]` experiment that confirms the typo with `src/a.mjs:12` as evidence. No padding.
