# Examples and self-test

Nine small files: eight with seeded state bugs and one clean control. Each has a golden list of the
rule IDs `uilint` should report, in `expected/`. Nothing here runs and none of it is loaded while
you use the skill; it exists so the claims can be checked.

| File | Stack | Expected | Seeded problem |
| --- | --- | --- | --- |
| [`list.jsx`](list.jsx) | React | [`expected/list.md`](expected/list.md) | Fetch failure swallowed, no loading, no empty state |
| [`form.jsx`](form.jsx) | React | [`expected/form.md`](expected/form.md) | Silent disabled submit, no confirmation, no working state |
| [`page.jsx`](page.jsx) | React Query | [`expected/page.md`](expected/page.md) | One failure blanks the page, coupled queries |
| [`panel.vue`](panel.vue) | Vue | [`expected/panel.md`](expected/panel.md) | Unhandled rejection, blank while loading |
| [`feed.svelte`](feed.svelte) | Svelte | [`expected/feed.md`](expected/feed.md) | Stack trace on screen |
| [`comments.html`](comments.html) | HTMX | [`expected/comments.md`](expected/comments.md) | Silent swap failures |
| [`files.jsx`](files.jsx) | React | [`expected/files.md`](expected/files.md) | Only a recommended rule fires; a delete that removes the row must NOT report R-FEEDBACK-07 |
| [`profile.html.erb`](profile.html.erb) | Rails ERB | [`expected/profile.md`](expected/profile.md) | Server-rendered form POST that redirects with no flash and no error re-render |
| [`pass.jsx`](pass.jsx) | React | [`expected/pass.md`](expected/pass.md) | None: a correct component |

Each expected ID carries a one-line reason, so a miss or an extra can be judged. Goldens are expectations written by the skill author, not measurements; no scored run is committed yet (see the README).

Line numbers in the golden files are for the files as shipped. Open a file and run `/uilint` to see a
finding in the exact output format from `SKILL.md`.

## Self-test

Paste this into Claude Code from the plugin folder:

```text
Run uilint on every file in examples/ except README.md and expected/. For each file, compare the
rule IDs you report with expected/<name>.md and print one line per file: matched, missed, extra.
Then print totals. Treat pass.jsx as a false-positive check: any finding there is an extra.
```

How to read it: **missed** means a rule the skill should have caught; **extra** means a possible false
positive or an expected file that needs updating. Because a language model is not deterministic, run
it twice and distrust any single score. This is a local sanity check, not a published benchmark.
