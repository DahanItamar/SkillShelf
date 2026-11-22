# page.jsx

Request helpers (`getUser`, `getStats`) are not shown. R-STATE-16 is not expected because the timeout may live inside them and the file gives no evidence either way; flagging it would be a guess.

Blocking, 5:
- `page.jsx:2 · R-STATE-11` (two coupled queries gated by one check at line 4, so one section's data is held hostage by the other)
- `page.jsx:4 · R-STATE-12` (one failed query replaces the whole page with a message)
- `page.jsx:4 · R-FEEDBACK-03` (the message is the single word "Error": it does not say what failed, why, or what to do next)
- `page.jsx:4 · R-FEEDBACK-10` (the swap to the error message does not move focus or announce itself, so a screen reader user hears nothing)
- `page.jsx:5 · R-STATE-02` (no loading branch, so `Layout` renders with undefined data while the queries run)

Worth fixing: none.
