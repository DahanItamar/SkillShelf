# page.jsx

Request helpers (`getUser`, `getStats`) are not shown, so R-STATE-16 is not expected here.

Blocking, 5:
- `page.jsx:2 · R-STATE-11` (two coupled queries gated by one check at line 4)
- `page.jsx:4 · R-STATE-12`
- `page.jsx:4 · R-FEEDBACK-03`
- `page.jsx:4 · R-FEEDBACK-10`
- `page.jsx:5 · R-STATE-02`

Worth fixing: none.
