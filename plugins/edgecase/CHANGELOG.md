# Changelog

Release checklist: version in `plugin.json` == the edgecase entry (version and description) in the root `.claude-plugin/marketplace.json` == the head of this file; the core rule count == `grep -c '^### R-' references/states.md references/feedback.md references/forms.md` summed (16+10+8 = 34 today; the 8 opt-in laws are not core); a fresh `examples/results/<model>-<date>.md` is committed per model release. `node --test scripts/check.mjs` checks all of this; nothing runs at install.

## 1.6.0 - 2026-11-22
- No model run exists for 1.5.0 or 1.6.0; the only recorded run is still the 1.4.0 one, and no no-skill baseline has been run. The README says so.
- Standalone: removed every mention of other skills from `SKILL.md`, `references/` and the README (the "If you also have uilint" and "Other skills read" sections are gone). Out-of-scope appearance problems get one line, "outside this skill's scope: <issue>". A new test fails if another skill is named.
- Portable: the description and `references/modes.md` trigger on plain requests (screen audit, policy block, probe recipe, design laws); `/edgecase ...` is an optional shortcut. The `edgecase:` policy block is read from the first of `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md` that has one. The README gains "Use it in other tools" and a three-line quick start.
- R-STATE-02 is now one predicate: required only when a request has no loading indicator and no prior or cached content on screen; whether a short wait needs an indicator is the author's call, and a wrong loader is R-STATE-06 at most.
- Completion rule: a required gap is fixed or named as open; "ship it" lists the open required IDs in one line. A prototype opt-out covers the named component for that task only and replies `edgecase: skipped (prototype)`.
- R-STATE-17 also branches on 403 and separates a network failure from a server error. R-FEEDBACK-01 says error copy must not echo personal data. R-FEEDBACK-10 notes the live-region container should exist before its content changes. No rule was added (34 core).
- Fixed "Jacob" to "Jakob". The README says plainly that the laws file holds 8 opt-in design rules, not eight named laws. The Probe section says never run a probe recipe; the read-only `scripts/candidates.sh` may be run.
- `scripts/check.mjs` gains tests for the standalone wording, an `expected/` file per example source, and a results file (or an honest README statement) for the current version.
- `node --test scripts/check.mjs` on a fresh clone of main (65cf7d6): 7 of 7 pass, so the reported failure did not reproduce; no fix was needed.
- README: the `list.jsx` sample is labelled as hand-written, not a recorded run. Not done: the blind recorded run, the baseline and the build-mode run.
- Fixed unterminated lines in `references/states.md` (R-STATE-02, R-STATE-16, R-STATE-18) and `references/feedback.md` (R-FEEDBACK-01, R-FEEDBACK-10); the R-STATE-02 sentence now ends "at most, never R-STATE-02". The laws row in `SKILL.md` uses the same wording as the README and `modes.md`. No rule was added.
- Docs: a "Track state debt with a plain diff" section in `references/modes.md` (compare the `edgecase-ids:` lines of two branches); a one-line other-tools pointer in the README quick start; the README no longer quotes exact byte, line or token figures. `scripts/check.mjs` gains one test that the README's "Measured so far" claims no run newer than the newest results file.
- Still not done, and the README still says so: a blind recorded run of this version, a no-skill baseline and the hand-judged build-mode case. They need fresh isolated sessions on neutral file names; the session that edited the goldens must not run them.

