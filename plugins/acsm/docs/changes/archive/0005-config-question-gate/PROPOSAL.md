# 0005 — Make the configuration gate an explicit question

> Status: proposed · 2026-08-16 · Against spec version 1.2

## Motivation

`AC-002` says the router infers and confirms. `AC-003` says it asks for what it cannot infer.
Neither says *how*, so the wording is left to whoever runs the skill — and the result is that
two sessions ask two different questions, and a user who does not already know the enum sees a
free-text prompt instead of a choice.

This surfaced concretely: asked to demonstrate the flow, the skill produced prose rather than a
picker, and aimed it at the wrong repository. A gate that depends on the operator improvising
is not a gate.

The fix is a canonical question block: every field, every permitted value, in one place the
router points at. It changes no routing rule and no criterion already closed — it fixes the
one step between inference and routing that was specified only as an intention.

## Criteria added

| ID | Criterion | Milestone |
| --- | --- | :-: |
| AC-057 | When the router asks the user to confirm or supply a configuration field, it shall present that field's permitted values from §5 as explicit options rather than as free text. | M3 |

## Criteria retired

None.

## Section edits

### §6 Interfaces — add

A subsection after §6.1, documenting the question surface as a named boundary:

```markdown
### 6.1a Configuration question gate

The router asks through `references/config-questions.md`, which holds one block per field
with its permitted values from §5. `SKILL.md` points at it rather than carrying it, for the
same reason the audit flow moved out: the question is procedure, and the router is loaded on
every invocation including the ones that never ask anything.
```

### §10 Build Order — add

**M3** gains: `- [ ] references/config-questions.md with one option block per field, and a pointer from the router — closes AC-057`

**Reason:** M3 is where the remaining reference files and the drafting flow land, so the
question block travels with them rather than reopening M2.

### §3 Decisions, §8 Edge Cases, §9 Security — no change

No architectural choice is made. The gate already exists; this specifies its form.

## Impact

- **Milestones affected:** M3 only.
- **Criteria added:** 1 · retired: 0. Active count 55 → 56.
- **No other open proposals.**
- **Rejected as part of this change:** renumbering the modules to the scheme in the
  ACSM flow document (`1-eu-gdpr-nis2`, `2-us-ccpa`, `3-il-privacy`, …). Module numbers are
  permanent under §4 and 83 audit checks carry `AUDIT-<module>-<n>` identifiers that would all
  break. The proposed split also removes UK/APAC and auditability coverage, which R02, R05 and
  R10 require, and promotes templates to a reference module when §4 gives them their own
  directory. The current numbering stands.
- **Noted, not built:** the flow document maps `HealthData` to HIPAA. ACSM has a
  `SensitiveHealth` sensitivity value but no HIPAA module, so that mapping currently resolves
  to nothing. Either a module 9 or an explicit out-of-scope entry is needed — this proposal
  does neither.
