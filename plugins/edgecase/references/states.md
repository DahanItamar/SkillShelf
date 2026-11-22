# States

Loading, empty, and partial. Error content lives in `feedback.md`; this file covers whether a state
exists at all and which form it takes.

`R-STATE-03` and `R-STATE-05` are retired — their material was merged into `R-STATE-06` and
`R-STATE-04`. Retired IDs are never reused, so a review citing one still resolves.

---

### R-STATE-01 · All five states considered
**DO:** Decide, for every section that fetches or submits, what it shows while loading, when it has
nothing, when it fails, when it succeeds, and when only part of it is ready.
*Why:* The path where everything works is the one that gets built by default; the other four are what
users actually hit.
*Applies:* any component performing async work
*Check:* name the file and line for each of the five. A state you cannot point at does not exist.
*Severity:* recommended (demoted in 1.4.0; this is the checklist in `SKILL.md`, and the rules below block on the individual states)

### R-STATE-02 · Never show an unexplained blank
**DO:** Render an indicator as soon as a wait begins — unless the wait is expected to stay under ~1 second, where R-STATE-06 says render nothing, and keep any prior content on screen.
*Why:* A blank screen is indistinguishable from a broken one, and a user who cannot tell the
difference will reload or leave.
*Applies:* any wait with no existing content on screen. Whether a request is slow cannot be known from
the code, so the check is on what exists, not on a time threshold
*Check:* no spinner or skeleton exists for a request that is not cached or prefetched. Throttle the
network and load the page to confirm: is anything on screen immediately?
*Severity:* required

### R-STATE-04 · Long waits need words, then a measure
**DO:** Put text on a wait that runs past a few seconds and advance it as the work moves; past ~10
seconds, switch to determinate progress or an explicit step list.
*Why:* An indefinite animation with no words reads as stuck, while text that advances shows the
system still working, which is design judgment rather than a measured figure. But a loop that never resolves
inverts patience, because the user cannot tell progress from a hang.
*Applies:* multi-step or network-bound operations — uploads, imports, builds, batch jobs
*Check:* past ~5 seconds, does the screen say what is happening? Can it exceed ~10 seconds? Then it
needs progress, not a spinner.
*Severity:* recommended

### R-STATE-06 · Match the loader to the wait
**DO:** Fit the affordance to the wait — nothing under ~1 second, a skeleton mirroring the layout
when a whole region is arriving, an inline spinner in the control when one action is in flight.
*Why:* A spinner that appears and vanishes inside a second registers as a glitch, not as progress.
Past that, a skeleton lets the eye settle into the layout; a skeleton inside a button is noise, and
a page-wide spinner throws away the layout information you already have.
*Applies:* any loading affordance, at any duration
*Check:* time it first — under a second, render the result directly. Otherwise, does the loader
occupy the same footprint the real content will?
*Severity:* recommended

### R-STATE-07 · Fail as soon as you know
**DON'T:** Run a loader for its full duration when the outcome is already known to be a failure.
*Why:* Making someone wait and then telling them it failed spends their patience to deliver bad
news, which reads as contempt for their time.
*Applies:* validation that can fail early, requests that reject fast
*Check:* in code, find the loader's stop condition. Does a rejected request or failed local validation end it immediately, or only a timeout or a fixed delay? Force a failure to confirm.
*Severity:* required

### R-STATE-08 · An empty state must say what it is for
**DO:** Explain what belongs in an empty region and give the primary action to fill it.
*Why:* This is frequently the first screen a new user sees, and a blank panel with no next step reads
as a product that is broken rather than one that is new.
*Applies:* any collection that can legitimately hold zero items
*Check:* sign up as a new user. Is there an obvious next action on every empty region?
*Severity:* required

### R-STATE-09 · Empty results keep a way forward
**DO:** Offer a route out of a no-results state — relax a filter, search a broader term, clear the query.
*Why:* A dead end costs you the session; the user came with intent and you are the one holding the
information about what else exists.
*Applies:* search, filtering, faceted browse
*Check:* search for something with no matches. Is there anything to click?
*Severity:* recommended

### R-STATE-10 · Treat intentional zero as an achievement
**DO:** Distinguish "you finished everything" from "there is nothing here", and present the former as
a success.
*Why:* Reaching zero is the goal in an inbox, a task list, or a review queue. Showing the same grey
placeholder as an unconfigured account throws away the best moment in the product.
*Applies:* queues, inboxes, task lists — anywhere zero is the target
*Check:* clear the last item. Does the screen acknowledge it?
*Severity:* recommended

### R-STATE-11 · Every section owns its own data
**DO:** Give each independently sourced region its own fetch, its own loading state, its own error
state, and its own retry.
*Why:* Regions on one screen come from different services at different speeds. Coupling them means
the slowest one sets the pace and the least reliable one sets the ceiling.
*Applies:* any screen assembling data from more than one source
*Check:* make one request hang. Does anything else on the page still work?
*Severity:* required

### R-STATE-12 · One failure must not blank the page
**DON'T:** Replace an entire screen with an error because a single section failed.
*Why:* The rest of the data arrived and is still useful. Discarding it turns a partial outage into a
total one.
*Applies:* screens with more than one data region
*Check:* force one request to reject. Is the remaining content still readable and usable?
*Severity:* required

