<div align="center">

# README Architect

**A Claude Code skill that writes a repository README by running the project first — real output, real numbers, and one clear reason the project is interesting.**

Standalone skill. Four Markdown files, no dependencies, no build step.

</div>

---

## The idea

Most generated READMEs are adjectives. *Fast. Scalable. Robust error handling. Clean
architecture.* A reader has no reason to believe any of it, so they skim to the install
command and decide from the code instead.

This skill enforces one rule:

> **Show it. Never describe what a reader could be shown.**

Which in practice means the skill does not start writing until it has run the project and
collected something to show:

| Instead of | It writes |
|---|---|
| "Handles concurrent requests safely" | Two log lines one tick apart, and a sentence naming what that proves |
| "Comprehensive test coverage" | "59 tests, including end-to-end against the real server" |
| "Secure by design" | "Passwords hashed with scrypt and a per-user salt; session cookie is `HttpOnly`" |
| "Robust error handling" | The actual failure response: `{"error":"Employee \"0\" not found"}` |

Every one of those is checkable in seconds. That is the whole point — a claim a reader can
verify is worth more than five they have to trust.

## What it does

**Phase 0 — learns the project.** Manifest, entry point, route surface, tests, `.env.example`.
Then it *runs* it: starts the server, hits an endpoint, runs the suite. A README written
without running the project reads exactly like one, and the tell is that every claim is an
adjective.

**Phase 1 — finds the one interesting thing.** Not a feature list; the single decision that
makes the project more than a tutorial exercise. That becomes the pitch and the first
section.

**Phase 2 — gathers evidence.** Real output, numbers it observed, the exact setup path, and
what the project deliberately does *not* need — readers cannot infer absence, so "no build
step" and "no database needed to try it" have to be claimed.

**Phase 3–5 — writes, illustrates, pressure-tests.** Five sections, 80–110 lines. It authors
SVG diagrams itself, and for screenshots it cannot take, it writes a shot list rather than
referencing PNGs that do not exist — a broken image on a repo front page is worse than no
image.

### What it refuses to do

Badge walls. Emoji headers. Empty "Contributing" and "Roadmap" sections on a solo project.
Feature lists of things every project has. Placeholder text. And above all, **invented
output** — a log line or benchmark that was never observed is the fastest way to lose a
reader who tries it, and it poisons every other claim on the page.

## Install

No plugin system needed — copy the folder into your skills directory:

```bash
# macOS / Linux
cp -r readme-architect ~/.claude/skills/

# Windows PowerShell
Copy-Item -Recurse readme-architect "$HOME\.claude\skills\"
```

Then in Claude Code:

```
/readme-architect
```

Or just ask — the skill triggers on "write a README", "my README is thin", "I'm about to
make this repo public", or "make this presentable on GitHub".

## Under the Hood — Briefly

- **`SKILL.md`** — the persona, the one rule, and a five-phase workflow ending in a
  pressure-test the README has to survive before handover.
- **`references/house-style.md`** — the skeleton and the voice: centred header block, a
  domain section named for the thing rather than "Overview", `Under the Hood — Briefly`
  bullets, and a formatting table down to image widths and alt-text rules.
- **`references/evidence-rules.md`** — the four kinds of evidence, the test any sentence
  must pass, how to claim absence, and what to do when the project genuinely cannot be run.
- **`references/readme-template.md`** — the structure to fill in, with per-section guidance.

> The house style is derived from READMEs that hold a reader's attention rather than from a
> generator's defaults. The skeleton is deliberately tight — five sections, around a hundred
> lines — because padding a small project into a long README reads as insecurity, and a
> reader who scrolls three screens to find the install command leaves.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · © 2026

</div>
