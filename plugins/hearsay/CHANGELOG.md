# Changelog

Release checklist: version in `plugin.json` == the hearsay entry (version and description) in the root `.claude-plugin/marketplace.json` == the head of this file == the README badge; `sh scripts/verify.sh` exits 0; a real run is committed under `examples/results/<model>-<date>.md` before any README line claims a measured result (until then the README says "Measured so far: nothing yet"). Nothing here runs at install.

## 0.1.0
- First version. Fact-checks release notes, a changelog entry, a PR description or a README feature list against the repository, one claim at a time, and marks each verified, unverified, contradicted or unmeasurable with file and line.
- Prints a claims ledger plus honest rewrites that downgrade what the code does not support. Never writes files, runs the project or touches the network.
- Release mode (`/hearsay --release <prev-tag>`): compares the previous tag with HEAD, classifies the changes, proposes the SemVer bump and flags commit messages that disagree with the diff (codes M1 to M7).
- `examples/` holds a fictional project, a fixture repo builder and expected verdicts. They are expectations written by the author; no run has been recorded yet.
- `scripts/verify.sh` is a structural check for maintainers (POSIX sh, no dependencies).
- Git allowlist hardened: every diff-like call carries `--no-ext-diff --no-textconv`, `--output`/`-O` banned, `git --no-optional-locks status --porcelain` only. The README says plainly that this is instruction-based and reduces, not removes, the risk.
- No-flag pre-release path: with no diff, HEAD on the default branch falls back to the latest tag (`git describe`) and prints it; `--release` with no tag infers it too.
- Verdict boundary fixed: unverified means a command or file read could settle it; unmeasurable means none could. A benchmark script with no results is unverified.
- Changelog section choice (named, manifest version, Unreleased, newest) is stated in the header; release mode uses `git diff <tag>` when the tree is dirty.
- Release mode reverse check also lists sensitive-area fixes (needs-maintainer) and dependency floor changes. Added `--path <dir>` for monorepos (common layouts only), `--rows 41-80`, and `--json` (advisory).
- Cap shown honestly: unchecked claims are counted by kind in risk order.
- Fast path: text of 10 non-blank lines or fewer and at most 1,200 characters skips the six references; description shortened.
- Fixed the `src/fetch.js:5-12` citation and the H-04 evidence in the README; README now has the hearsay-pr note on the first screen, a cost note, a PR recipe and four more comparisons.
- Optional maintainer scorer `scripts/score.test.js` (node --test, built-ins only) compares a saved ledger with a golden by row id and verdict, and counts false accusations (rows marked contradicted that the golden does not). `examples/results/TEMPLATE.md` is the results format. Run protocol: build the fixture with `make-fixture.sh`, run cases 1 to 8 twice each on two or more models, score, commit `results/<model>-<date>.md`.
- Contradicted gate: the cited line is re-opened and quoted before contradicted is printed, else unverified. Fast path names "tests pass"; its threshold is now 10 non-blank lines and 1,200 characters.
- Inline or file PR text with only a tag-inferred base prints "PR range unknown" and downgrades change claims that rest only on that diff. Release mode lists at most 10 Not mentioned items.
- README: per-mode cost estimates, a JavaScript-only limit and a Hardening paragraph (user-side deny rules, nothing shipped).
- Not done: the recorded run of the eight fixture cases was not performed in this pass, so `examples/results/` is still empty and the README says "Nothing yet". The Python and Go or Rust fixtures are deferred until that run exists. No accuracy figure is claimed.
