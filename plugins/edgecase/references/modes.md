# Modes

Read only on `/edgecase screen`, `/edgecase init`, `/edgecase laws`, `/edgecase probe`, or when the
repo's `CLAUDE.md` has an `edgecase:` block. The default build and review paths in `SKILL.md` never need this file.

## Screen audit (`/edgecase screen`, or a whole screen or page)

Instead of the list in `SKILL.md`, print one table: rows are the screen's regions (header, list, form,
sidebar...), columns are loading, empty, error, success, partial. Each cell is `file:line` where the
state is handled, `absent (decided)` where the region cannot be in that state, or `MISSING`. Then
list only the `MISSING` cells that hit a `required` rule, in the normal finding format, and end with
the `edgecase-ids:` line. Skip this for single-component requests. Save it as `docs/STATES.md` only
when asked.

## Team policy (optional)

If the repo's `CLAUDE.md` has an `edgecase:` block, it overrides the defaults:

```
edgecase:
  ignore: admin/**, prototypes/**
  demote: R-FORM-03
  strict: payments/**
```

`ignore` paths are skipped, `demote` rules become `recommended`, `strict` paths treat every
`recommended` rule in `states.md`, `feedback.md` and `forms.md` as `required`. `strict` never applies
to the opt-in laws file. Overrides in `CLAUDE.md` win over `SKILL.md`. When any is applied, say so in
the verdict line ("2 rules demoted by CLAUDE.md"). Nothing else is read from it.

Precedence in a monorepo: the nearest `CLAUDE.md` decides which blocks apply; a nearer one with no
`edgecase:` block inherits the parent's unchanged. Within the merged set, per rule per file:
`ignore` > `strict` > `demote`. Example: root demotes R-FORM-03, `payments/CLAUDE.md` marks
`payments/**` strict, so R-FORM-03 is required there. Example: root ignores `payments/**` and
`payments/CLAUDE.md` marks it strict, so it stays ignored (say so in the verdict line).

## `/edgecase init`

Read the routes, propose an `edgecase:` block (ignore for admin and prototypes, strict for payments
and auth) and print it for the user to paste. Write nothing.

## `/edgecase laws`

Read `references/opt-in/laws.md` (Jacob's, Hick's and Tesler's Laws, progressive disclosure). These
are design opinions: report them as recommended, never blocking, never under `strict`, and keep them
out of the `edgecase-ids:` line unless the user asked for laws.

## `/edgecase probe`

Or a finding the user disputes: read the Probe section of `references/states.md`.
