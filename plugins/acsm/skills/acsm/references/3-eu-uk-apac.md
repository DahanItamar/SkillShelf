---
module: 3
domain: "European, UK & APAC Jurisdictions"
jurisdictions: ["EU", "GB", "AU"]
last_verified: 2026-08-15
instruments:
  - name: "General Data Protection Regulation"
    citation: "Regulation (EU) 2016/679, Arts. 6, 13–14, 15, 17, 25, 30, 32, 33"
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj"
  - name: "ePrivacy Directive"
    citation: "Directive 2002/58/EC Art. 5(3), as amended by 2009/136/EC"
    url: "https://eur-lex.europa.eu/eli/dir/2002/58/oj"
  - name: "EU Artificial Intelligence Act"
    citation: "Regulation (EU) 2024/1689, Art. 50 (transparency obligations)"
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
  - name: "UK Data Protection Act 2018"
    citation: "UK GDPR and DPA 2018, as amended by the Data (Use and Access) Act 2025"
    url: "https://www.legislation.gov.uk/ukpga/2018/12/contents"
  - name: "Online Safety Act 2023"
    citation: "OSA 2023, duties of care for user-to-user and search services"
    url: "https://www.legislation.gov.uk/ukpga/2023/50/contents"
  - name: "Privacy Act 1988 (Cth)"
    citation: "Australian Privacy Principles, Schedule 1 — APP 6, 7, 8, 11"
    url: "https://www.oaic.gov.au/privacy/australian-privacy-principles"
---

# Module 3 — European, UK & APAC Jurisdictions

Loaded by **R07** (EU), **R10** (UK/APAC), and by **R04** and **R06** regardless of market —
because the erasure machinery GDPR Art. 17 describes is the same machinery every other
regime's deletion right needs, and the AI transparency rules are the strictest anywhere.

This is the module with the sharpest teeth. GDPR fines reach 4% of global annual turnover, and
the AI Act's transparency obligations under Art. 50 **became applicable on 2 August 2026** —
which is thirteen days before this module's `last_verified` date. Anything shipped before then
is now in scope.

---

## Obligations

### 3.1 No non-essential cookie or tracker before opt-in consent

Storing or reading information on a user's device requires prior informed consent, unless it
is strictly necessary to deliver a service the user explicitly requested.

**Citation:** ePrivacy Directive 2002/58/EC Art. 5(3); consent standard from GDPR Art. 4(11)
and Art. 7.

**In code:**

- Analytics, advertising, heatmap, session-replay and A/B scripts do not load until consent.
  Loading them and "not firing" is still storage on the device.
- Reject must be as easy as accept — same level, same prominence, same number of clicks. A
  banner with a bright Accept and a buried Manage is the single most-fined pattern in Europe.
- No pre-ticked boxes, no implied consent from scrolling, no cookie wall unless a genuine
  equivalent alternative exists.
- Consent is recorded with what was consented to and when, and is withdrawable as easily as
  it was given.
- Strictly necessary is narrow: session, load balancing, security, and the cart. Not analytics,
  however anonymised you believe it to be.

### 3.2 Erasure that reaches every copy

On a valid Art. 17 request, erase personal data across every system that holds it — including
derived, cached and training copies.

**Citation:** GDPR Art. 17 (right to erasure); Art. 19 (communicating erasure to recipients);
Art. 5(1)(e) (storage limitation).

**In code:**

- Enumerate destinations explicitly: primary database, read replicas, search index, analytics
  warehouse, object storage, message queues, logs, error-tracking payloads, backups, and any
  model fine-tuned or prompt-cached on the data.
- Backups are the honest hard case. The defensible position is documented rotation with
  erasure applied on restore — not silence.
- Processors are instructed to erase, and Art. 19 requires telling recipients you disclosed to.
- One month to respond, extendable by two with reason. Build the clock, not just the endpoint.
- Exemptions are real (legal obligation, legal claims, freedom of expression) — implement them
  as a logged allowlist, so a refusal can be explained.

### 3.3 Data protection by design and by default

Privacy protections are built into processing from the outset, and the default configuration
collects the minimum.

**Citation:** GDPR Art. 25; Art. 32 (security of processing); Art. 30 (records of processing).

**In code:**

- Default settings are the private ones. Public-by-default profiles are the archetypal Art. 25
  failure.
- Every field collected maps to a stated purpose and a lawful basis under Art. 6. A column
  nobody can justify is a column to drop.
- Pseudonymise where the identifier is not needed for the purpose.
- Records of processing (Art. 30) are a real artefact, not a formality — they are the first
  thing a regulator asks for.

### 3.4 Tell users when they are interacting with AI, and mark what it generates

Natural persons must be informed when they interact with an AI system, and synthetic
audio, image, video or text must be marked in a machine-readable way as artificially
generated or manipulated.

**Citation:** Regulation (EU) 2024/1689 Art. 50(1) (disclosure of AI interaction), Art. 50(2)
(machine-readable marking of synthetic content), Art. 50(4) (deep fakes and public-interest
text). Applicable from **2 August 2026**.

