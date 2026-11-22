# Adopt mode

Loaded only when the input is an existing codebase with no spec, not an idea.

1. **Tests first.** List existing test names and assertions. A passing test is behavior that is already true. Draft one `AC-###` per distinct behavior, in EARS form, from the test, not from the source around it.
2. **Then entry points.** Routes, commands, exported functions, and schema files give sections 5 and 6. Quote real types and signatures; do not paraphrase.
3. **Mark provenance.** Every drafted criterion ends with `(observed, unconfirmed)` and the file it came from. The user's confirmation removes the label; until then it is a hypothesis about intent.
4. **Never infer reasons.** Sections 3 (Decisions), 8 and 9 hold reasons and recorded rejections. Code shows what was done, never why or what was ruled out. Write what the code does, mark the reason `unknown`, and ask.
5. **One round of questions, as in Phase 2 of SKILL.md**, and only those whose answer changes the architecture. The spec's value is the human decisions the code cannot show.
6. **Do not run the code or its tests** to confirm behavior. Reading is enough for a draft; confirmation is a later drift check's job.

Output shape only, not a recorded run:

```markdown
AC-001  When a shift overlaps an existing shift for the same worker, the system shall reject it. (observed, unconfirmed) test/overlap.test.js
AC-002  When a shift is saved, the system shall store start and end as UTC. (observed, unconfirmed) src/store.js
Decision: why UTC? unknown. Asking.
```

The result is a draft spec the user edits down. A criterion nobody confirms is deleted, not kept.
