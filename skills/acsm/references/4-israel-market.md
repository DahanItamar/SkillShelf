---
module: 4
domain: "Israeli Market Regulations"
jurisdictions: ["IL"]
last_verified: 2026-08-15
instruments:
  - name: "Protection of Privacy Law 5741-1981"
    citation: "As substantially amended by Amendment 13 (5784-2024), in force 14 August 2025"
    url: "https://www.gov.il/en/departments/the_privacy_protection_authority"
  - name: "Privacy Protection Regulations (Data Security) 5777-2017"
    citation: "Security tiers, access logging, role management, backups"
    url: "https://www.gov.il/en/departments/the_privacy_protection_authority"
  - name: "Communications Law (Telecommunications and Broadcasts) 5742-1982"
    citation: "Section 30A (the Spam Law) — prior consent, opt-out in every message"
    url: "https://www.gov.il/en/departments/ministry_of_communications"
  - name: "Consumer Protection Law 5741-1981"
    citation: "Sections 13C–13G (continuing transactions and cancellation)"
    url: "https://www.gov.il/en/departments/consumer_protection_and_fair_trade_authority"
---

# Module 4 — Israeli Market Regulations

Loaded by **R08** whenever `targetMarkets` includes `Israel`, and by `Global`.

Three separate regimes with three separate regulators: the Privacy Protection Authority for
data, the Ministry of Communications for marketing messages, and the Consumer Protection and
Fair Trade Authority for subscriptions. They are commonly confused, and complying with one
says nothing about the others.

**Language:** consumer-facing disclosures, consent wording and cancellation interfaces
generally need to be in Hebrew to be effective against Israeli consumers. ACSM flags which
sections require Hebrew but does not translate them — see §2 of the spec.

---

## Obligations

### 4.1 Database registration — narrower than most material claims

**Correction to widely circulated guidance.** The old rule — register any database holding
sensitive information or more than 10,000 records — was substantially narrowed by **Amendment
13 to the Protection of Privacy Law, in force 14 August 2025**. Registration is now required
for a much smaller set: broadly, databases whose principal purpose is trading in data,
databases held by public bodies, and databases holding sensitive data about a very large
number of people. Most ordinary SaaS databases no longer require registration.

Amendment 13 also introduced a **Data Protection Officer requirement** for certain
controllers, expanded the Authority's enforcement and administrative-fine powers
substantially, and broadened the definition of sensitive data.

**Citation:** Protection of Privacy Law 5741-1981, as amended by Amendment 13 (5784-2024).

**Treat the specifics as requiring verification.** This is the most recently and most heavily
amended instrument in ACSM, and the thresholds are exactly the kind of detail that
secondary sources still report from the pre-2025 regime. **Confirm current thresholds with the
Privacy Protection Authority or Israeli counsel before relying on a registration conclusion.**

**In code:**

- Maintain a data inventory good enough to answer the registration question: what is held,
  about how many people, how sensitive, and for what purpose.
- Where a DPO is required, the role is named and reachable — an address in the privacy notice,
  not a job title in an org chart.

### 4.2 Security tiers, access logging, roles and backups

The Data Security Regulations assign every database a security tier and attach concrete
obligations to it. Access logging and role management are not optional at any tier above basic.

**Citation:** Privacy Protection Regulations (Data Security) 5777-2017 — tier assignment,
access control and role definition, logging of access to the database, backup, and periodic
security review.

**In code:**

- Access to personal data is logged: who, when, which records, what operation. This is
  Module 8's territory and the Israeli regulations are among the few instruments that require
  it by name rather than by implication.
- Roles are defined explicitly, with a documented list of who holds each. "Everyone is an
  admin in staging" is a finding when staging holds real data.
- Backups on a schedule, with a **tested** restore. The regulations require the backup; the
  untested restore is what fails at 3am.
- Periodic review of access rights — a stale account of a departed employee is the archetypal
  finding here.
- Security incidents affecting a database of significant scale carry a notification duty to
  the Authority. Know the route before you need it.

### 4.3 Prior consent before marketing, opt-out in every message

Sending advertising by email, SMS, fax or automated dialling requires the recipient's prior
explicit consent, in writing, and every message must carry a simple, free way to opt out.

