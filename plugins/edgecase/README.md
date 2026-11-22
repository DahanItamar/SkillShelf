> Version 1.5.0 rules have not yet been measured against a model; see Measured so far.

<div align="center">

# Edgecase

**A review for the interface states everyone forgets.**

<img alt="version 1.5.0" src="https://img.shields.io/badge/version-1.5.0-0F766E?style=flat-square">
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-0F766E?style=flat-square"></a>

</div>

---

Interfaces get built along the path where everything works. Whoever writes one clicks the buttons in
the order that succeeds, so the states nobody asked for never get written: the spinner that never
stops, the blank screen you cannot tell from a broken one, the payment that fails and says nothing.

`edgecase` is 34 rules a coding agent reads while the interface is being written, plus 8 opt-in design
laws. It is a review the model runs before it reports done. It advises; it does not enforce, and
it cannot stop a commit. No dependencies, no build step, no hooks, nothing runs at install, and no
network access: the rules are plain Markdown in this repository.

## The five states

Every section that fetches, submits, or navigates gets walked against all five.

| | The question it answers |
|---|---|
| **Loading** | Is something happening, and is it worth waiting for? |
| **Empty** | There is nothing here - is that broken, or just new? |
| **Error** | It failed. What failed, why, and what do I do now? |
| **Success** | Did it actually work? |
| **Partial** | Half of it loaded. Is the rest of the page still usable? |

Considered is not the same as present: a list that can never be empty needs no empty state, but that
has to be a decision rather than an oversight.

**18 of the 34 rules block completion; the other 16 are reported and never block.** Blocking is
reserved for silent user harm: no feedback at all, an error nobody can act on, a dead end, internal
detail on screen, a failed request shown as a success. A review that blocks on everything gets switched off in week two.

## A review

What a review of [`examples/list.jsx`](examples/list.jsx) looks like: seven lines that swallow a fetch
failure. This is an illustrative report in the output contract from `SKILL.md`. It lists the same rule IDs as the golden
file [`examples/expected/list.md`](examples/expected/list.md), which is an ID-and-line answer key rather than a copy of this format.
Run `/edgecase` on that file to get your own; wording and order vary between runs because a language
model is not deterministic.

```text
5 required rules violated.

Blocking - 5 required:
  list.jsx:4 · R-FEEDBACK-02
    If /api/orders fails, the page shows an empty list, identical to "you have no orders".
    Fix: keep an error state; render a message and a retry button in .catch

  list.jsx:4 · R-STATE-17
    If the server answers 500, its body is parsed as the order list and nothing says it failed.
    Fix: check r.ok before r.json() and treat a non-2xx response as the error state

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
edgecase-ids: R-FEEDBACK-02 R-STATE-02 R-STATE-08 R-STATE-16 R-STATE-17
```

The code is correct on the happy path; the failures are invisible by construction. Findings lead
with what the user experiences rather than which rule fired. A clean component such as
[`pass.jsx`](examples/pass.jsx) should get exactly two lines: `edgecase: no findings.` and
`edgecase-ids: none`. The last line is there so output can be compared mechanically.

## Install

> **Pick one route, not both**, or the same rules load twice. **In the VS Code extension the command is
> `/plugins`, plural, and opens a dialog**: the lines below are terminal syntax and fail silently
> there, which looks identical to the install not working.

