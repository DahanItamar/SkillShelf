---
module: 5
domain: "Payment, Financial & Enterprise Vectors"
jurisdictions: ["*", "EU"]
last_verified: 2026-08-15
instruments:
  - name: "Payment Card Industry Data Security Standard v4.0.1"
    citation: "PCI DSS v4.0.1; SAQ A eligibility; Requirements 6.4.3 and 11.6.1"
    url: "https://www.pcisecuritystandards.org/document_library/"
  - name: "SAML 2.0"
    citation: "OASIS Security Assertion Markup Language v2.0, Core and Web Browser SSO Profile"
    url: "https://www.oasis-open.org/standard/saml/"
  - name: "OpenID Connect Core 1.0"
    citation: "OpenID Foundation, Core 1.0 incorporating errata"
    url: "https://openid.net/specs/openid-connect-core-1_0.html"
  - name: "NIS2 Directive"
    citation: "Directive (EU) 2022/2555, Art. 21(2)(d) supply chain security; Art. 23 incident reporting"
    url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj"
  - name: "NTIA Minimum Elements for a Software Bill of Materials"
    citation: "Minimum elements: data fields, automation support, practices and processes"
    url: "https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom"
---

# Module 5 — Payment, Financial & Enterprise Vectors

Loaded by **R03** (e-commerce) and **R05** (enterprise flag).

PCI DSS is contractual rather than statutory — it binds through the acquirer agreement, and
the consequence of failure is fines, forensic investigation costs, and losing the ability to
take card payments. That is usually worse than a regulatory outcome, and it arrives faster.

---

## Obligations

### 5.1 Card data never touches your infrastructure

Do not receive, process, transmit or store primary account numbers on systems you control.
Use a hosted payment page, or hosted fields / iframes served by the payment provider.

**Citation:** PCI DSS v4.0.1 — SAQ A eligibility criteria. SAQ A applies to merchants who have
fully outsourced all cardholder data functions, with no electronic storage, processing or
transmission on their systems.

**In code:**

- Stripe Elements, Checkout, or the equivalent hosted fields from your provider. The card input
  is an iframe from their origin; your JavaScript never reads it.
- No card number, CVV, or full track data in any log, error report, analytics event, session
  replay, or support tool. Session replay tools are the recurring offender — mask the payment
  frame explicitly.
- Store the provider's token, never a PAN. If a column could hold sixteen digits, check what
  actually lands in it.
- A single self-hosted card form drops you from SAQ A to SAQ D — from roughly twenty controls
  to over three hundred, plus quarterly scanning and possibly an on-site assessment. This is
  the most expensive architectural mistake available in this module.
- The payment page itself must be protected against script tampering: inventory the scripts
  that load on it, justify each, and detect unauthorised change. **Requirements 6.4.3 and
  11.6.1 became effective 31 March 2025** and apply to pages that accept payment even under
  SAQ A. Verify current SAQ A applicability with your acquirer — this area moved recently.

### 5.2 Enterprise identity: SAML 2.0 or OIDC, with tenant isolation

Enterprise customers require federated sign-on against their own identity provider, and
isolation guarantees between tenants.

**Citation:** OASIS SAML 2.0 Web Browser SSO Profile; OpenID Connect Core 1.0.

**In code:**

- Validate the assertion properly. Signature verified against the IdP's configured certificate,
  audience restriction checked, `NotBefore` and `NotOnOrAfter` enforced, assertion ID recorded
  to prevent replay. A SAML implementation that skips any of these is an authentication bypass,
  and XML signature wrapping is a live attack class, not a theoretical one.
- For OIDC: validate `iss`, `aud`, `exp`, `nonce`, and the signature against the published JWKS.
  Use the authorization code flow with PKCE; the implicit flow is not appropriate here.
- Bind the identity to a tenant. An assertion from tenant A's IdP must never resolve to a user
  in tenant B — check the email domain claim against the tenant's verified domains.
