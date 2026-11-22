> Build history, not user instructions. Kept as provenance for how this plugin was made.

# 0002 — Split prose style out of house style

> Status: proposed · 2026-08-15 · Against spec version 1.0

## Motivation

M1 could not fit in five reference files. `house-style.md` reached 187 lines with three sections
still to write; callouts, formatting and voice would have landed it near 307, past the
constitution's 300-line hard limit for a reference file. The user authorised a split by subject
during implementation.

The cut is **structure versus prose**: `house-style.md` keeps which sections exist, what admits
one, and what goes in each; the new `references/prose-style.md` takes voice and sentence-level
formatting. That boundary also matches the load rule the original decision was built on — structure
is needed while laying a README out, prose while writing it, and they are two different moments.

This is the revisit condition the original decision named, not a reversal of it. It is on the
record because AC-002 asserts a closed set of five files and six now exist, and a criterion
contradicted by what is on disk is drift regardless of who authorised it.

## Criteria added

| ID | Criterion |
| --- | --- |
| AC-045 | The skill package shall carry six files in `references/`, named `house-style.md`, `prose-style.md`, `readme-template.md`, `evidence-rules.md`, `identity-block.md`, and `visuals.md`. |

## Criteria retired

| ID | Reason |
| --- | --- |
| AC-002 | Asserted a closed set of five reference files. M1 required a sixth; superseded by AC-045. |

## Section edits

### §3 Architecture — Components — add

| Component | Responsibility | Technology |
| --- | --- | --- |
| `references/prose-style.md` | Voice, the absence rule, and sentence-level formatting conventions. Holds no structural rule — it assumes the skeleton is already decided. | Markdown |

### §3 Decisions — replace

**Before:** *"`references/` splits by workflow phase, not by topic — five files, one per phase that
needs depth. … Revisit if: a sixth phase needs depth. The constitution's hard cap is seven files."*

**After:**

```
`references/` splits by workflow phase, not by topic — six files, one per phase that needs depth.
Because: a reference file is read cold and alone, so it must be complete for one moment of the
workflow; a topic-split file gets read at the wrong time or not at all.
Instead of: five files — the original count, correct until M1 measured the content. Structure and
prose are two moments, not one, and forcing them into one file breached the 300-line hard limit.
Instead of: one large file — same limit, plus it would load identity-block rules during evidence
gathering.
Revisit if: a seventh file is needed. That is the constitution's hard cap, and reaching it means
the split axis is wrong rather than the count.
```

**Reason:** the original decision's own revisit condition fired during M1. The prior reasoning is
kept verbatim on the "Instead of" line so a later reader can see the count was measured, not
guessed.

### §4 Project Layout & Conventions — replace

**Before:** *"`references/` reaches its soft cap of five files at exactly the set in §3. A sixth
needs a decision entry, not just space under the hard cap."*

**After:** *"`references/` holds the six files in §3. A seventh reaches the constitution's hard cap
and needs a decision entry showing why the split axis, not the count, should change."*

**Reason:** the sixth file now exists and has its decision entry above; the sentence as written
describes a state the repository has left.

### §4 Project Layout & Conventions — replace

**Before:** *"Element admission tests live in `SKILL.md`, not in `house-style.md`. They run on
every invocation, so they are not depth."*

**After:** *"Admission tests exist at two altitudes. The **identity-block element** tests — which
badges, wordmark and nav row are admitted — live in `SKILL.md`, because they run on every
invocation. The **capability-section** test lives in `house-style.md` with the section rules it
governs, because it is read only while laying a README out."*

**Reason:** the original sentence reads as forbidding what M1's T-02 did on instruction from its
own task line, and §10 M1 and M5 both cite AC-021 and AC-022 — so the spec already expected the
rule in two places without saying they were different rules. Stating the two altitudes resolves the
contradiction without moving any content.

### §6 Interfaces — SKILL.md → references — add

| Signature | Loaded when | Must be complete alone |
| --- | --- | --- |
| `references/prose-style.md` | Phase 3, writing | Yes — read cold |

## Impact

- **Milestones affected: M5.** Its task *"Link all five reference files by relative path"* cites
  the retired AC-002 and must cite AC-045 instead, and its wording becomes "six".
- Criteria added: 1 · retired: 1
- No change to §8 Edge Cases or §9 Security
- No other open proposal. `docs/changes/0001-m1-skeleton/` is a milestone task list, not a proposal,
  and edits no section.