edgecase ships in the [claude-skills](https://github.com/DahanItamar/claude-skills#readme) marketplace
with the other skills. It works standalone; `craft` and `accessibility` are optional and not needed.

Plugin route, invoked as `/edgecase:edgecase` or by describing the problem:

```bash
/plugin marketplace add DahanItamar/claude-skills
/plugin install edgecase@claude-skills
```

Plain-skill route, which needs no plugin UI and so works in web and cloud sessions too. It is invoked as
`/edgecase` with no plugin namespace, and `.claude-plugin/` is ignored:

```bash
git clone https://github.com/DahanItamar/claude-skills.git
cp -r claude-skills/plugins/edgecase ~/.claude/skills/edgecase
```

On Windows, copy to `%USERPROFILE%\.claude\skills\edgecase`.

To confirm the install, open any component and run `/edgecase`; you should get a verdict line. It
also triggers on its own while you are building UI (to turn that off in one repo, disable the plugin
there or add a line to that repo's CLAUDE.md telling Claude not to use edgecase), or when you describe a symptom rather than a
category: *"nothing happens when I click"*, *"it just spins forever"*.

Teams can tune it without a config file: an `edgecase:` block in the repo's `CLAUDE.md` can `ignore`
paths, `demote` rules or mark paths `strict`. `strict` applies only to the state, feedback and form rules, never to the opt-in laws. See
[`references/modes.md`](references/modes.md).

`/edgecase init` reads your routes and prints a suggested `edgecase:` block for you to paste; it writes
nothing. When you dispute a finding, `/edgecase probe` turns its `Check:` line into a runnable recipe
(MSW or Playwright, with 500, never-resolving and empty-array bodies) that you run yourself.
`/edgecase laws` loads the opt-in design laws (Jakob's, Hick's, Tesler's), which never block.

## If you also have uilint

A `uilint` skill can be installed beside this one and its description opens with similar wording, so both
may match the same request. What edgecase itself provides, each checkable in this folder:

- stable rule IDs that are never reused (`R-STATE-17`), cited in every finding;
- an `Applies:` predicate and a `Check:` line in every rule;
- a `required` / `recommended` split, with conditions on the `Severity:` line;
- the subcommands `/edgecase screen`, `init`, `laws` and `probe`;
- a last `edgecase-ids:` line in the output, so two runs can be compared mechanically.

I have not compared these against uilint's files, so no claim is made about what it lacks. If both
trigger, `SKILL.md` tells the model to use edgecase for the review output and not run both. Install one if you
want no ambiguity.

## Maintainer scripts (optional, nothing runs at install)

| Script | What it does |
|---|---|
| `node --test scripts/check.mjs` | Asserts rule count (34 core, 8 opt-in), required count (18), version agreement across `plugin.json`, `CHANGELOG.md`, the badge and the marketplace entry, that every ID in `examples/expected/` exists, that referenced paths exist, and that no emoji or private-looking strings are present. |
| `node scripts/score.mjs <reply> <golden>` | Reads the `edgecase-ids:` line of a saved reply and prints matched, missed and extra against a golden file. |
| `sh scripts/candidates.sh [path]` | Greps for candidate lines (empty catch, a fetch with no `ok` check or timeout, an effect fetch with no abort) and prints `file:line  pattern  (R-ID)`. **Advisory only:** these are candidates, not findings. The model review is not deterministic, and the script does not replace it. |

**Measured so far:** one self-test run, `claude-sonnet-5-5`, 2026-11-22, on version 1.4.0 only, 1 run, not blind for four of ten files: 28 of 32 expected IDs matched, 4 missed, 1 extra, 0 findings on the clean control (see [`examples/results/`](examples/results/claude-sonnet-5-5-2026-11-22.md)). Nothing has been run on version 1.5.0 (no runs of the new rules, the build-mode case or the new examples), and no no-skill baseline exists. The goldens are expectations written by the skill author. Server-rendered templates have one seeded case (ERB); other template
engines have none.

**Roadmap, not built:** domain packs as separate plugins (payments, streaming AI chat with a stalled
stream and a partial response, uploads, realtime) so the core stays within its cap; a regression test per
finding, offered only on request.

## When to use it instead of a prompt

A 20-line "check my UI states" prompt finds the obvious gaps. What this adds is stable rule IDs you
can cite in review, an `Applies` line per rule that suppresses false positives, a short blocking
list so the review does not get switched off, and a build mode that checks the states while the
code is written. It overlaps in places with the `craft` and `accessibility` skills, which are
separate and not bundled here; edgecase reports out-of-scope findings in one line rather than
skipping them.

**What it will not catch:** retry and backoff behaviour, offline and stale-data states (a cached
screen that is out of date), permission-denied states, optimistic-update rollback, internationalisation
beyond layout mirroring. Out-of-order responses are covered only for input-driven or param-driven
fetches (R-STATE-18). The five states are the scope, not the whole of UI correctness.

## How it is built

[`SKILL.md`](SKILL.md) holds the trigger, the Build-mode table with a one-line summary of the rules to check first, and the output contract: 7,719 bytes, 120 lines, loaded when it triggers. The 34 core rules sit in
three reference files, [states](references/states.md) 16, [feedback](references/feedback.md) 10 and
[forms](references/forms.md) 8, each read only when a row of the Build-mode table matches.
[`references/modes.md`](references/modes.md) holds the screen audit, policy block and `init`, and is read
only on those subcommands. The 8 opt-in laws are in [`references/opt-in/laws.md`](references/opt-in/laws.md) and are read only on `/edgecase laws`. File sizes in bytes:
states.md 12,730 and feedback.md 5,875 are the largest; no per-run token figure is published because none has been measured. Estimate from file sizes, not measured: SKILL.md (7,719 bytes) is always loaded; a fetch change adds states.md (12,730 bytes), about 20 KB total, roughly 5,000 tokens at 4 bytes per token. Every rule has the same
shape:

```markdown
### R-STATE-12 · One failure must not blank the page
**DON'T:** Replace an entire screen with an error because a single section failed.
*Why:* The rest of the data arrived and is still useful. Discarding it turns a
partial outage into a total one.
*Applies:* screens with more than one data region
*Check:* force one request to reject. Is the remaining content still readable and usable?
*Severity:* required
```

The `Applies` predicate is what stops false positives, and every `Check` runs in about a minute. Rule
IDs are permanent, so a review that cites one still reads correctly years later.

The core set is capped at 40 rules, and the cap is hard: new material merges into the rules already there
rather than accumulating, because every rule is context cost on every unrelated prompt. It stands at 34;
in 1.5.0 the design laws moved to the opt-in file to pay for two new rules. Spacing,
colour and typography are out of scope by design and belong to the `craft` skill. The design rationale is
in [`docs/SPEC.md`](docs/SPEC.md) (20,721 bytes, written for maintainers, never referenced by `SKILL.md`, so it is not loaded when the skill runs); version history is in [`CHANGELOG.md`](CHANGELOG.md).

## Other skills read

Counts below come from summaries of the two pages taken on 2026-11-22 and were not re-checked line by line, so verify before quoting them. This says what their pages do not define, not which is better, and edgecase has not been benchmarked against them. `ux-feedback` (sickn33/antigravity-awesome-skills) lists 4 states and 17 unnumbered rules; its page defines no stable IDs, no per-rule severity, no `response.ok` or status handling and no stale-response rule. `review-loading-error-empty-states` (Ritual, clawhub.ai) lists 5 checks; its page defines no IDs, severity, output format, status or stale-response handling, and mentions an optional paid cloud service. `react-ui-patterns` was not read and is not described here.

## Credits

The rules are independently written, informed by publicly available UX guidance: Nielsen Norman Group
research, Apple Human Interface Guidelines, WCAG, and Material Design. The fetch-status rule (R-STATE-17) rests on documented
`fetch` behaviour (MDN, `Response.ok`). The wording is original. Jakob's, Hick's and Tesler's Laws are
credited to Jakob Nielsen, William Hick and Larry Tesler.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
