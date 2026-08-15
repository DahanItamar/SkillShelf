---
module: 1
domain: "Global Core Security & Architecture"
jurisdictions: ["*"]
last_verified: 2026-08-15
instruments:
  - name: "ISO/IEC 27001:2022"
    citation: "Annex A controls A.8.20 (Networks security), A.8.24 (Use of cryptography)"
    url: "https://www.iso.org/standard/27001"
  - name: "NIST Cybersecurity Framework 2.0"
    citation: "PR.AA (Identity Management, Authentication and Access Control), PR.DS (Data Security)"
    url: "https://www.nist.gov/cyberframework"
  - name: "OWASP Top 10 for LLM Applications"
    citation: "LLM01:2025 Prompt Injection; LLM05:2025 Improper Output Handling (LLM02 in the 2023 list)"
    url: "https://genai.owasp.org/llm-top-10/"
---

# Module 1 — Global Core Security & Architecture

The baseline that applies wherever a product touches a network, holds personal data, or calls
a language model. Loaded by **R02** (connected desktop), **R04** (any real data sensitivity),
**R06** (any AI integration) and **R12** (anything not purely on-premises).

`jurisdictions: ["*"]` because nothing here is a jurisdiction. ISO, NIST and OWASP are
standards and guidance, not law — they bind through contracts, certifications and negligence
arguments rather than statute. Say that plainly when applying this module: "ISO 27001 requires"
is wrong unless the organisation is certified. "A.8.24 is the control an auditor will ask about"
is right.

---

## Obligations

### 1.1 Least privilege, enforced in one place

Every identity — human, service, CI job — gets the narrowest permission set that lets it do
its work, and permission is checked server-side per request rather than by hiding UI.

**Citation:** NIST CSF 2.0 PR.AA-05 (access permissions incorporate least privilege and
separation of duties); ISO/IEC 27001:2022 A.8.2 (privileged access rights).

**In code:**

- One enforcement point — middleware, row-level security policy, or a repository layer.
  Never re-implemented per handler; the copy that gets missed is the one that leaks.
- Every query that reads a user-owned record is scoped by owner. An ID in a URL that nobody
  checked belongs to the caller is the most common real-world vulnerability there is.
- Service credentials are per-service, not one shared key. A CI token that can also read
  production data is not least privilege regardless of what the policy document says.
- No role is assignable by the user who holds it. Check signup and profile-update paths
  specifically — privilege escalation lives there.

### 1.2 Data at rest encrypted with AES-256

Persistent stores holding personal or confidential data are encrypted at rest with AES-256 or
stronger, and the key is not stored beside the data.

**Citation:** ISO/IEC 27001:2022 A.8.24 (use of cryptography); NIST CSF 2.0 PR.DS-01
(confidentiality, integrity and availability of data-at-rest are protected).

**In code:**

- Managed database: enable provider encryption at rest, and record that it is on. It is
  usually a checkbox, and it is usually assumed rather than verified.
- Self-managed or local: AES-256 explicitly. For a local client store this is Module 7's
  SQLCipher requirement, and the key belongs in the OS keychain.
- Backups are data at rest too. An encrypted database with plaintext nightly dumps in object
  storage is not encrypted at rest.
- Keys live in a secret manager or the platform keystore, never in the repository, never in
  an environment variable committed to an image.

### 1.3 Data in transit over TLS 1.3

Every network hop carrying personal or authenticated data uses TLS 1.3. TLS 1.2 is acceptable
only where a named third party has not upgraded; anything below it is not.

**Citation:** ISO/IEC 27001:2022 A.8.20 (networks security), A.8.24; NIST CSF 2.0 PR.DS-02
(data-in-transit are protected).

**In code:**

- HTTPS enforced with a redirect *and* HSTS. A redirect alone leaves the first request in the
  clear, which is the request carrying the session cookie.
- Internal service-to-service calls are included. "It is inside the VPC" is a network
  assumption, not a cryptographic one.
- Certificate verification is never disabled. `rejectUnauthorized: false`, `verify=False` and
  `InsecureSkipVerify: true` are findings wherever they appear, including test configuration
  that ships.

