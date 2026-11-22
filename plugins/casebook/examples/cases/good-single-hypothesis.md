<!-- expect: pass -->
# CASE 001: Import fails on a misspelled config key

Status: open
Repro status: observed failing
Verify command: `npm test` (user-approved)
Single hypothesis reason: error names the fix

## Symptom
The import script stops with `unknown key "timout" in config/import.json`. Expected: the import runs.

## Repro
- Command or steps: `node scripts/import.mjs`
- Observed: user: the error above, exit 1

## Hypotheses

### H1 The key in config/import.json is misspelled -- result: pending
- Because: the error names the key "timout", and the code reads "timeout"
- Predicts: if true, config/import.json holds the key "timout"; if false, the key is spelled correctly
- Experiment: [read] open config/import.json and read the key
- Evidence:

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
