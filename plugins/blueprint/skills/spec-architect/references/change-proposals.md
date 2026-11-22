# Change Proposals

Delta mode. What to write when `docs/SPEC.md` already exists.

---

## Why not just edit the spec

Three reasons, in order of how much they cost when ignored:

1. **The reasoning is the asset.** §3 Decisions, §8 Edge Cases, and §9 Security record *why*. Rewriting the spec for feature 4 deletes the reasons that made features 1–3 correct — silently, with no diff anyone reads.
2. **A proposal is reviewable.** A rewritten spec is a 900-line diff nobody reads. A proposal is one page, and the reviewer can see exactly what changes.
3. **The spec must stay loadable.** It exists to be read whole into a fresh context. Growing it by a full feature description every time ends that.

So: the spec is the truth, and a proposal is a pending amendment. it is merged into the spec once the work ships.

---

## The directory

```
docs/changes/
├── 0004-shift-templates/
│   ├── PROPOSAL.md
│   └── TASKS.md            ← written later
└── archive/
    ├── 0001-m1-scheduling/
    └── 0002-pdf-export/
```

**Ordinals** are four digits, monotonic, never reused — including across `archive/`. Find the next one by scanning both directories; do not guess from the highest you happen to see.

**Slugs** are ASCII kebab-case, truncated at 40 characters. The full title lives in the document.

---

## The document

````markdown
# 0004 — Shift templates

> Status: proposed · <date> · Against spec version 2.0

## Motivation

<Why now. Two or three sentences. This is the part that survives into §3 Decisions
after the merge — write it as the reason a future reader needs, not as a ticket summary.>

## Criteria added

| ID | Criterion |
| --- | --- |
| AC-041 | When a manager applies a template, the scheduler shall create one shift per template row. |
| AC-042 | If a template row conflicts with an existing shift, then the scheduler shall skip that row and report it. |

## Criteria retired

| ID | Reason |
| --- | --- |
| AC-018 | Weekly copy replaced by templates; the copy path no longer exists. |

## Section edits

### §3 Architecture — Components — add

| Component | Responsibility | Technology |
| --- | --- | --- |
| Template store | Holds reusable shift patterns. Does not schedule. | SQLite table |

### §5 Data Models — add

```ts
interface ShiftTemplate {
  id: string;
  name: string;
  rows: TemplateRow[];
}
```

### §8 Edge Cases — replace

**Before:** | Duplicate week copy | Two identical shifts | Reject the second |
**After:** | Template row conflicts | Silent double-booking | Skip the row, report it | AC-042 |
**Reason:** the copy path this row described is retired by this change; the same
failure now arrives through templates and needs the reporting behavior AC-042 states.

## Impact

- Milestones affected: M4
- Criteria added: 2 · retired: 1
- No change to §9 Security
````

---

## Section edits

Every edit names its section, its operation, and — for the sections that record reasons — why.

| Operation | Requires a reason | Note |
| --- | --- | --- |
| `add` | no | New content, nothing displaced |
| `replace` | **yes**, for §3, §8, §9 | Show before and after; a reader must see what was lost |
| `remove` | **yes**, always | The most dangerous operation in the system |

### The rule that makes this safe

> **Removing or replacing an item in §3 Decisions, §8 Edge Cases, or §9 Security without a stated reason is not permitted.**

Those three sections exist because someone thought about a problem and wrote down the conclusion. An unexplained reversal is indistinguishable from a later session not knowing — which is precisely what a drift check classifies as a regression. Stating the reason converts it into a decision on the record.

When a §3 Decision genuinely reverses, do not delete it. Write the new decision with what changed:

```
**Storage** — Postgres
Because: two writers now exist (0004), which SQLite's single-writer model cannot serve
Instead of: SQLite — the original choice; correct while the app was single-user
Revisit if: the second writer is removed
```

The old reason stays visible. That is the whole point.

---

## Criteria in a proposal

- **Continue the repo-wide sequence.** If the spec ends at `AC-040`, this proposal starts at `AC-041`. Never restart at 001 per feature — IDs are unique across the repository, including archived proposals, because an archived task list still cites them.
- **Retiring is not deleting.** A retired criterion becomes a tombstone in §2.1 on merge, keeping its ID forever. One line, and every old citation still resolves.
- **Retire explicitly, never by omission.** A criterion the proposal simply stops mentioning is still active, and a drift check will keep checking it.

---

## Conflicts with other open proposals

Before writing, list the other directories under `docs/changes/` that are not archived, and read their `Section edits`.

If another open proposal edits a section you are about to edit:

- **Say so in `## Impact`**, naming the ordinal and the section.
- **Do not resolve it yourself.** Two proposals editing §5 in incompatible ways is a sequencing decision the user makes, not a merge you perform.
- Merge neither one until the overlap is resolved.

Independent proposals touching different sections merge in any order. That is the common case, and it needs no coordination.

---

## What delta mode does not change

Everything else in this skill still applies: one round of questions, decide rather than ask, delete anything that could be removed with the product still working, numbered assumptions for calls the user did not authorize.

Two additions specific to this mode:

- **Question budget is lower.** The spec already answered the architectural forks. Three questions is generous; often none are needed, because the constraint set is already written down.
- **Check the change against §8 before proposing it.** A new feature that reintroduces a failure mode §8 already solved is the single most common regression, and it is cheapest to catch here — before a task list exists, before code is written, and before a drift check has to explain what was lost.

---

## Teams and parallel branches

Two branches that each write a proposal will both scan `docs/changes/` and both pick the same next ordinal, and both continue the sequence from the same last `AC-###`. Branches cannot see each other, so allocate the real numbers where the work meets: at merge time, on `main`.

- **On a branch, use provisional ids.** Name the directory `0000-slug` and number new criteria `AC-NEW-1`, `AC-NEW-2`. A task list may cite an `AC-NEW-n` that is defined in the unmerged `PROPOSAL.md` beside it.
- **At merge, whoever merges second renumbers, in the merge commit.** On the up-to-date `main`: take the next real ordinal (scan `docs/changes/` and `docs/changes/archive/`) and the next free `AC-###`, rename the directory, replace each `AC-NEW-n` in the proposal and its `TASKS.md`, then apply the edits to the spec.
- **Worked collision.** Branch A and branch B each create `docs/changes/0000-<slug>/` with an `AC-NEW-1`. A merges first and becomes `0007` with `AC-041`. B merges next: it takes `0008` and `AC-042`, and rewrites its `AC-NEW-1` to `AC-042` everywhere, including the `T-` lines that cite it. Nobody else touches A.
- **Squash merges drop commit messages.** Put `closes AC-###` in the pull request title or body so the trail survives.
- **Check the result.** Search the spec for a duplicate `AC-###` or a reused tombstone: that means two branches skipped the provisional step. A leftover `0000-*` directory or `AC-NEW-n` on `main` means the merge step was skipped. Provisional ids are expected on feature branches, so look only on `main` or in a merge queue.
- **No hashes, no per-branch ranges.** They would break the `AC-###` format that every consumer matches on and the rule that ids are never renumbered once merged.
- **Solo work is unchanged.** One person on one branch at a time can keep allocating real ordinals and ids when writing the proposal.
