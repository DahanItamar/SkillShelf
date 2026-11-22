# Prose Style

How the sentences and the lines are written. Structure — which sections exist and what admits one —
is specified separately; this file assumes the skeleton is already decided and covers what fills it.

---

## Voice

**Concrete over abstract.** Name the actual thing. Not *"efficient queueing"* but *"the plane waits
in a queue and is released by a `QueueChanged` event the moment the spot frees up"*. The second one
is longer and it is the only one that tells a reader anything.

**Second person for instructions, third for description.** *"Copy `.env.example` to `.env`"* — not
*"the user should copy"*. A reader following setup steps is being addressed; a reader learning how
the thing works is being told about a system.

**Em dashes for the aside that carries the point.** They are the rhythm of this voice — used to
attach the consequence to the claim, in the same breath, so the reader never has to hold a fact
and wait to find out why it matters.

**No hedging.** Not *"should work on most systems"* — say which systems. Not *"generally fast"* —
give the number or cut the sentence. Hedging is what a writer does when they have not checked, and
a reader can hear it.

## Claim the absence

**A reader cannot infer what is missing.** They can see every dependency you have; they can see no
dependency you avoided. So the absences — which are frequently the most interesting thing about a
project — have to be *stated*, or they are invisible.

Every README says what the project does. This one also says what it deliberately does not do, and
what it deliberately does not need:

- **Zero npm dependencies** — no `package-lock`, no `node_modules`
- **No build step** — the browser loads the source
- **No API key on the default provider**, and no outbound request to any AI service
- **Starts in mock mode** — no database needed to try it
- **Unsigned, deliberately no auto-update** — an unsigned update channel is remote code execution
- **No account, no server, no telemetry**

Each is checkable in seconds, which is exactly why it is worth writing. And each answers the
question a reader is actually holding — *what will this cost me to try* — with the best answer
available, which is *nothing*.

Absence covers scope too, not just dependencies. A project that deliberately does not do the
obvious adjacent thing should say so once, plainly, near the end: it converts the reader's *"this
is missing"* into *"this was decided"*, and those are very different judgements of the same repo.

## Formatting conventions

| Element | Convention |
| --- | --- |
| Heading | Sentence case. Names the subject, never the document |
| Heading, emoji | Never. See below |
| Hero image | `<img src="…" alt="…" width="830">`, inside the centred block |
| Paired images | Two `<img>` on one line, `width="415"` each |
| Inline image | `width="300"` when it sits beside prose |
| Alt text | What is *visible*, not the filename. It is read aloud, and it is what shows when the image 404s |
| Code fence | Always language-tagged — ` ```bash `, ` ```json `, ` ```text `. An untagged fence loses highlighting and tells a reader nothing about what they are looking at |
| Table, enumerated | Centre the id or symbol column with `|:-:|`, left-align the rest |
| Table, two-column | Empty second header when the first column labels itself |
| Numeric column | Right-align with `|---:|` so the digits line up and a reader can compare them |
| Link to a file in the repo | Relative and clickable — `[`docs/SETUP.md`](docs/SETUP.md)` |
| Emphasis | Bold the phrase a skimmer needs. At most one per paragraph |
| Separator between facts | A middot with spaces — `Setup · Architecture · CLI` |

## No emoji in headings

Not one, not as a bullet marker, not as a section prefix. Three reasons, in order of how much they
cost:

1. **They date.** An emoji set reads as the year it was written, and a README's job is to look
   current for as long as the code is.
2. **They are read aloud.** A screen reader announces `🚀 Getting started` as *"rocket getting
   started"*, and every heading in the document acquires a noise word.
3. **They replace the work.** `⚡ Fast` is the adjective this style exists to eliminate, with
   decoration where the number should be.

A heading is a noun phrase naming its subject. That is the whole design.

## No heading without content

Never write a heading and leave it empty, and never write one whose body is a promise —
`Coming soon`, `TODO`, `Documentation forthcoming`, a placeholder paragraph describing what will
eventually go there.

An empty section is worse than a missing one, because a missing section costs nothing and an empty
one tells the reader the document was abandoned mid-write. Every heading in the file is a claim
that something worth reading sits under it; one broken claim is enough for a reader to stop
believing the rest.

**If a section has nothing in it, cut the heading.** The content can arrive with the heading later.

## Wrap at 100

Prose wraps at 100 characters. **Tables, fenced code blocks and URLs are exempt** — wrapping any of
the three damages it, and a table broken across lines stops being a table at all.

GitHub reflows prose regardless, so the wrap buys nothing for the reader. It buys everything for
review: a wrapped file produces a diff where a changed sentence is a changed line, and an unwrapped
one produces a diff where changing a comma repaints the paragraph. The README is a file that gets
edited for years, and every one of those edits is easier to see when the lines hold still.
