<!-- expect: FAIL L4 -->
# CASE 001: Nightly export job sometimes writes an empty file

Status: open
Repro status: not observed
Verify command: `none`

## Symptom
The nightly export file is sometimes zero bytes. Last seen on Tuesday. Expected: a file with one row per order.

## Repro
- Command or steps: not yet known
- Observed: not yet

## Hypotheses

### H1 The export runs before the orders are written -- result: pending
- Because: a zero-byte file means the query returned nothing, and the job time is close to the order import time
- Predicts: if true, the job start time is earlier than the import finish time on the bad nights; if false, the times never overlap
- Experiment: [read] compare the schedule in jobs/export.json with the schedule in jobs/import.json
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
