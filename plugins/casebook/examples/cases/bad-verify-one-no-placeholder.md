<!-- expect: FAIL L2 -->
# CASE 001: Queue worker test fails about one run in three

Status: closed
Repro status: observed failing
Verify command: `npm test` (user-approved)
Verify one: `npm test -- -t rounds` (user-approved)
Runs: 3

## Symptom
The test "drains the queue" passes on most runs and fails on some. Expected: it passes every time.

## Repro
- Command or steps: `npm test` several times in a row
- Observed: agent via verify command: ran: npm test x3 -> 2 passed, 1 failed
- Intermittent: yes

## Hypotheses

### H1 The test depends on the order of two timers -- result: confirmed
- Because: a failure that comes and goes with no code change often depends on timing
- Predicts: if true, the test awaits neither timer; if false, both are awaited
- Experiment: [read] open test/queue.test.mjs and look for the awaits
- Evidence: test/queue.test.mjs:12 awaits the first timer and never the second

### H2 A shared fixture leaks between tests -- result: ruled out
- Because: leaked state also makes a test pass or fail depending on order
- Predicts: if true, the fixture is created once at module level; if false, it is created per test
- Experiment: [read] open test/queue.test.mjs and find where the fixture is built
- Evidence: test/queue.test.mjs:5 builds the fixture inside beforeEach

## Ruled out
- H2 -- the fixture is rebuilt for every test (test/queue.test.mjs:5)

## Root cause
Confirmed: H1. The test awaited only the first timer, so it read the queue before the second timer had drained it on slow runs. Reading test/queue.test.mjs:12 shows the missing await.

## Fix
Changed test/queue.test.mjs and src/queue.mjs: drain now returns a promise that resolves after both timers, and the test awaits it.
Attempts: 1

## Regression test
test/queue.test.mjs :: drains the queue after both timers

## Before and after
- Before: exit 1; observed by agent; runs: 2/3; not ok 1 - drains the queue after both timers
- After: exit 0; observed by agent; runs: 3/3; ok 1 - drains the queue after both timers

## Lesson
Await every asynchronous step a test depends on, not only the first one.
