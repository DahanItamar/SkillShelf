---
document: "Marketing Consent and Opt-Out Copy"
jurisdictions: ["IL", "EU", "GB", "AU", "US"]
satisfies: ["AUDIT-4-05", "AUDIT-4-06", "AUDIT-4-07", "AUDIT-3-10"]
requires_translation: ["IL"]
placeholders: ["INSERT_COMPANY_NAME", "INSERT_CONTACT_EMAIL", "INSERT_PHYSICAL_ADDRESS", "INSERT_SENDER_NAME"]
license: "CC0-1.0"
---

> ⚠️ **DISCLAIMER**: This document is an AI-generated template intended for MVP/early-stage testing. It does not constitute formal legal advice. Before scaling, accepting paying customers, or entering regulated markets, have this document reviewed by qualified legal counsel in your target jurisdiction.

# Marketing Consent and Opt-Out Copy

Israeli Communications Law section 30A carries statutory damages of up to ILS 1,000 per
message **with no proof of damage required**. That is why this section produces class actions
rather than regulator letters, and why the consent record matters more than the consent itself.

## 1. Consent checkbox — unticked, separate from terms

> Email me product news and offers from [INSERT_COMPANY_NAME]. I can unsubscribe at any time.

**Separate checkbox for SMS:**

> Text me product news and offers. Message rates may apply. I can stop them by replying STOP.

Rules that make this hold up:

- **Unticked.** A pre-ticked box is not consent anywhere in this list of markets.
- **Separate from accepting the terms.** Bundling marketing consent into terms acceptance
  invalidates it.
- **Per channel.** Email consent is not SMS consent. Israeli law treats them separately and so
  should your schema.
- **Recorded.** Store who, when, what wording they saw, and from what page. The record is the
  defence.

## 2. Double opt-in confirmation email

The defensible implementation. Send immediately after the box is ticked.

> **Subject:** Confirm your subscription
>
> Hello,
>
> Someone asked to subscribe this address to updates from [INSERT_COMPANY_NAME]. If it was
> you, confirm below and we will start sending.
>
> Confirm my subscription
>
> If it was not you, ignore this email. We will not send anything and we will delete the
> request.
>
> [INSERT_COMPANY_NAME] · [INSERT_PHYSICAL_ADDRESS]

Do not send marketing before the confirmation click. The confirmation email itself is
transactional, not marketing, and may be sent once.

## 3. Footer for every marketing message

**Email**

> You are receiving this because you subscribed to updates from [INSERT_COMPANY_NAME].
>
> Unsubscribe · Update your preferences
>
> [INSERT_SENDER_NAME], [INSERT_PHYSICAL_ADDRESS] · [INSERT_CONTACT_EMAIL]

Required by section 30A: the sender's name and contact details, the fact that it is
advertising, and a free way to opt out. The unsubscribe must work with one click and must not
require signing in.

**SMS**

> [INSERT_COMPANY_NAME]: your message here. Reply STOP to unsubscribe.

The opt-out must work in the channel the message arrived in. An SMS campaign whose only
unsubscribe route is an email link fails section 30A.

## 4. Opt-out confirmation

> **Subject:** You have been unsubscribed
>
> You will not receive marketing emails from us again. You will still get messages about your
> account, such as receipts and security notices.
>
> Unsubscribed by mistake? You can resubscribe from your account settings.

## 5. Suppression rules

- **One list, checked at send time.** Per-campaign flags fail the moment a campaign is
  duplicated.
- **Immediate.** Not on the next sync. A message sent after an opt-out is a separate violation
  with its own statutory damages.
- **Permanent.** An opt-out survives account deletion and recreation, which means the
  suppression list outlives the user record.
- **All channels the person opted out of**, and if in doubt, all of them.
- **Never resell or share the list.** Consent given to you is not consent given to a partner.

## 6. The existing-customer exception — do not lean on it

Section 30A allows limited messages to an existing customer about similar goods or services,
where the opt-out was offered at the time of the original transaction. Australia's APP 7 has a
comparable narrow allowance.

It is narrower than it looks. Similar means similar to what they actually bought, not to what
you sell. If you cannot produce the record showing the opt-out was offered at the transaction,
you do not have the exception.

---

## Notes for the drafter — delete before publishing

- **Hebrew is required** for Israeli recipients. All copy above needs translating, including
  the unsubscribe wording.
- Consent has an expiry in practice even where the statute is silent. An address that has not
  engaged in two years is a risk, not an asset.
- Transactional messages are exempt, but the boundary is real: a receipt with a promotional
  banner is a marketing message.
- If you buy or import a list, you do not have consent. There is no version of this template
  that fixes that.