- Just-in-time provisioning respects role claims but never grants an unmapped role. A role
  string arriving from an IdP is input, not authority.
- Tenant isolation is enforced in one place — row-level security or a repository layer — not
  by a `WHERE tenant_id = ?` that every author has to remember.
- Deprovisioning matters as much as provisioning. SCIM, or a documented offboarding path;
  an ex-employee whose IdP account is disabled must lose access here too.

### 5.3 Software Bill of Materials, and supply chain security

Maintain a machine-readable inventory of dependencies, and manage vulnerabilities in them.

**Citation:** NIS2 Directive (EU) 2022/2555 Art. 21(2)(d) (security in supply chain relations);
NTIA Minimum Elements for an SBOM. NIS2 applies to essential and important entities in
scheduled sectors — check whether your customer's obligations flow to you contractually even
where the Directive does not bind you directly.

**In code:**

- Generate an SBOM in CycloneDX or SPDX at build time, from the lockfile, as a release
  artefact. An SBOM produced by hand is out of date the day after it is written.
- Lockfile committed, dependencies pinned. An SBOM of floating ranges describes nothing.
- Automated vulnerability scanning against the SBOM, with a stated response time by severity.
- Record component name, version, supplier, and unique identifier — the NTIA minimum fields.
- NIS2 Art. 23 requires early warning of significant incidents within 24 hours and a fuller
  notification within 72. If in scope, the reporting path is an operational artefact, not a
  policy paragraph.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-5-01 | No card data received or stored on own infrastructure | Payment components, form handlers, schema, API routes | Card entry is a provider-hosted iframe or hosted page; no field, column or handler receives a PAN | PCI DSS v4.0.1 SAQ A | blocker |
| AUDIT-5-02 | No card data in logs, errors, analytics or session replay | Logging config, error reporter, replay tool config | The payment frame is masked and no logging path can capture card fields | PCI DSS v4.0.1 Req. 3 | blocker |
| AUDIT-5-03 | Only provider tokens persisted | Payment and subscription tables | Stored values are opaque provider tokens; no column holds or could hold a PAN | PCI DSS v4.0.1 Req. 3 | blocker |
| AUDIT-5-04 | Payment page scripts inventoried and change-detected | Payment page markup, CSP, script inventory | Scripts on the payment page are enumerated and justified, with tamper detection in place | PCI DSS v4.0.1 Req. 6.4.3, 11.6.1 | high |
| AUDIT-5-05 | SAML assertions fully validated | SAML handler, IdP configuration | Signature, audience, time bounds and replay protection are all enforced | OASIS SAML 2.0 Core | blocker |
| AUDIT-5-06 | OIDC tokens fully validated | OIDC callback handler | `iss`, `aud`, `exp`, `nonce` and signature are checked against the JWKS; code flow with PKCE | OpenID Connect Core 1.0 | blocker |
| AUDIT-5-07 | Federated identity bound to the correct tenant | SSO callback, tenant resolution | An assertion resolves only within the tenant whose IdP issued it, checked against verified domains | OASIS SAML 2.0 | blocker |
| AUDIT-5-08 | Tenant isolation enforced in one place | RLS policies, repository layer, query builders | A single named mechanism scopes every tenant-owned query | PCI DSS v4.0.1 Req. 7 | blocker |
| AUDIT-5-09 | SBOM generated at build from a committed lockfile | CI workflow, build scripts, release artefacts | A CycloneDX or SPDX document is produced per release, from pinned dependencies | NIS2 Art. 21(2)(d); NTIA minimum elements | high |
| AUDIT-5-10 | Dependency vulnerabilities scanned with a response policy | CI config, security policy | Automated scanning runs on every build and a documented response time exists by severity | NIS2 Art. 21(2)(d) | medium |

**Reporting these:** AUDIT-5-01 is the check most worth being pedantic about. A codebase can
look fully outsourced and still have one legacy admin form that accepts a card number over the
phone. Search for the field, not for the integration.
