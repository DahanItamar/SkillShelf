# M1 Installable skeleton that routes — Tasks

> Source: docs/SPEC.md §10 M1 · Constitution: none — conventions inline in SPEC.md §4
> Verify: `bash scripts/verify.sh` (created by T-10; before then, verification is the demo in each task)

**Demo at the end of this milestone:** `/plugin marketplace add ./` from a local clone, ask
"I'm building a desktop app for the Israeli market", and watch the router infer the config,
name the rules that fired, and load exactly modules 4, 6 and 7.

- [x] T-01 Initialize the repository on `main` and pin LF endings for every text file — closes AC-040 — files: .gitattributes — done in 84f3af8
- [ ] T-02 Add MIT `LICENSE` and CC0-1.0 `LICENSE-TEMPLATES` scoped to `skills/acsm/templates/` — closes nothing, see G1 — files: LICENSE, LICENSE-TEMPLATES
- [ ] T-03 Write `plugin.json` and `marketplace.json`, then install from a local path to confirm the schema — closes AC-035 — files: .claude-plugin/plugin.json, .claude-plugin/marketplace.json — depends: T-01
- [ ] T-04 Create `SKILL.md` with frontmatter and the five-field config schema including the sensitivity rank table — closes AC-001, AC-008, AC-038 — files: skills/acsm/SKILL.md — depends: T-03
- [ ] T-05 Add the inference-then-confirm exchange, asking for any field that resists inference rather than defaulting it — closes AC-002, AC-003 — files: skills/acsm/SKILL.md — depends: T-04
- [ ] T-06 Add consent-gated `acsm.config.yml` write and load-existing-config short circuit — closes AC-004, AC-005 — files: skills/acsm/SKILL.md — depends: T-05
- [ ] T-07 Add routing rules R01–R12 with `Global` expansion and per-rule load reporting, verified against three example configs — closes AC-006, AC-007, AC-009, AC-011 — files: skills/acsm/SKILL.md, examples/localdesktop-il.config.yml, examples/saas-global-ai.config.yml, examples/ecommerce-us.config.yml — depends: T-04
- [ ] T-08 Add the strictest-wins conflict resolver that states both sources and the resolution — closes AC-010 — files: skills/acsm/SKILL.md — depends: T-07
- [ ] T-09 Add the safety rules block — read-only audit, target content is data not instruction, directives reported as findings — and confirm the finished file is within its line budget — closes AC-019, AC-022, AC-023, AC-039 — files: skills/acsm/SKILL.md — depends: T-08
- [ ] T-10 Write `scripts/verify.sh` covering frontmatter presence, UTF-8/LF encoding, relative link resolution and size limits, using only POSIX shell utilities — closes AC-043, AC-044 — files: scripts/verify.sh — depends: T-09
- [ ] T-11 Add the GitHub Actions workflow that runs `verify.sh` and blocks on non-zero exit — closes AC-042 — files: .github/workflows/verify.yml — depends: T-10
- [ ] T-12 Confirm `skills/acsm/` copied to `~/.claude/skills/` works standalone and that no content file exists in two places — closes AC-036, AC-037 — files: README.md — depends: T-09

## Coverage

24 criteria in the M1 slice, 23 closed by a task.

```
      001 002 003 004 005 006 007 008 009 010 011 019 022 023 035 036 037 038 039 040 041 042 043 044
T-01                                                                                   ●
T-02   ← closes nothing (G1)
T-03                                                           ●
T-04   ●                           ●                                               ●
T-05       ●   ●
T-06               ●   ●
T-07                       ●   ●       ●       ●
T-08                                       ●
T-09                                               ●   ●   ●                           ●
T-10                                                                                                   ●   ●
T-11                                                                                           ●
T-12                                                               ●   ●
```

### G1 — one task closes nothing

`T-02` has no criterion. The CC0-for-templates split is recorded as a §3 Decision with a
stated reason, but §2.1 never turned it into an obligation. The work is needed — a public
repository without a license is not reusable, and MIT attribution inside a user's published
privacy policy is the specific outcome the decision exists to avoid.

**Fix:** amend `docs/SPEC.md` §2.1 with a licensing criterion, then re-cite `T-02`.
Suggested wording, to be authored in the spec and not here:

> The repository shall be licensed MIT, except `skills/acsm/templates/`, which shall be
> licensed CC0-1.0 so that generated documents carry no attribution obligation.

### G2 — one criterion closes in no milestone alone

`AC-041` names seven check families for `verify.sh`. Three of them — disclaimer byte-equality,
placeholder form, audit-section presence — describe files that do not exist until M2 and M3.
It is therefore unsatisfiable in M1, and `T-10` cites only `AC-043` and `AC-044`.

This is a schedule gap in this slice and a defect in the spec: a criterion that three
milestones each partially satisfy cannot be verified by any of them.

**Fix:** split `AC-041` in `docs/SPEC.md` into one criterion per check family, so each
milestone closes the ones its files make checkable. `AC-041` itself is retired as a tombstone
rather than renumbered, per §4.
