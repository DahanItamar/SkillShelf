---
module: 7
domain: "Client Binary & Desktop Architecture"
jurisdictions: ["*"]
last_verified: 2026-08-15
instruments:
  - name: "CA/Browser Forum Baseline Requirements for Code Signing Certificates"
    citation: "Private key protection on FIPS 140-2 Level 2 or Common Criteria EAL4+ hardware, required since 1 June 2023"
    url: "https://cabforum.org/working-groups/code-signing/requirements/"
  - name: "NIST SP 800-218, Secure Software Development Framework"
    citation: "PS.2 (provide a mechanism to verify software release integrity); PW.4; RV.1"
    url: "https://csrc.nist.gov/pubs/sp/800/218/final"
  - name: "NIST SP 800-147B"
    citation: "BIOS Protection Guidelines for Servers — cited by the Regwise source material for update integrity"
    url: "https://csrc.nist.gov/pubs/sp/800/147/b/final"
  - name: "SQLCipher"
    citation: "AES-256 page-level encryption for SQLite databases"
    url: "https://www.zetetic.net/sqlcipher/"
---

# Module 7 — Client Binary & Desktop Architecture

Loaded by **R01** (local desktop) and **R02** (connected desktop).

A desktop application is code you ship to a machine you do not control, which inverts most web
assumptions. There is no server-side enforcement point, the user can read every byte you ship,
and an unsigned update channel is remote code execution with a friendly installer.

**Citation note.** The Regwise source material cites **NIST SP 800-147B** for binary integrity.
That document is *BIOS Protection Guidelines for Servers* — platform firmware, not application
binaries. It is kept in `instruments` above because the source names it and traceability
matters, but the applicable guidance for application release integrity is **NIST SP 800-218
(SSDF), practice PS.2**, and that is what the obligations below cite. Worth correcting wherever
the older citation has been copied forward.

---

## Obligations

### 7.1 Sign every binary, with a key you cannot export

Ship signed binaries on every platform. On Windows this is what SmartScreen evaluates; on macOS
it is Gatekeeper plus notarisation.

**Citation:** CA/Browser Forum Baseline Requirements for Code Signing Certificates — since
1 June 2023 private keys must be generated and stored on hardware meeting FIPS 140-2 Level 2,
Common Criteria EAL4+, or equivalent. NIST SP 800-218 PS.2.

**In code and process:**

- **Windows:** an EV or OV code signing certificate on a hardware token or cloud HSM. EV
  establishes SmartScreen reputation immediately; OV accumulates it slowly, which for a new
  product means users see a warning for months. Timestamp every signature so binaries stay
  valid past certificate expiry.
- **macOS:** Developer ID signing, hardened runtime, then **notarisation** and stapling.
  Signing alone is not enough — Gatekeeper on current macOS blocks un-notarised software.
  Declare entitlements narrowly; each one you request is attack surface you accept.
- **Linux:** sign packages and publish the repository key over HTTPS, or ship a signed
  AppImage with a published checksum.
- The signing key never sits on a build machine as a file. A key in CI secrets is exportable by
  anyone who can edit a workflow, and that is now a supply-chain compromise rather than a
  leaked credential.
- Publish checksums for every release artefact.

### 7.2 The update channel is signed, or it does not exist

Verify the signature of an update before executing it. Never fetch over plain HTTP, never
trust a redirect.

**Citation:** NIST SP 800-218 PS.2 and RV.1. An unsigned auto-update channel is the highest-
severity finding in this module: it converts any network position into code execution on every
installed machine.

**In code:**

- The update manifest and the payload are both signed, and the signature is verified against a
  key pinned in the shipped binary — not one fetched alongside the update.
- TLS with certificate validation, and no downgrade path. `InsecureSkipVerify` in an updater is
  a critical finding.
- Version rollback protection: refuse to install an older version than the one running, or an
  attacker replays a signed release with a known vulnerability.
- Tauri and Electron both provide signed-update mechanisms. Use the framework's, correctly
  configured, rather than a hand-rolled downloader.

### 7.3 Local data at rest is encrypted, with the key in the OS keychain

A local database holding personal or confidential data is encrypted, and the key lives in the
platform credential store.

**Citation:** ISO/IEC 27001:2022 A.8.24 (Module 1); SQLCipher for the SQLite case.

**In code:**

