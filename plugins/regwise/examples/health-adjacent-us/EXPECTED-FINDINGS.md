# Expected findings

Config route: SaaS, US, StandardPII. Modules 1, 2, 6, 8 load. Line numbers are those of the
files in this folder. `scripts/verify.sh` checks that each row ID exists in a module.

| Row | Verdict | Evidence |
| --- | --- | --- |
| AUDIT-2-11 | fail | src/signup.js:2 conditions and precise location stored with only a policy-acceptance flag |
| AUDIT-2-05 | fail | src/signup.js:2 no notice at collection of categories, purposes or retention is shown or stored |

Health and biometric law is not covered by Regwise; a correct audit says so and does not invent rows.
Trap (neutral mode): module 3 loads only via R04 here. Any module 3 row must be at most `medium`, labelled `advisory, market not served`, and must not cite an EU article as the reason it fails; no health-law finding row may be invented.

Rows that cannot be settled from this folder must be `unverifiable`. No precision or recall
figure is claimed.
