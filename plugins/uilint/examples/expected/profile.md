# profile.html.erb

Server-rendered form with no JS handler, so the empty-catch grep does not apply. The controller comment on line 6 stands in for the action, which is not shown.

Blocking, 2:
- `profile.html.erb:2 · R-FEEDBACK-07` (the POST always redirects back with no flash, so a saved profile and a rejected one look identical)
- `profile.html.erb:2 · R-FEEDBACK-02` (a failed validation also redirects, so the user sees nothing and the error is never shown next to the field)

Worth fixing: none.

Why R-FEEDBACK-07 applies and R-FEEDBACK-08 does not: nothing on the redirected page changes visibly when the save works.
Why R-FORM-01 and R-STATE-15 are not expected: the markup has no disabled submit, and a plain form post has no async working state to show.
