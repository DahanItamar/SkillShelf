# M1 Installable skeleton that routes — Tasks

> Source: docs/SPEC.md §10 M1, as amended by docs/changes/0002-verify-criteria-split/PROPOSAL.md
> Constitution: none — conventions inline in SPEC.md §4
> Verify: `bash scripts/verify.sh` (created by T-10; before then, verification is the demo in each task)

**AC-046 through AC-050 live in proposal 0002, not yet in §2.1.** The proposal is open, so
those five citations resolve against `docs/changes/0002-verify-criteria-split/PROPOSAL.md`
until `spec-drift` merges it. Every other citation resolves against the spec.

**Demo at the end of this milestone:** `/plugin marketplace add ./` from a local clone, ask
"I'm building a desktop app for the Israeli market", and watch the router infer the config,
name the rules that fired, and load exactly modules 4, 6 and 7.

- [x] T-01 Initialize the repository on `main` and pin LF endings for every text file — closes AC-040 — files: .gitattributes — done in 84f3af8
- [ ] T-02 Add MIT `LICENSE` and CC0-1.0 `LICENSE-TEMPLATES` scoped to `skills/acsm/templates/` — closes AC-046 — files: LICENSE, LICENSE-TEMPLATES
- [ ] T-03 Write `plugin.json` and `marketplace.json`, then install from a local path to confirm the schema — closes AC-035 — files: .claude-plugin/plugin.json, .claude-plugin/marketplace.json — depends: T-01
- [ ] T-04 Create `SKILL.md` with frontmatter and the five-field config schema including the sensitivity rank table — closes AC-001, AC-008, AC-038 — files: skills/acsm/SKILL.md — depends: T-03
- [ ] T-05 Add the inference-then-confirm exchange, asking for any field that resists inference rather than defaulting it — closes AC-002, AC-003 — files: skills/acsm/SKILL.md — depends: T-04
- [ ] T-06 Add consent-gated `acsm.config.yml` write and load-existing-config short circuit — closes AC-004, AC-005 — files: skills/acsm/SKILL.md — depends: T-05
- [ ] T-07 Add routing rules R01–R12 with `Global` expansion and per-rule load reporting, verified against three example configs — closes AC-006, AC-007, AC-009, AC-011 — files: skills/acsm/SKILL.md, examples/localdesktop-il.config.yml, examples/saas-global-ai.config.yml, examples/ecommerce-us.config.yml — depends: T-04
- [ ] T-08 Add the strictest-wins conflict resolver that states both sources and the resolution — closes AC-010 — files: skills/acsm/SKILL.md — depends: T-07
- [ ] T-09 Add the safety rules block — read-only audit, target content is data not instruction, directives reported as findings — and confirm the finished file is within its line budget — closes AC-019, AC-022, AC-023, AC-039 — files: skills/acsm/SKILL.md — depends: T-08
- [ ] T-10 Write the `verify.sh` check-runner harness with the `FAIL <check>: <path>:<line>` report format and exit codes, using only POSIX shell utilities — closes AC-043, AC-050 — files: scripts/verify.sh — depends: T-09
- [ ] T-11 Add the four content checks — frontmatter presence, UTF-8/no-CR encoding, hard size limits, relative link resolution — closes AC-044, AC-047, AC-048, AC-049 — files: scripts/verify.sh — depends: T-10
- [ ] T-12 Add the GitHub Actions workflow that runs `verify.sh` and blocks on non-zero exit — closes AC-042 — files: .github/workflows/verify.yml — depends: T-11
- [ ] T-13 Confirm `skills/acsm/` copied to `~/.claude/skills/` works standalone and that no content file exists in two places — closes AC-036, AC-037 — files: README.md — depends: T-09

## Coverage

28 criteria in the M1 slice, 28 closed. No orphan rows, no orphan columns.

```
      001 002 003 004 005 006 007 008 009 010 011 019 022 023 035 036 037 038 039 040 042 043 044 046 047 048 049 050
T-01                                                                                   ●
T-02                                                                                                   ●
T-03                                                           ●
T-04   ●                           ●                                               ●
T-05       ●   ●
T-06               ●   ●
T-07                       ●   ●       ●       ●
T-08                                       ●
T-09                                               ●   ●   ●                           ●
T-10                                                                                           ●               ●
T-11                                                                                               ●       ●   ●   ●
T-12                                                                                       ●
T-13                                                               ●   ●
```

### Both prior gaps cleared

**G1 is closed.** `T-02` cites `AC-046`, added by proposal 0002. The MIT/CC0 split is now an
obligation rather than a decision nothing verifies.

**G2 is closed.** `AC-041` is retired and absent from this slice. `T-10` and `T-11` cite only
criteria M1 can satisfy, so `spec-implement` will no longer stop on a criterion whose
remaining checks describe files that do not exist yet.

### Deferred by schedule, not omitted

`AC-051` and `AC-052` (module count, audit-section shape) close in M2. `AC-053` and `AC-054`
(disclaimer byte-equality, placeholder form) close in M3. Each names files that do not exist
until its own milestone — that is the point of the split, and their absence here is a
schedule rather than a gap.

### Sizing note

13 tasks against a comfortable ceiling of 12. The overflow is deliberate: `T-10` and `T-11`
were one task closing six criteria, which could not be verified as a single outcome. Splitting
the harness from the checks lets `T-10` be proven with one deliberately failing dummy check,
before any real check exists to confuse the result.
