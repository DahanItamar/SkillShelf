> Build history, not user instructions. Kept as provenance for how this plugin was made.

# M4 Evidence — Tasks

> Source: docs/SPEC.md §10 M4 · Constitution: docs/CONSTITUTION.md
> Verify: `none — verified by reading` — each task is checked by rereading the file against the
> criteria it cites, plus the five explicit checks in CONSTITUTION.md §Verification.
> Demo at the end: a measured cost table with its disclaimer, and a redacted output block that
> says it was redacted.

- [x] T-01 Add the fifth evidence class — measured cost and benchmark tables, carrying the date, the conditions, and a disclaimer that the figures are indicative and no liability is accepted — closes AC-026 — files: references/evidence-rules.md
- [x] T-02 Strengthen the observed-numbers rule into a stated test every number must pass before it is written — closes AC-023 — files: references/evidence-rules.md — depends: T-01
- [x] T-03 Make the interpretation sentence and the trimming disclosure explicit obligations rather than advice — closes AC-024, AC-025 — files: references/evidence-rules.md — depends: T-02
- [x] T-04 Add the redaction rule — a secret, token or personal name in real output is redacted, and the redaction is marked — closes AC-042 — files: references/evidence-rules.md — depends: T-03
- [x] T-05 Remove the duplicated `Claiming absence` section and the cannot-screenshot bullet's superseded SVG instruction, both of which now live in other files — closes no criterion; required by CONSTITUTION.md §Dependency direction, which puts one rule in one file — files: references/evidence-rules.md — depends: T-04

> T-05 cites no `AC-###` deliberately. It is constitution conformance, not scope: AC-027 is closed
> in `prose-style.md` by 0001-m1-skeleton T-05, and leaving a second copy here would let the two
> drift apart with nothing downstream noticing. Flagged rather than given a false citation.
