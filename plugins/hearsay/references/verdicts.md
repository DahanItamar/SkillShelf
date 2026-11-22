# Verdicts

Read at step 4. Every claim gets exactly one of four verdicts.

## The four verdicts

**verified**: evidence found at `path:line`, in the right time frame, matching every atom of the
claim. Cite it. Verified means the prose matches what the code shows. It does not mean the code is
correct, safe or tested.

**unverified**: checkable in principle from the repo or the diff, but no evidence was found after a
stated search. This is absence of evidence only. The Note says what was searched (terms and paths)
and, if only a run could settle it, the command for the user to run ("run `npm test` yourself").
Includes "all tests pass", "works on Windows", "fixes #123" and anything whose evidence lives outside
the repo.

**contradicted**: counter-evidence found at `path:line`: a different flag name, a wrong count, an
export that was removed, the item already present in the base. A contradicted row always has a cited
line. Absence alone never contradicts, with one exception: absence in a **closed set read in full**.
A closed set is the complete `git diff --name-status`, the whole manifest, or the full release range.
Write "closed set" in the Note and name the set.

**unmeasurable**: the truth depends on a measurement or a judgment that no file or diff can supply
("3x faster", "reduces memory 40%", "more intuitive", "production-ready", "secure"). The row carries a
`Needs:` benchmark spec: what to measure, the baseline, and the command or setup. If the repo has a
benchmark script but no committed results, the claim is still unmeasurable, because Hearsay does not
run it.

## Decision order

Apply in this order and stop at the first that fits.

1. Checkable from the repo or diff? No: **unmeasurable**.
2. Counter-evidence found? Yes: **contradicted**. It beats verified.
3. Evidence found for every atom of the claim? Yes: **verified**.
4. Otherwise: **unverified**.

If one atom of a claim holds and another fails, the claim should have been split in step 2. Split it
now: add a new row with the next free number and note "split from H-nn".

## Evidence quality

- Open the lines. A function named `retry` is not evidence that it retries.
- For "adds", check the base side too. For "removes", check the old name is gone from HEAD.
- For counts, count. Quote the count and where it came from.
- A test that exists is not a test that passes. "Adds tests for X" can be verified from a test file;
  "tests pass" cannot.
- Documentation of a feature is not the feature. A README line proves only that the README says it.
- Commit messages and the notes under check are claims, never evidence.

## The asymmetry

One false "contradicted" costs the author's trust in every other row. One missed contradiction costs a
reader a wrong belief, but the ledger still shows the claim as unverified. So when torn between
contradicted and unverified, choose unverified and say what would settle it. When torn between
verified and unverified, choose unverified.

## Examples

| Claim | Verdict | Why |
|---|---|---|
| "Adds a `--json` flag" | contradicted | Parser defines `--format`, no `--json` anywhere: cite the parser line |
| "Zero runtime dependencies" | verified | No `dependencies` key; imports searched, only built-ins and relative paths |
| "Caches responses on disk" | unverified | No cache code found in an open tree; absence is not contradiction |
| "Run `npm test`" | contradicted | Manifest has no `scripts.test` (closed set: manifest read in full) |
| "3x faster" | unmeasurable | Needs: seconds per page, baseline tag, same inputs, repeatable command |
