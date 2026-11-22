---
module: 8
domain: "Auditability & Observability"
jurisdictions: ["*", "EU", "IL"]
last_verified: 2026-08-15
instruments:
  - name: "ISO/IEC 27001:2022"
    citation: "Annex A controls A.8.15 (Logging), A.8.16 (Monitoring activities), A.8.17 (Clock synchronisation)"
    url: "https://www.iso.org/standard/27001"
  - name: "NIST Cybersecurity Framework 2.0"
    citation: "PR.PS-04 (log records are generated and made available), DE.AE (adverse event analysis), DE.CM (continuous monitoring)"
    url: "https://www.nist.gov/cyberframework"
  - name: "General Data Protection Regulation"
    citation: "Regulation (EU) 2016/679, Art. 30 (records of processing), Art. 33 (breach notification within 72 hours)"
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj"
  - name: "Privacy Protection Regulations (Data Security) 5777-2017"
    citation: "Access logging and periodic review obligations"
    url: "https://www.gov.il/en/departments/the_privacy_protection_authority"
  - name: "NIS2 Directive"
    citation: "Directive (EU) 2022/2555, Art. 23 — early warning within 24 hours, notification within 72"
    url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj"
---

# Module 8 — Auditability & Observability

Loaded by **R02** (connected desktop), **R05** (enterprise flag) and **R12** (any non-on-prem
infrastructure).

**This module exists because the Regwise routing rules demanded it.** R02 and R05 in the source
material both stack "Module 8", while the source module tree defined only seven. Folding audit
logging into Module 1 would have made `STACK Module 7 + Module 1 + Module 8` reference the same
file twice and erased the distinction between baseline security and the ability to answer
"who saw this record, and when" — which is a separate obligation with separate regulators.

The test for everything here: **after an incident, can you reconstruct what happened?** A
system that cannot answer that has no audit trail regardless of how much it logs.

---

## Obligations

### 8.1 Log access to personal data — actor, time, record, operation

Access to systems holding personal data produces a log entry identifying who did what to
which record, and when.

**Citation:** ISO/IEC 27001:2022 A.8.15 (logging); NIST CSF 2.0 PR.PS-04; Privacy Protection
Regulations (Data Security) 5777-2017 — Israel is among the few regimes requiring access
logging **by name** rather than by implication (Module 4).

**In code:**

- Four fields minimum: actor identity, timestamp, record or resource identifier, operation.
  An entry missing the actor is a metric, not an audit record.
- Log the read, not only the write. "Who viewed this customer's file" is the question audits
  actually ask, and read logging is the part almost always missing.
- Administrative and support access is logged loudest. Staff impersonating a user to debug is
  legitimate and must leave a trail — including who authorised it.
- Authentication events: success, failure, lockout, password change, MFA enrolment, session
  revocation.
- Authorisation denials too. A burst of 403s is the signal that something is being probed.

### 8.2 Audit logs are append-only and outlive the actor

An audit trail an attacker or an administrator can quietly edit is not evidence.

**Citation:** ISO/IEC 27001:2022 A.8.15; NIST CSF 2.0 PR.PS-04.

**In code:**

- Append-only in practice: no `UPDATE` or `DELETE` path on the audit table, enforced by
  permission rather than by convention. The application's database role should lack the grant.
- Ship logs off the machine that generates them. A host that is compromised keeps logs an
  attacker controls.
- Retention is a stated period, aligned with the longest applicable obligation, and it is
  enforced by a job rather than by disk exhaustion.
- The audit trail survives deletion of the subject. Erasing a user's personal data does not
  erase the record that an administrator accessed it — those are different questions, and
  GDPR Art. 17 does not require destroying the accountability record. Pseudonymise the subject
  reference; keep the event.

### 8.3 Clocks synchronised, timestamps unambiguous

Correlating events across services requires that their clocks agree.

**Citation:** ISO/IEC 27001:2022 A.8.17 (clock synchronisation).

**In code:**

- NTP on every host. A ten-minute skew makes an incident timeline unreconstructable, and it is
  discovered during the incident.
- Timestamps stored in UTC with timezone, ISO 8601, converted only at display. A local-time
  log across a DST transition contains an hour that happened twice.
- Include a correlation or request identifier on every entry so a single user action can be
  traced across services.

### 8.4 Logs carry no secrets and no unnecessary personal data

A log aggregator is a second copy of everything logged, usually with broader access than the
database and a longer retention.

**Citation:** GDPR Art. 5(1)(c) data minimisation, Art. 32 security of processing; ISO/IEC
27001:2022 A.8.15.

**In code:**

