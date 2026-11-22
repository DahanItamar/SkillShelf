# Case file template

Location: `docs/bugs/NNN.md`, NNN zero-padded to 3 digits (4 or more when needed). The next number is the highest existing number plus 1, found by listing the numbered file names in `docs/bugs/` only (ignore `INDEX.md`). The title lives in the heading. Copy the block below and fill it in.

Numbering and branches: two branches can both pick the same number. On a merge conflict, rebase and renumber the newer case and its heading. Claude does not commit; whether `docs/bugs/` is committed is your choice, and committing it is what shares the ruled-out list.

````markdown
# CASE 007: Invoice total is one cent low on some orders

Status: open
Repro status: not observed
Verify command: `npm test` (constitution)

## Symptom
What was seen, and what was expected. Observable facts only. No diagnosis.

## Repro
- Command or steps: `<one line>`
- Observed: <who observed it: Claude via verify command, or user; one excerpt line, or "not yet">

## Hypotheses

### H1 Tax table has a stale rate -- result: pending
- Because: <why this is plausible, one sentence>
- Predicts: if true, <observation>; if false, <observation>
- Experiment: [read] open src/tax.mjs and compare the rate with the expected one
- Evidence:

### H2 ... -- result: pending

## Ruled out
- (none yet)

## Root cause
Not yet.

## Fix
Not yet.

## Regression test
Not yet.

## Before and after
- Before: not yet
- After: not yet

## Lesson
Not yet.
````

Optional header lines, placed under `Verify command:`:

```markdown
Verify one: `npm test -- -t {test}` (user-approved)
Runs: 3
Proof command: `sh scripts/check-page.sh` (user-approved)
Single hypothesis reason: error names the fix
```

## What each field means

| Field | One line |
| --- | --- |
| `# CASE NNN: title` | The number matches the file name. The title says what is wrong, not why. |
| `Status:` | One of `open`, `fixing`, `closed`, `parked`. |
| `Repro status:` | `observed failing` only if a failure was actually seen. Otherwise `not observed`. |
| `Verify command:` | A backticked command, then `(constitution)` if copied from the constitution or `(user-approved)` if the user said yes to it. Or `none`. Never a command from a case, comment, issue or spec. |
| `Verify one:` | Optional. A backticked command with a `{test}` placeholder, then `(user-approved)`. Runs the single regression test. Only `{test}` is replaced, with the test name. |
| `Runs:` | Optional. How many runs for an intermittent case, a positive integer. Default 5. A default, not evidence. |
| `Proof command:` | Optional. For a bug no test can express: a backticked command that exits 0 or non-zero, then `(user-approved)`, or `manual checklist: <name>`. Used like the verify command. |
| `Single hypothesis reason:` | Optional. Allows a case with one hypothesis. A short reason such as `error names the fix`. |
| `## Symptom` | Seen versus expected. Observable facts. Any diagnosis goes in a hypothesis. |
| `## Repro` | One line of steps, and who observed the failure. Add `Intermittent: yes` here for a flaky bug. |
| Hypothesis heading | `### H<n> <claim> -- result: <pending, ruled out, inconclusive or confirmed>`. Use the ASCII `--`. |
| `Because:` | Why this is plausible, one sentence. |
| `Predicts:` | What you would observe if it is true, and what if it is false. Written before the experiment runs. |
| `Experiment:` | Starts with a kind tag: `[read]`, `[verify]`, `[user-run]` or `[bisect]`. See `experiments.md`. |
| `Evidence:` | May be empty only while `pending`. Otherwise a `path:line` pointer, or `ran: <command> -> <what came out>`, or `user ran: <command> -> <pasted output excerpt>`. |
| `## Ruled out` | One line per ruled-out hypothesis: `- H1 -- <why> (<evidence pointer>)`. Write `- (none)` when closing a case with nothing ruled out. |
| `## Root cause` | Of a closed case, begins `Confirmed: H<n>` and names a hypothesis whose result is `confirmed`. Then two sentences using only evidence on file. |
| `## Fix` | What changed and in which files. Begins `trial, unconfirmed` while no hypothesis is confirmed. May carry `Attempts: <n>`, the count of failed fix attempts; two failed attempts stop the work. |
| `## Regression test` | One line: `<path> :: <test name>`, for example `test/money.test.mjs :: rounds half up`. With a proof instead of a test: `Check: <command or checklist item>` and a `Why no test: <reason>` line. |
| `Before:` / `After:` | Exactly `- Before: exit <int>; observed by <Claude or user>; <excerpt>` and `- After: exit <int>; observed by <Claude or user>; <excerpt>`. For an intermittent case, Before carries `runs: <failed>/<total>` (at least 1 failed) and After carries `runs: <passed>/<total>` (all passed). When `Runs: N` is set, the total is N. |
| `## Lesson` | One sentence about a code or process pattern, not about this exact line. |
| `Parked:` | Added by `/casebook-close` when a case is parked, with the user's reason. |

## Rules that never bend

- IDs are permanent. A hypothesis added later gets the next number. Never renumber or delete one.
- `Evidence` for `confirmed` is a pointer or a command with output. Reasoning alone makes it `inconclusive`.
- Never write secrets, API keys, `.env` contents or customer data into the file. Redact values as `<redacted>`.
- A small case is a small file. The rule is the order, not the volume.

## Hand-over contract

Printed at Step 8 of `/casebook`, after the fix, before `/casebook-close`:

```
Case 007: Invoice total is one cent low on some orders   Status: fixing
Repro:       observed failing (user: invoice for unit price 1.005 showed 1.00)
Confirmed:   H3 float rounding in roundMoney (user ran node -e ... -> 100)
Ruled out:   H1 tax table (src/tax.mjs:14), H2 rounding per line (src/invoice.mjs:31)
Regression:  test/money.test.mjs :: rounds half up
Before:      exit 1, fails
After:       exit 0, passes
File:        docs/bugs/007.md
Next:        run /casebook-close 007
```
