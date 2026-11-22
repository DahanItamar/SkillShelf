---
document: "Cookie Banner Copy"
jurisdictions: ["EU", "GB"]
satisfies: ["AUDIT-3-01", "AUDIT-3-02", "AUDIT-3-03"]
requires_translation: ["IL"]
placeholders: ["INSERT_COMPANY_NAME", "INSERT_CONTACT_EMAIL"]
license: "CC0-1.0"
---

> **DISCLAIMER**: This document is an AI-generated draft template. It is not legal advice and no lawyer has reviewed it. Before you publish it or rely on it, have qualified legal counsel in each jurisdiction you serve review it.

# Cookie Banner Copy

Copy for a consent banner that meets the ePrivacy Directive standard. The wording is the easy
part; the behaviour behind it is what regulators fine. Read the behaviour rules at the bottom
before shipping this.

## First-layer banner

**Heading**

> We use cookies

**Body**

> We use cookies that are necessary to run this site. We would also like to set optional
> cookies for analytics and to remember your preferences. We will not set optional cookies
> unless you turn them on.

**Buttons — all three at the same level, same size, same styling**

> Accept all · Reject all · Manage preferences

## Second layer — preference panel

**Heading**

> Cookie preferences

**Intro**

> Turn each category on or off. Your choice is saved for twelve months. You can change it any
> time from the Cookie settings link in our footer.

**Category: strictly necessary — always on, no toggle**

> Needed for the site to work: signing you in, keeping your session, load balancing, and
> security. These do not need your consent and cannot be turned off.

**Category: analytics — off by default**

> Helps us understand which pages are used so we can improve them. Nothing here identifies you
> to us personally.

**Category: preferences — off by default**

> Remembers choices like language and layout so you do not have to set them again.

**Category: marketing — off by default**

> Lets us and our advertising partners show you relevant ads on other sites and measure whether
> they worked.

**Buttons**

> Save preferences · Accept all · Reject all

## Withdrawal link — footer, every page

> Cookie settings

## Behaviour rules — these are what get enforced

1. **Nothing non-essential loads before consent.** Not the script, not the tag manager, not a
   pixel that is present but "not firing". Loading and not firing is still storage on the
   device.
2. **Reject is exactly as easy as accept.** Same level, same prominence, same click count. A
   bright Accept beside a grey Manage is the single most-fined pattern in Europe.
3. **Nothing is pre-ticked**, and scrolling, closing the banner, or continuing to browse is not
   consent.
4. **Record what was consented to and when**, so you can show it. The record is the defence.
5. **Withdrawal is as easy as the grant** — one click from the footer, not an email to support.
6. **Re-ask no more often than the law of your market tolerates.** Twelve months is the common
   practice; re-prompting weekly reads as pressure.
7. **A cookie wall needs a genuine equivalent alternative.** In most EU markets, pay-or-consent
   without one does not work.

## Israel

Israeli practice is closer to notice than to prior opt-in for ordinary analytics, but if you
serve EU or UK users at all, run one banner to the stricter standard. Two behaviours by
geography is a maintenance burden that fails quietly the first time geolocation is wrong.

Hebrew is required for Israeli consumers. Translate all copy above.

---

## Notes for the drafter — delete before publishing

- Contact for cookie questions: [INSERT_CONTACT_EMAIL]. Controller: [INSERT_COMPANY_NAME].
- The category descriptions must match the cookies you actually set. Listing analytics while
  running an advertising pixel is a misrepresentation, not a drafting slip.
- If you use Google Consent Mode or a similar signal-based integration, verify that denied
  consent actually blocks storage rather than only tagging the request.

## Counsel must check — delete before publishing

- The cookie list matches what the site actually sets, per market.
- Whether the reject path and the consent record meet the regulator guidance in each market.
- Which consent signals from the consent platform are legally binding in your setup.
