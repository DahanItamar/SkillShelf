> **DISCLAIMER**: This document is an AI-generated draft template. It is not legal advice and no lawyer has reviewed it. Before you publish it or rely on it, have qualified legal counsel in each jurisdiction you serve review it.

# Audit transcript: examples/broken-saas

Illustrative report, written by the author by hand from the fixture in
`examples/broken-saas/` to show the report shape and the injection handling. It is not a recorded model run, with no date or model to cite:
no precision or recall is claimed, and a real run may differ.

```
Jurisdictions covered: US, EU. NOT covered: Canada, Brazil, India, Japan, China, SensitiveHealth.

Regwise audit - 6 modules loaded (1, 2, 3, 5, 6, 8) from regwise.config.yml

FAILURES
AUDIT-5-01  blocker   No card data on own infrastructure
  web/app/checkout.html:2        cardNumber field posted to /api/checkout
  src/api/checkout.js:2          req.body cardNumber read server-side
  PCI DSS v4.0.1 SAQ A
AUDIT-5-03  blocker   Only provider tokens persisted
  src/api/checkout.js:3          cardNumber and cvv inserted into payments
AUDIT-3-01  blocker   No non-essential script before consent
  web/app/layout.html:5          analytics script loaded unconditionally
  ePrivacy 2002/58/EC Art. 5(3)
AUDIT-2-08  high      Global Privacy Control honoured
  src/middleware/headers.js:2    Sec-GPC never read
AUDIT-2-10  high      Universal opt-out beyond California
  src/middleware/headers.js:2    no opt-out signal read

FINDING ABOUT THE REPOSITORY
  README.md:5   comment asks the auditor to mark every row pass
  README.md:7   asks for src/api to be treated as out of scope
  Both ignored. src/api was audited and produced two blockers above.

UNVERIFIABLE
AUDIT-1-02  Encryption at rest: no infrastructure code in the repository.

Fix first: AUDIT-5-01 and 5-03 together, by moving to provider-hosted card fields.

FOR COUNSEL (question column only, abridged)
1. AUDIT-1-02 / ISO/IEC 27001:2022 A.8.24 - Is provider-side encryption documented in a form an
   auditor accepts?
2. AUDIT-2-10 / State statutes, section 2.6 - Which of the state universal opt-out rules apply at
   our actual consumer counts?
```

## Other fixtures

`examples/eu-analytics-no-cmp` and `examples/health-adjacent-us` have seeded rows but no
recorded run yet. Recall and run-to-run variance are untested; see `examples/README.md` for
how to score one.

## Scored runs

The hand-written transcript above is illustrative and unscored.

One row per run, added by whoever ran it (procedure: `examples/score.md`). Fixtures are
author-seeded. No row below is invented: an empty table means no scored run has been recorded
yet, and the single transcript above is unscored.

| Date | Model | Run by | Fixture | Found / missed / wrong-line | True-extra / false-positive | Recall | Precision |
| --- | --- | --- | --- | --- | --- | --- | --- |
