# House Style

The skeleton, the voice, and the formatting. Derived from READMEs that hold up under a stranger's
first thirty seconds — the shape across them is remarkably tight, and the parts that vary are the
parts carrying evidence.

**Scope.** This file covers structure — which sections exist, what admits one, and what goes in
each. The centred header block, the diagrams and images, the evidence, and the sentence-level voice
are each specified in their own file and are not restated here.

---

## The skeleton

```markdown
<div align="center">
  <!-- the identity block: wordmark · pitch · stack line · badges · nav row · hero -->
  <!-- six elements, in that order, specified separately -->
</div>

---

## <The mechanism>            ← mandatory. Named for the thing, never "Overview"

## <Capability>               ← 0–3, each admitted by the test below

## Run it                     ← mandatory

## <Capability>               ← the ones a reader only wants after seeing it run

## Under the hood — briefly   ← mandatory, always last

> A blockquote pointing at the docs that carry the depth this file deliberately does not.

---

<div align="center">

Built by <a href="https://github.com/USERNAME">Author Name</a> · <a href="LICENSE">MIT</a> · © YEAR

</div>
```

**Four fixed points, and free slots between them.** The identity block opens, the mechanism section
comes first, `Under the hood — briefly` comes last, and the footer closes. Everything else is a
capability section that earned its place, and where it sits is decided by one question: *does the
reader need to have seen this thing run before this section means anything?* If yes, it goes after
`Run it`. If no, before.

The header block and the footer are **centred**; everything between them is left-aligned. That
contrast is what makes the page read as composed rather than dumped.

---

## The mechanism section

The one that carries the README. If a reader reads a single section, it is this one, and they
should finish it able to explain the mechanism to someone else.

**Named for the thing it explains.** *The evidence trail* · *The simulation* · *How you play* ·
*Why deduplication is the whole product*. Never `Overview`, `Introduction`, or `About` — those name
the document rather than the subject, and a reader who wanted a document would not be here.

Exactly one section does this job. Two mechanism sections means neither is *the* interesting thing,
and the second one is a capability section wearing the wrong name.

What goes in it:

- **The mechanism itself**, in the reader's terms. Prose when it is a mechanism; a table when it is
  an enumeration — stations, states, roles, tiers, what each colour means.
- **A diagram**, where the mechanism has branching or sequence.
- **Real output**, followed by one sentence naming what to notice.

---

## The admission test

A capability section is not admitted because it describes something the project does. It is
admitted because it **carries** something. One question, asked of every proposed `##` section
between the mechanism and `Under the hood`:

> Does this section contain at least one of the five?

| Admissible | What it proves |
| --- | --- |
| A **diagram** | The mechanism has a shape, and here it is |
| A **table** | The thing is an enumeration, and here are all of its members |
| **Real program output** | It runs, and this is what it said |
| **A measured number** | Someone counted, and here is the count |
| **An image** | It exists on a screen and this is what the screen looks like |

Nothing else counts. Not a well-written paragraph, not a list of sub-features, not a claim that the
approach is unusual. Those are the raw material of a section, not a section.

**A section that carries none of the five is demoted to a bullet** in `Under the hood — briefly`.
It is not padded until it looks like a section, and it is not deleted — the information is usually
worth one line. It is worth one line.

````markdown
<!-- Fails the test: three sentences, no artifact. -->
## Caching

The application caches responses to avoid redundant work. The cache is invalidated when the
underlying data changes, keeping memory use predictable even under sustained load.

<!-- Admitted, because the number is real and was observed. -->
## Caching

Responses are cached until the row they read changes. On the 48-document corpus this cut model
calls from 97 to 8 — the other 89 were re-reads of documents already in the ledger.

<!-- Or, if there is no such number: demoted, and honest. -->
- **Caching** — responses are held until the row they read changes, so a re-read costs nothing.
````

The test exists because "include it if it earns its place" is exactly the judgement that resolves
toward *yes* on every section, and a README where every section was admitted is the padded README
this style exists to prevent.

