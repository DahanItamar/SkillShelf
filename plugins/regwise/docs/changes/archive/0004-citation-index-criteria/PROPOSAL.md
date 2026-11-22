# 0004 — Give the citation index a criterion

> Status: proposed · 2026-08-15 · Against spec version 1.1

## Motivation

`docs/CITATIONS.md` is required by §4's directory layout and scheduled by §10 M2, but no
criterion in §2.1 covers it. §10 cites `AC-012`, which says *module files* carry citations —
already closed eight times over by the module tasks. So M2's `T-09` closes nothing, and the
index is a deliverable with no obligation behind it.

This is the third occurrence of the shape, after licensing (`AC-046`, proposal 0002) and
before it the compound verify criterion. All three came from §10 bullets citing a criterion
that did not actually cover the work — worth naming as a pattern, because M3 and M4 are still
undecomposed and the same trap is waiting in both.

The index is not redundant with the modules. A module cites an instrument inline, which is
what a reader needs while applying an obligation. The index is what makes that citation
*checkable against the official text* and *dateable* — and `AC-014`'s staleness warning is only
meaningful if someone can find the text a `last_verified` date refers to. Without the index,
"verified on 2026-08-15" is an assertion about nothing in particular.

## Criteria added

| ID | Criterion | Milestone |
| --- | --- | :-: |
| AC-055 | `docs/CITATIONS.md` shall list every instrument named in any module's `instruments` frontmatter, with the instrument's official URL and the date its text was last accessed. | M2 |
| AC-056 | If a module's frontmatter names an instrument absent from `docs/CITATIONS.md`, then `scripts/verify.sh` shall fail. | M2 |

`AC-056` goes beyond the literal request and is the easier of the two to reject. It is
proposed because `AC-055` alone repeats the mistake this proposal exists to fix: a stated
obligation with nothing enforcing it. Eight modules, several instruments each, an index
maintained by hand — it will fall out of sync during M2 itself, not months later. The check is
a substring match per instrument name and adds perhaps eight lines to `verify.sh`.

Reject `AC-056` and the index still lands; it just decays quietly, and `spec-drift` becomes
the only thing that would ever notice.

## Criteria retired

None.

## Section edits

### §5 Data Models — add

The index row shape, so `AC-056` has something exact to check. Placed after the module
frontmatter block, which is where the `instruments` list it mirrors is defined.

```markdown
### Citation index row

One row per instrument in `docs/CITATIONS.md`. The `Instrument` cell must match the `name`
field of the corresponding entry in a module's `instruments` frontmatter, byte for byte —
that equality is what `AC-056` checks.

| Instrument | Jurisdiction | Official text | Accessed |
| --- | --- | --- | --- |
| Regulation (EU) 2016/679 | EU | https://eur-lex.europa.eu/eli/reg/2016/679/oj | 2026-08-15 |
```

### §10 Build Order — replace

**M2**, citation index task — **Before:** `- [ ] docs/CITATIONS.md with the official URL and access date for every instrument — closes AC-012`
**After:** `- [ ] docs/CITATIONS.md with the official URL and access date for every instrument — closes AC-055`

**M2**, verify task — **Before:** `— closes AC-051, AC-052` **After:** `— closes AC-051, AC-052, AC-056`

**Reason:** the index task closed nothing, which is the gap this proposal exists to fix.
`AC-012` is about module files and is closed by the eight module tasks; citing it here made a
covered criterion look like it covered a second deliverable too.

### §3 Decisions — no change

No architectural choice is made here. The index was already in §4's layout; this gives it an
obligation, it does not introduce it.

### §8 Edge Cases — no change

Checked against every row before proposing. Nothing here reintroduces a failure mode §8
already solved, and the staleness row (`AC-013`, `AC-014`) is strengthened rather than
altered — a date is more useful when the text it refers to is findable.

### §9 Security — no change

## Impact

- **Milestones affected:** M2 only. M3 and M4 unchanged.
- **Criteria added:** 2 · **retired:** 0. Active count 53 → 55.
- **No other open proposals.** `0001` and `0003` are task lists with no `PROPOSAL.md` and edit
  no section; `0002` is archived. No overlap to resolve.
- **Downstream:** the M2 task list in `0003` needs regenerating — `T-09` gains `AC-055` and
  `T-12` gains `AC-056`. That clears the last orphan row in the milestone.
