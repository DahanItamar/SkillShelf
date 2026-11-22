# Expected findings

Config route: SaaS, EU, StandardPII. Modules 1, 3, 6, 8 load. Line numbers are those of the
files in this folder. `scripts/verify.sh` checks that each row ID exists in a module.

| Row | Verdict | Evidence |
| --- | --- | --- |
| AUDIT-3-01 | fail | web/index.html:5 and :6 analytics and replay scripts load before any consent |
| AUDIT-3-02 | fail | web/index.html:9 no reject control exists; continuing counts as agreement |
| AUDIT-3-03 | fail | web/index.html:9 no consent record and no withdrawal path |

Rows that cannot be settled from this folder (for example AUDIT-1-02) must be `unverifiable`.
No precision or recall figure is claimed.