---

## Run it

The shortest honest path from clone to running. Requirements as **one sentence**, then the commands.

````markdown
Requires **Node 22+**. No C++ toolchain — `better-sqlite3` ships prebuilt binaries.

```bash
./setup.sh      # once — dependencies and models
./dev.sh        # run with hot reload    → http://localhost:5173
```
````

Inline comments carry the ports and URLs; a reader scanning for "where does it appear" finds it
without reading prose. **Always state the zero-setup story if there is one** — *"needs no API key"*,
*"runs on an in-memory database"*, *"starts in mock mode"*. A reader deciding whether to try
something is asking what it will cost them, and *nothing* is the best answer available.

A command table earns its place past three commands:

```markdown
| Command | |
|---|---|
| `npm test` | 321 tests across 22 suites, about a second |
```

The second column header is deliberately empty — the commands label themselves.

---

## Under the hood — briefly

**At most six bullets**, each opening with a **bold lead-in** naming the concern, then one or two
sentences. Architecture, data, security, platform, testing — compressed to the one detail per
concern that a reader would not have guessed.

```markdown
- **The renderer holds no capability.** It renders text scraped from the open internet, so it has
  no Node, no filesystem, no network, and a CSP of `connect-src 'self'`.
- **One runtime dependency**, and that is the list. The S3 client is 122 lines of `node:crypto`
  signing SigV4, checked against AWS's own published test vector.
```

The word *briefly* in the heading is a promise to the reader. Six bullets keeps it; nine breaks it,
and a broken promise in the last section is the one they leave on.

This section is also where a capability that failed the admission test lands — demoted to a bullet
rather than padded into a heading.

---

## Callouts

GitHub renders five alert types. This style uses **two**:

```markdown
> [!WARNING]
> For the trap — something that will cost the reader real time.

> [!IMPORTANT]
> For the constraint they must carry away — a liability disclaimer, a guarantee with a hard edge.
```

`[!NOTE]`, `[!TIP]` and `[!CAUTION]` are not used. Three of five is already more distinction than
a reader tracks, and a tip is a sentence that belongs in the prose that needed it.

**A callout is admitted by one condition: a reader is likely to hit something that costs them real
time, and the symptom will not tell them what it was.** That is the whole test. The cost is the
misdiagnosis, not the problem — a failure that announces itself needs no callout.

Every callout names **the symptom and the fix**, in that order. The symptom first, because that is
what the reader arrives holding:

```markdown
> [!WARNING]
> **If the app starts and nothing happens, check `ELECTRON_RUN_AS_NODE`.** VS Code sets it in the
> terminals it spawns, and any Electron binary that inherits it runs as plain Node: it exits
> instantly, prints nothing, and opens no window — indistinguishable from a crash. Every launcher
> in this repo clears it first. If you invoke the binary yourself, clear it too.
```

A reader who has just watched nothing happen finds that in one scan, and the hour they were about
to spend bisecting their install is returned to them. That is the only thing a callout is for.

**Never a callout for emphasis.** Not to make a good sentence louder, not to flag the feature the
author is proudest of, not to open a section with a summary of itself. A README that shouts three
times has taught the reader to skip the boxes, and the fourth one — the real warning — goes with
them. If a sentence matters, bold a phrase in it and leave it in the prose.

Two callouts is normal. Four means at least two are emphasis wearing a warning's clothes.

---

## The footer

Identical every time. It is the one piece of pure convention in the document.

```markdown
<div align="center">

Built by <a href="https://github.com/USERNAME">Author Name</a> · <a href="LICENSE">MIT</a> · © YEAR

</div>
```

Three facts, centred, separated by middots: **who built it**, **the licence** — linked to the file,
so the claim is checkable in one click — and **the year**. Nothing else. A footer that thanks
contributors on a solo project, or links a roadmap that does not exist, undoes the credibility the
rest of the page just earned.
