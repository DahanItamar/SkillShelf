> Build history, not user instructions. Kept as provenance for how this plugin was made.

# M5 The skill orchestrates it — Tasks

> Source: docs/SPEC.md §10 M5 · Constitution: docs/CONSTITUTION.md
> Verify: `none — verified by reading` — each task is checked by rereading the file against the
> criteria it cites, plus the five explicit checks in CONSTITUTION.md §Verification.
> Demo at the end: run v2 end-to-end against a real repository and get a README that passes its
> own Phase 5 checklist.

- [x] T-01 Rewrite SKILL.md's frontmatter, the one rule, and the phases that read then run the project — including the write-from-tests fallback when it cannot be run — and align `.claude-plugin/plugin.json` at version 2.0.0 with a matching `name` — closes AC-001, AC-005, AC-006, AC-007 — files: SKILL.md, .claude-plugin/plugin.json
- [x] T-02 Write the element admission tests and the companion-doc rule — what each identity-block element must carry, what a capability section must carry or be demoted to, and that only reader-facing docs are ever created — closes AC-015, AC-016, AC-021, AC-022 — files: SKILL.md — depends: T-01
- [x] T-03 Write the hard rules — the write allowlist, the prohibition on writing git commands, and redaction of secrets in captured output — closes AC-041, AC-042 — files: SKILL.md — depends: T-01
- [x] T-04 Write the Phase 5 checklist and the handover report — every link opened, every image confirmed, every number traced, then paths written and claims unverified — closes AC-030, AC-040 — files: SKILL.md — depends: T-02, T-03
- [x] T-05 Link all six reference files by repository-relative path, and reference nothing under docs/ — closes AC-003, AC-004, AC-045 — files: SKILL.md — depends: T-04
- [x] T-06 Wrap SKILL.md at 100 characters, tables, fences and URLs exempt — closes AC-039 — files: SKILL.md — depends: T-05
- [x] T-07 Rewrite this repository's own README.md to the v2 skeleton, so the skill's front page obeys the rules it issues — closes AC-008 — files: README.md — depends: T-06

> AC-045 supersedes AC-002 per `docs/changes/0002-prose-style-split/PROPOSAL.md`. T-05 cites the
> replacement: six reference files, not five.
