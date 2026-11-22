---
document: "Data Subject Request Response Emails"
jurisdictions: ["EU", "GB", "US", "IL", "AU"]
satisfies: ["AUDIT-2-06", "AUDIT-3-04"]
requires_translation: ["IL"]
placeholders: ["INSERT_COMPANY_NAME", "INSERT_CONTACT_EMAIL", "INSERT_REQUESTER_NAME", "INSERT_REQUEST_DATE", "INSERT_DEADLINE_DATE"]
license: "CC0-1.0"
---

> ⚠️ **DISCLAIMER**: This document is an AI-generated template intended for MVP/early-stage testing. It does not constitute formal legal advice. Before scaling, accepting paying customers, or entering regulated markets, have this document reviewed by qualified legal counsel in your target jurisdiction.

# Data Subject Request Response Emails

The clock starts when the request arrives, not when you understand it. One month under GDPR,
45 days under CCPA. Acknowledge immediately even if you cannot act yet.

## 1. Acknowledgement — send within one working day

> **Subject:** We received your privacy request
>
> Hello [INSERT_REQUESTER_NAME],
>
> We received your request on [INSERT_REQUEST_DATE] and we are working on it. We will respond
> by [INSERT_DEADLINE_DATE].
>
> If we need anything from you to verify your identity we will ask separately. We will not ask
> for more information than we need.
>
> [INSERT_COMPANY_NAME] · [INSERT_CONTACT_EMAIL]

## 2. Identity verification — only if you genuinely need it

> **Subject:** Confirming your identity
>
> Hello [INSERT_REQUESTER_NAME],
>
> Before we act on your request we need to be confident it is you, so that we do not disclose
> or delete someone else's information by mistake.
>
> Please reply from the email address on the account. If you cannot, tell us and we will find
> another way.
>
> This does not change the deadline. We will still respond by [INSERT_DEADLINE_DATE].

Do not demand a government ID for a routine access request. Asking for more personal
information than the verification needs is itself a violation.

## 3. Access request — fulfilled

> **Subject:** Your data, as requested
>
> Hello [INSERT_REQUESTER_NAME],
>
> Attached is a copy of the personal information we hold about you, in a machine-readable
> format.
>
> It includes your account details, your activity in the service, and the messages you have
> sent us. It also lists the categories of information we collect, why we use each, who we
> share it with, and how long we keep it.
>
> If anything looks wrong, tell us and we will correct it.

## 4. Deletion request — fulfilled

> **Subject:** Your information has been deleted
>
> Hello [INSERT_REQUESTER_NAME],
>
> We have deleted the personal information we hold about you, and asked our service providers
> to do the same.
>
> Some information remains, and the law allows us to keep it: records we need for tax and
> accounting, and security logs we need to protect the service. We will delete those when their
> retention period ends.
>
> Copies in our backups are removed on the next scheduled rotation.
>
> Your account is now closed and cannot be recovered.

Say what you actually kept. A deletion confirmation claiming everything is gone while the
analytics warehouse still holds the records is a false statement, not a rounding error.

## 5. Refusal or partial refusal

> **Subject:** About your privacy request
>
> Hello [INSERT_REQUESTER_NAME],
>
> We have looked at your request of [INSERT_REQUEST_DATE] and we are not able to act on all of
> it.
>
> What we have done: we deleted your account and the personal information associated with it.
>
> What we have not done, and why: we are keeping the invoices for your past payments, because
> the law requires us to keep financial records for a set period. We will delete them when that
> period ends.
>
> If you disagree you can complain to your data protection authority. You can also reply to
> this email and we will look again.

A refusal must give a reason and a route to challenge it. A refusal with neither is worse than
a late response.

## 6. Extension — send before the original deadline

> **Subject:** We need a little longer with your request
>
> Hello [INSERT_REQUESTER_NAME],
>
> We are still working on your request of [INSERT_REQUEST_DATE]. Because it covers several
> systems we need more time, and we will respond by [INSERT_DEADLINE_DATE].
>
> We are sorry for the delay.

GDPR allows two further months for complex requests, and requires you to explain why. Send this
before the first deadline passes, not after.

---

## Notes for the drafter — delete before publishing

- **Hebrew is required** for Israeli requesters.
- Before sending template 4, confirm the deletion actually reached every destination: primary
  database, replicas, search index, analytics warehouse, object storage, logs, error reports,
  and any model fine-tuned on the data. This is the destination list most often incomplete.
- Log every request and response. The record that you answered in time is the only defence
  against a claim that you did not.
- Do not use these templates for a request that arrives alongside a legal claim or a regulator
  enquiry. Those go to counsel.

## Counsel must check — delete before publishing

- Response deadlines and extension rules in each market served.
- Identity-verification steps proportionate to the data held.
- The exemptions listed against the law that applies to the requester.
