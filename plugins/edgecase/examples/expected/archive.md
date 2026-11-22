# archive.jsx

Counter-example to `files.jsx`: the same kind of action, but the row stays in the list, so the R-FEEDBACK-07 carve-out must NOT apply.

Blocking, 2:
- `archive.jsx:6 · R-FEEDBACK-07` (an archived project stays in the list looking exactly as before, so nothing shows the action worked and the user will click again; R-FEEDBACK-08 does not apply because no visible change happens)
- `archive.jsx:13 · R-STATE-15` (the button has no working state while the request is in flight, so a slow archive can be pressed twice)

Worth fixing: none.

Why R-FEEDBACK-07 is expected: `files.jsx` removes the row, which is its own confirmation. Here the row never changes, so the carve-out in R-FEEDBACK-08 does not hold. Missing it here is a miss.
Why nothing else is expected: the failure path is inline with a reason, the fetch has a timeout and the empty list says what it is for.
