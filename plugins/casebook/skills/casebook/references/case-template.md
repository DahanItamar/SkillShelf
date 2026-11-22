# Case file template

Location: `docs/bugs/NNN.md`, NNN zero-padded to 3 digits (4 or more when needed). The next number is the highest existing number plus 1, found by listing the file names in `docs/bugs/` only. The title lives in the heading. Copy the block below and fill it in.

````markdown
# CASE 007: Invoice total is one cent low on some orders

Status: open
Repro status: not observed
Verify command: `npm test`

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

## What each field means

| Field | One line |
| --- | --- |
| `# CASE NNN: title` | The number matches the file name. The title says what is wrong, not why. |
| `Status:` | One of `open`, `fixing`, `closed`, `parked`. |
| `Repro status:` | `observed failing` only if a failure was actually seen. Otherwise `not observed`. |
| `Verify command:` | A backticked command copied from the constitution, or `none`. |
| `## Symptom` | Seen versus expected. Observable facts. Any diagnosis goes in a hypothesis. |
| `## Repro` | One line of steps, and who observed the failure. Add `Intermittent: yes` here for a flaky bug. |
| Hypothesis heading | `### H<n> <claim> -- result: <pending, ruled out, inconclusive or confirmed>`. Use the ASCII `--`. |
| `Because:` | Why this is plausible, one sentence. |
| `Predicts:` | What you would observe if it is true, and what if it is false. Written before the experiment runs. |
| `Experiment:` | Starts with a kind tag: `[read]`, `[verify]` or `[user-run]`. See `experiments.md`. |
| `Evidence:` | May be empty only while `pending`. Otherwise a `path:line` pointer, or `ran: <command> -> <what came out>`, or `user ran: <command> -> <pasted output excerpt>`. |
| `## Ruled out` | One line per ruled-out hypothesis: `- H1 -- <why> (<evidence pointer>)`. Write `- (none)` when closing a case with nothing ruled out. |
| `## Root cause` | Of a closed case, begins `Confirmed: H<n>` and names a hypothesis whose result is `confirmed`. Then two sentences using only evidence on file. |
| `## Fix` | What changed and in which files. Begins `trial, unconfirmed` while no hypothesis is confirmed. |
| `## Regression test` | One line: `<path> :: <test name>`, for example `test/money.test.mjs :: rounds half up`. |
| `Before:` / `After:` | Exactly `- Before: exit <int>; observed by <Claude or user>; <excerpt>` and `- After: exit <int>; observed by <Claude or user>; <excerpt>`. For an intermittent case After also carries `runs: <passed>/<total>`. |
| `## Lesson` | One sentence about a code or process pattern, not about this exact line. |
| `Parked:` | Added by `/casebook-close` when a case is parked, with the user's reason. |

## Rules that never bend

- IDs are permanent. A hypothesis added later gets the next number. Never renumber or delete one.
- `Evidence` for `confirmed` is a pointer or a command with output. Reasoning alone makes it `inconclusive`.
- Never write secrets, API keys, `.env` contents or customer data into the file. Redact values as `<redacted>`.
- A small case is a small file. The rule is the order, not the volume.
