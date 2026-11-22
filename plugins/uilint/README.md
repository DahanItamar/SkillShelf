<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/uilint-dark.png">
  <img src="docs/brand/uilint-light.png" width="380"
       alt="uilint — five stacked interface rows inside lint brackets, one flagged with an error mark and the last one only half filled">
</picture>

**A linter for the interface states everyone forgets.**

<img alt="version 1.4.0" src="https://img.shields.io/badge/version-1.4.0-2b2e3a?style=flat-square">
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-2b2e3a?style=flat-square"></a>

</div>

---

Interfaces get built along the path where everything works. Whoever writes one clicks the buttons in
the order that succeeds, so the states nobody asked for never get written — the spinner that never
stops, the blank screen you cannot tell from a broken one, the payment that fails and says nothing.

`uilint` is 40 rules a coding agent reads while the interface is being written. No dependencies, no
build step, nothing to run, no network access: the rules are plain Markdown in this repository and
nothing is fetched at runtime.

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

What a review of [`examples/list.jsx`](examples/list.jsx) looks like: seven lines that swallow a fetch
failure. This is the expected report in the exact output contract from `SKILL.md`, matching the golden
file [`examples/expected/list.md`](examples/expected/list.md). Run `/uilint` on that file to get your own;
wording and order vary between runs because a language model is not deterministic.

```text
4 required rules violated.

Blocking — 4 required:
  list.jsx:4 · R-FEEDBACK-02
    If /api/orders fails, the page shows an empty list, identical to "you have no orders".
    Fix: keep an error state; render a message and a retry button in .catch

  list.jsx:4 · R-STATE-16
    If the request never resolves, the user waits on a blank list forever.
    Fix: abort after about 10 seconds and show the error state

  list.jsx:6 · R-STATE-02
    While the request is in flight nothing renders, which looks the same as a broken page.
    Fix: render a loading indicator until the first response

  list.jsx:6 · R-STATE-08
    A new customer sees a bare empty list with no hint what it is for.
    Fix: render "No orders yet" and say what will appear here

Apply these?
```

The code is correct on the happy path; the failures are invisible by construction. Findings lead
with what the user experiences rather than which rule fired. A correct component
([`pass.jsx`](examples/pass.jsx)) should get the verdict line and nothing else. The
[self-test](examples/README.md#self-test) scores matched, missed and extra rule IDs across nine files.

## Install

> **Pick one route, not both**, or the same rules load twice. **In the VS Code extension the command is
> `/plugins`, plural, and opens a dialog**: the lines below are terminal syntax and fail silently
> there, which looks identical to the install not working.

uilint ships in the [claude-skills](https://github.com/DahanItamar/claude-skills#readme) marketplace
with the other skills. It works standalone; `craft` and `accessibility` are optional and not needed.

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
`%USERPROFILE%\.claude\skills\uilint`.

To confirm the install, open any component and run `/uilint`; you should get a verdict line. It
also triggers on its own while you are building UI (to turn that off in one repo, disable the plugin
there or add a line to that repo's CLAUDE.md telling Claude not to use uilint), or when you describe a symptom rather than a
category: *"nothing happens when I click"*, *"it just spins forever"*.

Teams can tune it without a config file: a `uilint:` block in the repo's `CLAUDE.md` can `ignore`
paths, `demote` rules or mark paths `strict`. See [`SKILL.md`](SKILL.md#team-policy-optional).

`/uilint init` reads your routes and prints a suggested `uilint:` block for you to paste; it writes
nothing. When you dispute a finding, `/uilint probe` turns its `Check:` line into a runnable recipe
(MSW or Playwright, with 500, never-resolving and empty-array bodies) that you run yourself.

**Measured so far:** not yet measured. The goldens in `examples/` are expectations, and no scored
self-test run is committed. Server-rendered templates have one seeded case (ERB); other template
engines have none.

**Roadmap, not built:** domain packs as separate plugins (payments, streaming AI chat with a stalled
stream and a partial response, uploads, realtime) so the core stays at 40 rules; a regression test per
finding, offered only on request.

## When to use it instead of a prompt

A 20-line "check my UI states" prompt finds the obvious gaps. What this adds is stable rule IDs you
can cite in review, an `Applies` line per rule that suppresses false positives, a short blocking
list so the gate does not get switched off, and a build mode that checks the states while the
code is written. It overlaps in places with the `craft` and `accessibility` skills, which are
separate and not bundled here; uilint reports out-of-scope findings in one line rather than
skipping them.

Other skills in this space are generic checklists; uilint has stable rule IDs, an `Applies` predicate
per rule, blocking severity and an output contract, and it works offline.

**What it will not catch:** race conditions between requests, retry and backoff behaviour, offline
and stale-data states, permission-denied states, optimistic-update rollback, internationalisation
beyond layout mirroring. The five states are the scope, not the whole of UI correctness.

## How it is built

[`SKILL.md`](SKILL.md) holds the trigger and the output contract in about 150 lines (about 8 KB), loaded when it triggers. The 40 rules sit in
four reference files — [states](references/states.md) 14, [feedback](references/feedback.md) 10,
[forms](references/forms.md) 8, [laws](references/laws.md) 8 — each read only when a row of the
Build-mode table matches, so a question about a form does not drag Tesler's Law into context. Every rule has the same
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

The rules are independently written, informed by publicly available UX guidance: Nielsen Norman Group
research, Apple Human Interface Guidelines, WCAG, and Material Design. The wording is original. Jacob's,
Hick's and Tesler's Laws are credited to Jakob Nielsen, William Hick and Larry Tesler.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
