---
name: edgecase
description: Stable-ID review of UI failure states - 34 rules, each with an Applies line, split into blocking `required` and non-blocking `recommended`, plus /edgecase screen, init and probe - for loading, empty, error, success and partial states. Use when building or reviewing an interface that fetches data, submits a form, or navigates, and when a user describes an interface problem in symptoms - "nothing happens when I click", "it just spins forever", "the page goes blank", "users don't know if it worked", "review this component", "/edgecase". Also use while writing UI, so the states exist in the first draft. Does NOT trigger for pure visual styling, copy edits, or static pages with no async work.
---

# edgecase

Interfaces get built along the path where everything works, so the states for slow networks, empty
accounts and failed requests never get written. Your job is to notice what is missing before the
user does. This is a review the model runs before it reports done; it advises and does not enforce.

**This skill covers behaviour, not appearance.** Spacing, colour, typography, elevation and motion
belong to the `craft` skill. Contrast and ARIA belong to `accessibility`; the one accessibility rule here is R-FEEDBACK-10. If one of those is clearly relevant, name it once; if it is not installed, add a single line "outside this skill's scope: <issue>". Never drop a finding just because its home skill is missing. If the `uilint` skill is also installed and both trigger, use this one for review output (it has stable IDs) and do not run both.

## The five states

Every section that fetches, submits, or navigates needs all five considered. Most code has one.

| State | The question it answers |
| --- | --- |
| **Loading** | Is something happening, and is it worth waiting for? |
| **Empty** | There is nothing here - is that broken, or just new? |
| **Error** | It failed. What failed, why, and what do I do now? |
| **Success** | Did it actually work? |
| **Partial** | Half of it loaded. Is the rest of the page still usable? |

"Considered" is not "present". A list that can never be empty needs no empty state, but that has to
be a decision, not an oversight.

## Two modes

**Build mode** - you are writing or editing UI. If the change has no fetch, submit or navigation, say
so in one line and stop. Otherwise apply the rules as you write, only to the files you touch.

| You are writing | Read | Check first (one line each) |
| --- | --- | --- |
| A fetch, query or async load (fetch, React Query, SWR, `load`, HTMX swap) | `states.md` | R-STATE-02 an indicator for any uncached request; 11 each region owns its fetch, error and retry; 12 one failure must not blank the page; 16 a timeout or abort; 17 check `response.ok` before success; 18 the latest request wins |
| A catch, error boundary or failed-request path | `feedback.md` | R-FEEDBACK-01 no internals on screen; 02 no silent failure; 03 say what, why and what next; 10 a live region for a state added after an action |
| A form or submit handler | `forms.md`, `feedback.md` | R-FORM-01 a disabled submit says why; 02 mark required fields; R-FEEDBACK-07 confirm the completed action |
| A button or control that triggers async work | `states.md` | R-STATE-15 busy and not pressable twice |

If the one-line summary is enough for the change, do not load the file. Stacks to recognise beyond
plain fetch: server actions, `useActionState`, `useOptimistic`, Suspense and ErrorBoundary, Next/Remix
loaders, Vue/Nuxt `useAsyncData`, SvelteKit `load`, Angular `HttpClient`, SwiftUI `.task`.

Grep for the code patterns that hide failures: empty `catch {}`, `.catch(() => {})`, a fetch whose
response is never checked for `ok` or `status`, a query hook whose `isError` / `error` is never read,
a `disabled=` bound to validity, a loader set to true with no reset on rejection, a request with no
timeout or abort, a fetch inside an effect keyed on input with no cleanup. `scripts/candidates.sh`
lists these lines as candidates, not findings. If the stack is unknown, read `states.md` and
`feedback.md` and state the framework assumption.

Write the loading, error and empty handling into the first draft for the paths the change touches,
then state in one line what was added ("Added: error + loading for Orders"). Before reporting the work
complete, walk the five states against what you wrote. If a `required` rule is unmet, the component is
not finished: say so, name the gap in terms of what the user experiences, and offer the fix. Do not
report completion with a known hole.

**Review mode** - you are given existing code, or asked why something feels wrong. Read the reference
files for the domains in play, not all by reflex. Check rules against the real code rather than from
memory. Report only what is violated.

## Severity

Every rule is `required` or `recommended`. **`required`** means absence causes silent user harm (no
feedback at all, an error the user cannot act on, a dead end, internal detail on screen) and blocks
completion. **`recommended`** is reported and never blocks. A gate that blocks on everything gets
switched off. Block rarely and mean it. Where a rule's `Severity:` line says "required when ...", the
condition decides.

## Rules

| File | Covers |
| --- | --- |
| `references/states.md` | Loading, empty, partial, loader choice, bounded waits, status checks, stale responses, control states |
| `references/feedback.md` | Error content and placement, success confirmation, announcing state changes |
| `references/forms.md` | Validation timing, required fields, prefill, input tolerance, disabled submits |
| `references/modes.md` | `/edgecase screen`, `init`, `laws`, `probe`, and the `edgecase:` policy block |
| `references/opt-in/laws.md` | Jacob's, Hick's, Tesler's Laws. Opt-in only, never blocks, not counted in the 34 core rules |

## Output - review mode

```
<one-line verdict>

Blocking - <n> required:
  <file>:<line> · R-<ID>
    <what the user experiences, not what the rule says>
    Fix: <concrete change>

Worth fixing:
  <file>:<line> · R-<ID> - <one line>

<single offer to apply them>
edgecase-ids: <every reported ID, sorted, space-separated; "none" if clean>
```

A clean component gets the verdict line `edgecase: no findings.` and `edgecase-ids: none`, nothing
else. No preamble, no score, no "Passed" section. Sort blocking first, then by user impact. Anchor
every finding to a real location. "Consider reviewing your error handling" is not a finding.

## Team policy (optional)

If the repo's `CLAUDE.md` has an `edgecase:` block (`ignore`, `demote`, `strict`), read
`references/modes.md`. `strict` raises `recommended` rules to `required` only for rules in `states.md`,
`feedback.md` and `forms.md`, never for the opt-in laws. Say in the verdict line when a policy applied.

## Judgment

- **State the consequence, not the rule.** "A failed payment currently shows nothing at all" lands;
  "violates R-FEEDBACK-02" does not. Cite the ID after the consequence.
- **A rule with a number is a constraint; a rule without one is a default.** Defaults yield to a
  stated reason. Constraints need a better one.
- **Check the `Applies:` line before flagging.** False positives cost more than missed findings,
  because they teach the user to ignore the review.
- **Never invent a rule.** If something looks wrong but no rule covers it, say it is your own read.
- **From a screenshot**, retry logic, error content and partial-failure behaviour are unverifiable.
  Say "verify in code" instead of guessing.
- **Honour an opt-out once.** If the user says it is a prototype, write the happy path only,
  acknowledge it and stop raising it for that component.
