# Self-test result: claude-sonnet-5-5, 2026-11-22

Model: `claude-sonnet-5-5`. Date: 2026-11-22. Skill version: 1.4.0. Runs: 1 (the README asks for 2; a second independent run was not possible in this session, so distrust this score). No no-skill baseline was run.

How it was run: the model read each file in `examples/` with the rules in `references/` in context and listed the rule IDs it would report, then compared the list with `expected/<name>.md`. Counts below were tallied from those lists, not estimated.

Known bias: the same session had already read `expected/list.md`, `expected/files.md` and `expected/profile.md` and had written `archive.jsx` and its golden, so those four rows are not blind. The other six were scored from the source file alone. No second reviewer has written `pass.md` or `files.md` blind yet.

| File | Matched | Missed | Extra |
| --- | --- | --- | --- |
| list.jsx | R-FEEDBACK-02, R-STATE-16, R-STATE-02, R-STATE-08 | none | none |
| form.jsx | R-FORM-01, R-FEEDBACK-02, R-FEEDBACK-07, R-STATE-15, R-STATE-16 | none | none |
| page.jsx | R-STATE-12, R-STATE-02, R-STATE-11, R-FEEDBACK-03 | R-FEEDBACK-10, R-STATE-16 | none |
| panel.vue | R-FEEDBACK-02, R-STATE-02, R-STATE-08, R-STATE-16 | none | none |
| feed.svelte | R-FEEDBACK-01, R-STATE-02, R-STATE-16 | R-FEEDBACK-03, R-STATE-08 | none |
| comments.html | R-FEEDBACK-02, R-STATE-02, R-STATE-15 | none | R-STATE-08 |
| files.jsx | R-FEEDBACK-05 | none | none |
| profile.html.erb | R-FEEDBACK-07, R-FEEDBACK-02 | none | none |
| archive.jsx | R-FEEDBACK-07, R-STATE-15 | none | none |
| pass.jsx | (none expected) | none | none |

Totals: 32 expected IDs, 28 matched, 4 missed, 1 extra. Recall 28/32 = 87.5%. Precision 28/29 = 96.6%. Control file `pass.jsx`: 0 findings. `files.jsx`: R-FEEDBACK-07 correctly not reported. `archive.jsx`: R-FEEDBACK-07 correctly reported.

Reading the misses: the four misses are all in the two files with the longest golden lists (`page.jsx`, `feed.svelte`) and are model omissions, not wrong goldens: a bare "Error" with no live region (R-FEEDBACK-10), no bound on the wait (R-STATE-16), no retry or next step (R-FEEDBACK-03) and an empty `posts` array rendering nothing (R-STATE-08). The one extra is R-STATE-08 on `comments.html`, where the empty list is rendered by the server and cannot be seen from this file; the golden does not expect it. Goldens and rules were left unchanged.
