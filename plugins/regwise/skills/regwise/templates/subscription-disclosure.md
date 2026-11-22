---
document: "Subscription Disclosure and Cancellation Terms"
jurisdictions: ["US", "IL", "EU"]
satisfies: ["AUDIT-2-03", "AUDIT-2-04", "AUDIT-4-08", "AUDIT-4-09"]
requires_translation: ["IL"]
placeholders: ["INSERT_COMPANY_NAME", "INSERT_CONTACT_EMAIL", "INSERT_PLAN_NAME", "INSERT_PRICE", "INSERT_BILLING_PERIOD", "INSERT_TRIAL_LENGTH"]
license: "CC0-1.0"
---

> ⚠️ **DISCLAIMER**: This document is an AI-generated template intended for MVP/early-stage testing. It does not constitute formal legal advice. Before scaling, accepting paying customers, or entering regulated markets, have this document reviewed by qualified legal counsel in your target jurisdiction.

# Subscription Disclosure and Cancellation Terms

## Part 1 — copy that must appear next to the payment button

Not behind a link. Not in a collapsed panel. Adjacent to the control that submits payment,
rendered by default.

> **[INSERT_PLAN_NAME] — [INSERT_PRICE] per [INSERT_BILLING_PERIOD]**
>
> Your subscription renews automatically every [INSERT_BILLING_PERIOD] at [INSERT_PRICE] until
> you cancel. You can cancel at any time from your account settings, and cancelling stops the
> next charge. We will email you a receipt after every payment.

**With a free trial, add:**

> Your free trial lasts [INSERT_TRIAL_LENGTH]. We will charge [INSERT_PRICE] when it ends
> unless you cancel first. We will email you before the first charge.

**The consent control — separate from the order button:**

> I agree to be charged [INSERT_PRICE] every [INSERT_BILLING_PERIOD] until I cancel.

Unticked by default. Record who ticked it and when. Consent to recurring billing has to be a
separate affirmative act from placing the order.

## Part 2 — cancellation terms

> **Cancelling**
>
> You can cancel at any time from your account settings. Cancellation takes effect promptly and
> stops all future charges. You will keep access until the end of the period you have already
> paid for.
>
> If you subscribed online, you can cancel online. We will not ask you to telephone us, email
> us, or speak to anyone to cancel.
>
> We will confirm your cancellation in writing, with the date it takes effect.

**Israel — add this:**

> If you are in Israel, we will process an online cancellation request within three business
> days and send you written confirmation. Your cancellation rights under the Consumer
> Protection Law are not affected by anything in these terms.

## Part 3 — renewal reminder email

Send before every annual charge, and before the first charge after a trial.

> **Subject:** Your [INSERT_PLAN_NAME] subscription renews on [INSERT_EFFECTIVE_DATE]
>
> Hello,
>
> Your [INSERT_PLAN_NAME] subscription renews on [INSERT_EFFECTIVE_DATE]. We will charge
> [INSERT_PRICE] to the card on file.
>
> If you want to continue, you do not need to do anything.
>
> If you would rather not renew, you can cancel in your account settings. Cancelling before
> the renewal date means you will not be charged.
>
> [INSERT_COMPANY_NAME] · [INSERT_CONTACT_EMAIL]

## Currency note

The FTC Negative Option Rule at 16 CFR Part 425, widely reported as the click-to-cancel rule,
**was vacated by the Eighth Circuit in July 2025**. Do not cite it as current law. What governs
instead:

- **ROSCA**, 15 U.S.C. section 8403 — clear and conspicuous disclosure before obtaining billing
  information, informed consent, and a simple cancellation mechanism.
- **State auto-renewal laws**, of which California's is strictest. It independently requires
  cancellation through the same medium used to subscribe, and renewal reminders for longer
  terms.
- **Israeli Consumer Protection Law sections 13C to 13G** — online cancellation, processed
  within a short statutory window, with written confirmation.

Building to California plus Israel satisfies the rest.

---

## Notes for the drafter — delete before publishing

- **Hebrew is required** for Israeli consumers. Parts 1, 2 and 3 all need translating.
- Confirm the statutory window before publishing the Israeli paragraph. Three business days is
  the commonly cited figure but you should verify it against the current text.
- A retention offer during cancellation is allowed in most markets, but it must be skippable in
  one action. A flow that forces three screens before the cancel button is the conduct
  regulators describe as a dark pattern.
- The renewal reminder is required for longer terms in several states. Sending it for every
  term is simpler than tracking which ones require it.
- If your billing cycle is longer than the Israeli cancellation window, cancellation cannot
  wait for the end of the cycle. Stop charges within the window and prorate.

## Counsel must check — delete before publishing

- The cancellation route and window against each state and national rule that applies.
- The renewal reminder timing for the longest billing cycle offered.
- That the price and renewal terms shown at checkout match this text exactly.
