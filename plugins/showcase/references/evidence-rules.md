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

## The five kinds of evidence

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

### 5. A measured cost or benchmark

The strongest number a README can carry, and the most dangerous. It is strong because nobody
guesses their way to `$0.120 against $0.173`; it is dangerous because a reader may spend money
on the strength of it.

Three things travel with every such table, and none is optional:

1. **The date it was measured**, because provider pricing and model behaviour change without
   notice and a figure with no date is a figure with no shelf life.
2. **The conditions** — what was run, how much of it, against which provider or machine. "48
   documents read, ideas written and judged" is a condition; "a typical run" is not.
3. **A disclaimer** that the figures are indicative and that no liability is accepted.

```markdown
| Stage | Model | Calls | Input | Output | Cost |
|---|---|---:|---:|---:|---:|
| Reading | Cheap | 8 | 31,591 | 2,216 | $0.011 |
| **Total — split models** | | **10** | **44,986** | **14,038** | **$0.120** |
| Same run — single model | | | | | $0.173 |

> [!WARNING]
> **Cost figures are indicative only. No liability is accepted.** Measured on 2026-08-12
> against the provider's published rates; pricing, model behaviour, reasoning-token volume and
> retry counts all change without notice.
```

A measurement repeated on a second corpus and landing in the same place is worth saying so —
*"82% again"* — because a number measured twice is a different claim from a number measured once.

---

## The test every number must pass

> **Did I observe this, in this repository, in a way I could repeat right now?**

If no, the number is not written. There is no third option — no estimate, no figure carried over
from a similar project, no round number that looks plausible, no count inferred from the shape of
a directory nobody listed.

| Number | Where it must come from |
| --- | --- |
| Test count | The suite was run and reported it |
| Dependency count | The manifest's `dependencies` was read and counted |
| Line or file count | The files were listed and counted |
| A timing | N runs with a range, or stated as `one run on <machine>` |
| A cost | The provider's own usage record, not a rate card multiplied by a guess |

One invented number discredits every other number on the page, because a reader who catches it has
no way to tell which of the rest were also invented — and the cheapest assumption is that they all
were. This is the rule with the least room in it, and it is the one that makes the others worth
anything.

**A number that ages badly** — a test count on a suite growing weekly — is either phrased so it
stays true, generated by CI, or left out.

---

## Two obligations attached to real output

### The interpretation sentence

**Raw output is data. Output plus one sentence naming what to notice is an argument.** The sentence
is required, not encouraged:

> Watch the runway do its job: the two arrivals reach station 4 **exactly one tick apart**
> (07:11:51 → 07:11:56) — one at a time, enforced by the queue.

Without it the reader scrolls past a block of text they have no reason to parse, and the strongest
evidence in the document does nothing. Name the thing to notice, and say what it proves.

### Say when you trimmed

Shortening ids, dropping columns, and cutting repeated lines are all legitimate — output pasted raw
is often unreadable. **Saying so is what keeps it honest:** *"IDs shortened for readability"*,
*"middle 40 lines cut"*.

Trimming is editing. Silent trimming is indistinguishable from composing, and a reader who runs the
command and gets something that does not match has caught the README lying about something small,
which costs exactly as much as lying about something large.

---

## Redaction

Real output frequently contains things that must not be published: an API key in a config dump, a
bearer token in a request header, a connection string, a customer's name or email in a record.

**Redact, and mark the redaction.** Both halves matter:

```text
$ curl -H "Authorization: Bearer sk-ant-…REDACTED" https://api.example.com/v1/runs
{"id":"run_8812","owner":"[redacted]","status":"complete","documents":48}
```

An unmarked redaction is a fabricated line — the reader believes they are seeing what came back,
and they are seeing something edited. A marked one costs a word and stays true.

If output cannot be shown without redacting so much that it no longer demonstrates anything, it is
not evidence. Find a different path through the system that produces publishable output, or cut the
claim. Never publish the secret to make the example better.

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
- **Cannot capture the interface**: author the diagrams you *can*, and record the shots you
  cannot take as a list someone else could execute. Never reference an image that does not
  exist — a broken image on the front page costs more than a missing one.
- **Cannot verify a claim the author made**: ask, or leave it out. Do not launder someone
  else's assertion into evidence by restating it more confidently.

---

## The ledger (`docs/EVIDENCE.md`)

One table, columns exactly: `claim | command | extracted value | tolerance | date | replay (yes/no)`.

| claim | command | extracted value | tolerance | date | replay |
| --- | --- | --- | --- | --- | --- |
| 3 source files | `ls src \| wc -l` | 3 | exact | 2026-01-01 | yes |

Default tolerance: exact for counts, versions, exit codes, byte and line sizes; +/-20% for timings
and throughput; never compared for timestamps, ids and ports (mark `volatile, re-measure on
request`). A run may tighten a tolerance only with a stated reason. The example row is a sample.
