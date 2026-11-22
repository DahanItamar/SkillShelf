# app-orders.jsx

Next.js App Router page with two Suspense sections and a server action.

Blocking, 4:
- `app-orders.jsx:6 · R-STATE-17` (neither `res.ok` check exists: a 500 body is parsed as the order list, and the server action at line 21 ignores its response)
- `app-orders.jsx:29 · R-STATE-12` (no `error.jsx` and no ErrorBoundary around either Suspense section, so a failing recommendations call replaces the whole page)
- `app-orders.jsx:21 · R-FEEDBACK-02` (the cancel-all request can fail and the page re-renders as if it worked, with no message)
- `app-orders.jsx:31 · R-STATE-15` (the submit button has no pending state, for example `useFormStatus`, so a second press sends a second cancel-all)

Worth fixing, 1:
- `app-orders.jsx:6 · R-STATE-16` (server-component fetches with no timeout report as recommended, not blocking)

Why R-FEEDBACK-07 is NOT expected: the revalidated list re-renders without the cancelled orders, so the change is its own confirmation (R-FEEDBACK-08). Why R-STATE-02 and R-STATE-08 are NOT expected: both sections have a Suspense fallback and the empty cases are handled.
