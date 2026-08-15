# 0007 — Announce the flow

> Status: proposed · 2026-08-15 · Against spec version 1.0

## Motivation

Invoking the skill produces a long run of reading, running and writing before anything appears on
screen that a user recognises. From the outside it is an undifferentiated wall: no way to tell
whether it is still gathering evidence or already writing, and therefore no way to judge whether
now is the moment to interrupt.

That is not a cosmetic problem. The skill asks the user a question in Phase 5 — which capture
mechanism to use — and a user who has lost track of where they are reads that question as coming
from nowhere. It also makes the one honest failure mode invisible: when Phase 1 cannot run the
project, the run *looks* identical to one that could, right up until the handover says otherwise.

The fix is the cheapest one available: state the phases once at the start, and name each phase on
entry. It costs two lines of output and turns a wall into a progress bar.

## Criteria added

| ID | Criterion |
| --- | --- |
| AC-046 | When invoked, the skill shall state its phase list before beginning Phase 0, and shall name each phase as it enters it. |
| AC-047 | Where the skill asks the user a question mid-run, it shall state which phase the question belongs to. |

## Criteria retired

None.

## Section edits

### §3 Architecture — Components — replace

**Before:** *"`SKILL.md` — The workflow, the one rule, the element admission tests, the Phase 5
checklist. Holds no catalogue and no long example."*

**After:** *"`SKILL.md` — The phase announcement, the workflow, the one rule, the element admission
tests, the Phase 6 checklist. Holds no catalogue and no long example."*

**Reason:** the announcement runs on every invocation and therefore cannot live in a reference
file, by the same argument that puts the hard rules in `SKILL.md`. Also corrects a stale reference
to "Phase 5" — the checklist moved to Phase 6 when visuals became their own phase in M5.

### §7 Core Flows — Flow A — add

New step 0, before reading anything:

> 0. Skill states the seven phases and names Phase 0 as it begins.

**Reason:** the flow is the specification of what a run looks like from outside, and an
announcement that is not in the flow will be dropped the first time a run is under pressure.

## Impact

- **Milestones affected:** none currently open. Implemented directly against `SKILL.md`.
- Criteria added: 2 · retired: 0
- No change to §5 Data Models, §8 Edge Cases, or §9 Security
- Applies equally to the five skills in `spec-architect`, which have the same problem and are out of
  scope for this repository's spec
