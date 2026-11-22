> Version 1.6.0 has not been measured against a model. The only recorded run is on 1.4.0 (see Measured so far).

<div align="center">

# Edgecase

**A review for the interface states everyone forgets.**

<img alt="version 1.6.0" src="https://img.shields.io/badge/version-1.6.0-0F766E?style=flat-square">
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-0F766E?style=flat-square"></a>

</div>

---

**Quick start**

1. Install: `/plugin marketplace add DahanItamar/SkillShelf`, then `/plugin install edgecase@skillshelf` Other tools: copy this folder to your agent skills directory, see Use it in other tools.
2. Open a component that fetches or submits, and say: `review this with edgecase`.
3. Expected result: a one-line verdict, any findings, and a last line `edgecase-ids: ...` (or `edgecase: no findings.` and `edgecase-ids: none`).

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
failure. This report was written by hand to show the output contract from `SKILL.md`; it is not a recorded
model run, and no 1.5.0 or later run has been recorded. It lists the same rule IDs as the golden
file [`examples/expected/list.md`](examples/expected/list.md), which is an ID-and-line answer key rather than a copy of this format.
Ask your agent to review that file to get your own; wording and order vary between runs because a language
model is not deterministic. The last line is plain text, so two reviews can be compared with an ordinary diff.

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

