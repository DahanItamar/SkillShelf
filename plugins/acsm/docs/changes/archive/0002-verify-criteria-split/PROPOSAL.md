# 0002 — Split the verify.sh criterion and license the templates

> Status: proposed · 2026-08-15 · Against spec version 1.0

## Motivation

The M1 coverage matrix surfaced two defects in §2.1 that no amount of careful implementation
would have fixed, because both are failures of the criteria themselves rather than of the
work they describe.

`AC-041` bundles seven check families into one sentence. Three of them — disclaimer
byte-equality, placeholder form, audit-section presence — describe files that do not exist
until M2 and M3, so the criterion is unsatisfiable in M1, unsatisfiable in M2, and only
becomes true at the very end of M3. Every milestone partially satisfies it and none can close
it, which means `spec-implement` would stop at the task citing it in M1 and report a failure
that is not a defect in the code.

The redundancy that proves the shape was wrong: **relative link resolution was already
`AC-044`**, written as its own `If … then …` criterion. One of the seven families had escaped
the bundle and been stated correctly, and the other six had not. Splitting the rest simply
finishes a decomposition that was already half done.

Separately, the MIT/CC0 licensing split is recorded as a §3 Decision with a stated reason —
MIT would oblige a user to carry an attribution notice inside their own published privacy
policy — but §2.1 never turned it into an obligation. A decision with no criterion is a
decision `spec-drift` cannot check and `spec-implement` cannot verify, which is how a
deliberate choice degrades into an accident.

## Criteria added

| ID | Criterion | Milestone |
| --- | --- | :-: |
| AC-046 | The repository shall be licensed MIT, except `skills/acsm/templates/`, which shall be licensed CC0-1.0. | M1 |
| AC-047 | If a Markdown file under `skills/acsm/` lacks YAML frontmatter containing every key required for its kind by §5, then `scripts/verify.sh` shall fail. | M1 |
| AC-048 | If any tracked text file contains a byte-order mark or a carriage return, then `scripts/verify.sh` shall fail. | M1 |
| AC-049 | If a file exceeds the hard size limit stated for its kind in §4, then `scripts/verify.sh` shall fail. | M1 |
| AC-050 | When `scripts/verify.sh` completes with one or more failed checks, it shall print each as `FAIL <check>: <path>:<line>` and exit 1. | M1 |
| AC-051 | If the repository does not contain exactly eight module files numbered 1 through 8, then `scripts/verify.sh` shall fail. | M2 |
| AC-052 | If a module file has no `## Audit` section, or an audit check within it omits any of the six fields defined in §5, then `scripts/verify.sh` shall fail. | M2 |
| AC-053 | If the first content of a file under `skills/acsm/templates/` is not byte-identical to `skills/acsm/templates/_disclaimer.txt`, then `scripts/verify.sh` shall fail. | M3 |
| AC-054 | If a file under `skills/acsm/templates/` contains a bracketed token that does not match `\[INSERT_[A-Z0-9_]+\]`, then `scripts/verify.sh` shall fail. | M3 |

Each new verification criterion is stated as `If <violation>, then verify.sh shall fail` —
the shape `AC-044` already used. Every one is closable by exactly one milestone, because each
names files that exist by the end of that milestone and no later.

Note the deliberate separation of **property** from **enforcement**. `AC-040` says files are
UTF-8 with LF; `AC-048` says CI fails when they are not. `AC-039` says `SKILL.md` is under 300
lines; `AC-049` says CI fails when it is not. Both halves are wanted: the property can be true
today by luck, and only the enforcement keeps it true next month.

## Criteria retired

| ID | Reason |
| --- | --- |
| AC-041 | Compound across seven check families spanning three milestones, so no milestone could satisfy it. Replaced by AC-047–AC-050 (M1), AC-051–AC-052 (M2), AC-053–AC-054 (M3), and AC-044, which already covered the link-resolution family before this split. |

`AC-041` becomes a tombstone in §2.1 on merge. It keeps its ID; the M1 task list already
cites it by ordinal in its coverage notes, and every such citation must still resolve.

## Section edits

### §2.1 Acceptance Criteria — add

The nine rows above, appended in ID order after `AC-045`.

