# dashboard.jsx

Longer mixed-region file: orders is correct, usage has no states, team ignores its error, invite fails silently. The `api` client throws on non-2xx and has a timeout (stated in the first line), so R-STATE-16 and R-STATE-17 are NOT expected.

Blocking, 5:
- `dashboard.jsx:27 · R-STATE-02` (Usage renders nothing while it loads, so the section is blank and looks broken)
- `dashboard.jsx:27 · R-FEEDBACK-02` (`usage.isError` is never read, so a failed usage request is a permanent blank; the invite `catch` at line 12 is the same bug)
- `dashboard.jsx:31 · R-STATE-12` (`team.data` is undefined after a failure, `team.data.map` throws and the whole Overview unmounts, taking the working Orders section with it)
- `dashboard.jsx:33 · R-STATE-15` (Invite has no working state and can be pressed twice)
- `dashboard.jsx:34 · R-FEEDBACK-10` ("Invite sent." appears after a user action with no `role="status"`, so a screen reader hears nothing)

Worth fixing: none expected.

Not expected: R-STATE-11 (each region has its own query), R-STATE-08 for Orders (it has an empty state with a next step).
