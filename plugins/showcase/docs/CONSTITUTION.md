# Showcase v2 — Constitution

> Status: Active · 2026-08-15 · Constitution version 1.0

This repository is a Claude Skill, distributed as a plugin. It ships Markdown that another model
reads at runtime. There is no program here, so "correct" means *a reader — human or model — does
the right thing after reading it*, and every rule below exists to protect that.

## Principles

1. **Every rule states what breaks when it is broken.** — A rule with no named consequence is a
   preference, and a model given preferences instead of rules produces average output while
   reporting success.
2. **`SKILL.md` carries the workflow; `references/` carries the detail.** — `SKILL.md` is loaded on
   every invocation, so depth parked there is context spent on turns that never needed it, and the
   first thing lost when context is tight is the end of the longest file.
3. **`SKILL.md` sits at the repository root and every path it names is relative to itself.** — An
   absolute path or a plugin-root variable breaks the bare `~/.claude/skills/` install, and it
   breaks silently: the model does not error, it just never reads the file.
4. **Nothing in this repository executes.** — Installation is a file copy into the user's `.claude`
   directory; a script or a dependency turns a documentation install into a code-execution surface,
   and a user who audits Markdown will not audit a postinstall.
5. **No example is invented.** Every sample output, count, or README excerpt held up as good comes
   from a repository that exists. — This skill's central rule is *never write output you did not
   observe*; taught with fabricated examples it is unlearnable, and the fabrications get copied into
   the READMEs it writes.
6. **This repository's own `README.md` obeys the rules this skill issues.** — A README-writing skill
   whose own README would fail its Phase 5 checklist has published a counterexample on its front
   page, and no reader trusts the rules after that.
7. **Where a rule and a real exemplar README disagree, the rule is wrong until re-argued.** — v1
   forbids badge rows while the exemplar v2 targets opens with ten of them; doctrine contradicted by
   the work it points at teaches readers that the doctrine is decorative.

## Layout

```text
SKILL.md              the workflow. Loaded every invocation — nothing here that isn't needed
                      every time. No catalogues, no long examples, no per-case detail.
references/           depth, loaded on demand. One file per concern, kebab-case. Every file
                      is linked from SKILL.md; a file nothing links to is dead weight.
.claude-plugin/
  plugin.json         package identity only — name, version, author, keywords. Never read at
                      runtime by the skill, so no instruction may live here.
docs/                 specs and process artefacts for the maintainer (this file, SPEC.md,
                      TASKS.md). Never loaded by the skill. Never referenced from SKILL.md.
README.md             the shop window, written to this skill's own rules (Principle 6).
LICENSE               MIT.
.gitattributes        line-ending normalisation.
```

No other top-level directory without a stated reason in `docs/SPEC.md`. In particular, no `src/`,
no `scripts/`, no `node_modules/` — see Principle 4.

## Dependency direction

`plugin.json → SKILL.md → references/*.md`. One way, one hop.

- `SKILL.md` links to `references/`. `references/` files never link back to `SKILL.md` and never to
  each other — a reference file is read alone, cold, with no guarantee its neighbour was read.
- Nothing links into `docs/`. Those files are for the maintainer; a runtime link there would load a
  spec into the reader's context as if it were instruction.
- `plugin.json` names the package. It never contains guidance, because the runtime never reads it.

## Naming

| Kind | Convention | Example |
| --- | --- | --- |
| Skill entry file | `SKILL.md`, uppercase, at the repository root | `SKILL.md` |
| Reference file | kebab-case noun phrase, `.md`, in `references/` | `references/house-style.md` |
| Maintainer doc | UPPERCASE, in `docs/` | `docs/CONSTITUTION.md` |
| Frontmatter `name` | kebab-case, identical to `plugin.json` `name` | `showcase` |
| Heading | sentence case, names the thing, no emoji, no numbering | `## The one rule` |
| Emphasis | bold for the phrase a skimmer needs; at most one per paragraph | `**Show it.**` |

