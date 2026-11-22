<!-- expect: FAIL L5 -->
# CASE 001: Invoice total is one cent low when a unit price ends in half a cent

Status: fixing
Repro status: observed failing
Verify command: `npm test` (constitution)

## Symptom
An order line with a unit price of 1.005 shows an invoice total of 1.00. The customer expected 1.01.

## Repro
- Command or steps: create an invoice with one line, unit price 1.005, quantity 1, and read the total
- Observed: user: the invoice total showed 1.00, expected 1.01

## Hypotheses

### H1 roundMoney loses the half cent to float rounding -- result: pending
- Because: roundMoney multiplies by 100 before rounding
- Predicts: if true, Math.round(1.005 * 100) prints 100; if false, it prints 101
- Experiment: [user-run] node -e "console.log(Math.round(1.005*100))"
- Evidence:

### H2 The tax table has a stale rate -- result: pending
- Because: a wrong rate would move the total by a small amount
- Predicts: if true, the rate differs from the current rate; if false, it matches
- Experiment: [read] open src/tax.mjs and compare the rate with the expected one
- Evidence:

## Ruled out
- (none yet)

## Root cause
Not yet.

## Fix
Started changing src/money.mjs before any experiment had a result.

## Regression test
Not yet.

## Before and after
- Before: not yet
- After: not yet

## Lesson
Not yet.
