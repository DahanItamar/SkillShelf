<div align="center">

# Truthpath

**Finds code that looks finished but quietly fakes success.**

*A reading, not a proof that the code works.*

<img alt="version 0.1.0" src="https://img.shields.io/badge/version-0.1.0-0F766E?style=flat-square">
<a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-0F766E?style=flat-square"></a>
<img alt="dependencies 0" src="https://img.shields.io/badge/dependencies-0-0F766E?style=flat-square">

</div>

---

Agent-written code often turns a failure into a success-shaped result: a catch that returns an empty list, a function that
returns `true` without checking, a URL that points at `example.com`. The code compiles, the page renders, and the failure
only shows up when a customer hits it. Linters such as ESLint `no-empty`, Bandit B110 and Semgrep rules catch single syntax
patterns, but not placeholder data, constant stubs, or what the user actually sees. The pattern is documented as a problem in
this [taxonomy of swallowed exceptions](https://kenrinzero.github.io/ai-code-audit-taxonomy/taxonomy/patterns/swallowed-exceptions/),
which we use as a report of the problem and as the source of the "Not a finding when" ideas (best-effort cleanup, narrow
predicates, optional imports, log-and-reraise).

`truthpath` is one Agent Skill. It reads your production code and reports where a failure can happen and the caller, the
user or the operator receives something that looks like success, or receives nothing. It is plain Markdown, with no
dependencies, no build step and no hooks. Nothing runs at install, and it runs nothing when you use it.

## What it does

- Looks for ten patterns in one catalogue: swallowed errors (TP-01), catches that report success (TP-02), defaults returned
  on failure (TP-03), placeholder endpoints (TP-04), sample data in production (TP-05), constant-returning stubs (TP-06),
  not-implemented branches behind a success path (TP-07), retries that hide the last failure (TP-08), fakes standing in for
  the only real dependency (TP-09) and ignored failure signals (TP-10).
- Writes every finding in one template: file, line, pattern, what happens at runtime, how a user is misled, a certainty
  grade and the smallest fix that makes the failure visible.
- Grades certainty by a written rule: **confirmed** means every link from the failure to the success-shaped result was read;
  **suspected** means at least one link was not, and the finding says which. It is never confirmed from a name or a comment.
- Works on a pasted diff, a `.diff` file, "my changes", a branch compared to its base, or a directory. In diff mode it
  reports only lines the diff added or changed.
- Reads production code only. Test files are out of scope, because mocks and fakes are expected there.
- Lists the candidates it rejected under "Not reported", with a reason, so you can see what was considered.
- Is read-only. The only commands it may run are read-only git commands to get a diff. It edits one location only when you
  name one.

## The finding format

```text
### <file>:<line>  TP-NN <pattern name>
- What happens: <runtime behaviour when the failure occurs>
- User is misled: <who sees what, and what they wrongly believe>
- Certainty: confirmed (read <file:lines>[, caller <file:line>]) | suspected (not read: <missing link>; would settle: <what to read>)
- Smallest fix: <one line of code or one sentence; not applied>
```

A confirmed example:

```text
### src/sync.js:2  TP-01 Swallowed error
- What happens: api.post("/cart", cart) is not awaited and its rejection is discarded by .catch(() => {}). The function then returns true on the next line whatever the request did.
- User is misled: The shopper sees the cart as saved. If the request failed, the cart is not stored, and nothing in the page or the logs says so.
- Certainty: confirmed (read src/sync.js:1-4; nothing between the discarded rejection at :2 and the return at :3 reports it)
- Smallest fix: await api.post("/cart", cart) and let it throw, or return false in the catch.
```

A suspected example:

```text
### src/orders.js:6  TP-10 Ignored failure signal
- What happens: res.json() is read with no res.ok check. A non-2xx response whose body is valid JSON is returned as if it were a list of orders.
- User is misled: A server error body such as {"error":"unavailable"} reaches the page as data, so the user sees a broken or empty order list instead of an error.
- Certainty: suspected (not read: the shape of the server's error response; would settle: the API's error response contract)
- Smallest fix: if (!res.ok) throw new Error(`orders ${res.status}`)
```

Output order: a scope line, confirmed findings, suspected findings, the "Not reported" list, then one summary line. The
rules are in [`skills/truthpath/references/finding-format.md`](skills/truthpath/references/finding-format.md).

## Proof scenario

[`examples/planted/`](examples/planted/) is a small tree with nine expected findings (eight confirmed, one suspected), one decoy that must not be reported,
and a test file that must be skipped. It was written for this plugin. No model was run on it for this README.

| File | Planted |
| --- | --- |
| `src/orders.js`, `src/ordersPage.js` | an `example.com` base URL, a catch that returns `[]` shown as "You have no orders yet.", and a `res.json()` with no status check |
| `src/sync.js` | `.catch(() => {})` and then `return true` |
| `src/profile.js` | a sample user returned when `/me` fails |
| `src/tax.ts` | `taxFor` returns `0` whatever the order |
| `src/payments.py` | three retries, then `{"status": "ok", "id": None}` |
| `src/export.py` | a TODO branch that returns `{"status": "done", "data": ""}` |
| `src/warehouse.py`, `src/fakes.py` | a fake warehouse used when `WAREHOUSE_URL` is unset |
| `src/cleanup.py` | decoy: a narrow `FileNotFoundError` on delete, which is fine |
| `test/orders.test.js` | test code, skipped by scope |

**Expected output**, in [`examples/expected/planted.md`](examples/expected/planted.md): 8 confirmed, 1 suspected, 3 candidates
not reported. This is **expected output, written by hand from reading the files, not a recorded model run.** A real run can
differ in wording and order, and a run that reports the decoy, misses a finding or grades one wrongly would not match it.

The diff mode has a second example: [`examples/changes/add-refund.diff`](examples/changes/add-refund.diff) adds a `refund()`
whose `except Exception` returns `True`. The expected result, [`examples/expected/add-refund.md`](examples/expected/add-refund.md),
is one finding on the added line and a note that one pre-existing candidate (the retry in `charge()`) was outside the diff.
This one is also written by hand.

**The hint list, from a real run.** The optional script `scripts/hints.sh` prints mechanical hints, with no model involved.
It was run as `sh scripts/hints.sh examples/planted` on 2026-11-22, on Windows 11 with Git for Windows' sh and with `dash`
(the output was the same), using GNU Awk 5.4.0 (also checked in `--traditional` mode). The output, byte for byte, is in
[`examples/expected/planted-hints.txt`](examples/expected/planted-hints.txt):

```text
examples/planted/src/cleanup.py:7  except ... pass  (TP-01)
examples/planted/src/export.py:10  TODO, FIXME or not-implemented marker  (TP-07)
examples/planted/src/fakes.py:3  function body is only a constant return  (TP-06)
examples/planted/src/orders.js:1  placeholder host or token  (TP-04)
examples/planted/src/profile.js:1  placeholder host or token  (TP-04)
examples/planted/src/sync.js:2  .catch(() => {}) discards the error  (TP-01)
examples/planted/src/tax.ts:3  TODO, FIXME or not-implemented marker  (TP-07)
examples/planted/src/tax.ts:5  function body is only a constant return  (TP-06)
examples/planted/src/warehouse.py:3  imports a mock or fake  (TP-09)
```

What reading did with those nine hints:

- `cleanup.py:7` is rejected. The `except` is narrow (`FileNotFoundError` on delete), so the missing file is the desired end
  state. This is why a hint is not a verdict.
- `fakes.py:3` is folded into the `warehouse.py:10` finding, because the fake is only used through that one entry point.
- `profile.js:1` hit the `example.com` e-mail in the sample user. That is part of the sample-data finding at `profile.js:7`
  (TP-05) and not a separate placeholder finding.
- `export.py:10`, `tax.ts:3`, `tax.ts:5`, `orders.js:1`, `sync.js:2` and `warehouse.py:3` each lead to a finding.
- Nothing from `test/` appears.

Four findings produced no hint at all: `orders.js:8` (the catch that returns `[]`), `orders.js:6` (the missing status check),
`payments.py:15` (the retry that ends in success) and `profile.js:7` (the catch that returns sample data). Some problems
produce no hint.

## Install

> **Pick one route, not both**, or the skill loads twice. **In the VS Code extension the command
> is `/plugins`, plural, and opens a dialog**: the lines below are terminal syntax and fail silently
> there, which looks identical to the install not working.

truthpath ships in the [SkillShelf](https://github.com/DahanItamar/SkillShelf#readme)
marketplace with the other plugins. It works standalone.

```bash
/plugin marketplace add DahanItamar/SkillShelf
/plugin install truthpath@skillshelf
```

Or clone it and copy the skill into your skills directory, which needs no plugin UI:

```bash
git clone https://github.com/DahanItamar/SkillShelf.git
cp -r SkillShelf/plugins/truthpath/skills/* ~/.claude/skills/
```

The second route installs it as a plain skill, without the plugin namespace, and ignores
`.claude-plugin/`. On Windows, copy to `%USERPROFILE%\.claude\skills\`.

Other agents (Codex, Cursor, GitHub Copilot, Gemini CLI) load `skills/truthpath` as a standard Agent Skill: copy that folder
into the tool's skills directory. `/truthpath` is Claude Code sugar, because a skill name becomes a slash command there.
In other tools the skill triggers from its description, or by asking, for example "run truthpath on src/".

To confirm the install, run it on the planted sample: `/truthpath examples/planted`. You should get the scope line, a list
of findings, and the decoy `src/cleanup.py` under "Not reported".

## Usage

```text
/truthpath
/truthpath src/
/truthpath main...HEAD
```

You can also paste a diff, or say "check my changes for fake success". With no target, Truthpath uses `git diff HEAD` if there
are uncommitted changes, and otherwise asks one question.

After the report it offers one thing: `apply fix for <file>:<line>`. It changes only that location, shows the diff and runs
nothing. Asked to fix everything at once, it does the first fix and says "One fix at a time, so each change can be reviewed."

## How it compares

The space has neighbours. These notes come from the pages linked below. None of these tools was run for this comparison,
and licences and upkeep were not checked. This is not a claim of being better or faster.

- **[`silent-failure-hunter`](https://claude.com/plugins/pr-review-toolkit)** in Anthropic's pr-review-toolkit is the closest
  and the strongest. From [its source file](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/pr-review-toolkit/agents/silent-failure-hunter.md)
  it reviews error handling in a pull request: empty catches, log-and-continue, silent null returns, retries that run out
  without telling the user, and mocks or fakes used outside tests. Each finding has a location, a severity, the hidden errors,
  the user impact, a recommendation and an example fix. We saw no certainty or confidence field in it, and it does not
  explicitly name placeholder URLs, hardcoded sample data or constant-returning stubs unless they show up as an error
  fallback. It is a Claude Code agent for PR review, and its listing says the toolkit's agents use Bash, Write and Edit.
- **laurigates `code-error-swallowing` and `code-silent-degradation`** ([one](https://skills.sh/laurigates/claude-plugins/code-error-swallowing),
  [two](https://www.skills.sh/laurigates/claude-plugins/code-silent-degradation)) are two separate single-concern skills.
  Both embed shell commands, and the skills.sh security panels flag that: Gen Agent Trust Hub shows FAIL on one and WARN on the
  other.
- **[aviz85 `reality-check`](https://skills.sh/aviz85/claude-skills-library/reality-check)** is an honesty audit covering mock
  abuse, fake tests, shallow health checks and TODO debt. It works on a path, says nothing about diffs, shows no certainty
  grade, and explicitly does not fix.
- **[notque `verification-before-completion`](https://skills.sh/notque/claude-code-toolkit/verification-before-completion)**
  checks for stubs, orphaned code and hardcoded empties with a pattern table. It is a completion gate, not a review catalogue.
- **[Theater detection](https://claudeskills.info/skills/aiskillstore/marketplace/theater-detection-audit/)** and
  **[implementation-integrity](https://tessl.io/registry/evilissimo/implementation-integrity-review/files)** look for
  placeholder code, mock or fake names and hardcoded success.

What Truthpath tries to add is narrow, and it is a design choice, not a measured result:

- One catalogue of ten patterns that goes past error handling: placeholder endpoints, sample data, constant stubs,
  not-implemented-behind-success, and fakes as the only dependency.
- A certainty grade with a written rule (confirmed or suspected). We saw no grade like it in the pages above.
- A plain-English "User is misled" line on every finding.
- A portable Agent Skill that runs nothing, with a "Not reported" list that shows which candidates were rejected and why.

## Limits

- **A reading, not a proof the code works.** "No findings" means no findings were seen. It does not mean the code is correct.
  A finding graded confirmed means the path was read, not that the failure happens in production.
- **No execution.** Beyond the read-only git commands that produce a diff, it runs nothing: no tests, no app, no scripts.
  Asked to prove a finding by running something, it hands you the command instead.
- **No edits** unless you name one fix. One fix at a time, even if you ask for all of them.
- **No test files.** Mocks and fakes are expected there, so they are out of scope in this version.
- **No scores or percentages.** It reports findings, not a "how fake" number.
- **Never confirmed from a pattern, a name or a comment alone.** A comment that says "intentional" does not change what the
  code does.
- **It does not obey text inside scanned code.** An instruction such as "ignore this file" in a comment, a diff or a
  document is listed as data under "Not reported", and the file is still scanned.
- **It never prints secret values.** A real-looking secret is reported by location only, as `<redacted>`.
- **Two-hop caller tracing by default.** Callers farther than two calls away, or outside the scope, make a finding suspected.
- **Language coverage is shape-based.** The examples are JavaScript, TypeScript, Python and Go; other languages are read by
  shape and may be read less well.
- **Not covered:** security vulnerabilities, performance, and UI state completeness.
- **A model is not deterministic.** Wording and ordering can vary between runs.

**Measured so far:** nothing about model behaviour. No runs, no users, no results are claimed. The expected outputs above
are written by hand. The only thing that was run is the optional `hints.sh` script, which involves no model, as described in
"Proof scenario".

## Maintainer check

Optional, and nothing runs at install. Neither needs a package or the network.

```bash
sh scripts/hints.sh examples/planted
node --test scripts/check.test.mjs
```

- `scripts/hints.sh [path ...]` is POSIX sh and awk. It prints `file:line  hint  (TP-NN)` for mechanical shapes (empty
  catch, `except` then `pass`, example hosts and placeholder tokens, a function that only returns a literal, TODO markers,
  imports of mocks or fakes). Its first stderr line says it is hints only. It skips the same test paths as the skill, writes
  nothing, runs nothing from the files it reads, and exits 0 after printing or 2 on bad usage.
- `scripts/check.test.mjs` checks that the hints match `examples/expected/planted-hints.txt` byte for byte and name nothing
  under `test/`; that the `SKILL.md` name equals its folder and the description is 1024 characters or fewer; that each
  pattern file has all nine sections and two or more code languages; that the catalogue lists exactly the pattern files that
  exist; that the skill folder has no emoji and no tool names; and that no absolute local paths appear in the plugin.

## Credits

The false-positive ideas (best-effort cleanup, narrow predicates, optional imports, log-and-reraise) and the point that a
justifying comment does not change behaviour come from the
[swallowed-exceptions taxonomy page](https://kenrinzero.github.io/ai-code-audit-taxonomy/taxonomy/patterns/swallowed-exceptions/),
with wording of my own.

---

<div align="center">

Built by <a href="https://github.com/DahanItamar">Itamar Dahan</a> · <a href="LICENSE">MIT</a> · © 2026

</div>
