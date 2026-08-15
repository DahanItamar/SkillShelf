# The Identity Block

The centred header a README opens with. It is the thirty-second decision: a stranger reads this
much and either scrolls or leaves, so every element in it either carries a fact or is cut.

**Scope.** This file covers the header block only. The body sections beneath it, the diagrams and
images that fill them, and the sentence-level voice are each specified separately.

---

## The six elements, in this order

```markdown
<div align="center">

1. Wordmark, or `# Project Name` — never both
2. The pitch — one or two bold sentences
3. The stack line — plain prose, the notable constraint in bold
4. Badges — the proof row, then the stack row
5. The nav row — middot-separated links to docs that exist
6. The hero image

</div>

---
```

The order is not stylistic. It answers a reader's questions in the sequence they ask them: *what is
this called* → *what is it, and why is it not ordinary* → *what is it built on* → *is it real* →
*where do I go next* → *what does it look like*. Moving any element up the list means answering a
question the reader has not asked yet.

**Elements are droppable, not reorderable.** A project with no wordmark uses `# Project Name`; one
with no docs omits the nav row; one with no interface omits the hero. What remains keeps its order.

## 1. The wordmark

Where light and dark variants exist, reference them through a `<picture>` element so the mark flips
with the reader's theme:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/winnow-dark.png">
  <img src="docs/brand/winnow-light.png" alt="Winnow" width="420">
</picture>
```

Three things make this correct. The `<source>` carries the **dark** variant, because the `<img>`
fallback is what renders when the browser understands neither the element nor the query — and light
is the safer thing to be caught rendering. The `<img>` is the light variant and carries the
`alt` and the `width`. And `width="420"` is roughly half the content column, which is the size at
which a wordmark reads as identity rather than as a banner.

Where only one variant exists, use a plain `<img>` — a `<picture>` with one source is a lie about
the asset. Where none exists, `# Project Name` is a perfectly good header and always has been.

## 2. The pitch

One or two bold sentences: what this is, and the thing about it that is not ordinary. Not a
category — *"a booking app"* — but a claim:

> **Winnow reads what developers complain about in public and turns it into project ideas that
> carry their evidence — every idea quoting the threads it came from, with a link back.**

Write it last, once the rest of the README has told you what the interesting thing was.

## 3. The stack line

Plain prose, one or two lines, with the notable constraint in bold. The constraint is the part
worth reading — a stack list is available from the language tab on the repo page, and an absence
is not:

> A local-first Electron desktop app: React 19, TypeScript strict, one SQLite file.
> **One runtime dependency, no server, no account, and no API key on the default provider.**

## 4. Badges

### The admission test

> **A badge is admitted only if it states a fact the reader can check.**

Four kinds qualify, and nothing else does:

| Kind | Example | Checkable because |
| --- | --- | --- |
| **Status** | `CI passing` | The workflow run is one click away |
| **Version** | `version 0.6.13`, `React 19` | It either matches the manifest or it does not |
| **Count** | `tests 321 passing`, `runtime deps 1`, `SQLite 41 migrations` | Someone counted, and the reader can count again |
| **Licence** | `licence MIT` | Links to the file that proves it |

**A badge carrying only a technology name is omitted.** `TypeScript`, `React`, `Powered by Node` —
these state nothing a reader could disagree with, which is another way of saying they state
nothing. The same badge with a version attached is admitted, because `React 19` is a claim about
this repository that could be wrong.

This is the rule that replaced a flat ban on badge rows. The ban was a proxy for *badges usually
carry nothing*; the proxy failed on `runtime deps 1`, which carries the single most interesting
fact about the project. Test the badge, not the row.

### Every count is one you observed

A number in a badge is held to the same standard as a number in the prose: **it is a count you
took in this repository**, not an estimate, not a figure from a similar project, and not a round
number that looks plausible.

- `tests 321 passing` — because the suite was run and reported 321
- `runtime deps 1` — because `dependencies` in the manifest has one key
- `41 migrations` — because the migrations directory was listed and counted

