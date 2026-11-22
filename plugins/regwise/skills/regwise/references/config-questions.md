# Configuration Questions

The question the router asks when it cannot infer a field, or when it needs the user to confirm
what it inferred. One block per field, with the permitted values spelled out.

Not a module — no obligation, no citation, no routing rule selects it. `SKILL.md` §1 points
here.

**Always present the options.** A field asked as free text produces answers outside the enum,
and a user who does not already know the five values cannot answer well. Where the host offers
a structured picker, use it. Where it does not, present the options as a numbered list.

**Ask only what you could not infer.** Show the inferred values first, then ask about the gaps.
Confirming four fields the repository already answered wastes the attention needed for the one
it did not.

---

## The opening message

```
Inferred from this repo:
  appType          ConnectedDesktop   tauri + outbound API calls in src-core/
  dataSensitivity  StandardPII        users table, migrations/003_users.sql
  aiIntegration    ThirdPartyAPI      @anthropic-ai/sdk in package.json
  infrastructure   HybridCloud        Dockerfile + on-prem install guide
  targetMarkets    ?                  could not infer

Correct these if any are wrong, and tell me which markets it ships to.
```

---

## appType — what kind of system is it?

| Value | Choose when | Pulls in |
| --- | --- | --- |
| `Web` | a site or app with a UI, no multi-tenant model | 6 |
| `SaaS` | accounts, tenancy, sign-up | 6 |
| `E-commerce` | sells things, takes card payments | 5, 6 |
| `LocalDesktop` | installed client, no network calls of its own | 7 |
| `ConnectedDesktop` | installed client that talks to a server | 7, 1, 8 |
| `Mobile` | iOS or Android app | 6 |
| `HeadlessAPI` | no user interface at all | none by itself |

`HeadlessAPI` is the only value that skips accessibility, and it skips it because there is no
interface to make accessible. If it has any UI — an admin panel, a status page — it is not
headless.

## targetMarkets — where does it ship?

Multiple choice. At least one.

| Value | Brings | The obligation people are most surprised by |
| --- | --- | --- |
| `US` | 2 | reviews cannot be AI-generated, and the do-not-sell link is statutory wording |
| `EU` | 3 | no analytics script may load before opt-in consent |
| `Israel` | 4 | marketing without prior consent carries statutory damages per message |
| `UK_APAC` | 3 | UK transfers need their own instrument, not EU clauses |
| `Global` | 2, 3, 4 | means exactly US, EU, Israel, UK/APAC. It does not cover Canada, Brazil, India, Japan, China or health law. May not be combined with another value |

Ask this one explicitly almost every time. It is the field a repository rarely reveals, and the
field that changes the module set most.

## dataSensitivity — what is the most sensitive thing it holds?

Single choice. The rank drives R04.

| Value | Rank | Choose when |
| --- | :-: | --- |
| `Public` | 0 | no accounts, forms, newsletter, analytics, cookies or visitor logs of any kind |
| `StandardPII` | 1 | names, emails, accounts, usage |
| `PaymentFinancial` | 2 | card or financial data anywhere in the flow |
| `SensitiveHealth` | 3 | health, biometric, or special category data |
| `EnterpriseB2B` | 1 | business customers with tenancy and SSO — sets the enterprise flag as well |

A contact form, mailing list, analytics tag or any account makes it `StandardPII`.

`EnterpriseB2B` is not a sensitivity level dressed up as one. It ranks 1 because a B2B product
still holds personal data about the people who use it, and it sets a separate flag that pulls
in audit and supply-chain obligations.

If the honest answer is more than one, take the highest rank and mention the others.

## aiIntegration — does it use a model?

| Value | Choose when |
| --- | --- |
| `None` | no model anywhere in the product |
| `ThirdPartyAPI` | calls a provider's API |
| `LocalHostedModel` | runs a model on your own infrastructure |
| `FineTuned` | trains or fine-tunes on your own data |

Anything other than `None` pulls in prompt-injection isolation, output validation, and EU AI
Act disclosure. `FineTuned` additionally makes model artefacts a destination in the erasure
cascade — training data does not disappear from a model when a row is deleted.

## infrastructure — where does it run?

| Value | Choose when |
| --- | --- |
| `CloudMultiTenant` | managed cloud, shared infrastructure |
| `LocalOnPrem` | customer hardware or the user's own machine only |
| `HybridCloud` | both |

Only `LocalOnPrem` skips R12. A product with any hosted component is not on-premises, however
small the component.

---

## After the answer

1. Restate the full five-field configuration so the user sees what routing will use.
2. Route, and report each loaded module with the rule that selected it.
3. Offer to save `regwise.config.yml`. Write only on explicit consent.

If a user gives an answer outside these values — a market not listed, an app type that fits
none — do not force it into the nearest option. Say what is missing, route on what you do know,
and state which obligations are therefore unaddressed. Regwise covers five jurisdictions; there
are many more, and pretending otherwise is worse than admitting the gap.

### Save-config template

Regwise writes `regwise.config.yml` with your consent, and `Regwise-REPORT.md` only if you ask for a report file. It changes nothing else. Everything else it does there is read-only.

```yaml
# regwise.config.yml — safe to commit
appType: ConnectedDesktop
targetMarkets: [Israel]
dataSensitivity: StandardPII
aiIntegration: ThirdPartyAPI
infrastructure: HybridCloud
configVersion: 1
lastConfirmed: 2026-08-15
```

Five enum values, no identifiers, no secrets. Committing it is the whole point — every
teammate and every later session then skips the confirmation exchange.

## Trust expires

If `lastConfirmed` is over 180 days old, or cheap repo signals (Stripe or billing deps, new
locale directories, AI SDK deps) disagree with the saved enums, show the saved values plus the
disagreement and ask for one re-confirmation. Never route silently on a stale file.

## Rule notes

R13: a SaaS taking card payments is not E-commerce, but PCI DSS still applies to it.