**In code:**

- The disclosure is visible at the point of interaction, not buried in terms. A chat interface
  says it is an AI before the first exchange, unless it is obvious to a reasonably informed
  person — and "obvious" is a defence you should not want to argue.
- Generated media carries machine-readable provenance. C2PA Content Credentials is the
  interoperable option; embedded metadata alone is stripped by every social platform, so mark
  at the point of generation and expect the mark to be the file's own.
- Deep fakes and AI-generated text published to inform the public on matters of public
  interest carry a visible disclosure too, not only a metadata mark.
- Exemptions exist for assistive editing that does not substantially alter the input. Do not
  stretch them; the exemption is narrow and the penalty is not.

### 3.5 UK — same core rules, separate regulator, plus a duty of care

The UK GDPR mirrors the EU regime with UK-specific amendments. Services allowing user-to-user
content additionally carry Online Safety Act duties.

**Citation:** UK GDPR and Data Protection Act 2018, as amended by the Data (Use and Access)
Act 2025; Online Safety Act 2023. Enforced by the ICO and Ofcom respectively.

**In code:**

- UK transfers are a separate assessment from EU transfers. The UK IDTA or the UK Addendum to
  the EU SCCs, not the SCCs alone.
- Where children can access a user-to-user service: risk assessment, age assurance, reporting
  and complaints routes, and the ICO's Age Appropriate Design Code defaults.
- The DUAA 2025 changed parts of the UK regime including automated decision-making and
  legitimate-interest processing. **Re-verify the specifics before relying on them** — this is
  the most recently moving instrument in this module.

### 3.6 Australia — the 13 Australian Privacy Principles

Collection, use, disclosure, direct marketing, cross-border transfer and security are governed
by the APPs, which bind by their own terms rather than by a consent-first model.

**Citation:** Privacy Act 1988 (Cth) Schedule 1 — APP 6 (use and disclosure), APP 7 (direct
marketing), APP 8 (cross-border disclosure), APP 11 (security), as amended by the Privacy and
Other Legislation Amendment Act 2024.

**In code:**

- APP 8: sending personal information overseas makes you accountable for the recipient's acts.
  Contractual guarantees are the mechanism; know which sub-processors sit where.
- APP 7: direct marketing requires a simple opt-out in every message and honouring it promptly.
- APP 11: reasonable security steps, and destruction or de-identification when no longer needed.
- The 2024 amendments introduced a statutory tort for serious invasions of privacy and a
  Children's Online Privacy Code. **Re-verify commencement dates** before relying on either.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-3-01 | No non-essential script before consent | `index.html`, layout components, tag manager config, analytics init | Every analytics, ad and replay script is gated behind a recorded consent state | ePrivacy 2002/58/EC Art. 5(3) | blocker |
| AUDIT-3-02 | Reject is as easy as accept | Consent banner component | Reject and Accept sit at the same level with equivalent prominence and click cost | GDPR Art. 4(11), Art. 7 | blocker |
| AUDIT-3-03 | Consent is recorded and withdrawable | Consent storage; account settings | Scope and timestamp are stored, and a withdrawal path exists as easy as the grant | GDPR Art. 7(3) | high |
| AUDIT-3-04 | Erasure reaches every enumerated destination | Deletion handler; data-store inventory | Every store — including search, warehouse, object storage and model artefacts — is covered, with backups documented | GDPR Art. 17 | blocker |
| AUDIT-3-05 | Private-by-default configuration | Default values in user/profile models and settings | Defaults are the privacy-protective option; nothing is public without an act | GDPR Art. 25(2) | high |
| AUDIT-3-06 | Every collected field has a purpose and lawful basis | Schema, migrations, records of processing | No field lacks a documented purpose and Art. 6 basis | GDPR Art. 6, Art. 30 | high |
| AUDIT-3-07 | AI interaction disclosed at the point of use | Chat/assistant entry points; first-render components | The interface states it is AI before the first exchange, visibly | AI Act Art. 50(1) | blocker |
| AUDIT-3-08 | Generated media machine-readably marked | Media generation and export paths | Provenance is attached at generation, in an interoperable format | AI Act Art. 50(2) | blocker |
| AUDIT-3-09 | UK transfers covered by IDTA or UK Addendum | Transfer documentation; sub-processor list | UK transfers are covered by a UK-specific instrument, not EU SCCs alone | UK GDPR; DPA 2018 | high |
| AUDIT-3-10 | Direct marketing carries a working opt-out | Email/SMS send paths; unsubscribe handling | Every marketing message carries an opt-out honoured promptly | Privacy Act 1988 APP 7 | high |
| AUDIT-3-11 | Cross-border recipients under contractual guarantee | Sub-processor register; DPAs | Every overseas recipient of personal information is covered by binding terms | Privacy Act 1988 APP 8 | medium |

**Reporting these:** AUDIT-3-04 is the one most often reported `pass` on insufficient evidence.
A deletion endpoint that returns 200 proves nothing about the search index. If the destination
inventory does not exist in the repository, the correct verdict is `unverifiable`, naming what
would settle it.