- SQLCipher with AES-256 for local SQLite. Plain SQLite in the user profile directory is a
  plaintext copy of everything, readable by any process running as that user.
- The key comes from **Keychain** on macOS, **DPAPI or Credential Manager** on Windows,
  **Secret Service / libsecret** on Linux. Never from a constant in the binary, never derived
  from a machine identifier alone — both are recoverable by anyone holding the file.
- Tokens and refresh credentials go in the keychain, not in `localStorage`, not in a JSON file
  beside the executable.
- If the local store is deliberately *not* encrypted, the spec and the user-facing
  documentation must say so plainly. An undocumented plaintext store is the finding; a
  documented one is a decision.

### 7.4 The renderer is untrusted

The UI layer never reaches the filesystem, the network or the OS directly. Every crossing is a
named, allowlisted command with a validated payload.

**Citation:** OWASP guidance for Electron and the Tauri security model; ISO/IEC 27001:2022
A.8.20 (Module 1).

**In code:**

- **Electron:** `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`. A preload
  script exposes a narrow, explicitly enumerated API through `contextBridge` — never the whole
  `ipcRenderer`, and never a generic "invoke anything" channel.
- **Tauri:** the capability and permission set is minimal and scoped. A broad filesystem scope
  is the same mistake in different syntax.
- Every path from user or renderer input is resolved and confirmed to sit under an allowed
  root. `../../` traversal is the bug here, and `path.join` does not prevent it.
- External links open in the system browser. `window.open` and navigation to untrusted origins
  inside an app window turns a phishing link into a same-context compromise.
- Disable DevTools in production builds, and do not ship source maps that reveal internals.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-7-01 | Release binaries are signed on every shipped platform | CI release workflow, packaging config, entitlements | Signing runs for each platform target, with timestamping on Windows and notarisation on macOS | CA/B Forum Code Signing BRs | blocker |
| AUDIT-7-02 | Signing key is not an exportable file in CI | CI secrets usage, signing step | Signing uses a hardware token, cloud HSM or platform signing service; no key material is written to disk | CA/B Forum Code Signing BRs | blocker |
| AUDIT-7-03 | Auto-update payloads are signature-verified against a pinned key | Updater configuration and handler | Manifest and payload signatures are verified against a key shipped in the binary, over validated TLS | NIST SP 800-218 PS.2 | blocker |
| AUDIT-7-04 | Update rollback protection present | Updater version comparison logic | Installing an older version than the running one is refused | NIST SP 800-218 RV.1 | high |
| AUDIT-7-05 | Local database encrypted with AES-256 | Database initialisation, connection setup | SQLCipher or equivalent is configured with a key, not opened as plain SQLite | ISO/IEC 27001:2022 A.8.24 | blocker |
| AUDIT-7-06 | Encryption key sourced from the OS credential store | Key retrieval code | The key comes from Keychain, DPAPI/Credential Manager or Secret Service; no hardcoded or machine-derived constant | ISO/IEC 27001:2022 A.8.24 | blocker |
| AUDIT-7-07 | Tokens stored in the keychain, not on disk | Auth token persistence | Access and refresh tokens are in the platform credential store, not `localStorage` or a config file | ISO/IEC 27001:2022 A.8.24 | high |
| AUDIT-7-08 | Renderer isolated from Node and the OS | Electron `webPreferences`, Tauri capabilities, preload script | `contextIsolation` on, `nodeIntegration` off, sandbox on; the exposed API is explicitly enumerated | OWASP Electron guidance | blocker |
| AUDIT-7-09 | IPC surface is an allowlist with validated payloads | IPC command definitions, preload bridge | Each channel is named and its payload validated; no generic execute-anything channel exists | OWASP Electron guidance | blocker |
| AUDIT-7-10 | Filesystem paths confined to an allowed root | Any handler taking a path from the renderer | Paths are resolved and confirmed under an allowed root before use | ISO/IEC 27001:2022 A.8.20 | high |
| AUDIT-7-11 | External links open in the system browser | Link handling, `will-navigate` / `new-window` handlers | Untrusted origins open externally, never in an app window | OWASP Electron guidance | medium |

**Reporting these:** AUDIT-7-01 and AUDIT-7-02 are frequently `unverifiable` from the repository
alone — signing may happen in a release pipeline whose secrets are not visible, or by hand. Say
so and name what would settle it, rather than reporting a pass from the presence of a signing
step whose key source cannot be seen.
