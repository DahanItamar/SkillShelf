# Changelog

Law-as-of convention: each release lists which modules or state-table rows were re-verified, and the date.

## 0.3.0

- The locked disclaimer no longer uses an emoji or MVP wording. It now says the document is an AI-generated draft, not legal advice, and needs review by counsel in each jurisdiction you serve. It is still one fixed line, checked byte for byte.
- The citation index moved to `skills/regwise/references/citations.md`, so a copy-install of `skills/regwise/` keeps it. If it is missing, the audit says so and cites module URLs instead.
- Re-verified on 2026-11-22 against primary text: module 2 section 2.6 rows for Virginia, Texas, Iowa, Tennessee, Minnesota, Delaware, Connecticut, Montana, Florida and Maryland (10 of 19). Maryland is codified at 14-4601 to 14-4614, not 14-47xx. Nine rows stay "not verified", each with the reason. The module's `last_verified` is unchanged.
- Corrected state-table cells: Connecticut threshold and cure end, Delaware threshold and cure, Montana threshold and cure, Tennessee threshold, Florida cure, Maryland signal.
- Drafting prune rule now names the jurisdiction text that sat outside headings (terms of service, subscription disclosure, cookie and accessibility notes).
- An audit header now prints a resume phrase, and diff audit is the stated default for repeat runs.
- SensitiveHealth now points to the kind of expert to pair with; the README says the same for markets not covered.
- Fixtures: copy without the answer key before scoring. No scored run is recorded yet, so no recall figure is claimed.
- A site with a contact form, newsletter or analytics tag is now `StandardPII`, so privacy policy and data-request drafts are no longer withheld from it.
- Audits: scope options (`blockers only`, `modules N,M`, `diff`), ledger lines printed so a run can resume, a fixed diff-audit block, a one-line findings list for week-over-week comparison, and a `Law as of` header with the state-table count.
- Drafting: sections for markets you do not serve are pruned and listed, duplicate section numbering fixed, and a monorepo uses the nearest `regwise.config.yml`.
- One accurate statement of what Regwise writes: `regwise.config.yml` with your consent, and `Regwise-REPORT.md` only on request.
- README: verify badge in the house colour, coverage table, corrected counts.

## 0.2.0

- Renamed from acsm to Regwise. `regwise.config.yml` replaces `acsm.config.yml`; the old name is still read.
