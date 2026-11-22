---
document: "Israeli Database Registration Worksheet"
jurisdictions: ["IL"]
satisfies: ["AUDIT-4-01", "AUDIT-4-02", "AUDIT-4-03", "AUDIT-4-04"]
requires_translation: ["IL"]
placeholders: ["INSERT_COMPANY_NAME", "INSERT_CONTACT_EMAIL", "INSERT_PHYSICAL_ADDRESS", "INSERT_DPO_EMAIL", "INSERT_DATABASE_NAME"]
license: "CC0-1.0"
---

> ⚠️ **DISCLAIMER**: This document is an AI-generated template intended for MVP/early-stage testing. It does not constitute formal legal advice. Before scaling, accepting paying customers, or entering regulated markets, have this document reviewed by qualified legal counsel in your target jurisdiction.

# Israeli Database Registration Worksheet

**This is a worksheet, not a document to publish.** It collects the facts a registration
question needs, so that counsel can answer it in ten minutes rather than an hour.

## Read this first — the rule changed

**Amendment 13 to the Protection of Privacy Law came into force on 14 August 2025 and
substantially narrowed the registration duty.** The widely repeated rule — register any database
with sensitive information or more than 10,000 records — describes the regime before that date.
Most ordinary SaaS databases no longer require registration.

Broadly, registration now attaches to a much smaller set: databases whose principal purpose is
trading in data, databases held by public bodies, and databases holding sensitive information
about a very large number of people. Amendment 13 also introduced a Data Protection Officer
duty for certain controllers, broadened what counts as sensitive information, and greatly
expanded the Authority's enforcement and administrative fine powers.

**Confirm the current thresholds with the Privacy Protection Authority or Israeli counsel
before concluding either way.** Secondary sources still describe the old regime, and the
thresholds are exactly the detail they get wrong.

## Part 1 — the database

| Question | Answer |
| --- | --- |
| Database name | [INSERT_DATABASE_NAME] |
| Controller | [INSERT_COMPANY_NAME], [INSERT_PHYSICAL_ADDRESS] |
| Contact | [INSERT_CONTACT_EMAIL] |
| Data protection contact | [INSERT_DPO_EMAIL] |
| Purpose of the database | |
| Is trading in data a principal purpose? | yes / no |
| Is the controller a public body? | yes / no |

## Part 2 — what is held

| Category | Held? | Roughly how many people |
| --- | --- | --- |
| Names and contact details | | |
| Identification numbers | | |
| Financial or payment information | | |
| Health information | | |
| Biometric data | | |
| Political, religious or philosophical views | | |
| Sexual orientation or intimate life | | |
| Criminal record | | |
| Location history | | |
| Behavioural or profiling data | | |

Total distinct individuals: ______

## Part 3 — where it is

| Question | Answer |
| --- | --- |
| Countries where the data is stored | |
| Cloud providers and regions | |
| Sub-processors with access | |
| Is any data transferred outside Israel? | yes / no |
| Backup locations | |

## Part 4 — security posture

The Data Security Regulations of 2017 assign a tier and attach obligations to it. Answer these
regardless of the registration conclusion, because the security duties apply either way.

| Control | In place? | Evidence |
| --- | --- | --- |
| Access to personal data is logged with actor, time, record and operation | | |
| Read access is logged, not only writes | | |
| Roles are defined with scoped permissions | | |
| A current list exists of who holds each role | | |
| Access rights are reviewed periodically | | |
| Backups run on a schedule | | |
| A restore has been tested, with a date | | |
| Data is encrypted at rest | | |
| Data is encrypted in transit | | |
| A security incident route to the Authority is documented | | |
| A person is named as responsible for data security | | |

## Part 5 — the conclusion

| Question | Answer |
| --- | --- |
| Does registration appear to be required? | yes / no / needs counsel |
| Who decided, and on what date | |
| If no, the reason in one sentence | |
| Date to review this again | |

Record the reasoning even when the answer is no. A documented negative conclusion is a defence.
An undocumented one is indistinguishable from never having asked.

---

## Notes for the drafter — delete before use

- **Hebrew is required** for any filing and for consumer-facing material derived from this.
- Part 4 is the part that matters even if registration does not apply. The security
  obligations under the 2017 Regulations do not depend on the registration question.
- The untested restore is the most common gap in Part 4. A backup nobody has restored is a
  hypothesis.
- Amendment 13's DPO duty may apply to you. Check it as a separate question from registration.
- Do not file anything produced from this worksheet without counsel reviewing it.

## Counsel must check — delete before publishing

- Whether registration is still required after Amendment 13 for this database.
- Whether a data protection officer or other new duty applies.
- Anything filed with the regulator, before it is filed.
