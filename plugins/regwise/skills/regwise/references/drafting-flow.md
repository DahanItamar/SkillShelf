# Drafting Flow

How to produce a user-facing legal document from `templates/`.

Not a module — no obligation, no citation, no routing rule selects it. `SKILL.md` §6 points
here.

Templates are the only part of Regwise that can hurt someone. An audit finding that is wrong wastes
an afternoon. A privacy policy published unreviewed makes representations to real users about
what happens to their data, and they rely on it. Everything below exists because of that
asymmetry.

---

## 1. Route first, then select

Resolve the configuration and load the modules before opening a template. Which templates apply
follows from `targetMarkets`, not from what the user asked for by name.

| Template | Applies when |
| --- | --- |
| `privacy-policy.md` | any market, `dataSensitivity` rank ≥ 1 |
| `cookie-banner-copy.md` | markets include `EU` or `UK_APAC` |
| `do-not-sell-notice.md` | markets include `US` |
| `terms-of-service.md` | any market |
| `subscription-disclosure.md` | recurring billing exists |
| `dsr-response-email.md` | any market, rank ≥ 1 |
| `ai-disclosure-notice.md` | `aiIntegration` is not `None` |
| `marketing-consent-copy.md` | marketing email or SMS is sent |
| `parental-consent-notice.md` | users under 13 are possible |
| `accessibility-statement.md` | `appType` is not `HeadlessAPI` |
| `il-db-registration-prep.md` | markets include `Israel` |

If the user asks for one that does not apply, produce it and say why it appeared unnecessary.
They may know something the configuration does not.

US-only sites with trackers get `do-not-sell-notice.md`, not the cookie banner; Israel has no
cookie template. Say so instead of staying silent.

If the repo shows any form, analytics tag or cookie, treat rank as 1 and say so.

**Prune before output.** Delete the sections whose tied jurisdiction is not in `targetMarkets`,
and list every removed section in the closing unfilled list (section 5). Unserved-market
obligations are requirements nobody agreed to. For `privacy-policy.md` this means:

- the section 2 GDPR lawful-basis text, unless `EU` or `UK_APAC` is a market;
- `### California` in section 6, unless `US` is a market;
- `### Israel` in section 6, unless `Israel` is a market.

Other templates: remove any section headed by a jurisdiction that is not a target market.

## 2. The disclaimer goes first, unchanged

Every generated document begins with the block in `templates/_disclaimer.txt`, byte for byte,
before any heading or other text.

Not paraphrased. Not shortened. Not moved below the title because it looks better there. CI
compares bytes, and the comparison exists because a disclaimer that drifts is a disclaimer
that eventually says something weaker than it should.

**If the user asks to remove it, refuse.** One sentence, no lecture: it is the control that
makes drafting these documents defensible, and a document without it reads as advice. Then
carry on with the rest of the request.

## 3. Never invent a placeholder value

Placeholders stay as `[INSERT_COMPANY_NAME]` unless the user supplied the value in this
conversation.

Do not infer a company name from the repository, an address from a git config, or an email from
a commit. A visible blank in a published privacy policy is embarrassing. An invented registered
address is a false statement about a legal entity, and it is the kind of error that survives
into print because it looks plausible.

Values from `regwise.config.yml` are configuration, not company details. The config holds five
enums and no identifiers, by design.

## 4. Flag what needs Hebrew

Where `targetMarkets` includes `Israel`, every template carrying `requires_translation: ["IL"]`
needs Hebrew for its consumer-facing text.

Mark the sections. Do not translate them — Regwise does not produce legal text in a language it
cannot check, and a mistranslated cancellation right is worse than an untranslated one.

Say it plainly at the end:

> Sections 1 to 6 and 11 need Hebrew for Israeli consumers. This template does not provide the
> translation.

## 5. Close with the unfilled list

Every generated document ends with an explicit list of what is still blank.

```
Before publishing, fill in:
  [INSERT_COMPANY_NAME]        appears 4 times
  [INSERT_PHYSICAL_ADDRESS]    appears 3 times
  [INSERT_RETENTION_PERIOD]    appears 1 time  — must be a real period,
                                 "as long as necessary" is not sufficient

Also: sections 1-6 and 11 need Hebrew.
Have this reviewed by counsel in each market before you rely on it.
```

The list is the difference between a template someone finishes and a template someone
publishes with brackets in it.

## 6. Never say it is compliant

The output is a starting point. Not compliant, not legally sufficient, not approved, not
enough.

Say what it is: a draft that reflects obligations from named instruments, needing counsel review
in each market. If the user asks whether they are now compliant, the answer is that this is not
the thing that decides it — and then say what would be.

Delete the drafter's notes at the bottom of each template only if the user asks. They carry the
warnings most likely to matter, and they are marked for deletion at publication rather than at
generation.

## 7. What this flow never does

- **Never publishes.** It produces a file or conversation output. Deploying it is the user's act.
- **Never fills a legal entity's details from inference.**
- **Never removes or weakens the disclaimer.**
- **Never drafts a contract.** DPAs, SCCs and BAAs are negotiated two-party instruments and are
  out of scope per the spec. Say so and stop.
- **Never claims currency.** The templates carry a `last_verified` context through the modules
  they cite. If those are stale, say so before the document, not after.

## 8. After counsel review

The disclaimer stays in every generated draft. When qualified counsel has reviewed a document,
the user deletes the blockquote and the two trailing "delete before publishing" sections
themselves. Regwise never strips them, and does not offer a mode that does. Each template ends with
a short **Counsel must check** list: hand it to the reviewer along with the draft.
