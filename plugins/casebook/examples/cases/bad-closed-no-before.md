<!-- expect: FAIL L8 -->
# CASE 001: Invoice total is one cent low when a unit price ends in half a cent

Status: closed
Repro status: observed failing
Verify command: `npm test` (user-approved)

## Symptom
An order line with a unit price of 1.005 shows an invoice total of 1.00. A calculator gives 1.01 for the same amount, and the customer expected 1.01.

## Repro
- Command or steps: create an invoice with one line, unit price 1.005, quantity 1, and read the total
- Observed: user: the invoice total showed 1.00, expected 1.01

## Hypotheses

### H1 The tax table has a stale rate -- result: ruled out
- Because: the total is wrong by a small amount, and a wrong rate would do that
- Predicts: if true, the rate in the table differs from the current rate; if false, the rate is current and the total is wrong even at a rate of zero
- Experiment: [read] open src/tax.mjs and compare the rate with the expected one
- Evidence: src/tax.mjs:14 holds the current rate, and the symptom line has no tax on it

### H2 Rounding is applied per line instead of once on the total -- result: ruled out
- Because: per-line rounding is a common way for a total to drift by a cent
- Predicts: if true, roundMoney is called inside the line loop; if false, it is called once after the lines are summed
- Experiment: [read] open src/invoice.mjs and find where roundMoney is called
- Evidence: src/invoice.mjs:31 calls roundMoney once, on the summed total

### H3 roundMoney loses the half cent to float rounding -- result: confirmed
- Because: roundMoney multiplies by 100 before rounding, and 1.005 has no exact binary form
- Predicts: if true, Math.round(1.005 * 100) prints 100; if false, it prints 101
- Experiment: [user-run] node -e "console.log(Math.round(1.005*100))"
- Evidence: user ran: node -e "console.log(Math.round(1.005*100))" -> 100. Mechanism read at src/money.mjs:4.

### H4 The unit price is stored as text and parsed wrongly -- result: pending
- Because: a text price could be parsed with fewer digits than it has
- Predicts: if true, the stored value is a string such as "1.00"; if false, the stored value is the number 1.005
- Experiment: [read] open test/fixtures/orders.json and look at the unit price type
- Evidence:

## Ruled out
- H1 -- the rate is current and the symptom has no tax (src/tax.mjs:14)
- H2 -- rounding happens once, on the total (src/invoice.mjs:31)

## Root cause
Confirmed: H3. roundMoney multiplies by 100 first, and 1.005 * 100 is 100.49999999999999 in floating point, so Math.round gives 100 and the half cent is lost. The user's node run printed 100, which matches the prediction for H3.

## Fix
Changed src/money.mjs: roundMoney now rounds on the decimal text of the number (shifts the decimal point with an e2 string) instead of on a float product.

## Regression test
test/money.test.mjs :: rounds half up

## Before and after
- After: exit 0; observed by agent; ok 1 - rounds half up

## Lesson
Round money with integer cents or decimal text, not Math.round on a float product.
