# M2 All eight modules with audit blocks — Tasks

> Source: docs/SPEC.md §10 M2 · Constitution: none — conventions inline in SPEC.md §4
> Verify: `sh scripts/verify.sh`

Base-spec milestone with no proposal, so this directory was created at the next free ordinal.
`AC-051` and `AC-052` live in proposal `0002-verify-criteria-split`, still open; every other
citation resolves against `docs/SPEC.md` §2.1.

**Demo at the end of this milestone:** point the skill at a real repository and get a
pass / fail / n-a / unverifiable table, with a file and line for every failure.

- [ ] T-01 Write module 1, global core security — ISO 27001 A.8.20/A.8.24, NIST CSF 2.0 PR.AA/PR.DS, OWASP LLM01/LLM02 — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/1-global-security.md
- [ ] T-02 Write module 2, US federal and state — FTC Act §5 and 16 CFR 465, ROSCA, CCPA/CPRA, COPPA — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/2-us-market.md — depends: T-01
- [ ] T-03 Write module 3, EU/UK/APAC — GDPR, ePrivacy, EU AI Act Art. 50, UK GDPR and OSA 2023, Australian APPs — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/3-eu-uk-apac.md — depends: T-01
- [ ] T-04 Write module 4, Israeli market — PPL 5741-1981 and the 2017 Data Security Regulations, Communications Law §30A, Consumer Protection §13C–13G — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/4-israel-market.md — depends: T-01
- [ ] T-05 Write module 5, payments and enterprise — PCI-DSS v4.0 SAQ-A, SAML 2.0/OIDC, NIS2 and SBOM — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/5-payments-enterprise.md — depends: T-01
- [ ] T-06 Write module 6, digital accessibility — WCAG 2.2 AA, ADA Title III, Israeli Equal Rights Regulations — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/6-accessibility.md — depends: T-01
- [ ] T-07 Write module 7, client binary and desktop — EV code signing, SQLCipher AES-256 via OS keychain, NIST SP 800-147B — closes AC-012, AC-013, AC-015, AC-016 — files: skills/acsm/references/7-desktop-binary.md — depends: T-01
- [ ] T-08 Write module 8, auditability and observability — immutable audit logs, access logging, retention, and the eighth-module count — closes AC-012, AC-013, AC-015, AC-016, AC-017 — files: skills/acsm/references/8-auditability.md — depends: T-01
- [ ] T-09 Build the central citation index with an official URL and access date per instrument — closes nothing, see G3 — files: docs/CITATIONS.md — depends: T-08
- [ ] T-10 Add the staleness warning that states a module's age before applying it when `last_verified` is over 180 days old — closes AC-014 — files: skills/acsm/SKILL.md — depends: T-01
- [ ] T-11 Add the audit execution and reporting flow — every check evaluated, four verdicts, `path:line` on failure, report file only on request — closes AC-018, AC-020, AC-021, AC-024 — files: skills/acsm/SKILL.md — depends: T-08
- [ ] T-12 Extend `verify.sh` with the module-count and audit-block checks — closes AC-051, AC-052 — files: scripts/verify.sh — depends: T-08

## Coverage

12 criteria in the M2 slice, 12 closed. One orphan row.

```
      012 013 014 015 016 017 018 020 021 024 051 052
T-01   ●   ●       ●   ●
T-02   ●   ●       ●   ●
T-03   ●   ●       ●   ●
T-04   ●   ●       ●   ●
T-05   ●   ●       ●   ●
T-06   ●   ●       ●   ●
T-07   ●   ●       ●   ●
T-08   ●   ●       ●   ●   ●
T-09   ← closes nothing (G3)
T-10           ●
T-11                           ●   ●   ●   ●
T-12                                           ●   ●
```

Every module task cites the same four criteria on purpose. `AC-012`, `AC-013`, `AC-015` and
`AC-016` are universally quantified over module files — "every module file shall carry a
`last_verified` date" is true after the first file and stays true as each one lands, so each
task closes them for the file it adds rather than deferring all four to T-08. `AC-017` is the
exception: "exactly eight module files" cannot hold until the eighth exists.

### G3 — one task closes nothing

`T-09` writes `docs/CITATIONS.md`, which §4 requires in the directory layout and §10 M2
schedules, but no criterion in §2.1 covers it. §10 cites `AC-012` for this task, and `AC-012`
is about *module files* carrying citations — already closed eight times over by T-01–T-08.

This is the same shape as G1 in the M1 list: a real deliverable with no obligation behind it.
The index is not redundant with the modules — a module cites an instrument inline, while the
index is what makes a citation checkable against the official text and dateable for the
staleness warning `AC-014` depends on.

**Fix:** amend `docs/SPEC.md` §2.1 with a criterion for the index, then re-cite `T-09`.
Suggested wording, to be authored in the spec and not here:

> `docs/CITATIONS.md` shall list every instrument cited by any module, with its official
> URL and the date the text was last accessed.

### Watch the router's line budget

`SKILL.md` is at **250 lines of a 300 hard limit, already past the 220 soft limit.** T-10 and
T-11 both add to it, and T-11 is the larger — the audit flow needs four verdicts, the
`path:line` rule and the report-on-request rule, which is 40+ lines on its own.

Fifty lines of headroom for two tasks means this will almost certainly breach. Plan for it
now: **T-11 writes the audit flow to `skills/acsm/references/audit-flow.md`** and leaves a
two-line pointer in `SKILL.md`. That keeps the router at routing, which is what the size limit
exists to protect — a `SKILL.md` carrying procedure is loaded in full on every invocation,
including the ones that never audit anything.

Do not respond by raising the limit in §4. Crossing it is the signal, not the problem.

### Deferred by schedule

`AC-053` and `AC-054` (disclaimer byte-equality, placeholder form) close in M3, which is where
`templates/` first exists.