### 1.4 No unauthenticated public object storage

Zero buckets, containers or blob stores readable without authentication, unless the content is
deliberately public and contains nothing user-derived.

**Citation:** NIST CSF 2.0 PR.AA-05; ISO/IEC 27001:2022 A.8.20.

**In code:**

- Block public access at the account level, not per bucket. Per-bucket settings are one
  console click away from being wrong, and nothing alerts you.
- User uploads are served through signed, expiring URLs — never a permanent public path, and
  never a path that reflects the user-supplied filename.
- Check infrastructure-as-code for `public-read`, `allUsers`, `AllowAnonymous`, and container
  access level `Blob` or `Container`.
- A public bucket holding personal data is a `blocker`. It is not a hardening opportunity;
  it is a disclosure that has probably already happened.

### 1.5 System instructions isolated from untrusted input

Where a language model is used, its instructions are structurally separated from content the
user or a third party controls, and retrieved content is never concatenated into the
instruction position.

**Citation:** OWASP Top 10 for LLM Applications, LLM01:2025 Prompt Injection.

**In code:**

- System prompt in the system role. User content in the user role. Never one string built by
  interpolation — `f"{system}\n\n{user_input}"` is the whole vulnerability in one line.
- Retrieved documents, tool results, scraped pages and file contents are untrusted. They
  describe things; they do not instruct.
- Privileged actions behind a confirmation the model cannot issue itself. A model that can be
  talked into deleting data will eventually be talked into it.
- Prompt injection is not solved by asking the model to ignore injections. Filters reduce
  incidence; only architecture removes the class.

### 1.6 Model output validated before it reaches a client

Anything a model produces is treated as untrusted input to whatever consumes it next.

**Citation:** OWASP Top 10 for LLM Applications, LLM05:2025 Improper Output Handling —
numbered LLM02 in the 2023 list, which is the numbering most existing material still uses.

**In code:**

- Model output rendered as HTML is sanitised. Markdown-to-HTML with raw HTML enabled is an
  XSS sink fed by an attacker-influenceable source.
- Model output is never passed to `eval`, a shell, a SQL string, or a file path without
  validation against an allowlist.
- Structured output is schema-validated before use. "It usually returns JSON" is not a parser.
- URLs a model emits are not fetched server-side without an allowlist — that is SSRF with an
  extra step.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-1-01 | Authorization enforced in one server-side place | Middleware, guards, RLS policies, repository layer; every route or handler file | A single named enforcement point exists and every user-scoped read passes through it | NIST CSF 2.0 PR.AA-05 | blocker |
| AUDIT-1-02 | Data at rest encrypted | IaC for the database; provider config; local store setup | Encryption at rest is explicitly enabled or AES-256 is explicitly applied, and backups are covered too | ISO/IEC 27001:2022 A.8.24 | blocker |
| AUDIT-1-03 | TLS 1.3 in transit, verification never disabled | Server and proxy config; every HTTP client construction | HTTPS is enforced with HSTS and no call site disables certificate verification | ISO/IEC 27001:2022 A.8.20 | blocker |
| AUDIT-1-04 | No unauthenticated public object storage | IaC and bucket policy: `public-read`, `allUsers`, `AllowAnonymous`, access level `Blob`/`Container` | No store holding user-derived content is readable without authentication | NIST CSF 2.0 PR.AA-05 | blocker |
| AUDIT-1-05 | System instructions isolated from user input | Every model call site; prompt construction and template files | Instructions occupy the system role and no user, retrieved or tool content is interpolated into it | OWASP LLM01:2025 | blocker |
| AUDIT-1-06 | Model output validated before use | Render paths for model output; any `eval`, shell, SQL or path built from it | Output is sanitised or schema-validated before rendering, execution or interpolation | OWASP LLM05:2025 | high |

**Reporting these:** a check that cannot be decided from the files available is `unverifiable`
with the reason — never `pass`. Encryption at rest on a managed provider is the usual case:
the setting lives in a console, not the repository, and saying so is the correct finding.
