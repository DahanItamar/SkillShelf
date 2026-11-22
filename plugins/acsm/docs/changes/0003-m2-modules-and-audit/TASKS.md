# M2 All eight modules with audit blocks — Tasks

> Source: docs/SPEC.md §10 M2 (spec v1.2) · Constitution: none — conventions inline in SPEC.md §4
> Verify: `sh scripts/verify.sh`

Base-spec milestone with no proposal, created at the next free ordinal. Every citation now
resolves against `docs/SPEC.md` §2.1 — proposals `0002` and `0004` are both merged and archived.

**Demo at the end of this milestone:** point the skill at a real repository and get a
pass / fail / n-a / unverifiable table, with a file and line for every failure.

- [x] T-01 Write module 1, global core security — ISO 27001 A.8.20/A.8.24, NIST CSF 2.0 PR.AA/PR.DS, OWASP LLM prompt-injection and output-handling — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/1-global-security.md
- [x] T-02 Write module 2, US federal and state — FTC Act §5 and 16 CFR 465, ROSCA, CCPA/CPRA, COPPA — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/2-us-market.md — depends: T-01
- [x] T-03 Write module 3, EU/UK/APAC — GDPR, ePrivacy, EU AI Act Art. 50, UK GDPR and OSA 2023, Australian APPs — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/3-eu-uk-apac.md — depends: T-01
- [x] T-04 Write module 4, Israeli market — PPL 5741-1981 and the 2017 Data Security Regulations, Communications Law §30A, Consumer Protection §13C–13G — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/4-israel-market.md — depends: T-01
- [x] T-05 Write module 5, payments and enterprise — PCI-DSS v4.0 SAQ-A, SAML 2.0/OIDC, NIS2 and SBOM — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/5-payments-enterprise.md — depends: T-01
- [x] T-06 Write module 6, digital accessibility — WCAG 2.2 AA, ADA Title III, Israeli Equal Rights Regulations — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/6-accessibility.md — depends: T-01
- [x] T-07 Write module 7, client binary and desktop — EV code signing, SQLCipher AES-256 via OS keychain, NIST SP 800-147B — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/7-desktop-binary.md — depends: T-01
- [x] T-08 Write module 8, auditability and observability — immutable audit logs, access logging, retention — and confirm the tree holds exactly eight numbered modules — closes AC-012, AC-013, AC-015, AC-016, AC-017 — files: skills/acsm/references/8-auditability.md — depends: T-01
- [x] T-09 Build the citation index, one row per instrument with its official URL and access date, matching module frontmatter `name` fields byte for byte — closes AC-055 — files: docs/CITATIONS.md — depends: T-08
- [x] T-10 Add the staleness warning that states a module's age before applying it when `last_verified` is over 180 days old — closes AC-014 — files: skills/acsm/SKILL.md — depends: T-01
- [x] T-11 Write the audit execution and reporting flow — every check evaluated, four verdicts, `path:line` on failure, report file only on request — to its own reference file, with a pointer from the router — closes AC-018, AC-020, AC-021, AC-024 — files: skills/acsm/references/audit-flow.md, skills/acsm/SKILL.md — depends: T-08
- [x] T-12 Extend `verify.sh` with the module-count, audit-block and citation-index checks — closes AC-051, AC-052, AC-056 — files: scripts/verify.sh — depends: T-09, T-11

## Coverage

14 criteria in the M2 slice, 14 closed. **No orphan rows, no orphan columns** — the first M2
matrix that is clean in both directions.

```
      012 013 014 015 016 017 018 020 021 024 051 052 055 056
T-01   ●   ●       ●   ●
T-02   ●   ●       ●   ●
T-03   ●   ●       ●   ●
T-04   ●   ●       ●   ●
T-05   ●   ●       ●   ●
T-06   ●   ●       ●   ●
T-07   ●   ●       ●   ●
T-08   ●   ●       ●   ●   ●
T-09                                           ●
T-10           ●
T-11                           ●   ●   ●   ●
T-12                                       ●   ●       ●
```

G3 is closed: `T-09` cites `AC-055`, added by proposal `0004`.

Every module task cites the same four criteria on purpose. `AC-012`, `AC-013`, `AC-015` and
`AC-016` are universally quantified over module files — "every module file shall carry a
`last_verified` date" is true after the first file and stays true as each one lands. `AC-017`
is the exception: "exactly eight" cannot hold until the eighth exists.

## Decide this before T-11, not during it

`SKILL.md` is at **250 lines of a 300 hard limit, already past the 220 soft limit.** T-10 and
T-11 both add to it, and T-11's audit flow is 40+ lines on its own. Fifty lines of headroom for
two tasks will not hold, so T-11 writes to `references/audit-flow.md` and leaves a pointer.
A router carrying procedure is loaded in full on every invocation, including the ones that
never audit anything — that is what the limit protects, so crossing it is the signal, not the
problem. Do not respond by raising it in §4.

**But a non-module file in `references/` collides with two checks.** `verify.sh` applies module
frontmatter — `module`, `domain`, `jurisdictions`, `last_verified`, `instruments` — to every
`references/*.md`, and `AC-051` requires exactly eight module files there. `audit-flow.md` has
no module number and no jurisdiction, so as things stand it fails the frontmatter check and
either breaks or is miscounted by the module count.

Two ways out, to be settled before T-11 starts:

- **Scope the module checks to `references/[1-8]-*.md`.** `AC-051` says "numbered 1 through 8",
  so this is the natural reading rather than a loophole. `AC-047` requires only the keys §5
  defines for a file's kind, and §5 defines none for a procedure file — so it passes. Cheapest,
  and needs no spec change. **Recommended.**
- **Add a third frontmatter kind to §5** for procedure files under `references/`, via a change
  proposal. More rigorous, and it closes the hole where a file §5 does not describe can carry
  no frontmatter at all. One more round through stage 2.

The first is a T-12 implementation detail; the second is a spec amendment. Pick before T-11 so
the file lands in its final home the first time.
