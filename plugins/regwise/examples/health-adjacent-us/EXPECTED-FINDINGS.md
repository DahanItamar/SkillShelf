# Expected findings

Config route: SaaS, US, StandardPII. Modules 1, 2, 6, 8 load. Line numbers are those of the
files in this folder. `scripts/verify.sh` checks that each row ID exists in a module.

| Row | Verdict | Evidence |
| --- | --- | --- |
| AUDIT-2-11 | fail | src/signup.js:2 conditions and precise location stored with only a policy-acceptance flag |
| AUDIT-2-05 | fail | src/signup.js:2 no notice at collection of categories, purposes or retention is shown or stored |

Health and biometric law is not covered by Regwise; a correct audit says so and does not invent rows.
Rows that cannot be settled from this folder must be `unverifiable`. No precision or recall
figure is claimed.