## 1.5.0 - 2026-11-22
- New rule R-STATE-17 (a non-2xx response is a failure): `fetch` resolves on 4xx and 5xx, so check `response.ok` or the status before treating a call as a success. New rule R-STATE-18 (the latest request wins) for input-driven and param-driven fetches. Both are in the Build-mode table and the grep list.
- Fixed a golden that taught the miss: `examples/files.jsx` now checks the status, and `expected/files.md` no longer blesses an unchecked one. The unchecked case is the new `examples/status.jsx`. `list.jsx`, `form.jsx`, `panel.vue` and `feed.svelte` gain an expected R-STATE-17.
- The 8 design laws moved to `references/opt-in/laws.md`, loaded only on `/edgecase laws`. They no longer count in the core, never block and are never raised by `strict`. R-LAW-07 became recommended. Core is now 34 rules, 18 of them required; the cap of 40 is unchanged.
- Narrowed rules: R-STATE-16 is satisfied by a framework or client timeout and reports server-component fetches as recommended; R-STATE-02 checks for a missing indicator rather than a time threshold; R-FEEDBACK-10 is required only for a state inserted after a user action.
- `strict` applies only to the states, feedback and forms rules.
- Output contract: the last line is `edgecase-ids: ...` (sorted, `none` when clean), and a clean file gets `edgecase: no findings.`. The examples README states that goldens are ID-and-line lists, not the output format.
- `SKILL.md` shrank from 8,605 to 7,719 bytes: the screen audit, policy block, `init` and `laws` moved to `references/modes.md`, and the Build table carries one-line rule summaries.
- Maintainer scripts, never run at install: `scripts/check.mjs` (`node --test`), `scripts/score.mjs`, `scripts/candidates.sh` (advisory candidates only).
- Four new examples (`status.jsx`, `search.jsx`, `dashboard.jsx`, `app-orders.jsx`), a build-mode case in `examples/build/`, and a blind and a no-skill-baseline prompt in `examples/README.md`. None of these has been run against a model yet.
- Reworded two uncited claims in `states.md` as design judgment, removed an uncited comparison from the README, added an "If you also have uilint" section, and changed "gate" wording to a review the model runs before it reports done. Removed "race conditions" from the will-not-catch list for the covered case.
- Marketplace entry (root `.claude-plugin/marketplace.json`) must be bumped to 1.5.0 with the new description; `scripts/check.mjs` fails until it is.
- Later in 1.5.0: R-STATE-17 also covers a 200 response whose body carries an error (GraphQL spec Response 7.1.2 read and cited). New example `graphql-or-checked.jsx` (status checked, failure never rendered: R-FEEDBACK-02 and not R-STATE-17); not yet run against a model. New "where the fix belongs" table at the end of `references/states.md` (TanStack Query, Next.js, SvelteKit, React, Vue, each with a docs URL read on 2026-11-22; Next.js `loading.tsx` omitted because its docs were not read). A Probe may be offered once after a blocking finding. `candidates.sh` header states its noise and measured result. README: unmeasured banner, size-based token estimate, factual note on two other skills.
- Name search 2026-11-22: no plugin named edgecase found in the registries searched; similar names exist.
- Not done in this release: no model runs, so no 1.5.0 results file and no fixtures check (see README, Measured so far).

## 1.4.0 - 2026-11-22
- Build mode now writes loading, error and empty handling into the first draft for the paths the change touches, and states in one line what it added. The earlier "do not silently add states" line is gone.
- Quick path first: no fetch, submit or navigation in the change means one line and stop. Added a "does not trigger" note for pure styling, copy edits and static pages.
- New rule R-STATE-16 (bound every wait: timeout or abort, plus a way to retry or leave) and R-FEEDBACK-10 (announce a state change that does not move focus).
- Narrowed over-broad rules: R-STATE-15 is required only for the working state; R-FEEDBACK-07 does not apply when R-FEEDBACK-08 does; R-FORM-03 validates on blur after the first touch.
- Review mode gains an optional screen audit table (`/edgecase screen`) and an optional `edgecase:` policy block in the repo's `CLAUDE.md` (ignore, demote, strict).
- Wider stack coverage in one line: server actions, Suspense, loaders, Vue, SvelteKit, Angular, SwiftUI.
- `examples/` now holds real files (React, Vue, Svelte, HTMX, plus a clean control) with golden findings in `examples/expected/`, and a paste-in self-test in its README.
- README sample review now matches the output contract; credits cite checkable public sources; install warnings moved to the top of the section; SPEC cleaned of private notes.
- Added a Probe option (`references/states.md`, opt-in via `/edgecase probe`) and `/edgecase init`, which prints a suggested policy block and writes nothing. Team policy now states monorepo precedence.
- Two more examples: `files.jsx` (only a recommended rule fires; a removed row must not report R-FEEDBACK-07) and `profile.html.erb` (server-rendered form). Every golden ID now carries a reason.
- Removed the unmeasured token estimate from the README.
- Monorepo precedence is now one rule with two examples (`ignore` > `strict` > `demote`; a nearer `CLAUDE.md` without a block inherits). Added `archive.jsx`, the opposite case to `files.jsx`, a first committed self-test result in `examples/results/`, and a note that the goldens are not blind-reviewed. `/edgecase screen` may be saved as `docs/STATES.md` when asked.

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
