# ACSM — Adaptive Compliance & Security Matrix

A Claude Code skill that works out which compliance and security obligations actually apply
to a project, then applies them while you write code.

Six legal regimes, eight modules, and only the ones your project fires. A local desktop tool
never pays the context cost of the CCPA module; a US-only storefront never reads the Israeli
spam law.

> ⚠️ **ACSM produces no legal advice.** It generates engineering directives, audit findings and
> document drafts that require review by qualified legal counsel in each market before you rely
> on them. Nothing it outputs is a compliance certification, and it never describes a project
> as compliant.

**What it does — three things:**

1. **Directs.** While you write code, it applies the obligations that actually bind you —
   erasure endpoints, consent gating, payment isolation, signed binaries, audit logging.
2. **Audits.** Points at an existing repo and returns pass / fail / n-a / unverifiable per
   check, with a file and line for every failure.
3. **Drafts.** Produces privacy policies, cookie copy, cancellation terms and nine other
   documents — each carrying a mandatory disclaimer and visible placeholders.

**8 modules · 34 obligations · 83 audit checks · 31 cited instruments · 11 templates.**

## Install

Two paths, one tree. Nothing is duplicated between them — the plugin's skill directory *is*
`skills/acsm/`.

**As a plugin** — gets you updates:

```
/plugin marketplace add DahanItamar/acsm
```

then install `acsm` from the marketplace.

**As a plain skill** — no manifest, no marketplace:

```sh
cp -r skills/acsm ~/.claude/skills/acsm          # all your projects
cp -r skills/acsm <project>/.claude/skills/acsm  # one project only
```

`skills/acsm/` is self-contained. `references/` and `templates/` sit inside it, so a copy
takes everything the skill needs and nothing above it.

## Use

Ask for anything that touches personal data, payments, subscriptions, cookies, marketing
email or SMS, AI features, accessibility, desktop binaries or SSO. The skill reads your repo,
infers five configuration fields, confirms them with you once, and loads only the modules its
rules select.

```
Loaded 3 of 8 modules:
  4  Israeli market            R08  markets include Israel
  6  Digital accessibility     R11  appType renders a UI
  7  Client binary & desktop   R01  appType == LocalDesktop

Not loaded: 1, 2, 3, 5, 8.
```

Save the answer to `acsm.config.yml` and every later session skips the question. See
`examples/` for three worked configurations.

## Verify

```sh
sh scripts/verify.sh
```

POSIX shell and standard utilities. No runtime, no package manager, no lockfile.

## Licence

MIT, except `skills/acsm/templates/`, which is CC0-1.0 so that documents generated from the
templates carry no attribution obligation. See `LICENSE` and `LICENSE-TEMPLATES`.
