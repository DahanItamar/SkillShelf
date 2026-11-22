> Build history, not user instructions. Kept as provenance for how this plugin was made.

# M2 The identity block — Tasks

> Source: docs/SPEC.md §10 M2 · Constitution: docs/CONSTITUTION.md
> Verify: `none — verified by reading` — each task is checked by rereading the file against the
> criteria it cites, plus the five explicit checks in CONSTITUTION.md §Verification.
> Demo at the end: generate the correct badge rows and nav row for this very repository, and for
> one repo with no test suite — the second produces fewer badges, not invented ones.

- [x] T-01 Write the identity block's six elements and their order, and the wordmark `<picture>` with its dark-scheme source — closes AC-008, AC-013 — files: references/identity-block.md
- [x] T-02 Write the badge admission test — a badge states a status, version, count or licence; a bare technology name is omitted; every count is one the skill observed — closes AC-009, AC-010, AC-012 — files: references/identity-block.md — depends: T-01
- [x] T-03 Write the shields grammar and the row layout — proof row then stack row, ten badges maximum across two rows — closes AC-011 — files: references/identity-block.md — depends: T-02
- [x] T-04 Write the nav row rule — middot-separated links to files verified to exist, and the row omitted entirely when none do — closes AC-014 — files: references/identity-block.md — depends: T-01

> AC-020 (the centred footer) is listed under M2 in docs/SPEC.md §10 but was closed in M1 by
> 0001-m1-skeleton T-01, which specified the footer in `house-style.md`. It is not repeated here —
> restating it would put one rule in two files, which the constitution's dependency direction
> forbids.
