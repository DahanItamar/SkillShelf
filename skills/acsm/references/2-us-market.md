---
module: 2
domain: "US Federal & State Regulations"
jurisdictions: ["US"]
last_verified: 2026-08-15
instruments:
  - name: "FTC Act Section 5"
    citation: "15 U.S.C. § 45 (unfair or deceptive acts or practices)"
    url: "https://www.law.cornell.edu/uscode/text/15/45"
  - name: "Rule on the Use of Consumer Reviews and Testimonials"
    citation: "16 CFR Part 465, effective 21 October 2024"
    url: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465"
  - name: "Restore Online Shoppers' Confidence Act"
    citation: "ROSCA, 15 U.S.C. §§ 8401–8405"
    url: "https://www.law.cornell.edu/uscode/text/15/chapter-110"
  - name: "California Consumer Privacy Act, as amended by the CPRA"
    citation: "Cal. Civ. Code §§ 1798.100, 1798.105, 1798.120, 1798.130"
    url: "https://cppa.ca.gov/regulations/"
  - name: "Children's Online Privacy Protection Rule"
    citation: "COPPA, 16 CFR Part 312"
    url: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312"
---

# Module 2 — US Federal & State Regulations

Loaded by **R09** whenever `targetMarkets` includes `US`, and by `Global`.

The US has no general federal privacy statute. What it has is a deception statute the FTC
enforces broadly, a subscription statute, and a patchwork of state privacy laws of which
California's is the strictest and the one most products build to. Building to CCPA and
applying it nationally is usually cheaper than segmenting by state — but that is a business
decision, not a legal requirement, and it should be recorded as one.

---

## Obligations

### 2.1 No fake, undisclosed-incentive, or fabricated testimonials

Reviews and testimonials must come from real people with real experience of the product.
Generating them — including with a language model — is prohibited, as is buying them,
suppressing negative ones, or failing to disclose a material connection.

**Citation:** 16 CFR Part 465 §§ 465.2 (fake or false consumer reviews and testimonials),
465.4 (buying positive or negative reviews), 465.6 (review suppression); FTC Act § 5,
15 U.S.C. § 45. Civil penalties apply per violation.

**In code:**

- No seeding a reviews table with generated content. Ever, including for a demo — demo data
  that ships is the classic route to a violation nobody intended.
- Incentivised reviews carry a visible disclosure stored alongside the review, not applied at
  render time by a flag someone can forget.
- Review display must not filter by rating in a way that suppresses negatives. A "most
  helpful" sort that structurally buries one-star reviews is the conduct § 465.6 describes.
- Insider reviews — employees, founders, their families — need a clear disclosure.
- If an AI feature *summarises* reviews, the summary is your statement about them and must be
  representative. This is the live edge: summarising ten reviews as "customers love it" when
  four are negative is a § 5 deception question with no case law to hide behind.

### 2.2 Subscriptions: disclose before billing, and make cancellation simple

Before obtaining billing information, disclose all material terms clearly and conspicuously,
get informed consent to the negative-option feature, and provide a simple mechanism to stop
recurring charges.

**Citation:** ROSCA, 15 U.S.C. § 8403.

**Currency note — read this before citing "click to cancel".** The FTC's 2024 Negative Option
Rule (16 CFR Part 425), which imposed the widely reported click-to-cancel requirement, was
**vacated by the Eighth Circuit in July 2025**. ROSCA remains fully in force, as do state
auto-renewal laws — California's ARL (Cal. Bus. & Prof. Code § 17600 et seq.) is the strictest
and independently requires cancellation through the same medium used to subscribe. Build to
the state laws; do not cite Part 425 as current. **Re-verify this before relying on it.**

**In code:**

- Terms rendered adjacent to the payment control — price, billing period, renewal behaviour,
  cancellation route. Not behind a link, not in a collapsed accordion.
- Consent to recurring billing is a separate affirmative act from placing the order, and the
  record of it is stored with a timestamp.
- Online cancellation for online signup. If the user subscribed in a browser, they cancel in a
  browser — no phone call, no retention gauntlet that cannot be skipped.
- Renewal reminders before annual or long-cycle charges. Several state ARLs require them.

### 2.3 Notice at Collection

At or before the point of collection, tell the consumer what categories of personal
information you collect, the purposes, whether it is sold or shared, and the retention period.

**Citation:** Cal. Civ. Code § 1798.100(a); § 1798.130(a)(5).

**In code:**

- The notice appears at the collection surface — the form, the signup screen — not only in a
  privacy policy the user reaches later.
