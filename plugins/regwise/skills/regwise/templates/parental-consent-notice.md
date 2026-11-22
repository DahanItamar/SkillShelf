---
document: "Parental Consent Notice"
jurisdictions: ["US", "EU", "GB"]
satisfies: ["AUDIT-2-09"]
requires_translation: ["IL"]
placeholders: ["INSERT_COMPANY_NAME", "INSERT_CONTACT_EMAIL", "INSERT_PHYSICAL_ADDRESS", "INSERT_SERVICE_NAME", "INSERT_RETENTION_PERIOD"]
license: "CC0-1.0"
---

> **DISCLAIMER**: This document is an AI-generated draft template. It is not legal advice and no lawyer has reviewed it. Before you publish it or rely on it, have qualified legal counsel in each jurisdiction you serve review it.

# Parental Consent Notice

COPPA applies if the service is directed to children under 13, or if you have actual knowledge
that a user is under 13. Actual knowledge is easy to acquire and hard to un-acquire — a support
message saying "my daughter is 11" puts you on notice from that moment.

Under GDPR the age of digital consent is 16, and member states may lower it to as far as 13.
Check each market you serve rather than assuming one number.

## 1. Age gate — neutral, no hint

Ask for a date of birth in a neutral form. Do not display "you must be 13 or older" before the
question — that is an instruction on how to pass.

> **When were you born?**
>
> Day · Month · Year

Do not let the person retry after failing. Set a flag or a cookie; otherwise the gate is a
guessing game with unlimited attempts.

## 2. Direct notice to the parent

Sent to the parent before any collection, separately from the privacy policy.

> **Subject:** We need your permission before your child can use [INSERT_SERVICE_NAME]
>
> Hello,
>
> Your child asked to create an account on [INSERT_SERVICE_NAME], operated by
> [INSERT_COMPANY_NAME]. Because they are under 13, United States law requires your permission
> before we collect anything about them.
>
> **What we would collect:** a username, your email address for contacting you, and what your
> child does in the service so it works properly.
>
> **What we would not collect:** their real name, home address, phone number, photographs, or
> location.
>
> **What we would use it for:** running the service for your child. Nothing else.
>
> **Who we would share it with:** our hosting and email providers, who work for us under
> contract and may not use it for their own purposes. We do not sell it and we do not use it
> for advertising.
>
> **How long we would keep it:** [INSERT_RETENTION_PERIOD], or until you ask us to delete it.
>
> **Your rights.** You can see what we hold about your child, ask us to delete it, and tell us
> to stop collecting more, at any time. Email [INSERT_CONTACT_EMAIL].
>
> **Your child can use the service without giving us more than we need.** We will not require
> extra information as a condition of taking part.
>
> To give permission, use the link below. If you do nothing, we will delete the request and
> your child will not be able to create an account.
>
> [INSERT_COMPANY_NAME] · [INSERT_PHYSICAL_ADDRESS] · [INSERT_CONTACT_EMAIL]

## 3. Verifiable consent — what actually counts

A checkbox saying "I am a parent" is not verification. Acceptable methods under the COPPA Rule
include:

- a small charge to a payment card, refunded or notified
- a signed consent form returned by post, fax or scan
- a call to a trained operator on a toll-free number
- a video call with trained personnel
- checking a government-issued identifier against a database, then deleting it
- a knowledge-based challenge with questions hard for a child to answer

**The email-plus exception:** parental email alone is enough only where the child's information
is used internally and never disclosed. If you share with any third party beyond a service
provider, you need one of the stronger methods.

## 4. Confirmation to the parent

> **Subject:** Permission recorded
>
> Thank you. We have recorded your permission and your child's account is active.
>
> You can review what we hold about them, ask us to delete it, or withdraw permission at any
> time by emailing [INSERT_CONTACT_EMAIL]. Withdrawing permission closes the account and
> deletes their information.

## 5. Withdrawal

> **Subject:** Permission withdrawn
>
> We have closed your child's account and deleted the personal information we held about them.
> We have asked our service providers to do the same.

---

## Notes for the drafter — delete before publishing

- **This template is a starting point for a low-risk service.** If your service is directed to
  children as its primary audience, COPPA compliance is a programme rather than a notice, and
  it needs counsel before launch.
- Under-13 accounts must not carry behavioural advertising identifiers or persistent
  cross-site identifiers beyond internal operations.
- Section 3's identifier-checking method requires deleting the identifier immediately after
  verification. Retaining it is its own violation.
- Build a route for support staff to escalate when a user reveals they are under 13. That
  moment creates actual knowledge, and the obligation starts then.
- The UK Age Appropriate Design Code adds duties beyond consent — default settings, profiling
  off, data minimisation — that this notice does not address.

## Counsel must check — delete before publishing

- The age threshold in each market served, and the consent method accepted.
- That the method of verification is one the regulator accepts.
- Duties beyond consent, such as default settings and profiling limits.
