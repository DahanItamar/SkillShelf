<!-- expect: pass -->
# CASE 001: Order total is wrong since the last release

Status: closed
Repro status: observed failing
Verify command: `npm test` (user-approved)
Verify one: `npm test -- -t {test}` (user-approved)

## Symptom
An order of two items at 10.00 each shows a total of 10.00. It showed 20.00 in release v2.3.0.

## Repro
- Command or steps: create an order with two items at 10.00 each and read the total
- Observed: user: the total shows 10.00, expected 20.00

## Hypotheses

### H1 A recent change broke the quantity sum -- result: confirmed
- Because: the total was right in v2.3.0, and no test covered quantities above one
- Predicts: if true, git bisect names one commit that touched the total code; if false, it names an unrelated commit
- Experiment: [bisect] script text below. The user saves it OUTSIDE the repo as ../bisect-total.sh, then runs git bisect start HEAD v2.3.0, git bisect run ../bisect-total.sh, git bisect reset
- Script (text only, the agent does not write it to disk):

```sh
#!/bin/sh
npm ci --silent || exit 125
test "$(node -e 'console.log(require("./src/total.js").total([10,10]))')" = "20"
```

- Evidence: user ran: git bisect run ../bisect-total.sh -> 8c41d07 is the first bad commit

### H2 The test data has one item instead of two -- result: ruled out
- Because: a wrong fixture would show a total of one item
- Predicts: if true, the fixture lists one item; if false, it lists two
- Experiment: [read] open test/fixtures/order.json and count the items
- Evidence: test/fixtures/order.json:3 lists two items

## Ruled out
- H2 -- the fixture lists two items (test/fixtures/order.json:3)

## Root cause
Confirmed: H1. The first bad commit changed the reduce in src/total.js to start from the first item, so the first item is counted once less. The bisect run names that commit.

## Fix
Changed src/total.js: the reduce starts from 0 again.

## Regression test
test/total.test.js :: sums two items

## Before and after
- Before: exit 1; observed by agent; not ok 1 - sums two items (expected 20, got 10)
- After: exit 0; observed by agent; ok 1 - sums two items

## Lesson
Cover a quantity above one in the total test, so a bisect has a test to run.
