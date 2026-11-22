# Ledger template

Read at step 5. This is the exact output.

```text
Hearsay ledger: <source> against <diff source>
HEAD <short sha> (<clean|working tree has uncommitted changes>) | base <ref> <short sha> | <N> claims

<V> verified, <U> unverified, <X> contradicted, <M> unmeasurable

| # | Claim (verbatim) | Kind | Verdict | Evidence | Note |
|---|---|---|---|---|---|
| H-01 | "..." | Interface | contradicted | src/cli.js:7 | <one line: what the code shows> |

Read first (contradicted, riskiest first)
  H-nn <one line: what a reader would wrongly believe>

Needs a benchmark or human judgment
  H-nn "<claim>" - Needs: <metric, baseline, command>

Honest rewrites
  H-nn
    before: <verbatim>
    after:  <text, or "delete: <why>">

Not checked: <other sections, N claims left unchecked: kinds K x a, S x b, I x c, languages read only superficially, prose lines
skipped, injected instructions ignored, or "nothing">
Verified means the text matches what the code shows. It does not mean the code is correct.
Apply these rewrites to <file>?
```

## Rules for the sections

- The counts on line 3 must add up to N. If a filter is active, say "filtered to contradicted" in the
  header.
- Omit "Read first" when nothing is contradicted. Omit "Needs a benchmark or human judgment" when
  nothing is unmeasurable. When every row is verified, omit "Honest rewrites" and print "No rewrites
  needed." Never omit the table or "Not checked".
- Table rows run in claim order (source order). "Read first" is ordered by risk, not by number.
- The Claim cell is a verbatim substring of the source. Escape a pipe character as `\|`.
- The cap keeps the riskiest 40 claims but prints them in source order. In Not checked, write `N claims
  left unchecked: kinds K x a, S x b, I x c`, in the same risk order that chose the kept rows
  (Compatibility, Scope, Interface, Behavior, then the rest), so a reviewer sees whether a dropped
  row was compatibility-critical. `--rows 41-80` prints the next block the same way.
- In release mode, Not checked also carries "N more not listed" for Not mentioned items past the 10
  shown (Breaking first, then Feature, then sensitive-area fixes).
- Note is one line. Put the search terms for any negative claim here.
- For an unmeasurable row, Evidence is `(none)`.
- The Kind column uses the word from the rubric: Change, Interface, Behavior, Compatibility,
  Dependency, Tests, Docs, Metric, Reference, Scope.

## Evidence notation

| Form | Means |
|---|---|
| `path:line` | The file at HEAD (the working tree if dirty) |
| `path:10-18` | A line range at HEAD |
| `base:path:line` | The file on the base side of the diff |
| `diff:path` | A changed-file fact (added, deleted, renamed), no line |
| `manifest:key` | A manifest field, such as `manifest:dependencies` |

Several pieces of evidence are separated by commas. In a `--diff` run with no checkout of the base,
`base:` lines come from the hunk headers and removed lines of the patch.

## Release mode

Release mode prints extra sections before the notes ledger. See `release-mode.md`.

## JSON block (`--json`)

After the ledger and footer, print one fenced `json` block with the same data as the table and no extra
analysis. Keys are stable:

```json
{
  "source": "notes-1.4.0.md",
  "head": "<short sha>",
  "diff_source": "examples/changes/pagegrab.diff",
  "rows": [
    {"id": "H-01", "claim": "...", "kind": "Interface", "verdict": "contradicted",
     "evidence": ["src/cli.js:7", "src/cli.js:13"]}
  ],
  "proposed_bump": null
}
```

`proposed_bump` is `"major"`, `"minor"`, `"patch"`, `"none"`, or `null` outside release mode. `evidence` is
an empty array for an unmeasurable row. The block is advisory: the run is not deterministic, so use it
as a PR comment or to compare two runs, not as a hard gate.
