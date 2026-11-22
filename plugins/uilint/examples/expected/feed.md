# feed.svelte

Blocking, 5:
- `feed.svelte:7 · R-STATE-16` (no timeout or abort on the fetch)
- `feed.svelte:15 · R-STATE-08` (an empty array of posts renders nothing and says nothing)
- `feed.svelte:17 · R-FEEDBACK-01` (`e.stack` is printed to the user, which leaks internals)
- `feed.svelte:17 · R-FEEDBACK-03` (the message names no cause in the user's terms and offers no next step)
- `feed.svelte:17 · R-STATE-02` (while `posts` is null and `message` is empty, an empty `<pre>` shows and the wait is blank)

Worth fixing: none.
