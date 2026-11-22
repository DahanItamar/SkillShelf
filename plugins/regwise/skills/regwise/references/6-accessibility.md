---
module: 6
domain: "Digital Accessibility"
jurisdictions: ["US", "EU", "IL"]
last_verified: 2026-08-15
instruments:
  - name: "Web Content Accessibility Guidelines 2.2"
    citation: "W3C Recommendation, 5 October 2023 — conformance Level AA"
    url: "https://www.w3.org/TR/WCAG22/"
  - name: "Americans with Disabilities Act, Title III"
    citation: "42 U.S.C. §§ 12181–12189; DOJ rule for state and local government, 28 CFR Part 35"
    url: "https://www.ada.gov/resources/web-guidance/"
  - name: "European Accessibility Act"
    citation: "Directive (EU) 2019/882, applicable from 28 June 2025; harmonised standard EN 301 549"
    url: "https://eur-lex.europa.eu/eli/dir/2019/882/oj"
  - name: "Equal Rights for Persons with Disabilities (Service Accessibility) Regulations 5773-2013"
    citation: "Regulation 35 — internet accessibility; Israeli Standard 5568"
    url: "https://www.gov.il/en/departments/ministry_of_justice"
---

# Module 6 — Digital Accessibility

Loaded by **R11** for every app type that renders a user interface, and by **R03**.

R11 is written as an exclusion rather than an enumeration, so a new `appType` inherits this
module by default. That direction is deliberate: a user interface wrongly exempted ships
inaccessible to real people, while a headless service wrongly included reads one module it can
ignore.

**The commercial argument, since it is usually what gets this prioritised.** In the US,
accessibility claims are a high-volume plaintiff practice and a demand letter costs more to
answer than the fixes cost to make. In the EU, the Accessibility Act has applied since
**28 June 2025** and bites on e-commerce, banking, e-books, transport and consumer terminals.
In Israel, a conformance statement is required and its absence is itself the finding.

---

## Obligations

### 6.1 WCAG 2.2 Level AA is the operative standard

Conform to WCAG 2.2 Level AA. This is the reference that US, EU and Israeli regimes all
converge on, at slightly different versions.

**Citation:** W3C WCAG 2.2, Level AA. The DOJ's 2024 rule for state and local government
(28 CFR Part 35) adopts **WCAG 2.1 Level AA**; EN 301 549 is the harmonised standard under the
EAA; Israeli Standard 5568 derives from WCAG. Building to 2.2 AA satisfies all of them.

**In code — the four principles, as things a reviewer can check:**

- **Perceivable.** Every non-decorative image has meaningful alternative text; decorative
  images have empty `alt`, not a filename. Video has captions. Colour is never the only carrier
  of meaning. Text contrast is at least 4.5:1, large text 3:1, and UI components and focus
  indicators 3:1 against adjacent colour.
- **Operable.** Everything reachable and usable by keyboard alone, in a logical order, with no
  trap. Focus is always visible — `outline: none` with no replacement is the single most common
  violation in modern codebases. Targets are at least 24×24 CSS pixels (2.2, Level AA). A skip
  link precedes repeated navigation.
- **Understandable.** Form inputs have programmatically associated labels — a placeholder is
  not a label. Errors identify the field and describe the fix in text. The page has a `lang`
  attribute. Navigation is consistent across pages.
- **Robust.** Semantic HTML first; ARIA only where semantics run out, and correct when used.
  `role="button"` on a `div` without keyboard handling and `tabindex` is worse than a `button`.
  Status changes are announced through a live region rather than only visually.

### 6.2 New in WCAG 2.2 — the criteria most codebases fail

Six of the nine additions in 2.2 are Level A or AA and are commonly missed because they
postdate most internal checklists.

**Citation:** WCAG 2.2 success criteria 2.4.11 Focus Not Obscured (Minimum, AA), 2.5.7
Dragging Movements (AA), 2.5.8 Target Size (Minimum, AA), 3.2.6 Consistent Help (A), 3.3.7
Redundant Entry (A), 3.3.8 Accessible Authentication (Minimum, AA).

**In code:**

- A sticky header or cookie banner must not cover the focused element (2.4.11). Test by tabbing
  down a long page with the banner open.
- Any drag interaction has a single-pointer alternative — a reorder list needs move-up and
  move-down controls too (2.5.7).
