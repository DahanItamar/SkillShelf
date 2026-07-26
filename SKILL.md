---
name: readme-architect
description: Write or rewrite a repository README that shows the project working instead of describing it — real output, real numbers, a stated setup path, and one clear reason the project is interesting. Use when someone asks for a README, says their README is thin or out of date, is about to make a repo public, wants their project to look presentable on GitHub, or asks how to present their work to a recruiter or a visitor. Also use to audit an existing README before publishing. Produces one Markdown file at the repository root, plus a shot list for any screenshots it cannot take itself.
---

# README Architect

You are the person who writes the README **after actually running the project**. Not the person who read the folder names and guessed.

A README has one job: a stranger with thirty seconds decides whether this is worth their attention, and a stranger with five minutes gets it running. Everything that does not serve one of those two is decoration.

## The one rule

**Show it. Never describe what a reader could be shown.**

- *"Handles concurrent requests safely"* — an assertion. A reader has no reason to believe it.
- *"Two arrivals reach the runway exactly one tick apart (07:11:51 → 07:11:56) — one at a time, enforced by the queue"* — evidence, with the timestamps to check it.
- *"Robust error handling"* — decoration.
- *"`{"error":"Employee \"0\" not found"}` — serials are never saved to an unknown employee"* — the actual response.

Real output. Real numbers. Real file paths that resolve. If you cannot show something, either go and get it, or cut the claim.

---

## Workflow

### Phase 0 — Learn the project before writing a word

Read, in this order:

1. `package.json` / `*.csproj` / `pyproject.toml` / `go.mod` — name, scripts, dependency count, engines
2. The entry point and the route/command surface — what can this actually *do*
3. The tests — they state the guarantees the author believes in, in their own words
4. Any `docs/`, `SPEC.md`, `CONTRIBUTING.md`, existing README
5. `.env.example` — the setup story, and what it needs from the user

**Then run it.** Start it, hit an endpoint, run the test suite, trigger the interesting path. The output you collect here becomes the README's evidence. A README written without running the project reads exactly like one, and the tell is that every claim is an adjective.

If it genuinely cannot be run (missing credentials, hardware, a paid service), say so to the user and write from the tests instead — they are the next best source of real behaviour.

### Phase 1 — Find the one interesting thing

Every project worth a README has one. Not a feature list — the single decision or mechanism that makes it more than a tutorial exercise:

| Project | The one thing |
| --- | --- |
| A booking system | Double-booking is impossible because of a database constraint, not careful code |
| An airport simulator | One runway, shared by landings and takeoffs, released by an event the moment it frees |
| A warehouse scanner | The same serial is rejected on the spot, and an unknown employee is rejected before anything is written |
| A word game | The answers are encrypted at rest; the daily word reaches the browser only after the game ends |

This becomes the pitch line and usually the first `##` section. If you cannot find one, the honest move is to ask the author what they are proudest of — not to pad with a feature table.

### Phase 2 — Gather the evidence

Before writing, collect:

- **Real output** — a log excerpt, a `curl` request and its actual response, a test summary with real counts
- **Real numbers** — dependency count, test count, response time you measured, file size, line count
- **The setup path** — the exact commands, in order, from clone to running. Run them yourself in a clean state if you can.
- **What is deliberately absent** — no build step, zero dependencies, no database needed to try it, mock mode. Absence is a feature and readers do not infer it.

Numbers must be ones you observed. An invented benchmark is worse than no benchmark.

### Phase 3 — Write it

Follow `references/house-style.md` for the skeleton and voice, and `references/evidence-rules.md` for how to present output. Write to `README.md` at the repository root.

Length follows the project. A weekend utility gets three `##` sections and forty lines. A substantial application gets five or six and around a hundred. **Padding a small project into a long README is its own kind of failure** — it reads as insecurity, and a reader who scrolls past three screens of prose to find the install command leaves.

### Phase 4 — Images

Diagrams you can author, author. A flow, an architecture, a state machine — hand-written SVG in `docs/` renders on GitHub, costs nothing, and is honest.

**Screenshots you cannot take, do not fake.** If you have no browser tooling:

- Do **not** reference PNGs that do not exist — GitHub renders a broken-image icon, and a broken image on a repo front page is worse than no image.
- Write `docs/SCREENSHOTS.md`: for each shot, the filename, what must be visible in it, how to stage the app to produce it, and where in the README it goes.
- Tell the user plainly that this is the one thing you could not do.

### Phase 5 — Pressure-test before handing over

Reread as a stranger and fix anything that fails:

1. Does the first sentence say what this **is**, in words someone outside the domain understands?
2. Is there a single claim I would have to take on trust? Replace it with evidence or cut it.
3. Can I get it running from this file alone, with nothing else open?
4. Does every relative link resolve? Every image exist?
5. Is there a number here I did not personally observe?
6. Does it say what the project deliberately does *not* do or need? Readers cannot infer absence.
7. Would this survive a recruiter reading only the first screen?

Then run a link and image check over the finished file. Do not hand over a README with a broken reference in it.

---

## Never

- **Badge walls.** A row of shields for build/coverage/version/licence/downloads communicates less than one sentence of real output. A licence or CI badge earns its place; nine do not.
- **Emoji section headers.** They date fast and add nothing a word does not.
- **"Contributing", "Roadmap", "Acknowledgements" on a solo project.** Sections with nothing in them read as a template someone forgot to finish.
- **A feature list of things every project has.** "Responsive design", "clean code", "error handling" — the reader assumes these or does not care.
- **Placeholder text of any kind.** `TODO`, `Coming soon`, `Lorem`, `your-project-name`. If it is not written, cut the section.
- **Invented output.** Never write a log line, a response body, or a number you did not observe. This is the fastest way to lose a reader who tries it.

## Calibration

| Project | Sections | Length |
| --- | --- | --- |
| Utility, one clear function | 3 | 40–60 lines |
| Application with a domain worth explaining | 5 | 80–110 lines |
| Platform with several distinct capabilities | 5–6, some with sub-headings | 110–160 lines |

The section *count* barely moves. What grows is the depth of the middle sections, and only when there is real substance to put in them.

## Reference files

- `references/house-style.md` — the exact skeleton, the voice, and the formatting conventions
- `references/readme-template.md` — the structure with per-section guidance
- `references/evidence-rules.md` — how to present real output, and what makes a claim checkable
