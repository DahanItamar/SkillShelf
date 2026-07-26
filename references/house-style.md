# House Style

The skeleton, the voice, and the formatting. Derived from READMEs that work: the common
shape across them is remarkably tight — five `##` sections, 80–110 lines, and evidence
instead of adjectives.

---

## The skeleton

```markdown
<div align="center">

# Project Name

**One bold sentence: what this is, and the thing about it that is actually interesting.**

Stack line — plain prose, with the notable constraint in bold.

<img src="docs/hero.png" alt="Descriptive alt text naming what is visible" width="830">

</div>

---

## The <Domain Noun>          ← how the core thing works

## <Capability>               ← the notable parts, one section each

## Run It                     ← shortest path from clone to running

## Under the Hood — Briefly   ← bullets, bold lead-in each

> A blockquote for a caveat, a history note, or what is deliberately absent.

---

<div align="center">

Built by <a href="https://github.com/USERNAME">Author Name</a> · © YEAR

</div>
```

The header block and the footer are **centred**; everything between them is left-aligned.
That contrast is what makes the page feel composed rather than dumped.

---

## Section by section

### The header block

Three lines, in this order, and nothing else:

1. `# Project Name`
2. **The pitch** — one bold sentence. Names what it is and why it is not ordinary. Not a
   category ("a booking app") but a claim ("a live airport — arrivals and departures
   competing for one runway and two gates in real time").
3. **The stack line** — plain prose, one line, with the notable constraint bolded:
   *"Backend: ASP.NET Core 8, EF Core, an event-driven state machine. Frontend: vanilla
   JS, **zero dependencies, no build step**."*

Then the hero image at `width="830"`, then `</div>`, then `---`.

If there is no hero image, the block still works — do not substitute a badge row.

### The domain section

Named for the thing, not for the document: **The Simulation**, **The Flow**, **How you
play**, **The idea**. Never "Overview", "Introduction", or "About".

This is where the one interesting thing gets explained, in the reader's terms. Use a table
when the content is an enumeration (stations, states, roles, colour meanings) and prose
when it is a mechanism.

Follow it with a **Real Example** — actual output, then a sentence interpreting it. The
interpretation is what turns a code block into an argument:

> Watch the runway do its job: the two arrivals reach station 4 **exactly one tick apart**
> (07:11:51 → 07:11:56) — one at a time, enforced by the queue.

### The capability sections

One `##` per genuinely distinct capability, two or three at most. Each earns its place by
having something concrete in it — an example, a table, a piece of output, an image. A
section that is three sentences of adjectives should be a bullet in "Under the Hood".

Images belong here, paired at `width="420"` or single at `width="830"`.

### Run It

The shortest honest path. Requirements as one sentence, then a fenced block:

````markdown
The only requirement: [.NET SDK 8](https://dotnet.microsoft.com/download/dotnet/8.0).

```bash
cd AirportAPI
dotnet run          # tower: http://localhost:5055 · swagger: /swagger
```

Works out of the box on an in-memory database — zero setup.
````

Inline comments in the code block carry the URLs and ports. **Always state the
zero-setup story** if there is one — a reader deciding whether to try something is asking
"what will this cost me", and "nothing, it runs on a mock" is the best possible answer.

A command table is worth adding when there are more than three scripts:

```markdown
| Command | |
|---|---|
| `npm start` | Run the server |
| `npm test` | 59 tests, including end-to-end against the real server |
```

The second column header is deliberately empty — the commands are self-labelling.

### Under the Hood — Briefly

Bullets, each opening with a **bold lead-in** naming the concern, then one or two
sentences. This is where architecture, data, security and frontend choices go, compressed:

```markdown
- **Server** — Express, ~70 lines: static hosting plus the three endpoints, with input
  cleaning and employee validation before anything touches the database.
- **DB layer** — one abstraction over `mssql` / `mysql2` / `pg` with lazy driver loading,
  connection pooling, and a mock implementation for zero-setup testing.
```

Six bullets is plenty. The word "Briefly" in the heading is a promise — keep it.

### The blockquote

One `>` block, near the end, for exactly one of:

- what is deliberately not in the repo, and why
- a history note ("built as a learning exercise in 2023; updated in 2026 to …")
- a limitation worth stating before someone discovers it

Optional. Do not manufacture one.

---

## Voice

**Concrete over abstract.** Name the actual thing: not "efficient queueing" but "the plane
waits in a queue and is released by a `QueueChanged` event the moment the spot frees up".

**Bold one phrase per paragraph, at most.** It should be the phrase a skimmer needs. Bold
everywhere is bold nowhere.

**Em dashes for the aside that carries the point.** They are the rhythm of this voice —
used to attach the consequence to the claim.

**Second person for instructions, third for description.** "Copy `.env.example` to `.env`"
— not "the user should copy".

**State constraints as features.** "One dependency." "No build step." "Zero setup."
"Answers encrypted at rest." A reader cannot infer absence, so absence must be claimed.

**No hedging.** Not "should work on most systems" — say which systems.

---

## Formatting conventions

| Element | Convention |
| --- | --- |
| Hero image | `<img src="docs/x.png" alt="…" width="830">` inside the centred block |
| Paired images | Two `<img>` on one line, `width="420"` each |
| Inline image | `width="300"` when it sits beside prose |
| Alt text | Describes what is *visible*, not the filename. It is read aloud. |
| Table, enumerated | `|:-:|` centre the id/symbol column, left-align the rest |
| Table, two-column | Empty second header when the first column is self-labelling |
| Code fence | Always language-tagged: ```bash, ```sql, ```json |
| Links to files | Relative and clickable: `[`config/database.js`](config/database.js)` |
| Footer | Identical every time, with the current year |

Line-wrap prose at roughly 100 characters. GitHub reflows it, but a wrapped source file is
reviewable in a diff and an unwrapped one is not.
