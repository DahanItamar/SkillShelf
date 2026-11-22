# Examples

Nothing here is loaded while you use the plugin, and nothing runs at install. It exists so the claims can be checked.

| Path | What it is |
| --- | --- |
| [`walkthrough.md`](walkthrough.md) | One bug from report to close. An illustration written by hand, not a recorded run. |
| [`cases/`](cases/) | 20 case files. Each starts with `<!-- expect: pass -->` or `<!-- expect: FAIL L<n> -->`. |
| [`proof/`](proof/) | The before/after scenario in three small files, and a test that checks it. |

## The case files

`good-closed.md` is the worked case from the walkthrough. `good-open.md` is a legitimate open case with no repro yet. `good-closed-intermittent.md` shows `Verify one:`, `Runs:`, and `runs: <failed>/<total>` on Before. `good-closed-check.md` shows a `[bisect]` experiment and a non-test proof (`Proof command:`, `Check:`, `Why no test:`). `good-closed-bisect.md` shows a `[bisect]` experiment with the check script as text, saved outside the repo by the user. `good-single-hypothesis.md` shows the one-hypothesis path with its written reason. Each `bad-*.md` breaks exactly one lint rule, named in its first line:

| File | Breaks |
| --- | --- |
| `bad-heading-mismatch.md` | L1: the heading number does not match the file name |
| `bad-status-value.md` | L2: `Status: done` is not an allowed value |
| `bad-missing-section.md` | L3: no `## Lesson` section |
| `bad-one-hypothesis.md` | L4: only one hypothesis |
| `bad-fixing-no-result.md` | L5: `Status: fixing` with every hypothesis still pending |
| `bad-confirmed-no-evidence.md` | L6: a confirmed hypothesis with no pointer or command output |
| `bad-ruled-out-mismatch.md` | L7: a ruled-out hypothesis missing from the Ruled out list |
| `bad-closed-no-before.md` | L8: closed with no Before line |
| `bad-closed-no-test.md` | L8: closed with no `<path> :: <name>` regression test pointer |
| `bad-closed-placeholder.md` | L9: closed with a `TBD` left in |
| `bad-verify-no-source.md` | L2: `Verify command:` has no `(user-approved)` mark |
| `bad-verify-one-no-placeholder.md` | L2: `Verify one:` has no `{test}` placeholder |
| `bad-intermittent-before-no-runs.md` | L8: an intermittent case whose Before has no `runs: <failed>/<total>` |
| `bad-check-no-proof.md` | L8: a `Check:` pointer with no `Proof command:` header |

The example file names are descriptive, so the checker is run with `--as 001.md`, which tells it to treat the file as `001.md`:

```sh
sh scripts/check-case.sh --as 001.md examples/cases/good-closed.md
```

Running a `good-*.md` file without `--as` exits 1 by design: the descriptive file name is not `NNN.md`, so rule L1 fails. The L1 file-name half of the rule is exercised by a temporary copy named `1.md` inside the test.

## The proof

```sh
node --test examples/proof/proof.test.mjs
```

It needs Node 18 or newer (tested locally on Node 24.15; CI uses Node 22) and a POSIX `sh`. No packages.

It has three groups:

1. `before.mjs` is the buggy `roundMoney`. The test asserts that `roundMoney(1.005)` is not `1.01` (it is `1`), so the suite stays green while it demonstrates the failure.
2. `after.mjs` is the fixed version. The same assertion passes, and values that were already right still match.
3. The lint check runs over every file in `cases/` and compares the result with its `expect:` line.

This shows the scenario the skill is built around. It does not measure any model: it cannot tell you how often an agent follows the gate.
