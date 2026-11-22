# Adopt mode

Loaded only when the input is an existing codebase with no spec, not an idea.

1. **Tests first.** List existing test names and assertions. A passing test is behavior that is already true. Draft one `AC-###` per distinct behavior, in EARS form, from the test, not from the source around it.
2. **Then entry points.** Routes, commands, exported functions, and schema files give sections 5 and 6. Quote real types and signatures; do not paraphrase.
3. **Mark provenance.** Every drafted criterion ends with `(observed, unconfirmed)` and the file it came from. The user's confirmation removes the label; until then it is a hypothesis about intent.
4. **Never infer reasons.** Sections 3 (Decisions), 8 and 9 hold reasons and recorded rejections. Code shows what was done, never why or what was ruled out. Write what the code does, mark the reason `unknown`, and ask.
5. **One round of questions, as in Phase 2 of SKILL.md**, and only those whose answer changes the architecture. The spec's value is the human decisions the code cannot show.
6. **Do not run the code or its tests** to confirm behavior. Reading is enough for a draft; confirmation is `spec-drift`'s job later.

The result is a draft spec the user edits down. A criterion nobody confirms is deleted, not kept.
