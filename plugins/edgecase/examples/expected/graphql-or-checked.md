# graphql-or-checked.jsx

The response status IS checked (`!r.ok` throws), so R-STATE-17 must NOT be reported. The failure only sets `error`, which is never rendered, so the user stays on "Loading cart..." forever.

Blocking, 1:
- `graphql-or-checked.jsx:11 · R-FEEDBACK-02` (the failure is caught and stored in state that no branch renders; the user sees a loading message with no error and no retry)

Worth fixing: none.

Not expected: R-STATE-17 (status is checked). Loading, empty and timeout are handled. A report of R-STATE-17 here is an extra and shows the rule double-reports.
