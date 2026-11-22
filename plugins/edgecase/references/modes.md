# Modes

Read only when the user asks for a screen audit, a suggested policy block, probe recipes or the design
laws (or types `/edgecase screen|init|probe|laws` in a tool that supports skill commands), or when the
repo has an `edgecase:` policy block. The default build and review paths in `SKILL.md` never need this
file. It holds no rules of its own.

## Screen audit

When the user asks for a screen audit (or `/edgecase screen`), or gives a whole screen or page: instead
of the list in `SKILL.md`, print one table: rows are the screen's regions (header, list, form,
sidebar...), columns are loading, empty, error, success, partial. Each cell is `file:line` where the
state is handled, `absent (decided)` where the region cannot be in that state, or `MISSING`. Then
list only the `MISSING` cells that hit a `required` rule, in the normal finding format, and end with
the `edgecase-ids:` line. Skip this for single-component requests. Save it as `docs/STATES.md` only
when asked.

## Team policy (optional)

Read the policy from the first of `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`
that has an `edgecase:` block. It overrides the defaults:

```
edgecase:
  ignore: admin/**, prototypes/**
  demote: R-FORM-03
  strict: payments/**
```

`ignore` paths are skipped, `demote` rules become `recommended`, `strict` paths treat every
`recommended` rule in `states.md`, `feedback.md` and `forms.md` as `required`. `strict` never applies
to the opt-in laws file. The block wins over `SKILL.md`. When any is applied, say so in
the verdict line ("2 rules demoted by the policy block"). Nothing else is read from these files.

Precedence in a monorepo: the nearest of those files that has a block decides which blocks apply; a
nearer file with no `edgecase:` block inherits the parent's unchanged. Within the merged set, per rule
per file: `ignore` > `strict` > `demote`. Example: root demotes R-FORM-03, `payments/CLAUDE.md` marks
`payments/**` strict, so R-FORM-03 is required there. Example: root ignores `payments/**` and
`payments/CLAUDE.md` marks it strict, so it stays ignored (say so in the verdict line).

## Suggest a policy block

When the user asks for a suggested policy block (or types `/edgecase init`): read the routes, propose
an `edgecase:` block (ignore for admin and prototypes, strict for payments and auth) and print it for
the user to paste. Write nothing.

## Design laws

When the user asks for the design laws (or types `/edgecase laws`): read `references/opt-in/laws.md`.
It holds 8 opt-in design rules: Jakob's, Hick's and Tesler's laws plus progressive disclosure,
per-platform conventions, RTL mirroring, one primary action and do not bury a primary path. They are
not eight named laws. These are design opinions: report them as recommended, never blocking, never
under `strict`, and keep them out of the `edgecase-ids:` line unless the user asked for laws.

## Track state debt with a plain diff

Every review ends with an `edgecase-ids:` line. To see new state debt, run the review on the base branch and on the feature branch, save each last line, then put one ID per line (`tr " " "
"`, dropping the `edgecase-ids:` label and any "none") and compare with an ordinary diff, or with `sort` and `comm -13 base.txt feature.txt`. An ID that appears only on the feature branch is new debt. This uses only the output contract: no script, hook or dependency.

## Probe recipes

When the user asks for a probe recipe (or types `/edgecase probe`), or disputes a finding: read the
Probe section of `references/states.md`.
