# Modes and special shapes

Load this only when the mode is not plain Write, or the project is an internal service, a monorepo,
a library with no tests, or non-English. The Hard rules in `SKILL.md` apply in every mode.

## Modes

| Mode | Trigger | Phases run | Writes |
| --- | --- | --- | --- |
| Write | No README, or "write a README" | 0 to 6 | The paths in Hard rules |
| Audit, then rewrite | A README exists | 0 to 6; show a keep / change / cut table before writing | Same |
| Audit only | "audit my README", "do not change it" | 0, then the Phase 6 mechanical checks. No Phase 1 run, no visuals, no stranger test | Nothing |
| Refresh | `docs/EVIDENCE.md` exists | 0, replay its commands under the Phase 1 gate, Phase 6 checks | Stale facts and the ledger's dates |
| Static | "do not run anything", or the gate was not passed | 0 and 2 to 6, no Phase 1 | As write; every runtime fact is `unverified` |

Banner for the other modes: name the mode and list only the phases that run (Audit only: `0` and
`6` mechanical checks; Static: `0`, `2` to `6`).

## Audit only: the fixed checklist

Run exactly these six checks. Static facts only; run facts are reported as `not rechecked`.

1. Counts (files, lines, dependencies, tests named in the README) against `wc` and the manifest.
2. Versions in the README against the manifest.
3. Every relative link and image path resolves (`test -f`).
4. `TODO`, `Coming soon`, `Lorem`, `your-project-name`.
5. The install and run path against the manifest's own scripts.
6. Badge facts: each badge states something the repository confirms (licence, version, count).

Report one table, one row per finding, so audits compare across repositories:

| Where | Problem | Fix | Rank |
| --- | --- | --- | --- |
| `file:line` | what is wrong | the change | high, med or low |

## Audit then rewrite and Refresh

- Show the keep / change / cut table before writing. Keep the author's accurate hand-written prose.
- Refresh stores each claim's extracted value (count, version, status) in the ledger, not raw
  output, and compares extracted values only. Ledger columns and default tolerances are in
  `references/evidence-rules.md`. Compare timings and other volatile fields (timestamps, ids,
  ports) within a stated tolerance, or list them as "re-measure on request".
- Edit a row only when its extracted value changed, and leave the prose alone.

## Static mode: what Phase 3 collects

Only test names and assertions, manifest facts (dependencies, scripts, version), file and line
counts, and example code from the repo. No output, no timings, no counts of passing tests. Every
runtime row goes in the handover as `unverified`.

## Special shapes

- **Internal or team service** - use the Internal service skeleton in `references/readme-template.md`.
- **Monorepo** - one root README plus a short per-package README linking up.
- **Library or no tests** - run the examples.
- **Non-English or RTL** - write in the author's language and set `dir="rtl"`.
