# form.jsx

Blocking, 5:
- `form.jsx:6 · R-FEEDBACK-02` (empty `.catch`, so a failed invite is silent)
- `form.jsx:6 · R-FEEDBACK-07` (a sent invite shows nothing, and no visible change stands in for a message)
- `form.jsx:6 · R-STATE-15` (the request has no working state and the form can be submitted twice)
- `form.jsx:6 · R-STATE-16` (no timeout or abort on the POST)
- `form.jsx:11 · R-FORM-01` (the button is disabled by validity with no message saying what is wrong with the email)

Worth fixing: none.
