# list.jsx

Blocking, 4:
- `list.jsx:4 · R-FEEDBACK-02` (the empty `.catch` swallows the failure, so a failed load changes nothing on screen)
- `list.jsx:4 · R-STATE-16` (no timeout or abort, so a hung request leaves the page blank for ever)
- `list.jsx:6 · R-STATE-02` (the list renders empty while the fetch is in flight, which looks broken)
- `list.jsx:6 · R-STATE-08` (an empty array renders an empty `<ul>` with no words about why)

Worth fixing: none.