- No passwords, tokens, API keys, session identifiers, card numbers or full request bodies.
  Redact at the logging layer, not at each call site — the call site that forgets is the one
  that leaks.
- Error reporters capture more than people expect: request bodies, local variables, headers.
  Configure the scrubber and verify it with a deliberate test event.
- Reference personal data by identifier where the value itself is not needed. `user_id=4821`
  answers the audit question; the email address usually does not.
- Logs are in scope for erasure requests where they contain personal data. This is the
  destination most often missed in a deletion cascade (Module 2, Module 3).

### 8.5 Records of processing, and a breach path that exists before you need it

Maintain the Art. 30 record, and know the notification route and clock before an incident.

**Citation:** GDPR Art. 30 (records of processing activities), Art. 33 (notification to the
supervisory authority without undue delay and, where feasible, within 72 hours of awareness);
NIS2 Directive (EU) 2022/2555 Art. 23 (early warning within 24 hours, notification within 72,
where in scope).

**In code and process:**

- The Art. 30 record is a maintained artefact naming purposes, categories, recipients,
  transfers and retention. It is the first document a regulator requests.
- The 72-hour clock starts at *awareness*, not at confirmation, and not at the end of the
  investigation. Build detection that makes awareness a defined moment.
- Know which authority, which form, and who signs it. NIS2 adds a 24-hour early warning for
  in-scope entities — a shorter clock than most teams assume they have.
- Run the restore and the incident path as an exercise. An untested backup and an untested
  notification route fail the same way, for the same reason.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-8-01 | Personal-data access produces a log entry with four fields | Data-access layer, middleware, audit table schema | Entries carry actor, timestamp, record identifier and operation | ISO/IEC 27001:2022 A.8.15 | blocker |
| AUDIT-8-02 | Reads are logged, not only writes | Query paths for personal data | Read access to personal records produces audit entries | Data Security Regs. 5777-2017 | high |
| AUDIT-8-03 | Administrative and impersonation access logged distinctly | Admin tooling, support impersonation feature | Staff access is recorded with the acting identity and the authorisation for it | ISO/IEC 27001:2022 A.8.15 | blocker |
| AUDIT-8-04 | Authentication and authorisation events logged | Auth handlers, permission checks | Success, failure, lockout, credential change and denial events are recorded | NIST CSF 2.0 DE.CM | high |
| AUDIT-8-05 | Audit records are append-only | Audit table permissions, migrations, ORM models | No update or delete path exists for audit rows, enforced by database grant | ISO/IEC 27001:2022 A.8.15 | blocker |
| AUDIT-8-06 | Logs shipped off the generating host | Logging configuration, IaC | Logs are forwarded to a separate system with its own access control | NIST CSF 2.0 PR.PS-04 | high |
| AUDIT-8-07 | Retention stated and enforced by a job | Retention configuration, scheduled tasks | A defined period exists and something enforces it | GDPR Art. 5(1)(e) | medium |
| AUDIT-8-08 | Audit trail survives subject erasure, pseudonymised | Deletion cascade, audit table handling | Erasure pseudonymises the subject reference without destroying the event record | GDPR Art. 17, Art. 30 | high |
| AUDIT-8-09 | Clocks synchronised, timestamps UTC and ISO 8601 | Host configuration, timestamp columns and formatters | NTP configured; stored timestamps are UTC with timezone | ISO/IEC 27001:2022 A.8.17 | medium |
| AUDIT-8-10 | Correlation identifier on every entry | Request middleware, log formatter | A request or trace identifier is attached and propagated across services | NIST CSF 2.0 DE.AE | medium |
| AUDIT-8-11 | No secrets or unnecessary personal data in logs | Log formatter, error reporter scrubbing config | Redaction is configured centrally and covers credentials, tokens and request bodies | GDPR Art. 32 | blocker |
| AUDIT-8-12 | Logs included in the erasure cascade | Deletion handler, destination inventory | Log stores appear in the enumerated deletion destinations | GDPR Art. 17 | high |
| AUDIT-8-13 | Records of processing maintained | `docs/`, compliance artefacts, ROPA | An Art. 30 record exists naming purposes, categories, recipients, transfers and retention | GDPR Art. 30 | high |
| AUDIT-8-14 | Breach notification route and clock defined | Incident runbook, security policy | The authority, the form, the owner and the 72-hour (and where applicable 24-hour) clocks are documented | GDPR Art. 33; NIS2 Art. 23 | high |

**Reporting these:** AUDIT-8-05 is the one worth the extra minute. An audit table with an
`updated_at` column, an ORM model exposing `save()`, or an application role holding `UPDATE`
means the trail is editable by the same credential an attacker would obtain first. Check the
grant, not the intention.
