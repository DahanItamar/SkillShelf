---
document: "Do Not Sell or Share Notice"
jurisdictions: ["US"]
satisfies: ["AUDIT-2-07", "AUDIT-2-08"]
requires_translation: []
placeholders: ["INSERT_COMPANY_NAME", "INSERT_CONTACT_EMAIL", "INSERT_EFFECTIVE_DATE"]
license: "CC0-1.0"
---

> ⚠️ **DISCLAIMER**: This document is an AI-generated template intended for MVP/early-stage testing. It does not constitute formal legal advice. Before scaling, accepting paying customers, or entering regulated markets, have this document reviewed by qualified legal counsel in your target jurisdiction.

# Do Not Sell or Share My Personal Information

**Effective date:** [INSERT_EFFECTIVE_DATE]

## The link

The link text is fixed by statute. Use exactly this wording, in the footer of every page,
reachable without signing in:

> Do Not Sell or Share My Personal Information

Californian law also permits an alternative opt-out link reading "Your Privacy Choices" with
the standard opt-out icon. Pick one and use it consistently.

## Page copy

**Heading**

> Do Not Sell or Share My Personal Information

**Body**

> California law gives you the right to tell us not to sell your personal information, and not
> to share it for cross-context behavioural advertising. Cross-context behavioural advertising
> means using information about your activity across different sites to target ads to you.
>
> You do not need an account to use this right, and we will not treat you differently for
> using it.

**The control**

> Opt out of the sale and sharing of my personal information

A single toggle or button. Not a form that demands your name, address and date of birth first
— a request for more information than you need to process the opt-out is itself a violation.

**Confirmation**

> Done. We have recorded your choice and will not sell or share your personal information.
> If you are signed in, this applies to your account. If you are not, it applies to this
> browser, and you will need to opt out again on other browsers or devices.

## Global Privacy Control

Add this line to the page:

> We also honour the Global Privacy Control signal. If your browser or extension sends it, we
> treat it as a valid opt-out request and you do not need to do anything here.

GPC is not optional in California. It arrives as an HTTP header and your server has to read it
and act on it. A page that offers a manual toggle while ignoring the header is only half
compliant, and the half it is missing is the automated one regulators test for.

## Authorised agents

> Someone can make this request for you. If an authorised agent contacts us on your behalf, we
> will ask them for written proof that you authorised them, and we may ask you to confirm
> directly.

## Contact

Questions about this notice: [INSERT_CONTACT_EMAIL]
[INSERT_COMPANY_NAME]

---

## Notes for the drafter — delete before publishing

- **Publish this only if it is true that you can honour it.** The link is trivial; the
  plumbing behind it is not. Opting out has to actually stop the advertising pixels firing and
  propagate to the ad platforms you use.
- Most products that believe they do not sell personal information do share it, because
  loading an advertising or analytics pixel that receives an identifier meets the statutory
  definition of sharing. Check what your tags send before claiming otherwise.
- The opt-out must persist. Storing it only in a cookie means clearing cookies silently opts
  the person back in.
- Several other states now have comparable opt-out rights with different mechanics. If you
  operate nationally, honour the strictest and apply it everywhere rather than segmenting.

## Counsel must check — delete before publishing

- Whether the product sells or shares personal information as the statutes define those terms.
- Which state laws apply at your consumer counts, and the opt-out signals each requires.
- The exact link wording and placement required in each state.
