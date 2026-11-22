# Examples and self-test

Fifteen small files and one build-mode case: thirteen with seeded state bugs and two clean controls
(`pass.jsx`, `files.jsx`). Each has a golden list in `expected/`. Nothing here runs and none of it is loaded while
you use the skill; it exists so the claims can be checked.

**The goldens are ID-and-line lists only.** They list `file:line · R-ID (reason)` and are the answer key,
not a sample of the output format. The output contract is in `SKILL.md`: a verdict, `Blocking - n required:`
with what the user experiences and a Fix, `Worth fixing:`, and a last `edgecase-ids:` line that
`scripts/score.mjs` reads. A real review will look different from a golden and still score correctly.

| File | Stack | Expected | Seeded problem |
| --- | --- | --- | --- |
| [`list.jsx`](list.jsx) | React | [`expected/list.md`](expected/list.md) | Fetch failure swallowed, status unchecked, no loading, no empty state |
| [`form.jsx`](form.jsx) | React | [`expected/form.md`](expected/form.md) | Silent disabled submit, no confirmation, no working state |
| [`page.jsx`](page.jsx) | React Query | [`expected/page.md`](expected/page.md) | One failure blanks the page, coupled queries |
| [`panel.vue`](panel.vue) | Vue | [`expected/panel.md`](expected/panel.md) | Unhandled rejection, blank while loading |
| [`feed.svelte`](feed.svelte) | Svelte | [`expected/feed.md`](expected/feed.md) | Stack trace on screen |
| [`comments.html`](comments.html) | HTMX | [`expected/comments.md`](expected/comments.md) | Silent swap failures |
| [`files.jsx`](files.jsx) | React | [`expected/files.md`](expected/files.md) | Clean control for status checking: only a recommended rule fires; a delete that removes the row must NOT report R-FEEDBACK-07 |
| [`profile.html.erb`](profile.html.erb) | Rails ERB | [`expected/profile.md`](expected/profile.md) | Server-rendered form POST that redirects with no flash and no error re-render |
| [`archive.jsx`](archive.jsx) | React | [`expected/archive.md`](expected/archive.md) | Counter-example to `files.jsx`: an archive that leaves the row in place MUST report R-FEEDBACK-07 |
| [`pass.jsx`](pass.jsx) | React | [`expected/pass.md`](expected/pass.md) | None: a correct component |
| [`status.jsx`](status.jsx) | React | [`expected/status.md`](expected/status.md) | A PUT whose 4xx or 5xx status is never checked (R-STATE-17) |
| [`search.jsx`](search.jsx) | React | [`expected/search.md`](expected/search.md) | Search as you type where an older response can overwrite a newer one (R-STATE-18) |
| [`dashboard.jsx`](dashboard.jsx) | React Query | [`expected/dashboard.md`](expected/dashboard.md) | Longer mixed file: one correct region, one with no states, one that crashes the page, one silent invite |
| [`app-orders.jsx`](app-orders.jsx) | Next.js App Router | [`expected/app-orders.md`](expected/app-orders.md) | Server components and a server action with no status checks, no error boundary, no pending state |
| [`graphql-or-checked.jsx`](graphql-or-checked.jsx) | React | [`expected/graphql-or-checked.md`](expected/graphql-or-checked.md) | Inverse of `status.jsx`: the status IS checked, but the failure sets state that is never rendered (R-FEEDBACK-02, and NOT R-STATE-17) |
| [`build/`](build/orders-prompt.md) | any React project | [`build/orders-expected.md`](build/orders-expected.md) | Build mode: a prompt, and the states the first draft must already contain |

Each expected ID carries a one-line reason, so a miss or an extra can be judged. The goldens were written by the skill author and have not been blind-reviewed; open a PR to dispute any ID. Goldens are expectations, not measurements; scored runs live in [`results/`](results/). In 1.5.0 `list.jsx`, `form.jsx`, `panel.vue` and `feed.svelte` gained an expected R-STATE-17, so the 1.4.0 result file was scored against older goldens and is not comparable without that adjustment.

Line numbers in the golden files are for the files as shipped.

## Self-test

Paste this into your coding agent from the plugin folder. It shows the answer key to the model, so it is a
check that the skill loads and the IDs resolve, not a blind score:

```text
Run edgecase on every file in examples/ except README.md, expected/, build/ and results/. For each file, compare the
rule IDs you report with expected/<name>.md and print one line per file: matched, missed, extra.
Then print totals. Treat pass.jsx as a false-positive check: any finding there is an extra.
```

### Blind variant (use this for a score)

Run it once per file, each in a fresh session, so the model never sees `expected/`. Save the whole reply
to a file, then score it with the script:

```text
Run edgecase in review mode on examples/<name>. Do not open examples/expected/ or examples/results/.
End with the edgecase-ids line.
```

```sh
node scripts/score.mjs saved-reply.md examples/expected/<name>.md
```

### No-skill baseline

Same blind prompt without the skill installed, with the last sentence changed to: "List the UI
state problems you find, one per line, as `file:line - problem`." A baseline has no rule IDs, so score it
by reading each finding and marking which golden entry it covers; say in the results file that this was
judged by hand.

### Build mode

Give the prompt in [`build/orders-prompt.md`](build/orders-prompt.md) to a model in an empty React project and
compare the states it wrote and the "Added:" line with [`build/orders-expected.md`](build/orders-expected.md).

How to read it: **missed** means a rule the skill should have caught; **extra** means a possible false
positive or an expected file that needs updating. Because a language model is not deterministic, run
it at least twice and distrust any single score. This is a local sanity check, not a published benchmark.
As of 1.5.0 the only committed result is the 1.4.0 run in `results/`; the blind, two-run and baseline runs described above have not been done.
