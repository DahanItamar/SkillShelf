# Module contract

What a jurisdiction module must look like, so a new one (Canada, Brazil, India, health data) can
ship as its own marketplace plugin and still pass `scripts/verify.sh`. No install-time code.

## Frontmatter (required)

`module` (number), `domain`, `jurisdictions` (list), `last_verified` (YYYY-MM-DD, set only after
reading primary text), `instruments` (list of `name`, `citation`, `url`). Optional:
`neutral_rows` (audit IDs that run when the module loaded for a market-neutral rule).

## Body

- `## Obligations`: numbered `### N.M` sections, each with a **Citation:** line and an **In code:** list.
- `## Audit`: one row per check, six fields in order: `ID | Obligation | Locate | Pass when |
  Citation | Severity`. IDs are `AUDIT-<module>-<nn>`. Severity is `blocker`, `high` or `medium`.
- Loaded-by line naming the routing rule that selects it.

## Citation rules

Every `instruments[].name` appears byte for byte in the plugin's `skills/regwise/references/citations.md` with an
official URL and an Accessed date. Cite statutes, not blog counts. Mark an instrument volatile if it
changed in the last eighteen months. Unverified material says so in the text.

## Routing

A module is selected by a rule row of the form `| Rxx | condition | modules |` in the router. A new
plugin adds its own rule and its own module; it does not edit the core router. Hard limits: 600 lines
per module, UTF-8, LF.
