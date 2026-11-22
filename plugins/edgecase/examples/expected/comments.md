# comments.html

Blocking, 4:
- `comments.html:1 · R-FEEDBACK-02` (failed load is silent: HTMX leaves the empty div when the request fails)
- `comments.html:1 · R-STATE-02` (the div is empty until the response arrives, with no indicator)
- `comments.html:2 · R-FEEDBACK-02` (failed post is silent for the same reason)
- `comments.html:4 · R-STATE-15` (the Post button has no busy state, so a slow post can be sent twice)

Worth fixing: none.
