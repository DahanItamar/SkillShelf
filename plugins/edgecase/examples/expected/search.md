# search.jsx

Seeded bug: a stale response. Typing "ab" then "abc" sends two requests; if the first answers last, `setRows` writes the results for "ab" under a box that says "abc".

Blocking, 1:
- `search.jsx:9 · R-STATE-18` (no abort, no request id, no cleanup in the effect, so an older slower response overwrites the newer one)

Worth fixing: none.

Why nothing else is expected: the status is checked, the wait has a timeout, loading, error and no-results states exist with a way forward, and each is in a live region. Anything else reported here is an extra.