### §2.1 Acceptance Criteria — replace

**Before:** `| AC-041 | When scripts/verify.sh runs, it shall check frontmatter presence, disclaimer byte-equality, placeholder form, relative link resolution, audit-section presence, file encoding, and size limits, and shall exit non-zero if any check fails. |`

**After:** `| ~~AC-041~~ | *Retired in 0002-verify-criteria-split — compound across three milestones; replaced by AC-047–AC-054.* |`

**Reason:** stated in Motivation. The criterion is not being weakened — the same seven checks
are still required, now as eight separately closable obligations across the milestones whose
files make each one checkable.

### §8 Edge Cases — replace

**Before:** `| Disclaimer corrupted by encoding (â ï¸) | … | UTF-8 no-BOM enforced by .gitattributes; CI byte-compares against _disclaimer.txt | AC-027, AC-040, AC-041 |`

**After:** `| Disclaimer corrupted by encoding (â ï¸) | … | UTF-8 no-BOM enforced by .gitattributes; CI byte-compares against _disclaimer.txt | AC-027, AC-040, AC-048, AC-053 |`

**Reason:** the handling described in this row is unchanged, but it cited a criterion that no
longer exists. `AC-048` now carries the encoding check and `AC-053` the byte comparison — the
two halves this row always depended on. A §8 row citing a retired ID is a handling nobody
verifies.

### §8 Edge Cases — replace

**Before:** `| SKILL.md grows as obligations leak into the router | … | 300-line hard limit enforced in CI | AC-039, AC-041 |`

**After:** `| SKILL.md grows as obligations leak into the router | … | 300-line hard limit enforced in CI | AC-039, AC-049 |`

**Reason:** same repointing. `AC-039` states the limit; `AC-049` is now what makes CI fail when
it is crossed. Without this edit the row's only enforcement citation is a tombstone.

### §10 Build Order — replace

**M1**, licensing task — **Before:** `- [ ] git init, .gitattributes with eol=lf, MIT LICENSE, CC0 LICENSE-TEMPLATES — closes AC-040`
**After:** two tasks, `- [ ] git init and .gitattributes with eol=lf — closes AC-040` and `- [ ] MIT LICENSE and CC0 LICENSE-TEMPLATES scoped to skills/acsm/templates/ — closes AC-046`

**M1**, verify task — **Before:** `— closes AC-041, AC-043, AC-044` **After:** `— closes AC-043, AC-044, AC-047, AC-048, AC-049, AC-050`

**M2**, verify task — **Before:** `— closes AC-015, AC-017` **After:** `— closes AC-015, AC-017, AC-051, AC-052`

**M3**, verify task — **Before:** `— closes AC-041` **After:** `— closes AC-053, AC-054`

**Reason:** the licensing task closed nothing, which is the gap this proposal exists to fix;
the three verify tasks each cited the same unsatisfiable compound criterion and now cite only
criteria their own milestone can close.

### §4 Tooling — no change

The verify command, the dependency ban, and the size-limit table are all unchanged. `AC-049`
cites the existing table rather than restating it.

### §6.5 CI — no change

Exit codes `0`, `1` and `2` are already specified. `AC-050` makes exit `1` and the failure
line format verifiable; exit `2` remains an interface contract with no separate criterion,
since a script that cannot run produces no findings to check.

## Impact

- **Milestones affected:** M1, M2, M3. M4 unchanged.
- **Criteria added:** 9 · **retired:** 1. Active count 45 → 53.
- **No change to §3 Decisions.** The MIT/CC0 rationale is already recorded there; this
  proposal gives that decision a criterion, it does not revisit it.
- **No change to §9 Security.** The disclaimer control is unchanged in substance — `AC-025`,
  `AC-027` and `AC-034` all stand. Only the criterion that made CI enforce it was renumbered.
- **No other open proposals.** `docs/changes/0001-m1-installable-skeleton/` holds a task list
  with no `PROPOSAL.md`; it occupies the ordinal but edits no section. No overlap to resolve.
- **Downstream:** the M1 task list in `0001` must be regenerated — `T-02` gains `AC-046`, and
  `T-10` gains `AC-047`–`AC-050`. Re-run `/spec-tasks` after this merges.