## Size limits

Measured on the wrapped file. Tables, fenced code blocks and URLs are exempt from the line limit —
wrapping them damages them.

| Unit | Soft | Hard |
| --- | ---: | ---: |
| `SKILL.md` | 250 lines | 350 lines |
| A `references/` file | 200 lines | 300 lines |
| Prose line | 100 chars | 120 chars |
| Files in `references/` | 5 | 7 |
| Frontmatter `description` | 600 chars | 1024 chars |

For scale, v1 measures: `SKILL.md` 120 lines (longest line 597 chars, unwrapped), reference files
116–183 lines, `description` 584 chars, 3 reference files.

**v1's `SKILL.md` is non-conforming** under the line limit and must be rewrapped at 100 characters
as part of v2. `references/evidence-rules.md` has a 122-char line; it is a table row, and exempt.

## Tooling

| Concern | Tool |
| --- | --- |
| Authoring | any text editor — there is no toolchain and none may be added |
| Line endings | `.gitattributes`, `* text=auto eol=lf` — authored on Windows, read everywhere |
| Distribution | `.claude-plugin/plugin.json`; `version` is semver, and v2 bumps the major |
| Process | `spec-constitution → spec-architect → spec-tasks → spec-implement → spec-drift` |
| Verification | reading — see below |

## Verification

**Verify command:** `none — verified by reading`

A task is done when the file has been reread against the acceptance criteria it cites and the
checks below pass. Reading covers whether a rule names its consequence, whether prose belongs in
`SKILL.md` or `references/`, and whether an example is real.

Reading does **not** catch these, so check each one explicitly before any commit that touches them:

1. **Frontmatter** — `SKILL.md` opens with `---`, has `name` and `description`, and `name` matches
   `plugin.json`. A malformed block makes the skill fail to load with no error the author sees.
2. **Relative links** — every path in `SKILL.md` resolves from the repository root. Open each one.
3. **Both install paths** — the tree works copied bare into `~/.claude/skills/showcase/`
   *and* installed as a plugin. Nothing may depend on the plugin wrapper existing.
4. **No placeholders** — no `TODO`, `Coming soon`, `Lorem`, or `your-project-name` survives.
5. **Line limit** — longest prose line ≤ 120 chars, excluding tables, fences and URLs.

## Standing decisions

Made without asking. Reject any one and I will rewrite the sections it touches.

1. **The repository stays Markdown-only — no scripts, no dependencies, no build.** Taken from v1's
   observed practice, not from an answer you gave. If wrong: a check script lands, Principle 4 is
   struck, and Tooling and Verification are both rewritten.
2. **The skill `name` stays `showcase`, and v2 is an in-place major version bump.** If
   wrong: a rename means every existing install stops firing, and `plugin.json` plus the frontmatter
   change together.
3. **The frontmatter `description` may be rewritten freely.** You did not mark trigger compatibility
   as non-negotiable. If wrong: v2 must preserve v1's trigger phrases verbatim and only append.
4. **`docs/` is committed, not gitignored.** The spec chain is part of the repository's argument for
   itself. If wrong: `docs/` leaves the Layout tree and the Dependency direction rule about it goes.
5. **This constitution governs this repository, not the READMEs the skill produces.** Rules about
   badges, emoji, hero images, mermaid diagrams and section counts are *content*, and they are
   decided in `docs/SPEC.md` by `spec-architect` and written into `references/`. If wrong: the
   Winnow-alignment doctrine moves in here and this document roughly doubles.
6. **Prose wraps at 100 characters everywhere, including `SKILL.md`.** Your answer, recorded here
   because it makes v1 non-conforming and creates work. If wrong: the wrap rule and the size table
   both drop the line limit.

## Release checklist

Bump `plugin.json`, the README badge and the root `.claude-plugin/marketplace.json` entry
together, so the three never disagree.