- No cognitive function test in authentication without an alternative (3.3.8). This means
  password managers must be allowed to paste, and puzzle-based CAPTCHA needs another route.
- Do not ask for the same information twice in one process unless re-entry is essential (3.3.7).
- Help mechanisms appear in a consistent place across pages (3.2.6).

### 6.3 Publish a conformance statement

Where required, publish an accessibility statement naming the standard, the conformance level,
known limitations, and a contact route for accessibility problems.

**Citation:** Equal Rights for Persons with Disabilities (Service Accessibility) Regulations
5773-2013, reg. 35 (Israel — statement required, in Hebrew); Directive (EU) 2019/882 and EN
301 549 (EU — information on accessibility of the service).

**In code:**

- A reachable `/accessibility` page, linked from the footer.
- It names the standard and level, states known gaps honestly, and gives a contact that a human
  answers. An aspirational statement claiming full conformance while the site fails contrast is
  worse than none — it is a representation.
- Israeli statements are expected in Hebrew, with the accessibility coordinator's contact
  details.

---

## Audit

| ID | Obligation | Locate | Pass when | Citation | Severity |
| --- | --- | --- | --- | --- | --- |
| AUDIT-6-01 | Non-decorative images carry meaningful alt text | Image components, `<img>` usage, icon components | Every non-decorative image has descriptive `alt`; decorative ones have `alt=""`, none carry a filename | WCAG 2.2 SC 1.1.1 | high |
| AUDIT-6-02 | Text and UI contrast meet AA ratios | Theme tokens, colour variables, stylesheet | Body text ≥ 4.5:1, large text ≥ 3:1, UI components and focus indicators ≥ 3:1 | WCAG 2.2 SC 1.4.3, 1.4.11 | high |
| AUDIT-6-03 | Focus is always visible | Global stylesheet, reset, component styles | No `outline: none` or `outline: 0` without an equivalent visible replacement | WCAG 2.2 SC 2.4.7 | blocker |
| AUDIT-6-04 | Everything operable by keyboard, no trap | Interactive components, modals, custom widgets | Custom controls handle keyboard events and modals return focus on close | WCAG 2.2 SC 2.1.1, 2.1.2 | blocker |
| AUDIT-6-05 | Form inputs have associated labels | Form components, input usage | Every input has a `<label for>` or `aria-label`; placeholders are not used as labels | WCAG 2.2 SC 3.3.2 | high |
| AUDIT-6-06 | Errors identified in text with a described fix | Validation and error components | Errors name the field and describe the correction, not colour alone | WCAG 2.2 SC 3.3.1, 3.3.3 | high |
| AUDIT-6-07 | Semantic HTML, ARIA correct where used | Component library, custom controls | Interactive elements are real controls or have complete role, state and keyboard behaviour | WCAG 2.2 SC 4.1.2 | high |
| AUDIT-6-08 | Focus not obscured by sticky elements | Sticky headers, banners, cookie notices | Focused elements remain visible when persistent overlays are present | WCAG 2.2 SC 2.4.11 | medium |
| AUDIT-6-09 | Drag interactions have a single-pointer alternative | Drag-and-drop, sortable lists, sliders | Every drag operation has an equivalent click or keyboard route | WCAG 2.2 SC 2.5.7 | medium |
| AUDIT-6-10 | Targets at least 24×24 CSS pixels | Buttons, icon controls, close affordances | Interactive targets meet the minimum size or a documented exception applies | WCAG 2.2 SC 2.5.8 | medium |
| AUDIT-6-11 | Authentication allows paste and offers a non-cognitive route | Login form, CAPTCHA, MFA flow | Password fields permit paste and autofill; any puzzle test has an alternative | WCAG 2.2 SC 3.3.8 | high |
| AUDIT-6-12 | Accessibility statement published and reachable | Routes, footer, legal pages | A statement exists naming standard, level, known limitations and a contact | Regs. 5773-2013 reg. 35; Directive (EU) 2019/882 | medium |

**Reporting these:** most of this module is verifiable from source, and that is a trap. Contrast
ratios can be computed from tokens, but a token used on an unexpected background is not caught
by reading the stylesheet, and no static check proves a screen reader announces the right
thing. Report source-verifiable checks as `pass` where they hold, and say plainly that
conformance is not established by them.