- Retention is stated as a period or the criteria used to determine it. "As long as necessary"
  alone does not satisfy § 1798.100(a)(3).
- Collecting a new category, or using an existing one for a new purpose, requires new notice
  before that use. A schema migration adding a field is the moment to check this.

### 2.4 Deletion, and Do Not Sell or Share

Honour verifiable deletion requests, and give consumers a clear way to opt out of the sale or
sharing of their personal information — including cross-context behavioural advertising.

**Citation:** Cal. Civ. Code § 1798.105 (deletion), § 1798.120 (opt-out of sale/sharing),
§ 1798.135 (the link and its wording).

**In code:**

- A deletion endpoint that actually cascades: primary tables, replicas, search indexes,
  analytics warehouses, object storage, backups on their next rotation, and any model
  fine-tuned or prompt-cached on the data. Enumerate the destinations; an erasure that
  misses the warehouse is the common failure.
- Service providers are told to delete too. § 1798.105(c)(3) makes that your obligation.
- A link titled **"Do Not Sell or Share My Personal Information"** — that wording, in the
  footer, on every page, reachable without an account.
- Honour Global Privacy Control. A GPC signal is a legally effective opt-out request in
  California, and it arrives as an HTTP header your server has to read.
- Statutory exceptions to deletion exist — transaction completion, security, legal compliance.
  Implement them as an explicit, logged allowlist, not as an accident of which table you forgot.

### 2.5 Verifiable parental consent under 13

If the service is directed to children under 13, or you have actual knowledge a user is under
13, obtain verifiable parental consent before collecting personal information.

**Citation:** COPPA, 16 CFR §§ 312.4 (notice), 312.5 (parental consent), 312.7 (no
conditioning participation on excess collection), 312.10 (retention limits).

**In code:**

- An age gate that does not encourage lying — neutral date entry, no "you must be 13+" prompt
  before the question.
- "Verifiable" means more than a checkbox: a charge to a payment card, signed consent form,
  government ID check, or a knowledge-based challenge. A parent's email address alone
  satisfies it only for internal-use collection.
- Under-13 accounts collect the minimum. No behavioural advertising identifiers, no persistent
  cross-site identifiers beyond internal operations.
- Actual knowledge is a trigger you can create. A support ticket saying "my daughter is 11"
  puts you on notice, so the support tooling needs a path for it.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-2-01 | No generated or fake reviews; incentives disclosed | Reviews/testimonials tables, seed and fixture files, admin tooling | No seeded or model-generated review content exists, and incentivised reviews carry a stored disclosure | 16 CFR § 465.2 | blocker |
| AUDIT-2-02 | Review display does not suppress negatives | Review query, default sort and filter logic | No default filter or sort structurally excludes or buries low ratings | 16 CFR § 465.6 | high |
| AUDIT-2-03 | Subscription terms disclosed before billing details | Checkout and signup components; payment form | Price, period, renewal and cancellation route render adjacent to the payment control, with a separately recorded consent | ROSCA 15 U.S.C. § 8403 | blocker |
| AUDIT-2-04 | Online cancellation available to online subscribers | Account routes; cancellation flow | A logged-in user can cancel without leaving the product, and the path is reachable in the UI | ROSCA § 8403; Cal. Bus. & Prof. Code § 17602 | blocker |
| AUDIT-2-05 | Notice at Collection at the collection point | Signup, checkout and any form writing personal data | Categories, purposes, sale/share status and retention appear at or before collection | Cal. Civ. Code § 1798.100(a) | high |
| AUDIT-2-06 | Deletion endpoint cascades to every store | Deletion handler; list of data destinations, search indexes, warehouses, object storage | Every enumerated destination is covered, and service providers are notified | Cal. Civ. Code § 1798.105 | blocker |
| AUDIT-2-07 | Do Not Sell or Share link present and correctly worded | Footer component; routes | A link reading "Do Not Sell or Share My Personal Information" exists site-wide and needs no account | Cal. Civ. Code § 1798.135 | blocker |
| AUDIT-2-08 | Global Privacy Control honoured | Request middleware; consent state | The `Sec-GPC` header is read and treated as an opt-out request | Cal. Civ. Code § 1798.135(b) | high |
| AUDIT-2-09 | Verifiable parental consent where under-13 users are possible | Age gate; signup; consent records | An age gate exists and under-13 signup is blocked pending a verifiable consent method | 16 CFR § 312.5 | blocker |

**Reporting these:** `n/a` is a real verdict here. A B2B product with no consumer reviews, no
subscription, and no under-13 users legitimately fails to trigger most of this module — say so
per check rather than reporting a wall of passes that were never tested.
