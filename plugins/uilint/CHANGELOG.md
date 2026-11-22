# Changelog

## 1.4.0 - 2026-11-22
- Build mode now writes loading, error and empty handling into the first draft for the paths the change touches, and states in one line what it added. The earlier "do not silently add states" line is gone.
- Quick path first: no fetch, submit or navigation in the change means one line and stop. Added a "does not trigger" note for pure styling, copy edits and static pages.
- New rule R-STATE-16 (bound every wait: timeout or abort, plus a way to retry or leave) and R-FEEDBACK-10 (announce a state change that does not move focus).
- Narrowed over-broad rules: R-STATE-15 is required only for the working state; R-FEEDBACK-07 does not apply when R-FEEDBACK-08 does; R-FORM-03 validates on blur after the first touch.
- Review mode gains an optional screen audit table (`/uilint screen`) and an optional `uilint:` policy block in the repo's `CLAUDE.md` (ignore, demote, strict).
- Wider stack coverage in one line: server actions, Suspense, loaders, Vue, SvelteKit, Angular, SwiftUI.
- `examples/` now holds real files (React, Vue, Svelte, HTMX, plus a clean control) with golden findings in `examples/expected/`, and a paste-in self-test in its README.
- README sample review now matches the output contract; credits cite checkable public sources; install warnings moved to the top of the section; SPEC cleaned of private notes.

### Rule changes
- Demoted to `recommended`: R-STATE-01 (it is the checklist in `SKILL.md`), R-FORM-03.
- Retired, IDs never reused: R-LAW-09, R-LAW-10 (not checkable without a physical device; kept as notes in `laws.md`).
- Added: R-STATE-16, R-FEEDBACK-10. Total stays at 40; required stays at 17 of 40.

## 1.3.0
- Fixed the rule count in plugin metadata (40, not 43).
- Build mode now says which reference files to read for what you are writing, which code patterns to grep for, and what to do with an unknown stack or no UI code.
- Missing `craft` / `accessibility` skills no longer swallow findings; they are reported as out of scope in one line.
- R-FORM-01 states its in-flight exception up front; R-STATE-02 points to R-STATE-06; R-STATE-07 and R-LAW-07 now have checks that run against code.
- Trigger description no longer fires on vague phrases like "this form is annoying".
- Added `examples/` with seeded buggy components and expected findings.

## 1.2.0 and earlier
- Rules capped at 40; retired R-STATE-03 and R-STATE-05 merged into R-STATE-06 and R-STATE-04. Earlier history and dates were not recorded.
