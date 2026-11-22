> Build history, not user instructions. Kept as provenance for how this plugin was made.

# Showcase v2 — Technical Spec

> Status: Draft · 2026-08-15 · Spec version 1.0
> Governed by [`docs/CONSTITUTION.md`](CONSTITUTION.md).

## 1. Problem & Users

Showcase v1 writes a good small README: five sections, real output, no padding. It cannot
write the README its own author now writes by hand. v1 forbids badge walls outright, has no
position on mermaid, cannot produce a light/dark wordmark, treats every screenshot as impossible,
and caps at a shape that has no room for a measured cost table or a `> [!WARNING]` that saves an
hour. The gap is not taste — the exemplar
([Winnow](https://github.com/DahanItamar/Winnow)) clears every one of v1's own evidence rules while
breaking three of its formatting rules, which means the formatting rules were wrong.

**Primary user:** a developer pointing the skill at their own repository, wanting a front page that
survives a recruiter's first screen and a stranger's first five minutes.
**Success looks like:** the skill produces, unattended, a README of the standard the author
currently reaches only by hand — and refuses to fabricate the parts it cannot observe.

## 2. Scope

### In scope

- A single Winnow-derived skeleton, with a mechanical admission test per element
- An identity block: wordmark, badge rows, doc-nav row, hero image
- A badge rule that replaces v1's ban — every badge states a checkable fact
- Mermaid diagrams as a first-class, always-preferred diagram medium
- Real screenshot capture where the host can launch the project; shot list where it cannot
- A light/dark SVG wordmark, authored by the skill
- GitHub alert callouts for traps that cost the reader real time
- A measured-numbers evidence class — cost and benchmark tables, with a mandatory disclaimer
- Companion reader-facing docs (`SETUP.md`, `ARCHITECTURE.md`) when the README would otherwise swell

### Explicitly out of scope

- **Maintainer-process docs** — `HANDOFF.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
  Your answer, and correct: they are process artefacts, not reader artefacts, and a solo repo with
  a CONTRIBUTING file reads as a template someone forgot to finish.
- **Platform fences** (`<!-- platform:windows -->`) and release-time stripping — Winnow-specific
  build tooling, not a README pattern. v3 if a second repo ever needs it.
- **Translation / RTL READMEs** — a second output file per language, and nothing asked for it.
- **Badge services beyond shields.io and GitHub Actions** — one badge vocabulary, so the admission
  test stays checkable.
- **CI that regenerates the README** — the skill writes; it does not install automation.
- **A worked-example README shipped as a reference file** — this repository's own `README.md` is the
  worked example (Constitution Principle 6), and a second one would drift from it.

### 2.1 Acceptance Criteria

Two actors. **The skill** is Showcase v2 — criteria about what it does when invoked. **The
README** is the artefact it produces — criteria about what must be true of that file. Both are
observable by reading.

| ID | Criterion |
| --- | --- |
| AC-001 | The skill package shall present `SKILL.md` at the repository root with YAML frontmatter carrying `name: showcase` and a `description`. |
| AC-002 | The skill package shall carry five files in `references/`, named `house-style.md`, `readme-template.md`, `evidence-rules.md`, `identity-block.md`, and `visuals.md`. |
| AC-003 | `SKILL.md` shall link to every file in `references/` by a repository-relative path. |
| AC-004 | `SKILL.md` shall reference no path under `docs/` and no absolute or plugin-root path. |
| AC-005 | When invoked, the skill shall read the project manifest, the entry point, the tests, any existing docs, and `.env.example` before writing any README prose. |
| AC-006 | Where the project can be run, the skill shall run it and collect its real output before writing. |
| AC-007 | If the project cannot be run, then the skill shall write from the tests and shall tell the user it could not run the project. |
| AC-008 | The README shall open with a centred identity block containing, in order: the wordmark or `# Name`, the pitch, the stack line, the badge rows, the nav row, and the hero image. |
| AC-009 | Every badge shall state a fact the reader can check — a build status, a version, a count, or a licence. |
| AC-010 | If a badge would carry only a technology name with no version and no count, then the skill shall omit it. |
| AC-011 | The identity block shall carry at most ten badges across at most two rows. |
| AC-012 | Every count rendered in a badge shall be a number the skill observed in the repository it is documenting. |
| AC-013 | Where a wordmark exists in light and dark variants, the README shall reference it through a `<picture>` element carrying a `prefers-color-scheme: dark` source. |
| AC-014 | The nav row shall link only to files that exist in the repository when the README is written. |
| AC-015 | When the setup path exceeds what fits in the Run it section, the skill shall write `docs/SETUP.md` and link it from the nav row. |
| AC-016 | The skill shall not create a maintainer-process document unless the user asks for it by name. |
| AC-017 | The README shall carry exactly one section explaining the project's single most interesting mechanism, named for that mechanism and never `Overview`, `Introduction`, or `About`. |
| AC-018 | The README shall carry a Run it section stating the requirements in one sentence followed by the shortest honest path from clone to running. |
| AC-019 | The README shall carry an `Under the hood — briefly` section of at most six bullets, each opening with a bold lead-in. |
| AC-020 | The README shall close with a centred footer naming the author, the licence, and the year. |
| AC-021 | Every capability section shall carry at least one of: a diagram, a table, real program output, a measured number, or an image. |
| AC-022 | If a capability section would carry none of those, then the skill shall demote it to a bullet in `Under the hood — briefly`. |
| AC-023 | The README shall contain no number the skill did not observe. |
| AC-024 | When real program output is shown, the README shall follow it with one sentence naming what the reader should notice. |
| AC-025 | If output was trimmed or identifiers shortened, then the README shall say so. |
| AC-026 | Where the README states a measured cost or benchmark, it shall name the date and the conditions of measurement and carry a disclaimer that the figures are indicative and that no liability is accepted. |
| AC-027 | The README shall state what the project deliberately does not do or does not need. |
| AC-028 | Where the project's central mechanism has branching or sequence, the skill shall author a mermaid diagram of it directly in the README. |
| AC-029 | Every mermaid edge shall carry a label naming the condition or the mechanism it represents. |
| AC-030 | The README shall reference no image file that does not exist in the repository. |
| AC-031 | When the user has chosen a capture mechanism, the skill shall capture using that mechanism into `docs/assets/screens/` and reference the results from the README. |
| AC-032 | If capture fails, is impossible, or the user declines every option, then the skill shall write `docs/SCREENSHOTS.md` naming for each shot its filename, what must be visible, how to stage it, and where it goes — and shall tell the user this is the one thing it could not do. |
| AC-033 | Every image shall carry alt text describing what is visible rather than naming the file. |
| AC-034 | Where a reader is likely to hit a trap that costs real time, the README shall carry a `> [!WARNING]` or `> [!IMPORTANT]` callout naming the symptom and the fix. |
| AC-035 | The skill shall not use a callout for emphasis. |
| AC-036 | The README shall contain no emoji in any heading. |
| AC-037 | The README shall contain no placeholder text — no `TODO`, `Coming soon`, `Lorem`, or `your-project-name`. |
| AC-038 | The README shall contain no heading with no content beneath it. |
| AC-039 | README prose shall wrap at 100 characters, excluding tables, fenced blocks, and URLs. |
| AC-040 | When the skill finishes, it shall report every path it wrote and every claim it could not verify. |
| AC-041 | The skill shall not run a git command that writes — no commit, no push, no tag. |
| AC-042 | If real output contains a secret, a token, or personal data, then the skill shall redact it and say that it did. |
| AC-043 | Where the project has a visible interface, the skill shall ask the user which capture mechanism to use, offering the mechanisms that fit the project's shape plus a custom option in which the user writes the instruction themselves. |
| AC-044 | The skill shall author a wordmark as type only — the project's name set in a typeface — and shall never author a pictorial or emblem mark. |

## 3. Architecture

### Overview

A Claude Skill is a loader plus a set of Markdown files, and the only architectural decision that
matters is **what is loaded when**. `SKILL.md` enters context on every invocation; a `references/`
file enters only when the workflow sends the reader to it. So `SKILL.md` carries the workflow and
the rules that apply to every README, and each reference file carries the depth for exactly one
phase of that workflow. The split is by *when it is needed*, not by topic.

```text
                    ┌──────────────────────────┐
  Claude Code  ──►  │ frontmatter: name + desc │  trigger match, every session
                    └────────────┬─────────────┘
                                 │ loads
                    ┌────────────▼─────────────┐
                    │        SKILL.md          │  workflow · the one rule · admission tests
                    └────────────┬─────────────┘
                    relative link, on demand
        ┌───────────────┬────────┴───────┬────────────────┬───────────────┐
        ▼               ▼                ▼                ▼               ▼
  house-style.md  identity-block.md  visuals.md   evidence-rules.md  readme-template.md
   Phase 3          Phase 3a          Phase 4        Phase 2            Phase 3

                                 │ writes (filesystem)
                                 ▼
        README.md · docs/SETUP.md · docs/ARCHITECTURE.md · docs/brand/*.svg
        docs/assets/screens/*.png · docs/SCREENSHOTS.md
```

### Components

| Component | Responsibility | Technology |
| --- | --- | --- |
| `SKILL.md` | The workflow, the one rule, the element admission tests, the Phase 5 checklist. Holds no catalogue and no long example. | Markdown + YAML frontmatter |
| `references/house-style.md` | The skeleton, the voice, the formatting conventions, the calibration table. Does not cover the identity block. | Markdown |
| `references/identity-block.md` | Wordmark, badge admission test and shields grammar, nav row, hero image, footer. | Markdown |
| `references/visuals.md` | Mermaid authoring rules, SVG wordmark authoring, screenshot capture, the shot-list fallback. | Markdown |
| `references/evidence-rules.md` | The four evidence classes plus the fifth — measured cost and benchmark tables — and the redaction rule. | Markdown |
| `references/readme-template.md` | The fill-in structure with per-section guidance. Instruction, never content to copy. | Markdown |
| `.claude-plugin/plugin.json` | Package identity. Version `2.0.0`. Never read at runtime. | JSON |

### Decisions

**Skeleton shape** — one Winnow-derived skeleton, with a mechanical admission test per element.
Because: you asked for the Winnow skeleton, and two named tiers would make the skill's first act a
classification it can get wrong before it has read anything.
Instead of: a Standard/Flagship pair — it doubles `references/` and puts the highest-stakes
judgement earliest, when the skill knows least.
Revisit if: the skill starts emitting flagship scaffolding on forty-line utilities, which is v1's
stated failure mode and the risk this decision accepts.

**How an element earns its place** — a stated, checkable admission test, not a judgement call.
Because: "include it if it is earned" is precisely the judgement a model resolves toward *yes*,
and the whole skeleton then arrives on every project.
Instead of: prose guidance about proportion — unenforceable, and `spec-drift` cannot report on it.
Revisit if: an admission test proves unwritable for some element; that element leaves the skeleton.

**Badges** — every badge states a fact the reader can check; at most ten, at most two rows.
Because: v1's ban was a proxy for "badges usually carry nothing", and the exemplar's badges carry
`321 passing`, `41 migrations`, `runtime deps 1` — facts, which is what the ban was protecting.
Instead of: keeping the ban — it makes the target README unreachable. Instead of: measured-only,
dropping the stack row — a `React 19` badge carries a version, which is checkable.
Revisit if: badge rows start appearing on repos with no test suite and no measurable constraint.

**Mermaid before any image format** — diagrams are authored as mermaid in the README body.
Because: it renders natively on GitHub, is plain text in the diff, needs no file, and is the one
visual the model can author with no tooling at all.
Instead of: hand-written SVG in `docs/` (v1's answer) — a binary-ish artefact to maintain, and
invisible in review. Instead of: PNG — cannot be authored without a renderer.
Revisit if: the primary distribution target stops being GitHub. npm and PyPI render mermaid as a
code fence, which degrades to readable text rather than to a broken image — see §8.

**Screenshots** — the user picks the capture mechanism, every run; the shot list is the fallback.
Because: capture depends on facts the skill cannot reliably infer — whether the thing is a desktop
window, a page at a URL, or a terminal session, and whether it is already running. Offering the
mechanisms that fit the shape and letting the user write their own instruction puts the one fact
the skill lacks in the hands of the only party who has it. Because the fallback: a referenced PNG
that does not exist renders as a broken image on the repo front page, which is worse than no image.
Instead of: autodetecting the host's capability — it guesses at the moment it knows least, and a
wrong guess produces either nothing or a screenshot of the wrong window.
Instead of: shot-list-only (v1) — leaves the highest-value element permanently unreachable.
Revisit if: the picker starts firing on projects with no visible interface, which would make it a
question asked for its own sake.

**The wordmark is typographic and authored as SVG** — two variants, light and dark, in `docs/brand/`.
Because: a typographic wordmark is text and geometry, which the model can author honestly; a
pictorial mark is neither, and a bad generated emblem is worse than none. Confirmed rather than
assumed — the skill sets the name in a typeface and never draws a symbol.
Instead of: no wordmark — loses the `<picture>` theme-flip that opens the exemplar.
Revisit if: the project already has brand assets, in which case the skill uses them and authors none.

**Companion docs are reader-facing only** — `SETUP.md` and `ARCHITECTURE.md`, and nothing else.
Because: your answer — "docs needed and necessary, not like handoff". A reader needs setup depth
and architecture depth; nobody visiting a repo needs its handoff notes.
Instead of: the full Winnow constellation — five of its six nav targets are maintainer artefacts.
Revisit if: a user asks for one by name, which AC-016 already permits.

**`references/` splits by workflow phase, not by topic** — five files, one per phase that needs depth.
Because: a reference file is read cold and alone, so it must be complete for one moment of the
workflow; a topic-split file gets read at the wrong time or not at all.
Instead of: one large file — it would exceed the constitution's 300-line hard limit and would load
identity-block rules during evidence gathering.
Revisit if: a sixth phase needs depth. The constitution's hard cap is seven files.

## 4. Project Layout & Conventions

Governed by [`docs/CONSTITUTION.md`](CONSTITUTION.md) — layout, dependency direction, naming, size
limits, tooling, and the verify command. Nothing here restates it.

Specific to this spec:

- `references/` reaches its soft cap of five files at exactly the set in §3. A sixth needs a
  decision entry, not just space under the hard cap.
- Paths the skill writes **into a target repository** are a fixed allowlist — see §6. Any path
  outside it is a defect, not a judgement call.
- Element admission tests live in `SKILL.md`, not in `house-style.md`. They run on every invocation,
  so they are not depth.

## 5. Data Models

There is no database. The models are the four artefacts whose exact shape the skill depends on.

**`SKILL.md` frontmatter** — the trigger contract. A malformed block fails silently (Constitution §Verification).

```yaml
---
name: showcase          # kebab-case; identical to plugin.json `name` (AC-001)
description: >-                 # ≤ 600 chars soft, 1024 hard; carries the trigger phrases
  Write or rewrite a repository README that shows the project working instead of
  describing it — real output, observed numbers, a stated setup path, mermaid diagrams
  of the mechanism, and an identity block whose every badge states a checkable fact.
  Use when someone asks for a README, says theirs is thin or out of date, is about to
  make a repo public, or wants it presentable to a recruiter. Also use to audit an
  existing README before publishing.
---
```

**`.claude-plugin/plugin.json`** — package identity. Only `version` changes in v2.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "showcase",
  "displayName": "Showcase",
  "version": "2.0.0",
  "description": "…",
  "author": { "name": "Itamar Dahan", "url": "https://github.com/DahanItamar" },
  "homepage": "https://github.com/DahanItamar/showcase",
  "repository": "https://github.com/DahanItamar/showcase",
  "license": "MIT",
  "keywords": ["readme", "docs", "documentation", "open-source", "markdown", "onboarding"]
}
```

**The identity block** — the exact structure AC-008 asserts, in the order it must appear.

```markdown
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/<name>-dark.svg">
  <img src="docs/brand/<name>-light.svg" alt="<Name>" width="420">
</picture>

**<Pitch — one or two bold sentences: what it is, and the thing that makes it not ordinary.>**

<Stack line, plain prose. **The notable constraint in bold.**>

<row 1 — proof badges: CI status · test count · version · licence>
<row 2 — stack badges, each carrying a version or a count>

<a href="docs/SETUP.md">Setup</a> · <a href="docs/ARCHITECTURE.md">Architecture</a>

<img src="docs/assets/screens/<hero>.png" alt="<what is visible>" width="830">

</div>

---
```

**A badge** — the shields grammar, so AC-009 and AC-012 are checkable by reading the URL.

```text
https://img.shields.io/badge/<label>-<message>-<hex>?style=flat-square[&logo=<slug>&logoColor=white]
                              │        │
                              │        └─ MUST be a status, a version, a count, or a licence
                              └─ the fact's name — never a bare technology name (AC-010)

alt text MUST restate the fact in words: alt="321 tests passing across 22 suites"
```

**Constraints**

- unique: `references/` filenames — the set in AC-002 is closed
- ordered: the identity block's six elements — order is asserted, not stylistic
- bounded: badges ≤ 10, `Under the hood` bullets ≤ 6, capability sections ≤ 3

## 6. Interfaces

### Skill → Claude Code (the trigger contract)

| Signature | Purpose | Contract |
| --- | --- | --- |
| frontmatter `name` | Skill identity, invoked as `/showcase` | Unchanged from v1 — a rename silently stops every existing install firing |
| frontmatter `description` | Trigger matching | Rewritten in v2; must still fire on v1's asks (see §11.3) |

### SKILL.md → references (the load contract)

| Signature | Loaded when | Must be complete alone |
| --- | --- | --- |
| `references/evidence-rules.md` | Phase 2, gathering evidence | Yes — read cold |
| `references/house-style.md` | Phase 3, writing | Yes |
| `references/identity-block.md` | Phase 3a, the header block | Yes |
| `references/visuals.md` | Phase 4, diagrams and images | Yes |
| `references/readme-template.md` | Phase 3, alongside house-style | Yes |

### Skill → target repository (the write allowlist)

Every path the skill may create or modify. Anything else is out of bounds.

| Path | Written when | Never |
| --- | --- | --- |
| `README.md` | Always | Overwritten without showing the user what is being replaced (§8) |
| `docs/SETUP.md` | Setup exceeds the Run it section (AC-015) | Otherwise |
| `docs/ARCHITECTURE.md` | The mechanism section would exceed the skeleton | Otherwise |
| `docs/brand/<name>-{light,dark}.svg` | No brand assets exist and a wordmark is wanted | If the project already has them |
| `docs/assets/screens/*.png` | Capture succeeded (AC-031) | Fabricated, ever |
| `docs/SCREENSHOTS.md` | Capture failed or is impossible (AC-032) | Alongside successful capture |

Writes only. No `git add`, no `git commit`, no `git push`, no tag (AC-041).

### Skill → user (the handover)

Reported at the end, always: every path written · every number observed and where it came from ·
every claim that could not be verified · whether screenshots were captured or listed (AC-040).

## 7. Core Flows

### Flow A — Fresh README, project runs

1. Skill reads manifest, entry point, tests, existing docs, `.env.example` — no prose written yet.
2. Skill runs the project and the test suite; captures output, counts, timings verbatim.
3. Skill identifies the one interesting mechanism; if it has branching or sequence, drafts the mermaid.
4. Skill runs each element's admission test against what it gathered; elements that fail are dropped.
5. Where the project has a visible interface, skill asks the user which capture mechanism to use —
   the options that fit the shape, plus a custom one the user writes — then captures into
   `docs/assets/screens/`. On failure or decline, writes `docs/SCREENSHOTS.md` instead.
6. Skill writes the identity block, then the body, then the footer.
7. Skill runs the Phase 5 checklist — every link opened, every image confirmed to exist, every
   number traced to an observation.
8. Skill reports paths and unverified claims.

**Satisfies:** AC-005, AC-006, AC-008, AC-021, AC-028, AC-030, AC-031, AC-040, AC-043
**Failure branches:** run fails → Flow C. Capture fails or is declined → AC-032. No mechanism
found → §8.

### Flow B — Audit an existing README

1. Skill reads the existing README in full before reading anything else.
2. Skill lists what it keeps — every claim already backed by evidence stays, in the author's words.
3. Skill runs Flow A steps 1–5 to gather what the existing file lacks.
4. Skill shows the user which sections it proposes to replace, and what is lost, before writing.
5. Skill writes, preserving kept content verbatim.

**Satisfies:** AC-005, AC-023, AC-040
**Failure branches:** existing README contains claims the skill cannot verify → they are quoted to
the user, never silently promoted into v2's prose and never silently deleted.

### Flow C — The project cannot be run

1. Skill states to the user, before writing, exactly why it cannot run the project.
2. Skill reads the test suite as the source of the guarantees the author believes in.
3. Skill writes with evidence drawn from tests only; no timing, no runtime output, no hero screenshot.
4. Badge rows carry only what static reading proves — test count, dependency count, licence, version.
5. Skill writes `docs/SCREENSHOTS.md` and says plainly that images are the gap.

**Satisfies:** AC-007, AC-012, AC-023, AC-032
**Failure branches:** no tests either → the skill says so and writes the smallest honest README,
rather than inventing the middle sections.

## 8. Edge Cases & Failure Modes

| Case | Consequence if unhandled | Handling | AC |
| --- | --- | --- | --- |
| Project has no single interesting mechanism | The mechanism section becomes a padded feature list, which is v1's stated failure | Skill asks the author what they are proudest of; if there is no answer, the section is dropped and the README is short | AC-017, AC-022 |
| No test suite | A `tests` badge with an invented count | Badge omitted; absence stated in prose instead | AC-009, AC-012 |
| Test count drifts after the README is written | A confidently wrong number on the front page | Counts that change per-commit go in a CI-generated badge or are phrased to stay true; otherwise omitted | AC-012 |
| Existing README holds hand-written content worth keeping | Overwrite destroys work the author cannot recover | Flow B shows what is being replaced before writing | AC-040 |
| Screenshot capture picks up a secret, token, or real customer data | The repo front page publishes a credential | Capture only the app window in a staged state; skill re-reads the shot before referencing it; redact and say so | AC-042 |
| Real output contains an API key or PII | Same, in a code fence | Redacted, and the redaction stated | AC-025, AC-042 |
| Repo is private, or nav targets are private | Every link 404s for the audience the README is for | Nav row is built from files verified to exist in this repository; external links are opened before being written | AC-014, AC-030 |
| Distribution target is npm or PyPI, not GitHub | Mermaid renders as a code fence and callouts as blockquotes | Accepted: both degrade to readable text, never to a broken image. Stated in `visuals.md` | AC-028 |
| Monorepo — many packages, one README | The README describes the wrong thing, confidently | Skill names which package it documents in the pitch, or asks when it is genuinely ambiguous | AC-017 |
| Wordmark authored for a project that already has brand assets | Two competing identities in one repo | Skill uses existing assets and authors none | AC-013 |
| `docs/` already exists with different conventions | Files written into a layout that contradicts the repo | Skill follows the repo's existing docs layout; the allowlist in §6 names defaults, not overrides | AC-014 |
| Project is not in English | An English README on a Hebrew-language project | Skill writes in the language of the repo's existing prose, and says so if it had to choose | — |

## 9. Security & Permissions

**Authentication:** none. The skill runs inside the user's own session, against a repository they
opened. The OS account is the boundary.

**The real risk is execution.** Phase 0 instructs a model to run an arbitrary repository's scripts —
`npm install` runs postinstall hooks, and a build script is arbitrary code. This is v1's behaviour
too; v2 states it rather than inheriting it silently.

| Actor | May | May not |
| --- | --- | --- |
| The skill | Read any file in the target repo; run the project the user pointed it at; write the §6 allowlist | Run a project the user did not name; install global tooling; write outside the allowlist |
| The skill | Capture screenshots of the app it launched | Capture the desktop, other windows, or a terminal holding credentials |
| The skill | Read `.env.example` | Read `.env`, or copy any value from it into any file |

**Enforcement point:** the §6 write allowlist, restated in `SKILL.md` as a hard rule rather than
left to `visuals.md` — it must be in context on every invocation to bind.

**Data handling:** no secret, token, connection string, or personal name from real output reaches
any written file. Where output must be shown and contains one, it is redacted and the redaction is
stated — an unmarked redaction is a fabricated line (AC-025, AC-042). The skill never runs a
writing git command, so nothing it produces leaves the working tree without the user's own commit
(AC-041).

## 10. Build Order

Verification is by reading, per the constitution. Each milestone ends with the five explicit checks
in `docs/CONSTITUTION.md` §Verification over the files it touched.

**M1 — The skeleton exists**
*Demo: hand someone `house-style.md` and `readme-template.md` and they can lay out a Winnow-shaped
README for a project they know, without asking a question.*
- [ ] Rewrite `references/house-style.md` around the Winnow-derived skeleton — closes AC-017, AC-018, AC-019, AC-020, AC-021, AC-036, AC-038, AC-039
- [ ] Add the callout rules — when a `> [!WARNING]` is earned, and that emphasis is not a reason — closes AC-034, AC-035
- [ ] Rewrite `references/readme-template.md` to the same skeleton, guidance-only — closes AC-022, AC-027, AC-037

**M2 — The identity block**
*Demo: generate the correct badge rows and nav row for this very repository, and for one repo with
no test suite — the second produces fewer badges, not invented ones.*
- [ ] Write `references/identity-block.md`: element order, wordmark `<picture>`, footer — closes AC-008, AC-013, AC-020
- [ ] Write the badge admission test and the shields grammar — closes AC-009, AC-010, AC-011, AC-012
- [ ] Write the nav row rule — links only to verified files — closes AC-014

**M3 — Visuals**
*Demo: a mermaid diagram of a real mechanism with every edge labelled, plus either captured
screenshots or a `docs/SCREENSHOTS.md` a stranger could execute.*
- [ ] Write `references/visuals.md` mermaid section — authoring rules, edge labelling, npm/PyPI degradation — closes AC-028, AC-029
- [ ] Write the capture-mechanism picker — the options per project shape, and the custom option — closes AC-043
- [ ] Write the screenshot section — staging, capture, and the shot-list fallback — closes AC-031, AC-032, AC-033
- [ ] Write the SVG wordmark section — typographic only, light and dark, existing assets win — closes AC-013, AC-044
- [ ] Write the never-reference-a-missing-image rule — closes AC-030

**M4 — Evidence**
*Demo: a measured cost table with its disclaimer, and a redacted output block that says it was redacted.*
- [ ] Extend `references/evidence-rules.md` with the measured-numbers class — closes AC-023, AC-026
- [ ] Add the interpretation-sentence and trimming rules — closes AC-024, AC-025
- [ ] Add the redaction rule — closes AC-042

**M5 — The skill orchestrates it**
*Demo: run v2 end-to-end against a real repository and get a README that passes its own Phase 5 checklist.*
- [ ] Rewrite `SKILL.md`: phases, the one rule, the element admission tests — closes AC-005, AC-006, AC-007, AC-021, AC-022
- [ ] Add the write allowlist and the git prohibition as hard rules in `SKILL.md` — closes AC-041, AC-042
- [ ] Add the companion-doc rule — `SETUP.md` and `ARCHITECTURE.md` when the README would otherwise swell, nothing else without an explicit ask — closes AC-015, AC-016
- [ ] Add the Phase 5 checklist and the handover report — closes AC-030, AC-040
- [ ] Link all five reference files by relative path; reference nothing under `docs/` — closes AC-002, AC-003, AC-004
- [ ] Rewrap `SKILL.md` at 100 characters — closes AC-039
- [ ] Rewrite frontmatter `description`; bump `plugin.json` to `2.0.0` — closes AC-001
- [ ] Rewrite this repository's own `README.md` to the v2 skeleton — closes AC-008, AC-026, AC-027 (Constitution Principle 6)

## 11. Assumptions

1. **One skeleton, Winnow-derived, elements admitted by mechanical test** — read from "based the
   winnow one Skeleton include badges, build etc." If wrong and you wanted two tiers: `house-style.md`
   splits in two, `references/` goes to six files, and `SKILL.md` gains a tier-selection step.
2. **`references/` holds exactly the five files in AC-002.** If wrong: the split changes and every
   §6 load-contract row moves.
3. **v2 is `2.0.0`, the `name` is unchanged, the `description` is rewritten.** Constitution standing
   decisions 2 and 3. If wrong: v2 must preserve v1's trigger phrases verbatim and only append.
4. **Companion docs are `SETUP.md` and `ARCHITECTURE.md` only** — read from "docs needed and
   necessary, not like handoff". If wrong: §6's allowlist grows and AC-016 loosens.
5. **The shot-list fallback survives.** You selected real capture and did not select the fallback,
   but capture cannot succeed everywhere, and the alternative to a fallback is a broken image on a
   repo front page. If wrong: AC-032 goes and failed capture becomes silence.
6. **Measured cost and benchmark tables become a named evidence class with a mandatory disclaimer.**
   Decided, not asked — the exemplar carries one and it is the highest-risk claim on the page. If
   wrong: AC-026 goes.
7. **This repository's own README is the worked example; no example README ships in `references/`.**
   If wrong: a sixth reference file, and two examples that will drift apart.
8. **GitHub is the primary render target.** Mermaid and callouts degrade to text elsewhere, which is
   accepted. If wrong: the skeleton needs a no-mermaid variant.

## 12. Open Questions

- **Which repository does M5's end-to-end demo run against?** It needs to be one whose output you
  can verify by eye. You said you would try it later in the day — until then M5's five build tasks
  are unblocked and only its demo waits. — blocks: M5's demo, not its tasks · needed by: M5

**Resolved 2026-08-15**

- ~~Is a typographic SVG wordmark acceptable?~~ Yes. The skill sets the name in a typeface and never
  draws a symbol — AC-044, and the wordmark decision in §3.
- ~~Which screenshot mechanism is available?~~ Not the skill's guess to make. It offers the
  mechanisms that fit the project's shape — a desktop window, a page at a URL, a terminal session —
  plus a custom option where the user writes the instruction, and asks each run. AC-043, and the
  screenshots decision in §3.
