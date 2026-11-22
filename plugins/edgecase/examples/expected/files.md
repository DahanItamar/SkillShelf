# files.jsx

Control for the Worth-fixing half of the output contract and for the R-FEEDBACK-07 carve-out.

Blocking: none.

Worth fixing, 1:
- `files.jsx:9 · R-FEEDBACK-05` (the toast carries "Undo" and dismisses itself after 3 seconds, so a user who looked away loses the action)

Why R-FEEDBACK-07 is NOT expected: the deleted row leaves the list, so R-FEEDBACK-08 applies and the change is its own confirmation. Reporting R-FEEDBACK-07 here is an extra.
Why nothing else is expected: the failure path is inline with a reason and a next step, the button has a working state, the fetch has a timeout and the empty list says what it is for.
