<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/uilint-dark.png">
  <img src="docs/brand/uilint-light.png" width="380"
       alt="uilint — five stacked interface rows inside lint brackets, one flagged with an error mark and the last one only half filled">
</picture>

**A linter for the interface states everyone forgets.**

<img alt="version 1.3.0" src="https://img.shields.io/badge/version-1.3.0-2b2e3a?style=flat-square">
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-2b2e3a?style=flat-square"></a>

</div>

---

Interfaces get built along the path where everything works. Whoever writes one clicks the buttons in
the order that succeeds, so the states nobody asked for never get written — the spinner that never
stops, the blank screen you cannot tell from a broken one, the payment that fails and says nothing.

`uilint` is 40 rules a coding agent reads while the interface is being written. No dependencies, no
build step, nothing to run.

## The five states

Every section that fetches, submits, or navigates gets walked against all five.

| | The question it answers |
|---|---|
| **Loading** | Is something happening, and is it worth waiting for? |
| **Empty** | There is nothing here — is that broken, or just new? |
| **Error** | It failed. What failed, why, and what do I do now? |
| **Success** | Did it actually work? |
| **Partial** | Half of it loaded. Is the rest of the page still usable? |

Considered is not the same as present: a list that can never be empty needs no empty state, but that
has to be a decision rather than an oversight.

**17 of the 40 rules block completion; the other 23 are reported and never block.** Blocking is
reserved for silent user harm — no feedback at all, an error nobody can act on, a dead end, internal
detail on screen. A gate that blocks on everything gets switched off in week two.

## A review

Real output from a working local tool (a 1,023-line page polling a Python server every five
seconds; the project is private, so this one is not reproducible). For a reproducible run, use the
seeded components in [`examples/`](examples/README.md), each with the findings it should produce.

```text
web/index.html:1019 · R-FEEDBACK-02 · blocking
  The five-second poll swallows every failure: refresh().catch(() => {}).
  Kill the server and the page keeps showing stale numbers with no sign
  that it stopped updating.
  Fix: surface a disconnected marker after two consecutive failures

web/index.html:204 · R-STATE-15 · blocking
  The remove-from-queue button sits at opacity: 0 until :hover. On a touch
  screen there is no hover, so the only way to clear a queued URL never
  appears at all.
  Fix: :focus-visible already covers keyboard — keep it visible on touch

Passed: three disabled assignments (:601, :795, :988), each either in
flight or self-evident, which is what R-FORM-01 permits.
```

The code is correct in both cases; the failure is invisible by construction. Findings lead with what
the user experiences rather than which rule fired — and the three `disabled` assignments it walked
past matter as much as the two it stopped on.

## Install

uilint ships in the [claude-skills](../../README.md) marketplace with the other skills.

```bash
/plugin marketplace add DahanItamar/claude-skills
/plugin install uilint@claude-skills
```

Or clone it into your skills directory, which needs no plugin UI and so works in web and cloud
sessions too:

```bash
git clone https://github.com/DahanItamar/claude-skills.git
cp -r claude-skills/plugins/uilint ~/.claude/skills/uilint
```

The second route installs it as a plain skill: the same rules, but the skill is invoked as
`/uilint` without the plugin namespace, and `.claude-plugin/` is ignored. On Windows, copy to
`%USERPROFILE%\.claude\skills\uilint`. Pick one route, not both, or the same rules load twice. **In the VS Code extension the command is
`/plugins`, plural, and opens a dialog** — the lines above are terminal syntax and fail silently
there, which looks identical to the install not working.

To confirm the install, open any component and run `/uilint`; you should get a verdict line. It
also triggers on its own while you are building UI (to turn that off in one repo, disable the plugin
there or add a line to that repo's CLAUDE.md telling Claude not to use uilint), or when you describe a symptom rather than a
category: *"nothing happens when I click"*, *"it just spins forever"*.

## When to use it instead of a prompt

A 20-line "check my UI states" prompt finds the obvious gaps. What this adds is stable rule IDs you
can cite in review, an `Applies` line per rule that suppresses false positives, a short blocking
list so the gate does not get switched off, and a build mode that checks the states while the
code is written. It overlaps in places with the `craft` and `accessibility` skills, which are
separate and not bundled here; uilint reports out-of-scope findings in one line rather than
skipping them.

**What it will not catch:** race conditions between requests, retry and backoff behaviour, offline
and stale-data states, permission-denied states, optimistic-update rollback, internationalisation
beyond layout mirroring. The five states are the scope, not the whole of UI correctness.

## How it is built

[`SKILL.md`](SKILL.md) holds the trigger and the output contract in about 120 lines. The 40 rules sit in
four reference files — [states](references/states.md) 13, [feedback](references/feedback.md) 9,
[forms](references/forms.md) 8, [laws](references/laws.md) 10 — read only when the work touches that
domain, so a question about a form does not drag Tesler's Law into context. Every rule has the same
shape:

```markdown
### R-STATE-12 · One failure must not blank the page
**DON'T:** Replace an entire screen with an error because a single section failed.
*Why:* The rest of the data arrived and is still useful. Discarding it turns a
partial outage into a total one.
*Applies:* screens with more than one data region
*Check:* force one request to reject. Is the remaining content still readable?
*Severity:* required
```

The `Applies` predicate is what stops false positives, and every `Check` runs in about a minute. Rule
IDs are permanent, so a review that cites one still reads correctly years later.

The set is capped at 40 rules, and the cap is hard: new material merges into the rules already there
rather than accumulating, because every rule is context cost on every unrelated prompt. Spacing,
colour and typography are out of scope by design and belong to the `craft` skill. The design rationale is
in [`docs/SPEC.md`](docs/SPEC.md); version history is in [`CHANGELOG.md`](CHANGELOG.md).

## Credits

Distilled from **[@synsation_](https://www.instagram.com/synsation_/)**'s *Build for Good UX* series,
a practical walkthrough of the states and failure paths most tutorials skip. These are independently
written directives derived from that material; no transcripts or source text appear here. Jacob's,
Hick's, Fitts's and Tesler's Laws are credited to Jakob Nielsen, William Hick, Paul Fitts and Larry
Tesler.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