**Citation:** Communications Law (Telecommunications and Broadcasts) 5742-1982, Section 30A.
Section 30A(i) provides statutory damages of up to ILS 1,000 per message **without proof of
damage** — which is why this section produces class actions rather than regulator letters.

**In code:**

- Consent is explicit and recorded: who, when, what they were told they were consenting to.
  Double opt-in is the defensible implementation, because the record is the defence.
- Pre-ticked boxes and bundled consent do not work. Consent to marketing must be separable
  from consent to terms.
- Every message states the sender's name and contact details, marks itself as an
  advertisement, and carries an opt-out that costs the recipient nothing.
- Opt-out by reply must work for the channel used. An SMS campaign with an email-only
  unsubscribe fails § 30A.
- Opt-outs are honoured immediately and permanently, across every list. One suppression list,
  checked at send time — not per-campaign flags.
- The narrow existing-customer exception applies only to similar goods or services, with a
  clear opt-out given at the time of the original transaction. Do not lean on it.

### 4.4 Continuing transactions: clear terms, and cancellation that works

For continuing transactions, disclose the terms clearly, and allow cancellation by the same
means the consumer used to enter — including online. Cancellation must take effect promptly.

**Citation:** Consumer Protection Law 5741-1981, Sections 13C–13G. Cancellation requests
submitted online must be processed within a short statutory window — commonly cited as **three
business days** — and the trader must send confirmation.

**In code:**

- An online cancellation control for anyone who subscribed online. Not a phone number, not an
  email address, not a retention flow that cannot be exited.
- Cancellation is confirmed to the consumer in writing, with the effective date.
- Charges stop within the statutory window. A cancellation that stops billing "at the end of
  the next cycle" is a finding if the cycle exceeds the window.
- Terms — price, period, renewal, cancellation route — are disclosed before the transaction,
  in Hebrew, in a form the consumer can retain.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-4-01 | Data inventory sufficient to answer the registration question | Schema, migrations, any data map or ROPA in the repo | An inventory exists naming what personal data is held, about whom, and why | PPL 5741-1981, Amendment 13 | high |
| AUDIT-4-02 | Access to personal data is logged | Data-access layer, middleware, audit-log table | Reads and writes of personal data produce a log entry with actor, time, record and operation | Data Security Regs. 5777-2017 | blocker |
| AUDIT-4-03 | Roles defined explicitly, no blanket admin | Role definitions, seed data, environment configuration | Roles are enumerated with scoped permissions, and non-production environments holding real data are not blanket-admin | Data Security Regs. 5777-2017 | high |
| AUDIT-4-04 | Scheduled backups with a tested restore | Backup configuration, IaC, runbooks | A schedule exists and a restore procedure is documented as tested, not merely defined | Data Security Regs. 5777-2017 | high |
| AUDIT-4-05 | Marketing consent explicit, separable and recorded | Signup form, consent columns, marketing opt-in flow | Consent is a separate unticked act, stored with timestamp and scope; double opt-in where feasible | Communications Law § 30A | blocker |
| AUDIT-4-06 | Opt-out present in every marketing message and channel-appropriate | Email and SMS templates, send pipeline | Every template carries a free opt-out valid for its own channel | Communications Law § 30A | blocker |
| AUDIT-4-07 | One suppression list, honoured at send time | Send pipeline, suppression checks | Opt-outs are global and checked immediately before dispatch, not per campaign | Communications Law § 30A | blocker |
| AUDIT-4-08 | Online cancellation available and confirmed | Account routes, cancellation flow, confirmation email | An online subscriber can cancel online and receives written confirmation with an effective date | Consumer Protection Law §§ 13C–13G | blocker |
| AUDIT-4-09 | Cancellation takes effect within the statutory window | Billing logic, subscription state transitions | Charges cease within the statutory window rather than at the end of an arbitrary cycle | Consumer Protection Law §§ 13C–13G | high |
| AUDIT-4-10 | Consumer-facing terms available in Hebrew | Locale files, legal pages | Subscription terms, consent wording and cancellation UI exist in Hebrew | Consumer Protection Law § 13C | medium |

**Reporting these:** AUDIT-4-01 will usually be `unverifiable` from code alone — a registration
conclusion needs facts about headcount, purpose and data categories that no repository states.
Report what the code shows, name what is missing, and route the conclusion to counsel.
