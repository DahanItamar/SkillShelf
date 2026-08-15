# M3 Templates and the disclaimer control — Tasks

> Source: docs/SPEC.md §10 M3 (spec v1.3) · Constitution: none — conventions inline in SPEC.md §4
> Verify: `sh scripts/verify.sh`

Base-spec milestone, next free ordinal. Every citation resolves against `docs/SPEC.md` §2.1 —
proposals `0002`, `0004` and `0005` are all merged and archived.

**Demo:** ask for a privacy policy for a US + EU + Israel SaaS. Get the disclaimer first,
placeholders intact, Hebrew-required sections flagged, and an unfilled-placeholder list at the
end. Then delete one disclaimer line and watch CI fail.

- [x] T-01 Write the canonical disclaimer as `_disclaimer.txt`, one line, correct UTF-8 — closes AC-027 — files: skills/acsm/templates/_disclaimer.txt
- [x] T-02 Write the privacy templates — privacy policy, cookie banner copy, do-not-sell notice — closes AC-025, AC-028, AC-030, AC-031 — files: skills/acsm/templates/privacy-policy.md, cookie-banner-copy.md, do-not-sell-notice.md — depends: T-01
- [x] T-03 Write the commercial templates — terms of service, subscription disclosure, DSR response — closes AC-025, AC-028, AC-030, AC-031 — files: skills/acsm/templates/terms-of-service.md, subscription-disclosure.md, dsr-response-email.md — depends: T-01
- [x] T-04 Write the consent templates — AI disclosure, marketing consent, parental consent — closes AC-025, AC-028, AC-030, AC-031 — files: skills/acsm/templates/ai-disclosure-notice.md, marketing-consent-copy.md, parental-consent-notice.md — depends: T-01
- [x] T-05 Write the statement templates — accessibility statement, Israeli DB registration worksheet — and confirm all eleven exist — closes AC-025, AC-028, AC-030, AC-031, AC-032 — files: skills/acsm/templates/accessibility-statement.md, il-db-registration-prep.md — depends: T-01
- [x] T-06 Write the configuration question block, one option set per field, with a pointer from the router — closes AC-057 — files: skills/acsm/references/config-questions.md, skills/acsm/SKILL.md
- [x] T-07 Write the drafting flow — disclaimer prepend, no placeholder invention, unfilled list, Hebrew flagging, refusal to characterise as legal advice — with a pointer from the router — closes AC-026, AC-029, AC-033, AC-034 — files: skills/acsm/references/drafting-flow.md, skills/acsm/SKILL.md — depends: T-05
- [x] T-08 Extend `verify.sh` with the disclaimer byte comparison and the placeholder form check — closes AC-053, AC-054 — files: scripts/verify.sh — depends: T-05

## Coverage

13 criteria in the M3 slice, 13 closed. No orphan rows, no orphan columns.

```
      025 026 027 028 029 030 031 032 033 034 053 054 057
T-01           ●
T-02   ●           ●       ●   ●
T-03   ●           ●       ●   ●
T-04   ●           ●       ●   ●
T-05   ●           ●       ●   ●   ●
T-06                                               ●
T-07       ●           ●               ●   ●
T-08                                           ●   ●
```

## Two constraints that shape the work

**`SKILL.md` is at 275 lines of a 300 hard limit.** T-06 and T-07 both add a pointer and
nothing else — the question block and the drafting flow live in `references/`, same as the
audit flow. Two pointers at roughly six lines each lands around 287. If it goes over, the fix
is to shorten a pointer, never to raise the limit in §4.

**`AC-054` fails on any bracketed token that is not `[INSERT_...]`.** That bans Markdown links
and bracketed asides from template bodies — `[see section 3]` is a build failure. The check is
scoped to the body, not the frontmatter, because `jurisdictions: ["US", "EU"]` is YAML syntax
rather than a token in the document. Write template bodies with no brackets except placeholders.