A count that changes with every commit — a test total on an actively growing suite — either comes
from a CI-generated badge that regenerates itself, or it is omitted. A confidently wrong number on
the front page discredits every other number on the page, and the front page is where a reader
decides whether to believe any of them.

Where a project has no test suite, there is no test badge. The absence is stated in prose instead,
where it can be honest about itself.

### The grammar

One badge vocabulary, so the admission test stays checkable by reading the URL:

```text
https://img.shields.io/badge/<label>-<message>-<hex>?style=flat-square[&logo=<slug>&logoColor=white]
                              │        │
                              │        └─ the fact: a status, a version, a count, or a licence
                              └─ the fact's name — never a bare technology name
```

- **`style=flat-square` on every badge.** Mixed styles in one row read as assembled rather than
  designed, and the reader notices the seam before they read the facts.
- **Two colours, used consistently.** One accent for the facts worth stopping on — the test count,
  the dependency count — and one neutral for everything else. A row where every badge is a
  different colour has no emphasis, which is the same as a row with no emphasis.
- **Alt text restates the fact in words**, because a badge is an image and images fail:
  `alt="321 tests passing across 22 suites"`, never `alt="tests badge"`.
- **Status badges link.** A CI badge whose image is a live status but which links nowhere asks the
  reader to trust a picture. Wrap it in an `<a>` pointing at the workflow.
- **The licence badge links to `LICENSE`**, for the same reason.

### The rows

**At most ten badges, across at most two rows.**

| Row | Carries | Typical |
| --- | --- | --- |
| **Proof** | Is this real, and is it maintained | CI status · test count · version · licence |
| **Stack** | What it is built on, each with a version or a count | `TypeScript strict` · `Electron 35` · `React 19` · `SQLite 41 migrations` · `runtime deps 1` |

The proof row comes first, because *is this real* precedes *what is it made of*. A project that
fills only the proof row has four badges and a clean header, and that is a finished header — the
second row is not a slot waiting to be filled.

Ten is a ceiling reached by projects with genuinely that many checkable facts, not a target. Past
ten the row wraps on a narrow window, the badges stop being scannable, and the wall this rule
replaced comes back through the door the rule opened.

## 5. The nav row

Middot-separated links to the documents that carry the depth the README deliberately does not:

```html
<a href="docs/SETUP.md">Setup</a> ·
<a href="docs/ARCHITECTURE.md">Architecture</a> ·
<a href="docs/CLI.md">CLI</a>
```

**Every target is opened and confirmed to exist before the link is written.** Not inferred from a
convention, not assumed because the project looks like the kind that would have one, and not
written in the expectation that the file is coming. A nav row is the first thing a reader clicks,
and a 404 on the first click is a stronger statement about the project than anything the README
goes on to say.

**Where no such document exists, the row is omitted entirely.** Not replaced with a placeholder,
not filled with links to headings inside the README itself, not padded with a link to the licence.
A header block without a nav row is a normal header block.

One-word labels, and the label names the destination rather than describing it: *Setup*,
*Architecture*, *CLI*, *Spec*. Four or five is comfortable; past six the row is competing with the
badge rows directly above it for the same glance.

**Reader-facing documents only.** A nav row points at what a visitor needs — how to set it up, how
it works, what the commands are. Maintainer process — handoff notes, changelogs, contribution
guides — is not what a stranger opened the repository for, and putting it in the first screen
spends the reader's most valuable attention on the least valuable document.

## 6. The hero image

One image, `width="830"`, showing the product in its most characteristic state — not a logo, not
an architecture diagram, not a terminal showing an install completing. The state that makes someone
understand what the thing is.

Alt text describes what is visible and what the reader should notice in it, because it is read
aloud and it is what renders when the image fails:

```html
<img src="docs/assets/screens/evidence.png" width="830"
     alt="An idea open in Winnow, showing the two harvested complaints it was built from, each
          with a verbatim quote and a link to the source thread">
```

Where no such image exists, the block ends after the nav row. It still works — a header with a
pitch, a stack line and four honest badges is a good header. An invented or borrowed image is not
an image, and a referenced file that does not exist renders as a broken icon on the front page.
