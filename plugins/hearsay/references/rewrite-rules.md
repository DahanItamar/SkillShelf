# Rewrite rules

Read at step 6. A rewrite downgrades a claim to what the evidence supports. It never upgrades one.

1. **Verified claims are never touched.**
2. **A rewrite may assert only what its ledger row's evidence supports.** Never add a fact, a number or
   a scope that the evidence does not contain.
3. **Contradicted:** replace the claim with what the evidence shows, or delete it if nothing true
   remains. Say which ("after:" text, or "delete: <why>").
4. **Unverified:** downgrade to the narrower statement the evidence does support, delete the claim, or
   keep it with a visible `[needs check: <what>]` marker. The wording must not turn an unverified claim
   into a verified-sounding one.
5. **Unmeasurable:** drop the number or superlative and state the observable change. Optionally add
   `[add measured result: <metric, baseline, command>]` for the author to fill in. Hearsay never fills
   it, and never writes "significantly", "approximately" or a made-up figure.
6. **Strength words** (all, every, always, never, fully, completely, seamlessly) come off unless an
   exhaustive search supports them.
7. **Keep the author's voice,** markdown structure and order. Make the smallest edit that is true.
   Print each rewrite as before and after. Print a full revised text only if the source is 60 lines or
   fewer, or the user asks.
8. **Release-mode omissions** (breaking or feature changes nobody mentioned) get a suggested new line,
   written only from the diff evidence. Skip it when a contradicted row's rewrite already states the
   change.
9. **Rewrites are text in the answer.** Nothing is written to disk, including the file under check.
10. **A rewrite is not re-verified into the ledger.** If the user asks to verify a rewrite, run the
    skill on it as new input.

## Good and bad

| Claim | Evidence | Good rewrite | Bad rewrite |
|---|---|---|---|
| "Adds a `--json` flag." | parser defines `--format` | "Adds `--format json`." | "Adds JSON output." (drops the checkable detail) |
| "Retries three times." | `MAX_ATTEMPTS = 2` | "Retries once." | "Retries a few times." (vaguer, not truer) |
| "3x faster." | nothing | "delete: no benchmark supports it" | "Significantly faster." |
| "Works on Windows." | no evidence | "Works on Windows `[needs check: Windows]`" | "Should work on Windows." |

## Never in a rewrite

- A number, version, file name or flag that is not in the row's evidence.
- "significantly", "approximately", "roughly", "up to", or any softener that keeps an unsupported
  claim alive.
- A fix to the code. Rewrites change prose only. If the code is wrong, that is outside this skill.
