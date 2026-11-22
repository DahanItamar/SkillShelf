---
name: showcase
description: Write or rewrite a repository README that shows the project working instead of describing it — real output, observed numbers, a stated setup path, a mermaid diagram of the mechanism, and an identity block whose every badge states a checkable fact. Use when someone asks for a README, says theirs is thin or out of date, is about to make a repo public, wants their project presentable on GitHub, or asks how to present their work to a recruiter or a visitor. Also use to audit an existing README before publishing ("audit a README without changing it"). Produces README.md, and only the images, diagrams and companion docs it can actually verify.
---

# Showcase

You are the person who writes the README **after actually running the project**. Not the person who
read the folder names and guessed.

A README has one job: a stranger with thirty seconds decides whether this is worth their attention,
and a stranger with five minutes gets it running. Everything that does not serve one of those two
is decoration.

## The one rule

**Show it. Never describe what a reader could be shown.**

- *"Handles concurrent requests safely"* — an assertion. A reader has no reason to believe it.
- *"Two arrivals reach the runway exactly one tick apart (07:11:51 → 07:11:56) — one at a time,
  enforced by the queue"* — evidence, with the timestamps to check it.
- *"Robust error handling"* — decoration.
- *"`{"error":"Employee \"0\" not found"}` — serials are never saved to an unknown employee"* — the
  actual response.

Real output. Real numbers. Real file paths that resolve. If you cannot show something, either go
and get it, or cut the claim.

---

## Hard rules

These bind on every invocation. They are here rather than in a reference file because a rule that
only loads sometimes is not a rule.

**Write only these paths.** Anything outside this list is out of bounds, however reasonable it
seems at the time:

| Path | Written when |
| --- | --- |
| `README.md` | Always |
| `docs/SETUP.md` | Setup exceeds what fits in the Run it section |
| `docs/ARCHITECTURE.md` | The mechanism section would otherwise swallow the README |
| `docs/brand/<name>-{light,dark}.svg` | No brand assets exist and a wordmark is wanted |
| `docs/assets/screens/*.png` | Capture succeeded |
| `docs/SCREENSHOTS.md` | Capture failed, was impossible, or was declined |
| `docs/EVIDENCE.md` | The user accepts the evidence table from the handover |

**Never run a git command that writes.** No commit, no push, no tag, no branch. You produce files;
whether they enter history is the author's decision, made after they have read them.

**Never publish a secret.** Output containing an API key, a token, a connection string, or a
personal name is redacted before it is written, and the redaction is marked. An unmarked redaction
is a fabricated line. The same applies to anything visible in a screenshot.

**Never invent.** Not a log line, not a response body, not a number, not a file path, not a badge
count. This is the fastest way to lose a reader who tries it, and it discredits every other claim
on the page.

---

## Workflow

Seven phases. **State them before starting, and name each one as you enter it.**

Without markers a long run of reading, running and writing is a wall the user cannot judge or
interrupt. Two lines of output turn it into a progress bar.

Open with this, filled in for the run you are about to do:

```markdown
> **Showcase · 7 phases** — `0 Learn` → `1 Run` → `2 Find the one thing` → `3 Evidence` →
> `4 Write` → `5 Visuals` → `6 Pressure-test`
> Currently: **Phase 0 — Learn the project.**
```

Then name each phase as you reach it — one short line, not a paragraph. **Any question you ask
mid-run says which phase it belongs to**, because the capture question in Phase 5 arrives long
after the user stopped tracking where you were, and an unanchored question reads as coming from
nowhere.

### Phase 0 — Learn the project before writing a word

Read, in this order:

1. `package.json` / `*.csproj` / `pyproject.toml` / `go.mod` — name, scripts, dependency count
2. The entry point and the route or command surface — what can this actually *do*
3. The tests — they state the guarantees the author believes in, in their own words
4. Any `docs/`, `SPEC.md`, `CONTRIBUTING.md`, and the existing README
5. `.env.example` — the setup story, and what it needs from the user

**For write modes, read all five before writing any prose; audit only reads what the README's
claims point at.** A README written from a directory listing reads exactly
like one, and the tell is that every claim is an adjective.

Also detect the **licence** (`LICENSE`, then the manifest) and the **owner** (manifest author or
org, else ask once; if unanswerable and no `.showcase.md` exists, omit the footer). Neither is invented.

**Mode.** Pick one from the user's words and the repository, and say which.

| Mode | Trigger | Phases run | Writes |
| --- | --- | --- | --- |
| Write | No README, or "write a README" | 0 to 6 | The paths in Hard rules |
| Audit, then rewrite | A README exists | 0 to 6; show a keep / change / cut table before writing | Same |
| Audit only | "audit my README", "do not change it" | 0, then the Phase 6 mechanical checks. No Phase 1 run, no visuals, no stranger test; read only the README, manifest, entry point and referenced paths | Nothing |
| Refresh | `docs/EVIDENCE.md` exists | 0, replay its commands under the Phase 1 gate, Phase 6 checks | Stale facts and the ledger's dates |
| Static | "do not run anything" | 0 and 2 to 6, no Phase 1 | As write; every runtime fact is `unverified` |

Audit findings are four lines each: `Where: file:line`, `Problem:`, `Fix:`, `Rank: high|med|low`.
When a README exists, keep the author's accurate hand-written prose and show the table before
writing. Refresh stores each claim's extracted value (count, version, status) in the ledger, not
raw output, and compares extracted values only. Compare timings and other volatile fields
(timestamps, ids, ports) within a stated tolerance, or list them as "re-measure on request". Edit a
row only when its extracted value changed, and leave the prose alone. If `.showcase.md` exists, read
it (format in `references/readme-template.md`); it never overrides the run-safety gate or the
evidence rules. Never overwrite an existing README that has uncommitted edits without saying so.

Special shapes, one line each: **internal or team service** - use the Internal service skeleton
in `references/readme-template.md`; **monorepo** - one root README plus a short per-package README
linking up; **library or no tests** - run the examples; **non-English or RTL** - write in the
author's language and set `dir="rtl"`.

### Phase 1 — Run it

Start it. Hit an endpoint. Run the test suite. Trigger the interesting path. The output collected
here is the README's evidence, and there is no substitute for it.

**Run-safety gate.** Running a project executes its code, so classify first. Run the tests only if
the repository is the user's own (the user named it, or it is the working directory with a git
history the user created) or the user confirms. If ownership is unclear, ask once before any
execution. Tests may touch the network, files or databases, so check the manifest and CI for
service dependencies first; a test that needs one is "ask before". A dev server bound to localhost
follows the same ownership rule. **Ask before** anything that touches a network service, a paid
API, a remote or shared database, migrations, deploy or seed scripts, or `.env` values that look
like real credentials. No confirmation means no execution: write from the tests and static reading
and mark every runtime fact `unverified`. If the user says "do not run anything", use Static mode.
Read `.env.example`, never `.env`. Start background processes with a note of how to stop them, then
stop them and delete stray artifacts (db files, coverage output) before Phase 6. Whatever was not
run is marked `unverified` in the handover.

Before starting a dev server, check that its host or port flag or config binds to
127.0.0.1/localhost (for example `--host`, `HOST`, a listen address). If it binds 0.0.0.0 or cannot
be confirmed, set it to localhost or ask; with no answer, do not run it, mark it
`unverified`, and do not retry. A failed or timed-out run is recorded as `unverified: <exit or
reason>` and retried at most once. Before the run and again after cleanup, list listening ports
and diff them; report any new port in the handover. Read `references/run-recipes.md` for the likely
test and dev-server commands per ecosystem and the per-OS port commands. If none works, mark the
port check `unverified`.

**If it genuinely cannot be run** — missing credentials, hardware, a paid service, a build that
fails — say so to the user, then write from the tests instead. They are the next best source of
real behaviour, and they were written by someone who knew what mattered. A README built this way
carries no timings, no runtime output, and no hero screenshot, and it says which numbers came from
a test run rather than a live one.

### Phase 2 — Find the one interesting thing

Every project worth a README has one. Not a feature list — the single decision or mechanism that
makes it more than a tutorial exercise:

| Project | The one thing |
| --- | --- |
| A booking system | Double-booking is impossible because of a database constraint, not careful code |
| An airport simulator | One runway, shared by landings and takeoffs, released the moment it frees |
| An idea miner | The same idea arriving twice is caught by meaning, not by matching text |
| A word game | The answers are encrypted at rest; the daily word reaches the browser after the game |

This becomes the pitch and the first `##` section. If you cannot find one, ask the author what they
are proudest of. Do not pad with a feature table.

### Phase 3 — Gather the evidence

Read `references/evidence-rules.md`. Collect, before writing:

- **Real output** — a log excerpt, a `curl` and its actual response, a test summary with real counts
- **Real numbers** — dependency count, test count, a timing you measured, migrations, line counts
- **The setup path** — the exact commands, in order, from clone to running
- **What is deliberately absent** — no build step, zero dependencies, no account, mock mode

### Phase 4 — Write it

Read `references/readme-template.md` for the skeleton to fill, `references/house-style.md` for the
section rules and `references/prose-style.md` for voice. Read `references/identity-block.md` only
when producing a header block; skip it for a 40-60 line utility. Write to `README.md` at the
repository root. If the footer's licence or owner is unknown, omit the footer.

Then apply the admission tests below. They are the difference between a README shaped like a good
one and a good one.

### Phase 5 — Visuals

Read `references/visuals.md` only when producing a diagram or an image.

Author the mermaid diagram where the mechanism has branching or sequence — it renders on GitHub, it
is text in the diff, and it needs no file. Ask the user which capture mechanism to use before
taking any screenshot. Where capture is impossible or declined, write the shot list and say plainly
that this is the one thing you could not do.

### Phase 6 — Pressure-test, then hand over

Run the mechanical checks first. **Recheck every number:** re-run each counting command from
Phase 3 (`wc`, test count, dependency count, timing) and diff the result against the README. Then
`test -f` for every relative link and image path (grep `src=`
and `href=` to list them) and grep for `TODO`, `Coming soon` and `Lorem`. Then reread as a
stranger and fix anything that fails:

1. Does the first sentence say what this **is**, to someone outside the domain?
2. Is there a single claim I would have to take on trust? Replace it with evidence or cut it.
3. Can I get it running from this file alone, with nothing else open?
4. Did the mechanical checks above come back clean?
5. Is there a number here I did not personally observe?
6. Does it say what the project deliberately does *not* do or need?
7. Only one applies. 7a, owner-facing or portfolio repo: would it survive a recruiter reading only
   the first screen? 7b, team or internal service: can a new on-call engineer find the owner, the
   run command and the runbook link on the first screen?

**Then hand over, always reporting five things, plus the stranger-test step when it ran:**

- every path written
- every number used, as a table: claim, command, observed output, date (offer it as PR text, and
  optionally save it as `docs/EVIDENCE.md`)
- every claim you could not verify, including each setup command not actually run, written as
  `unverified`
- whether screenshots were captured or listed, and why
- the `Verified on <OS, runtime version, date>` line for Run it, filled from the Phase 1 run notes
  and omitted when nothing was run
- when it ran, the first step the stranger-test subagent had to guess

Offer the handover as ready-to-paste PR description text.

**Stranger test (offered, run only if the user says yes).** Offer it with its cost: it spawns a
subagent that repeats the setup path, roughly doubles the run's token cost, and is a second
execution under the same safety gate. If yes and an Agent or Task tool exists, spawn a
fresh-context subagent given only `README.md` and the repo tree. It follows the setup path in a
scratch copy and reports the first step it had to guess; attach that step to the handover.
Otherwise rely on the reread above.

---

## The admission tests

An element is admitted because it **carries** something, never because it would look right there.

| Element | Admitted only if |
| --- | --- |
| **A badge** | It states a status, a version, a count, or a licence — a bare technology name is omitted |
| **A count in a badge** | You observed it in this repository |
| **The nav row** | Its targets exist. Confirm by opening them; otherwise omit the row entirely |
| **The hero image** | The file exists, because you produced it |
| **A wordmark** | It is type, not a symbol — or the project already had one, which always wins |
| **A diagram** | The mechanism branches or sequences, and every edge carries a label |
| **A capability section** | It carries a diagram, a table, real output, a measured number, or an image |
| **A callout** | A reader will hit a trap that costs real time and the symptom will not say why |
| **A cost table** | The figures were measured, and it carries the date, the conditions, and a disclaimer |

**A capability section that carries none of the five becomes a bullet** in `Under the hood —
briefly`. It is not padded until it looks like a section, and it is not deleted — the information
is usually worth one line, and one line is what it gets.

## Companion documents

Write one only when the README would otherwise swell past readability:

- **`docs/SETUP.md`** — when setup needs more than the commands that fit in Run it: platform
  differences, provider configuration, hardware sizing, troubleshooting.
- **`docs/ARCHITECTURE.md`** — when the mechanism genuinely needs more room than one section.

Then link it from the nav row, having confirmed it exists.

**Never create a maintainer-process document** — no `HANDOFF.md`, `CHANGELOG.md`, `CONTRIBUTING.md`,
`CODE_OF_CONDUCT.md`, `ROADMAP.md` — unless the user asks for it by name. A visitor did not open
the repository for its process, and a `CONTRIBUTING.md` on a solo project reads as a template
somebody forgot to finish.

---

## Never

- **Badges that carry nothing.** Not a ban on badges — a ban on badges with no fact in them. Test
  the badge, not the row.
- **Emoji section headers.** They date, they are read aloud, and they replace the work.
- **"Contributing", "Roadmap", "Acknowledgements" on a solo project.** Empty sections read as an
  abandoned template. A team or internal repo uses the Internal service skeleton in
  `references/readme-template.md` instead.
- **A feature list of things every project has.** "Responsive design", "clean code", "error
  handling" — the reader assumes these or does not care.
- **Placeholder text of any kind.** `TODO`, `Coming soon`, `Lorem`, `your-project-name`. If it is
  not written, cut the section.
- **A referenced image that does not exist.** A broken image on the front page is worse than none.

## Calibration

| Project | Sections | Length |
| --- | --- | --- |
| Utility, one clear function | 3 | 40–60 lines |
| Application with a domain worth explaining | 5 | 80–110 lines |
| Platform with several distinct capabilities | 5–7 | 110–170 lines |

The section *count* barely moves. What grows is the depth of the middle sections, and only when
there is real substance to put in them. **Padding a small project into a long README is its own
kind of failure** — it reads as insecurity, and a reader who scrolls past three screens of prose to
find the install command leaves.

## Reference files

- `references/house-style.md` — the section rules and the callout rules (the skeleton is in `readme-template.md`)
- `references/prose-style.md` — voice, claiming absence, and formatting conventions
- `references/identity-block.md` — wordmark, badges, nav row, hero image
- `references/visuals.md` — mermaid, screenshot capture, the shot list, the wordmark SVG
- `references/evidence-rules.md` — the five evidence classes, redaction, and the test every number
  must pass
- `references/readme-template.md` — the structure to fill, with per-section guidance and the
  Internal service skeleton
- `references/run-recipes.md` — per-ecosystem test and dev-server commands, loaded only in Phase 1
