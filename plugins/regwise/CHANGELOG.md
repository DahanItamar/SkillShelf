# Changelog

Law-as-of convention: each release lists which modules or state-table rows were re-verified, and the date.

## 0.4.0

Law as of 2026-11-22: module 2 section 2.6 now has 12 of 19 state rows read against primary text (Utah and Kentucky added). The other 7 stay "not verified". Module `last_verified` dates are unchanged.

- Market-neutral mode no longer reports EU-law blockers for a product that does not serve the EU. Each neutral row is at most medium, labelled advisory, and written as engineering hygiene.
- One write rule: drafts are printed in the conversation, and written to disk only when you ask, to the path you name, never over an existing file without asking.
- Utah and Kentucky state-table cells corrected against statute text (Utah revenue is $25M or more; thresholds say over 50%). The README no longer says all 19 state laws are covered; it states the checked count.
- The audit report tail is merged into one FOR COUNSEL table; the findings list appears on repeat or diff runs or on request; the counsel packet is on request only.
- Writing-code flow added (section 7 of the router), so the promise to apply rules when writing code is backed by steps.
- Drafting asks three yes/no product questions (marketing email or SMS, users under 13, recurring billing) only when the repo does not answer them. The config is unchanged.
- The Hebrew note is taken from each template's own drafter notes; the disclaimer rule reads as one rule.
- Wide routes offer blockers first, rest on request.
- README: Agent Skills portability and per-tool copy steps, quick start, token costs for an audit, and a note that from 2027-02-11 each module states its age before use.
- New template: ROPA skeleton (CC0) for the existing records-of-processing check.
- Optional machine-readable output (`row|verdict|severity|path:line|citation-id`) for diffing two audits with plain `diff`.
- README: portability wording now says what was tested (Claude Code plugin install only); the blockers-first offer is stated next to "every check"; the 7 unverified state rows are named; the age notice is described as one line that never blocks; the Spec link is labelled maintainer history.
- Law since `last_verified`: Modules 1 to 8: no change read in this release; only the module 2 section 2.6 state rows above were re-read.
- Not done: no scored fixture run is recorded yet, so no recall or precision figure is claimed.

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
