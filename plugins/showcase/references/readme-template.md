# README Template

The structure to fill in.

**Everything in angle brackets is an instruction to you, not content to copy.** Not one `<…>`
survives into the file you write — no `<Project Name>`, no `TODO`, no `Coming soon`, no `Lorem`, no
`your-project-name`. A placeholder that ships is the single loudest signal a README can send that
nobody finished it, and a reader who finds one stops trusting every number on the page.

Drop a section that genuinely does not apply. Never reorder them, and never keep a heading you
could not fill.

---

````markdown
<div align="center">

<Wordmark as a picture element with light and dark sources, or a plain `# Project Name` if there
is no wordmark. Never both.>

**<The pitch. One or two bold sentences: what this is, and the thing about it that is not
ordinary. Not a category — "a booking app" — but a claim: "a live airport, arrivals and departures
competing for one runway in real time". Write this line last, once you know what the interesting
thing is. It is the hardest sentence in the document and the one most readers will read.>**

<The stack line. Plain prose, one or two lines, naming what it is built on. The notable
constraint in bold — "**one runtime dependency, no server, no account**", "**zero dependencies,
no build step**".>

<Badge row one: proof. Build status, test count, version, licence.>
<Badge row two: stack, each badge carrying a version or a count.>

<Nav row: middot-separated links to docs that exist. Omit the row entirely if none do.>

<Hero image. Alt text describes what is visible and what the reader should notice in it.>

</div>

---

## <The mechanism>

<Named for the thing, never "Overview", "Introduction" or "About". The Simulation · The evidence
trail · How you play · Why deduplication is the whole product.

This section carries the README. Explain the one interesting mechanism in the reader's terms, well
enough that they could describe it to someone else. Prose when it is a mechanism; a table when it
is an enumeration — stations, states, roles, tiers, what each colour means.

Where the mechanism has branching or sequence, put the diagram here.>

| <Thing> | <Role> | <Constraint> |
|:-:|---|:-:|
| | | |

### <Real example>

<Actual output from an actual run — a log excerpt, a transcript, a request and the body that came
back. Say so if you trimmed it or shortened identifiers.>

```text
<real output, copied, never composed>
```

<Then one sentence naming what the reader should notice and why it matters. This sentence is what
turns a code block into an argument. Without it the reader scrolls past.>

## <Capability>

<One section per genuinely distinct capability, three at most. Each must carry a diagram, a table,
real output, a measured number, or an image — a section carrying none of those is demoted to a
bullet in "Under the hood" instead of being padded until it looks like a section.

Place it before "Run it" if it stands on its own; after, if the reader needs to have seen the thing
running for it to mean anything.>

<Paired images, both 415 wide, or a single one at 830.>

## Run it

<Requirements in one sentence. Then the shortest honest path from clone to running, with ports and
URLs as inline comments.>

```bash
<install>
<run>          # http://localhost:<port>
```

<The zero-setup story, if there is one: "needs no API key", "runs on an in-memory database",
"starts in mock mode". A reader deciding whether to try this is asking what it will cost them.>

| Command | |
|---|---|
| `<cmd>` | <what it does, with a real number in it where there is one> |

<A warning callout here if — and only if — there is a trap that will cost the reader real time and
the symptom will not tell them what it was. Name the symptom first, then the fix.>

## Under the hood — briefly

<At most six bullets. Each opens with a bold lead-in naming the concern, then one or two sentences
carrying the detail a reader would not have guessed. Architecture, data, security, platform,
testing. "Briefly" in the heading is a promise to the reader; six bullets keeps it.

Security bullets name mechanisms and nothing else: "parameterized queries", "scrypt with a
per-user salt", "`HttpOnly` session cookie". Never "secure by design".>

- **<Concern>** — <what it is, and the one detail worth knowing>
- **<Absence>** — <what the project deliberately does not do or need, stated because a reader
  cannot infer it>

> <One blockquote, optional: where the depth lives that this file deliberately does not carry, or
> a limitation worth stating before someone discovers it themselves.>

---

<div align="center">

Built by <a href="https://github.com/<owner>"><Owner></a> · <a href="LICENSE"><detected licence></a> · © <year>

</div>
<!-- Omit this whole footer if the licence or owner was not detected. -->
````

---

## The `.showcase.md` file

Optional, in the repository root. Plain `key: value` lines; `sections` is a comma-separated list.
It never overrides the run-safety gate or the evidence rules.

```text
footer: omit
owner: Example Org
licence: MIT
tone: plain
sections: Run it, Under the hood
badge_colour: 0F766E
```

For an agency or team: commit a shared `.showcase.md` per client repo, or keep one preset in a team
template and copy it in. Set `footer: omit`, or `owner:` to the client or agency name, per repo.
The file may hold no secrets, contact emails, or client names the client has not agreed to publish.
`.showcase.md` cannot relax the run-safety gate.

## Filling it in

**Write the pitch last.** It has to say what the thing is *and* why it is not ordinary, in one
sentence, to someone who does not know the domain. You cannot write it until the rest of the
document has told you what the interesting thing was.

**The mechanism section is the one that carries the file.** If a reader reads one section, it is
that one. Everything else can be skimmed; that one has to land.

**Sections are earned, not filled.** Three strong sections beat five with two padded ones. A
capability with nothing concrete behind it becomes a bullet, and the README gets shorter — which
is the correct outcome, not a failure to reach a length.

**Length follows the project.** A utility with one clear function is forty lines and three
sections. An application with a domain worth explaining is a hundred. Padding a small project into
a long README reads as insecurity, and a reader who scrolls three screens to find the install
command leaves before they get there.

---

## Internal service skeleton

Use this instead of the skeleton above when Phase 0 finds a team or internal service: private repo,
on-call rotation, no public audience. Every line is filled from something observed, or omitted.

```markdown
# <service>

<One sentence: what it does and who depends on it.>

## Owner
<Team, and the contact or channel. From CODEOWNERS or the manifest, else ask.>

## Run it
<Commands from clone to running, as in the main skeleton.>

## Health check
<The real command and its real output, for example a curl of the health endpoint.>

## Dependencies
<Datastores, queues and upstream services the repo names. Observed in config, not guessed.>

## On-call and runbook
<Alert source, runbook link, escalation contact. Omit any that does not exist.>
```
