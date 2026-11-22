# status.jsx

Seeded bug: `fetch` resolves on 4xx and 5xx, so the `catch` never runs for a server error and the success path runs anyway.

Blocking, 1:
- `status.jsx:8 · R-STATE-17` (a PUT that returns 500 still calls `onSaved` and shows "Saved.", so the user believes a note was saved that was not)

Worth fixing: none.

Why nothing else is expected: the button has a working state, the request has a timeout, the message is in a `role="status"` region and the failure branch for a network error is inline with a next step. Anything else reported here is an extra.
