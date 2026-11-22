# Changelog

Release checklist: version in `plugin.json` == the hearsay entry (version and description) in the root `.claude-plugin/marketplace.json` == the head of this file == the README badge; `sh scripts/verify.sh` exits 0; a real run is committed under `examples/results/<model>-<date>.md` before any README line claims a measured result (until then the README says "Measured so far: nothing yet"). Nothing here runs at install.

## 0.1.0
- First version. Fact-checks release notes, a changelog entry, a PR description or a README feature list against the repository, one claim at a time, and marks each verified, unverified, contradicted or unmeasurable with file and line.
- Prints a claims ledger plus honest rewrites that downgrade what the code does not support. Never writes files, runs the project or touches the network.
- Release mode (`/hearsay --release <prev-tag>`): compares the previous tag with HEAD, classifies the changes, proposes the SemVer bump and flags commit messages that disagree with the diff (codes M1 to M7).
- `examples/` holds a fictional project, a fixture repo builder and expected verdicts. They are expectations written by the author; no run has been recorded yet.
- `scripts/verify.sh` is a structural check for maintainers (POSIX sh, no dependencies).