edgecase ships in the [SkillShelf](https://github.com/DahanItamar/SkillShelf#readme) marketplace
with the other skills.

Claude Code route (plugin), invoked as `/edgecase:edgecase` or by describing the problem:

```bash
/plugin marketplace add DahanItamar/SkillShelf
/plugin install edgecase@skillshelf
```

Plain-skill route, which needs no plugin UI and so works in web and cloud sessions too. It is invoked as
`/edgecase` with no plugin namespace, and `.claude-plugin/` is ignored:

```bash
git clone https://github.com/DahanItamar/SkillShelf.git
cp -r SkillShelf/plugins/edgecase ~/.claude/skills/edgecase
```

On Windows, copy to `%USERPROFILE%\.claude\skills\edgecase`.

To confirm the install, open any component and say "review this with edgecase"; you should get a verdict
line. It also triggers on its own while you are building UI (to turn that off in one repo, disable the
plugin there or tell your agent in that repo's instructions file not to use edgecase), or when you
describe a symptom rather than a category: *"nothing happens when I click"*, *"it just spins forever"*.

### Use it in other tools

edgecase is a plain skill folder (the open Agent Skills format), so it is not tied to Claude Code. Copy this folder into the tool's skills directory:

- Codex: `~/.codex/skills` or `.agents/skills`; Cursor: `.cursor/skills` or `.agents/skills`
- GitHub Copilot: `.github/skills`; Gemini CLI: `.gemini/skills`
- The root [README install section](../../README.md#install) documents all five tools.
- The `/plugin` lines above are the Claude Code route only; nothing in the skill needs them.

Teams can tune it without a config file: an `edgecase:` block in the first of `AGENTS.md`, `CLAUDE.md`,
`GEMINI.md` or `.github/copilot-instructions.md` that has one can `ignore` paths, `demote` rules or mark
paths `strict`. `strict` applies only to the state, feedback and form rules, never to the opt-in rules. See
[`references/modes.md`](references/modes.md).

Ask for a "policy block" (or type `/edgecase init` where the tool supports skill commands) and it reads
your routes and prints a suggested `edgecase:` block for you to paste; it writes nothing. When you dispute
a finding, ask for a "probe recipe" (`/edgecase probe`) and it turns the rule's `Check:` line into a
recipe (MSW or Playwright, with 500, never-resolving and empty-array bodies) that you run yourself; the
agent never runs it. A "screen audit" (`/edgecase screen`) prints a regions-by-states table. Asking for
the "design laws" (`/edgecase laws`) loads 8 opt-in design rules (Jakob's, Hick's and Tesler's laws plus
progressive disclosure, per-platform conventions, RTL mirroring, one primary action, do not bury a primary
path), not eight named laws; they never block.

**Advises, does not enforce.** There is no hook, blocking CI step or compliance mode, and there will not
be one: nothing runs at install and the skill cannot stop a commit. A `required` gap is fixed or named as
open in the completion message; if you say ship it, the open IDs are listed in one line and work proceeds.
A prototype opt-out covers the named component for that task only.

## Maintainer scripts (optional, nothing runs at install)

| Script | What it does |
|---|---|
| `node --test scripts/check.mjs` | Asserts rule count (34 core, 8 opt-in), required count (18), version agreement across `plugin.json`, `CHANGELOG.md`, the badge and the marketplace entry, that every ID in `examples/expected/` exists, that every example source has an `expected/` file, that referenced paths exist, that no other skill is named in `SKILL.md`, the README or `references/`, that the README states honestly whether a results file exists for the current version, and that no emoji or private-looking strings are present. |
| `node scripts/score.mjs <reply> <golden>` | Reads the `edgecase-ids:` line of a saved reply and prints matched, missed and extra against a golden file. |
| `sh scripts/candidates.sh [path]` | Greps for candidate lines (empty catch, a fetch with no `ok` check or timeout, an effect fetch with no abort) and prints `file:line  pattern  (R-ID)`. **Advisory only:** these are candidates, not findings. The model review is not deterministic, and the script does not replace it. |

**Measured so far:** one self-test run, `claude-sonnet-5-5`, 2026-11-22, on version 1.4.0 only, 1 run, not blind for four of ten files: 28 of 32 expected IDs matched, 4 missed, 1 extra, 0 findings on the clean control (see [`examples/results/`](examples/results/claude-sonnet-5-5-2026-11-22.md)). No run exists for 1.5.0 or 1.6.0 (the new rules, the build-mode case and the newer examples have never been run against a model), the second run the examples README asks for was not done, and no no-skill baseline exists, so nothing here shows that the skill beats a plain prompt. The goldens are expectations written by the skill author. Server-rendered templates have one seeded case (ERB); other template
engines have none.

**Roadmap, not built:** domain packs as separate plugins (payments, streaming AI chat with a stalled
stream and a partial response, uploads, realtime) so the core stays within its cap; a regression test per
finding, offered only on request.

## When to use it instead of a prompt

A 20-line "check my UI states" prompt finds the obvious gaps. What this adds is stable rule IDs you
can cite in review, an `Applies` line per rule that suppresses false positives, a short blocking
list so the review does not get switched off, and a build mode that checks the states while the
code is written. Appearance problems are out of scope and get a one-line note rather than a finding.

**What it will not catch:** retry and backoff behaviour, stale data (a cached screen that is out of
date), optimistic-update rollback, internationalisation beyond layout mirroring. A 403 response and a
network failure are covered only as branches of R-STATE-17. Out-of-order responses are covered only for input-driven or param-driven
fetches (R-STATE-18). The five states are the scope, not the whole of UI correctness.

## How it is built

[`SKILL.md`](SKILL.md) holds the trigger, the Build-mode table with a one-line summary of the rules to check first, and the output contract. SKILL.md is about 8 KB; the rule files load only when a task needs them. The 34 core rules sit in
three reference files, [states](references/states.md) 16, [feedback](references/feedback.md) 10 and
[forms](references/forms.md) 8, each read only when a row of the Build-mode table matches.
[`references/modes.md`](references/modes.md) holds the screen audit, policy block, suggested-policy and probe modes (it has no rules of its own), and is read
only when one of those is asked for. The 8 opt-in design rules are in [`references/opt-in/laws.md`](references/opt-in/laws.md) and are read only when the design laws are asked for. No per-run token figure is published because none has been measured; any token estimate would come from file sizes, not from a run. Every rule has the same
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
colour and typography are out of scope by design. The design rationale is
in [`docs/SPEC.md`](docs/SPEC.md) (20,721 bytes, written for maintainers, never referenced by `SKILL.md`, so it is not loaded when the skill runs); version history is in [`CHANGELOG.md`](CHANGELOG.md).

## Credits

The rules are independently written, informed by publicly available UX guidance: Nielsen Norman Group
research, Apple Human Interface Guidelines, WCAG, and Material Design. The fetch-status rule (R-STATE-17) rests on documented
`fetch` behaviour (MDN, `Response.ok`). The wording is original. Jakob's, Hick's and Tesler's Laws are
credited to Jakob Nielsen, William Hick and Larry Tesler.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
