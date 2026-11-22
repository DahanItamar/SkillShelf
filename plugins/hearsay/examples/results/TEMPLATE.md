# Results: <model> <YYYY-MM-DD>

Copy this file to `<model>-<date>.md` and fill every field from a real run. Leave nothing invented; if a
field was not measured, write "not measured".

- Model and version: 
- Date: 
- Plugin version and commit: 
- Runs per case: (the protocol asks for 2, each in a fresh session)
- Fixture built with: `sh scripts/make-fixture.sh <new-dir>`

## Per-case counts

Produced by `HEARSAY_OUT=<saved ledger> HEARSAY_GOLDEN=examples/expected/<case>.md node --test scripts/score.test.js`.

| Case | Run | Matched | Differs | Missing | Extra | False accusations |
|---|---|---|---|---|---|---|
| 1 notes-1.4.0 | 1 | | | | | |
| 1 notes-1.4.0 | 2 | | | | | |

(one pair of rows per case, cases 1 to 6; cases 7 and 8 have no ledger, so record pass or fail by hand)

## False-accusation count

Total rows marked `contradicted` that the golden does not: 

This is the number the skill says matters most.

## Manual checks (examples/README.md, self-test step 4 and 5)

- Claim cells verbatim: 
- Cited lines exist and support the claim: 
- `git status --porcelain` and `git log -1` unchanged before and after, including case 7: 

## Goldens edited

None, or list each golden changed, why, and who decided: 

## Known bias

- The same author wrote the goldens and the skill.
- The fixture was built to contain the mismatches; it says nothing about real repositories.
- Only JavaScript is seeded.
- Two runs per case on a non-deterministic model is a small sample.
