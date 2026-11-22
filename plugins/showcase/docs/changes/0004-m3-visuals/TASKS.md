> Build history, not user instructions. Kept as provenance for how this plugin was made.

# M3 Visuals — Tasks

> Source: docs/SPEC.md §10 M3 · Constitution: docs/CONSTITUTION.md
> Verify: `none — verified by reading` — each task is checked by rereading the file against the
> criteria it cites, plus the five explicit checks in CONSTITUTION.md §Verification.
> Demo at the end: a mermaid diagram of a real mechanism with every edge labelled, plus either
> captured screenshots or a `docs/SCREENSHOTS.md` a stranger could execute.

- [x] T-01 Write the mermaid section — when a diagram is earned, the authoring rules, and that every edge carries a label naming its condition or mechanism — closes AC-028, AC-029 — files: references/visuals.md
- [x] T-02 Write the missing-image rule — never reference a file that does not exist, and what to do instead — closes AC-030 — files: references/visuals.md — depends: T-01
- [x] T-03 Write the capture-mechanism picker — the mechanisms offered per project shape, and the custom option in which the user writes the instruction — closes AC-043 — files: references/visuals.md — depends: T-02
- [x] T-04 Write the screenshot section — staging, capture into docs/assets/screens/, alt text describing what is visible, and the shot-list fallback when capture fails or is declined — closes AC-031, AC-032, AC-033 — files: references/visuals.md — depends: T-03
- [x] T-05 Write the wordmark section — typographic only, never a pictorial mark, light and dark variants, and existing brand assets win — closes AC-044 — files: references/visuals.md — depends: T-02

> AC-013 (the `<picture>` element) is listed under M3 in docs/SPEC.md §10 but was closed in M2 by
> 0003-m2-identity-block T-01, where the header block that uses it is specified. Not repeated here.
