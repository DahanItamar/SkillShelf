# Evidence Rules

What separates a README someone believes from one they skim. Every rule here exists
because the alternative is an adjective.

---

## The test for any sentence

> Could a reader check this without taking my word for it?

If no, it is either evidence waiting to be gathered, or a line to cut.

| Written | Verdict |
| --- | --- |
| "Fast and scalable" | Cut. Means nothing, checkable by nobody. |
| "Saves a guess in ≈0.02 ms" | Keep — a number, measurable, falsifiable. |
| "Secure by design" | Cut. |
| "Passwords hashed with scrypt and a per-user salt; all scoring computed server-side" | Keep — names the mechanism. |
| "Comprehensive test coverage" | Cut. |
| "59 tests, including end-to-end against the real server" | Keep — countable. |
| "Handles concurrent access" | Cut, unless you show it. |
| Two log lines one tick apart, with a sentence explaining what that proves | Keep. This is the strongest form. |

---

## The four kinds of evidence

### 1. Real program output

The most persuasive thing a README can contain. A log excerpt, a console transcript, a
test summary — copied from an actual run, never composed by hand.

````markdown
```
Location: 4 | 07:11:51 | FlightID: 759b58e2 | isArrival: True
Location: 4 | 07:11:56 | FlightID: 57900f80 | isArrival: True
```

Watch the runway do its job: the two arrivals reach station 4 **exactly one tick apart** —
one at a time, enforced by the queue.
````

**The interpretation sentence is not optional.** Raw output is data; output plus "here is
what to notice" is an argument. Without it the reader scrolls past.

Trim for readability — shorten ids, drop irrelevant columns — and say you did (*"IDs
shortened for readability"*). Trimming is honest; inventing is not.

### 2. Request and response

For anything with an API. Show the call and the actual body that came back, including the
failure path — the failure is usually the more interesting one, because it shows a
guarantee being enforced:

````markdown
```bash
# ...and the rejection path — serials are never saved to an unknown employee
$ curl -X POST http://localhost:3000/api/serials \
       -H "Content-Type: application/json" \
       -d '{"employeeId":"0","serials":["SN-88213"]}'
{"error":"Employee \"0\" not found"}
```
````

A comment above each call saying what it demonstrates turns a reference block into a
narrative.

### 3. Numbers you observed

Test count. Dependency count. Line count. A timing you actually measured. Rows in a
dataset. File size.

**Never a number you did not observe.** An invented benchmark is the fastest way to lose a
reader who tries it, and it poisons every other claim on the page.

If a number will age badly (a test count that changes weekly), either accept it will drift
or phrase it so it stays true.

### 4. A worked example from the domain

For anything with rules, walk one real case through them. A table with the input, the
result, and what it demonstrates:

```markdown
| Guess | Result | What we learned |
|---|---|---|
| **שולחן** | ש⬛ ו🟨 ל🟩 ח⬛ ן⬛ | There is a **ו**, but not in second place; **ל** is exactly right |
```

This teaches the domain and demonstrates correctness in one move, and it is the section
readers remember.

---

## Claiming absence

Readers cannot infer what is missing, so absence must be stated — and absence is often the
most interesting thing about a project:

- "**Zero npm dependencies** — no `package-lock`, no `node_modules`"
- "no build step"
- "starts in **mock mode** — no database needed"
- "Works out of the box on an in-memory database — zero setup"
- "no framework, no packages — three files"

Each is checkable in seconds, which is exactly why they are worth writing.

---

## Security claims

Only ever concrete. The mechanism, and where it applies:

| Instead of | Write |
| --- | --- |
| "Secure authentication" | "Passwords hashed with scrypt and a per-user salt; session cookie is `HttpOnly`" |
| "Protected against SQL injection" | "All queries are **parameterized** — no string-built SQL" |
| "Data is safe" | "Inserts run in a **transaction** — all serials save or none do" |
| "Credentials are handled properly" | "`.env` is gitignored so credentials never reach the repo" |

A vague security claim reads as a project that has not thought about it. A specific one
reads as a project that has.

---

## What to do when you cannot gather evidence

Say so. To the user, in your handover — not silently in the README.

- **Cannot run it** (missing credentials, hardware, a paid service): write from the tests.
  They state the guarantees in the author's own words and are the next best source.
- **Cannot screenshot it** (no browser tooling): author the diagrams you *can* — a flow, an
  architecture, a state machine as hand-written SVG in `docs/`. Then write
  `docs/SCREENSHOTS.md` with the shot list. Never reference a PNG that does not exist.
- **Cannot verify a claim the author made**: ask, or leave it out. Do not launder someone
  else's assertion into evidence by restating it more confidently.
