# Writing hypotheses

## What a hypothesis is

A claim about a mechanism, plus a prediction that could turn out false. "The cache is stale" is a claim. "If the cache is stale, the second request returns the old total and the first does not" is a hypothesis, because it can be wrong.

If you cannot say what you would see when it is false, it is a hunch, not a hypothesis. Rewrite it or drop it.

## Because and Predicts

**Because** is one sentence of why this is plausible, tied to something you saw.

- Good: `Because: the total is off by exactly one cent, and a rate change would scale with the amount.`
- Bad: `Because: this is usually the problem.`

**Predicts** names an observation for both outcomes.

- Good: `Predicts: if true, Math.round(1.005 * 100) prints 100; if false, it prints 101.`
- Bad: `Predicts: we will see the bug.` (It is true under every theory, so it settles nothing.)

Write Predicts before you run the experiment. A prediction written after the result is a story.

## Where to look when stuck

At least one hypothesis must come from outside the code the symptom points at. Check this list:

- **Data.** The input is not what you think: a text value where a number was assumed, an empty row, an old record, a locale.
- **Configuration.** A setting differs between the place it works and the place it fails.
- **Environment.** Versions, operating system, time zone, a missing tool, a different working directory.
- **Ordering and time.** Two things happen in an order you did not expect. Something runs before it is ready. A clock or a timeout.
- **The test or repro itself.** It may be wrong: a stale fixture, shared state left by another test, the wrong assertion.
- **A stale build.** The code you read is not the code that ran. A cache, a compiled output, an old container.

## Ranking

Rank by how likely it is against how much its experiment costs. Reading one named line is cheap. Reproducing a race is expensive. A less likely theory with a one-minute experiment goes before a likelier one that needs an hour. Ties go to the cheaper experiment.

Re-rank when a result changes the odds. Add a new hypothesis with the next number. Never renumber the old ones.

## Evidence grades

| Result | What it needs |
| --- | --- |
| `confirmed` | An observation that discriminates: the prediction named a result and that result appeared, and the other theories would not have produced it. Recorded as a `path:line` pointer or a command with its output. |
| `ruled out` | An observation that contradicts the prediction. Recorded the same way, and listed in Ruled out. |
| `inconclusive` | Anything weaker. Say in Evidence what is missing and which experiment would settle it. |
| `pending` | Not yet run. |

"It makes sense" is not evidence. If two hypotheses would both produce the observation you got, it discriminates neither. Pick an experiment where they predict different results.

## Anti-patterns

- **Anchoring on the user's diagnosis.** The user's theory is one hypothesis. Give it a fair experiment, and write at least one rival.
- **One-hypothesis cases.** A case with a single theory is a guess with paperwork. Write at least two.
- **Confirmed because it makes sense.** Plausible is where a hypothesis starts, not where it ends.
- **Hypotheses that cannot fail.** "Something is wrong with the data" predicts nothing.
- **Re-running a ruled-out theory because it feels likely.** Re-open it only with new evidence, and add a new hypothesis that cites it.
