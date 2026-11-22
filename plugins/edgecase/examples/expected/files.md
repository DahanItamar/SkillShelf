# files.jsx

Clean control for the Worth-fixing half of the output contract and for the R-FEEDBACK-07 carve-out. Since 1.5.0 it also checks the response status, so it is a control for R-STATE-17 as well (the unchecked case is `status.jsx`).

Blocking: none.

Worth fixing, 1:
- `files.jsx:11 · R-FEEDBACK-05` (the toast carries "Undo" and dismisses itself after 3 seconds, so a user who looked away loses the action)

Why R-FEEDBACK-07 is NOT expected: the deleted row leaves the list, so R-FEEDBACK-08 applies and the change is its own confirmation. Reporting R-FEEDBACK-07 here is an extra.
Why R-STATE-17 is NOT expected: the DELETE response is checked (`r.status === 401`, then `!r.ok`) before `onRemoved` runs, with a different message for an expired session. Reporting it here is an extra. Before 1.5.0 this file did not check the status and this golden wrongly blessed that.
Why nothing else is expected: every failure path is inline with a reason and a next step, the button has a working state, the fetch has a timeout and the empty list says what it is for.
