# panel.vue

Blocking, 5:
- `panel.vue:5 · R-FEEDBACK-02` (no try/catch around the await, so a rejection reaches the console and the screen does not change)
- `panel.vue:5 · R-STATE-17` (`res.json()` runs on a 4xx or 5xx response and the body is treated as items; added in 1.5.0)
- `panel.vue:5 · R-STATE-16` (no timeout or abort on the fetch)
- `panel.vue:10 · R-STATE-02` (an empty list shows while loading, so the wait is a blank)
- `panel.vue:10 · R-STATE-08` (an empty result renders nothing and says nothing about why)

Worth fixing: none.