### R-STATE-13 · Show what you already have while refreshing
**DO:** Render cached or previously loaded content immediately, then replace it when fresh data lands.
*Why:* The wait disappears from the user's experience entirely, and stale-but-visible beats
correct-but-blank for content that tolerates a few minutes of age.
*Applies:* feeds, lists, dashboards — not balances, prices, or anything where stale is misleading
*Check:* revisit a screen you have already loaded. Does it show content before the network returns?
*Severity:* recommended

### R-STATE-14 · Sequence the first run
**DO:** On a brand-new account, present setup as ordered steps with visible progress rather than a
single call to action.
*Why:* The first empty screen is where a new user decides whether the product is worth the effort.
One button answers "what now" but not "how much is left"; a short visible sequence shows the end from
the beginning and gives each completed step a reason to continue.
*Applies:* first-run dashboards, workspace creation, onboarding — not routine empty states later
*Check:* create a fresh account. Can you tell how many steps stand between you and a working setup?
*Severity:* recommended

### R-STATE-15 · A control that works must say it is working
**DO:** When a control triggers async work, give it a working state — visibly busy and not pressable
again until the work settles. Make the request idempotent where a repeat would do harm.
*Why:* A control that looks identical before, during, and after a press tells the user nothing, so
they press it again. The duplicate submit that follows is not user error; it is the missing state.
*Applies:* buttons and controls that trigger async work. Hover, held and focus styling are
`recommended`, not blocking: a focus ring on every control, and no latching hover after a touch.
*Check:* trigger its slow path. Does the control itself say it is working, and does a second press do
nothing? Then tab to it (focus ring?) and tap it on a phone (does hover latch?).
*Severity:* required for the working state; recommended for hover, held and focus

### R-STATE-16 · Bound every wait
**DO:** Give every request that can hang a timeout or abort, and when it fires, an error with a way to
retry or leave.
*Why:* A request that never resolves leaves the loader on forever. "It just spins forever" is the
most common way a missing failure path is reported, and the user has no move except closing the tab.
*Applies:* hand-rolled fetch, XHR, uploads and polls. A framework loader with a built-in timeout, or a configured client default (a React Query fetcher that passes a `signal`, a Next server fetch with a configured timeout), satisfies it. A fetch in a server component reports as recommended, not blocking
*Check:* make the request never resolve. After the timeout does the user get an error and a next step?
*Severity:* required for hand-rolled requests; recommended for server-component fetches

### R-STATE-17 · A non-2xx response is a failure
**DO:** Check `response.ok` or the status before treating a fetch as a success, and branch on the cases the user can act on: 401 (session expired: sign in again and keep what the user typed), 404 (gone or empty), 5xx (offer a retry). Axios-style clients that throw on non-2xx already satisfy this.
*Why:* `fetch` resolves on 4xx and 5xx and rejects only on a network failure, so a `try/catch` alone never sees a server error. The code then runs its success path: the row is removed, the toast says "saved", and nothing was. (MDN, `fetch()` and `Response.ok`; the whatwg/fetch discussion "Why doesn't fetch reject if 400 <= status < 600".)
*Applies:* any fetch or XHR call whose result changes the UI or local state. A 200 response whose body carries an error (GraphQL `errors`, `{ok:false}`, `{error:...}`) also counts as a failure when the code reads that body; the GraphQL spec says `errors` may be present beside `data` (Response, 7.1.2).
*Check:* make the endpoint return 500. Does the user see an error, and is local state unchanged?
*Severity:* required

### R-STATE-18 · The latest request wins
**DO:** When a fetch is driven by input or route parameters, ignore or abort every response except the one for the latest request: an `AbortController`, a request id compared before `setState`, or the query library's cache key.
*Why:* Responses can arrive out of order. An older, slower answer then overwrites the newer one and the screen shows data for something the user is no longer asking about.
*Applies:* input-driven or param-driven fetches (search as you type, filters, route changes, pagination). Required when it applies; a one-shot load on mount does not apply
*Check:* delay the first response past the second. Does the screen show the newer data?
*Severity:* required when Applies holds

---

## Where the fix belongs (read only when the stack is recognised)

| Stack | Use the framework mechanism, not a hand-rolled flag | Source |
|---|---|---|
| TanStack Query | The `error` field holds the failure after retries are exhausted; `retry` sets the attempt count (default 3 in the browser) | https://tanstack.com/query/v5/docs/framework/react/guides/query-retries |
| Next.js (App Router) | `error.js` in a route segment is the error boundary for uncaught exceptions; model expected failures such as `!res.ok` as return values | https://nextjs.org/docs/app/getting-started/error-handling |
| SvelteKit | `+error.svelte` renders for the nearest error in rendering or `load` | https://svelte.dev/docs/kit/errors |
| React | A client-side render error goes to the closest Error Boundary; Suspense covers waiting, not failure. Boundaries do not catch event-handler errors, so store those in state | https://react.dev/reference/react/Suspense and the Next.js page above |
| Vue | `onErrorCaptured` handles a descendant error; return `false` to stop propagation | https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured |

---

## Probe (optional, on request)

For any finding the user disputes, or on an explicit `/edgecase probe`, print that rule's `Check:` line
as a recipe the user runs, not something you run. Give one handler per failure: an MSW handler or a
Playwright `route.fulfill` returning a 500, one that never resolves (a `new Promise(() => {})` body or
`route.abort` after the timeout), and one returning `[]`. Name the screen state the user should then
see. Never run a script or start a server for a probe. Write nothing to the repo unless asked, and if asked to write the file, show it first; the `Check:` lines already hold the content.

A Probe may be offered once, as one sentence, after a blocking finding.
