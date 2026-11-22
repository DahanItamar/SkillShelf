# Build-mode case: expected behaviour

Written by the skill author as an expectation, never run against a model as of 1.5.0 (see `results/`).

The first draft, before anything is reported complete, must already contain:

- Loading: an indicator or skeleton while the list loads (R-STATE-02).
- Error: a message with a retry when the list request fails or returns a non-2xx status (R-FEEDBACK-02, R-STATE-17), with a timeout or abort on the request (R-STATE-16).
- Empty: text saying what the panel is for, with a next step (R-STATE-08).
- Cancel: a working state on the pressed row only (R-STATE-15), the status checked before the row is removed (R-STATE-17), and an inline error with a next step on failure (R-FEEDBACK-02, R-FEEDBACK-03). No separate success message is required because the row leaving the list is the confirmation (R-FEEDBACK-08).

The reply must state in one line what was added, for example `Added: loading, error + retry, empty and cancel states for Orders.` It must not report the work complete while any of the above is missing.

It must not add states to files it did not touch, and must not comment on spacing, colour or typography.
