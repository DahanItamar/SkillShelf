<!-- expect: FAIL L8 -->
# CASE 001: Login page lost its stylesheet after the last release

Status: closed
Repro status: observed failing
Verify command: `npm test` (user-approved)

## Symptom
The login page renders as unstyled text. It was styled in the previous release.

## Repro
- Command or steps: open /login in a browser
- Observed: user: the page shows plain text with no layout

## Hypotheses

### H1 A recent change broke the stylesheet link -- result: confirmed
- Because: the page worked in the previous release
- Predicts: if true, git bisect names one commit that touched the link; if false, it names a commit that touched nothing related
- Experiment: [bisect] git bisect start HEAD v1.4.0 then git bisect run sh scripts/check-css.sh then git bisect reset
- Evidence: user ran: git bisect run sh scripts/check-css.sh -> 3f2a9c1 is the first bad commit

### H2 The browser is serving a cached page -- result: ruled out
- Because: a stale cache can show an old broken page
- Predicts: if true, a hard reload fixes it; if false, a hard reload changes nothing
- Experiment: [user-run] hard reload /login and report what changes
- Evidence: user ran: hard reload of /login -> still unstyled

## Ruled out
- H2 -- a hard reload does not fix it (user ran: hard reload of /login -> still unstyled)

## Root cause
Confirmed: H1. The first bad commit changed the link tag in views/login.html to a path that does not exist. The bisect run names that commit.

## Fix
Changed views/login.html: the link tag points at /static/app.css again.

## Regression test
Check: sh scripts/check-css.sh
Why no test: the unit tests do not load a rendered page, so only the project's CSS check can see this.

## Before and after
- Before: exit 1; observed by agent; check-css: /static/app.css missing from /login
- After: exit 0; observed by agent; check-css: ok

## Lesson
Check that a page links an asset that exists, with a command the project already has.
