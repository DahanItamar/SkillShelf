# README Template

The structure to fill in. Guidance under each heading is instruction to you, not content
to copy. Drop sections that genuinely do not apply — never reorder them, and never leave a
heading with nothing under it.

---

````markdown
<div align="center">

# <Project Name>

**<One sentence: what this is, and the thing about it that is actually interesting.>**

<Stack line, plain prose, with the notable constraint in bold — "**zero dependencies, no
build step**", "one dependency", "pure Node.js".>

<img src="docs/<hero>.png" alt="<What is visible: the screen, the state it is in, what a
reader should notice>" width="830">

</div>

---

## <The Domain Noun>

<Named for the thing, never "Overview" or "About": The Simulation · The Flow · How you
play · The idea.

Explain the one interesting mechanism in the reader's terms. A table when the content is
an enumeration (stations, states, roles, colour meanings); prose when it is a mechanism.>

| <Thing> | <Role> | <Constraint> |
|:-:|---|:-:|
| | | |

### Real Example

<Actual output from a real run — a log excerpt, a transcript, a worked case. Say if you
trimmed it: "IDs shortened for readability".>

```
<real output>
```

<Then one sentence interpreting it. This is the part that turns data into an argument —
name the thing to notice and why it matters. Not optional.>

## <Capability>

<One section per genuinely distinct capability, two or three at most. Each must carry
something concrete: an example, a table, output, or an image. A section that is three
sentences of adjectives belongs in Under the Hood as a bullet.>

<img src="docs/<a>.png" alt="…" width="420"> <img src="docs/<b>.png" alt="…" width="420">

## Run It

<Requirements as one sentence. Then the shortest honest path from clone to running, with
URLs and ports as inline comments.>

```bash
<install>
<run>          # http://localhost:<port>
```

<The zero-setup story, if there is one — "starts in mock mode, no database needed",
"works out of the box on an in-memory database". A reader deciding whether to try this is
asking what it will cost them.>

| Command | |
|---|---|
| `<cmd>` | <what it does> |

## Under the Hood — Briefly

<Six bullets at most. Each opens with a bold lead-in naming the concern, then one or two
sentences. Architecture, data, security, frontend — compressed. "Briefly" is a promise.>

- **<Concern>** — <what it is, and the one detail worth knowing>
- **<Data>** — <store, and the interesting property>
- **<Security>** — <concrete mechanisms only: scrypt with salt, parameterized queries,
  HttpOnly cookie. Never "secure by design".>

> <One blockquote, optional: what is deliberately not in the repo and why, a history note,
> or a limitation worth stating before someone discovers it.>

---

<div align="center">

Built by <a href="https://github.com/<username>"><Author Name></a> · © <year>

</div>
````

---

## Notes on filling it in

**The pitch is the hardest line and worth the time.** It has to say what the thing is *and*
why it is not ordinary, in one sentence, to someone who does not know the domain. Write it
last, after you know what the interesting thing is.

**The domain section carries the README.** If a reader only reads one section, it is this
one. It should leave them understanding the mechanism well enough to explain it to someone
else.

**Sections are earned, not filled.** Three strong sections beat five with two padded ones.
If a capability has nothing concrete behind it, demote it to a bullet.

**Every image needs alt text describing what is visible** — it is read aloud, and it is
what shows when the image fails to load.

**The footer is identical every time.** It is the one piece of pure convention here.
