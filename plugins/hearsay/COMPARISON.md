# How it compares

Others in this space are programs you run. Hearsay is instructions an agent follows, so it is zero-install,
language-agnostic and also covers release prose, and it is non-deterministic. These tables are snapshots. Statements below are from
the cited pages as read on 2026-11-22 and may have changed. Not a claim of being better.

| Tool | What it is | Use that instead when |
|---|---|---|
| [`hearsay-pr`](https://pypi.org/project/hearsay-pr/) (PyPI; [repo](https://github.com/hearsay-dev/hearsay)) | Deterministic CLI that checks PR descriptions against the diff with patterns, no LLM, no network. Its README advises against gating on `contradicted` until calibrated | You want repeatable verdicts or a CI check for PR text |
| [truth](https://github.com/blasrodri/truth) | Local MCP fact-checker for an agent's claims about its own work, using recorded command runs and the working-tree diff | You want an agent's claims checked as it works, with command runs as evidence |
| [README Clew](https://dev.to/earlgreyhot1701d/i-always-worried-my-own-readmes-disagreed-with-my-own-repos-so-i-built-readme-clew-42i5) | Checks a README against code (verified, unverifiable, missing, contradicted) | You only need README checks |
| [RealityLint](https://pypi.org/project/realitylint/) | Static checks of README claims (scripts, links, env vars, license), no LLM | You want mechanical README checks in CI |
| [semver-checks](https://dev.to/kyungseopk1m/i-got-tired-of-guessing-semver-bumps-in-prs-so-i-built-a-tool-15o) | TypeScript API diff between two refs with a bump recommendation | You need a precise TypeScript API diff. It sees only the API surface, so behavior changes are outside what it can see (Hearsay marks those `needs-maintainer`) |

The next rows are other skills for release notes and changelogs, from their pages as read on
2026-11-22. In the sources we searched we found none that combines four verdicts, commit-message
mismatch codes and a bump proposal; that is a statement about our search, not a universal claim.

| Skill | What its page says it does | Use that instead when |
|---|---|---|
| [Release Proof Notes](https://www.agensi.io/skills/release-proof-notes-check-the-claims-behind-your-changelog) | Drafts customer-facing notes from a private claim-to-evidence ledger over an explicit git range, holding or rewording claims that lack evidence; uses a bundled local collector | You want notes drafted from a checked git range. Hearsay checks notes you already wrote |
| [kweaver-ai changelog-release-notes](https://skills.sh/kweaver-ai/skills/changelog-release-notes) | Writes release notes from version files, git history, diffs and migrations, matching the existing changelog style. The page does not mention a claim check | You want a changelog written, not audited |
| [DevFlow docs-release-notes](https://www.claudepluginhub.com/skills/the01geek-devflow/docs-release-notes) | Drafts release notes for a branch, checking claims against the diff, and corrects CHANGELOG claims the shipped diff contradicts when the version is bumped | You want notes written and corrected as part of that workflow. The page does not mention a bump proposal or commit-message checks |
| [laurigates changelog-review](https://skills.sh/laurigates/claude-plugins/changelog-review) | Reviews the Claude Code platform changelog for changes that affect your plugins | Different job: it reads Claude Code releases, not your project's notes |

An NVIDIA warp `changelog-audit` skill (tessl.io registry) was also found by search, but its page
returned HTTP 410 when read, so it is not compared here.

Not the `hearsay-pr` PyPI package: that is a separate, deterministic CLI by other authors.

## Credits

The rubric is independently written. Public sources that informed the design: the arXiv paper above
(for the failure mode), and the tools in the comparison table, from which the ideas of an honest
"unverifiable" bucket, "supported is not correct", and cheap mechanical README checks were taken.
Pages cited were read on 2026-11-22.
