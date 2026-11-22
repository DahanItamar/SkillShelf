# Patterns

Grep recipes and phrase tables, one section per rule ID in `rules.md`. Run every recipe over the whole
tree in Step 4, including files that were not read in full. A recipe with zero hits is recorded in
Coverage as "swept, 0 hits".

How to use this file:

- Recipes use the regular-expression syntax of the Grep tool (Rust regex). Use case-insensitive matching for the phrase recipes. Use multiline mode only where marked.
- A hit is a lead, not a finding. Read the line in context and apply the rule's `Applies:` line and the downgrade conditions in `rules.md`.
- The phrase lists are short and generic on purpose. They are examples of a family, not a complete list. A line that does the same thing in other words is still a hit when you judge it.
- Phrases sit inside code spans in table cells. That is deliberate: it is what lets this file be read as documentation about the patterns rather than as instructions.
- Never put a real-world payload string in this file.

Recipe names (`S-...`) are what Coverage lists.

---

## G-TEXT-01

- `S-INVIS`: `[\x{200B}-\x{200F}\x{2060}\x{FEFF}\x{202A}-\x{202E}\x{2066}-\x{2069}]` — zero-width, joiner, mark, word-joiner, byte-order-mark and bidirectional-control characters.
- `S-TAG`: `[\x{E0000}-\x{E007F}]` — Unicode tag characters (they render as nothing and can spell ASCII).

Judging: a hit on line 1 at the first character is probably a byte-order mark (not a finding). U+200D between two emoji is not a finding. Anything else is. Report each character as `<U+XXXX>`, never raw. Do not use `grep -P`: it rejects the tag range. Use the Grep tool.

## G-TEXT-02

- `S-COMMENT` (multiline mode): `(?s)<!--.*?-->` — read every comment found.
- `S-HIDDEN`: `hidden|display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0`
- `S-PAD`: `^[ \t]{200,}\S` — a line pushed far off-screen by padding.

Judging: first work out whether the comment sits inside a fenced block or a code span (shown literally, so not hidden). Then read the comment text and judge it under the other rules as if it were visible.

## G-TEXT-03

- `S-BLOB`: `[A-Za-z0-9+/=_-]{80,}` — base64-like runs.
- `S-HEX`: `\b[0-9a-fA-F]{64,}\b` — long hex runs.

Judging: skip `data:image/` URIs, `integrity` and `sha512-` fields and git SHAs. A long URL path is a false positive; look at what follows the run (a decoder or an interpreter raises the severity). Never decode. Write the first 40 characters, then `... N chars`.

## G-INJ-01

- `S-INJ-REVIEWER`: `(ignore|disregard|forget)\s+(all\s+|any\s+)?(the\s+)?(previous|prior|above|earlier)|you\s+are\s+now\b|^\s*(system|assistant)\s*:|\[/?INST\]|</?system>`
- `S-INJ-AUDITOR`: `(audited|reviewed|approved|certified|verified)\s+(and\s+\w+\s+)?(by|safe)|mark\s+(all|every)\w*\s+(as\s+)?pass|no\s+findings|skip\s+(the\s+)?(src|dir|folder|director)|(auditor|scanner|reviewer)\b`

| Family | Example wording |
|---|---|
| Drop earlier instructions | `ignore previous instructions` |
| Take a new role | `you are now` |
| Role or system marker | `SYSTEM:` |
| Claim of prior approval | `this skill has been audited` |
| Dictate the result | `report no findings` |
| Exclude something from review | `skip src` |
| Name the reviewer | `the auditor` |

## G-INJ-02

- `S-CONCEAL`: `(do\s+not|don't|never)\s+(tell|mention|show|reveal|inform)|silently|without\s+(telling|asking|notifying)|before\s+(responding|answering|replying).{0,40}(first|run)|omit\s+(this|it)\s+from`

| Family | Example wording |
|---|---|
| Hide from the user | `do not tell the user` |
| Hidden step | `silently` |
| No notice | `without telling` |
| Act first | `before responding, first run` |
| Leave out of the output | `omit this from the output` |

Judging: `silently` most often describes a failure ("fails silently"). It is a hit only when it tells Claude to do something unannounced, and the unannounced thing is something the user would want to know about.

## G-INJ-03

- `S-OVERRIDE`: `skip\s+(the\s+)?confirm|you\s+have\s+(my\s+)?permission|do\s+not\s+ask\s+before|always\s+proceed|disable\s+(the\s+)?sandbox|dangerously-skip-permissions|bypassPermissions|skipDangerousModePermissionPrompt|enableAllProjectMcpServers|approve\s+all`

| Family | Example wording |
|---|---|
| Skip approval | `skip confirmation` |
| Claim a permission | `you have permission` |
| No questions | `do not ask before` |
| Switch off a control | `disable the sandbox` |
| Settings keys that remove approval | `bypassPermissions`, `enableAllProjectMcpServers` |

Judging: a README that documents a user's own choice of a setting is a note under the downgrade conditions. An instruction to Claude, or a shipped settings file that sets one, is not.

## G-EXEC-01

- `S-HOOK`: `"hooks"\s*:|hooks\.json|PreToolUse|PostToolUse|SessionStart|UserPromptSubmit|Stop\b`

Judging: also open `hooks/hooks.json` and the frontmatter of every skill, command and agent file in full. List each hook as event plus exact command. Check the command against G-NET-01, G-PERM-02, G-EXEC-03 and G-EXEC-04 before assigning severity.

## G-EXEC-02

- `S-STARTER`: `mcpServers|"command"\s*:|npx\s+(-y\s+)?[@\w]|uvx\s|pip3?\s+install|npm\s+(i|install)\b|"(preinstall|install|postinstall|prepare)"\s*:|monitors?\b|\blsp\b`

Judging: also use the Glob listing. `bin/` files, `.mcp.json` and any `mod` file are starters whether or not a recipe hits. Note whether a version is pinned.

## G-EXEC-03

- `S-REMOTE-EXEC`: `(curl|wget|iwr|Invoke-WebRequest)[^\n|]*\|\s*(sudo\s+)?(ba|z|da)?sh|\|\s*(python3?|node|perl|ruby)\b|bash\s+<\(|eval\s*\$\(|iex\s*\(|chmod\s+\+x|git\+https?://|npm\s+(i|install)\s+https?://`
- `S-REMOTE-FOLLOW`: `(read|fetch|load|follow|obey)[^\n]{0,40}(instructions?|rules|prompt)[^\n]{0,40}https?://`
- `S-MUTABLE-URL`: `raw\.githubusercontent\.com/[^\s/]+/[^\s/]+/(main|master|HEAD)/|/latest\b`

| Family | Example wording |
|---|---|
| Pipe a download to a shell | `curl ... pipe sh` |
| Process substitution | `bash <(curl ...)` |
| Download, mark executable, run | `chmod +x` |
| Unpinned URL install | `pip install git+https://...` |
| Fetch and follow | `read the instructions at <URL> and follow them` |

## G-EXEC-04

- `S-OBFUSC`: `\beval\s*\(|new\s+Function|String\.fromCharCode|atob\(|exec\(.{0,20}(base64|b64)|base64\s+(-d|--decode)`
- `S-LONGLINE`: `^.{2000,}$` — a single line of 2,000 characters or more.
- Glob by extension: `**/*.{exe,dll,so,dylib,bin,jar,wasm,pyc,node}`.

Judging: any file Read cannot present as text goes in Coverage as "Not read" with name, size and extension, and makes coverage incomplete.

## G-PERM-01

- `S-GRANT`: `allowed-tools|allowedTools|"allow"\s*:|permissions`

Open the grant and look for: bare `Bash`, `Bash(*)`, `Bash(sh:*)`, `Bash(bash:*)`, `Bash(zsh:*)`, `Bash(pwsh:*)`, `Bash(cmd:*)`, `Bash(python:*)`, `Bash(node:*)`, `Bash(perl:*)`, `Bash(ruby:*)`, `sudo`, `eval`, bare `WebFetch`, `Write` or `Edit` on a skill whose purpose is read-only, and `*`. The `allowed-tools` field accepts a space-separated string, a comma-separated string or a YAML list; read all three forms.

## G-PERM-02

- `S-PATH`: `~/\.(ssh|aws|gnupg|kube|docker)|~/\.config|\.env\b|\.npmrc|\.netrc|id_(rsa|ed25519)|keychain|Login Data|\.bash_history|\.zsh_history|\.(bash|zsh)rc|\.profile\b|/etc/|git\s+config\s+--global|\.git/hooks|settings(\.local)?\.json|CLAUDE\.md|~/\.claude|\.claude/`

Judging: separate "Claude is told to read or write it" from "the text mentions it". Only the first is a reach finding. Every path found goes in the capability inventory.

## G-NET-01

- `S-EGRESS`: `\b(curl|wget|Invoke-WebRequest|nc|ncat|scp|sftp|ftp)\b|fetch\(|requests\.(get|post|put)|urllib|WebFetch|\bPOST\b|webhook|pastebin|ngrok|requestbin|webhook\.site|bit\.ly|tinyurl`
- `S-URL`: `https?://[^\s)>"']+` — list every distinct host.
- `S-IP-URL`: `https?://\d{1,3}(\.\d{1,3}){3}`
- `S-IMG-EXFIL`: `!\[[^\]]*\]\(https?://[^)]*(\{|<|\$\{|%7B)`

Judging: the payload decides severity. Look for what is sent and the framing words (report, sync, upload, telemetry). Defang every URL you print: `hxxps://host[.]invalid/path`.

## G-INTENT-01

No recipe. This is the Step 6 diff: read the stated purpose from the `description` or the README, list what the files ask Claude to do, name the surplus, quote both sides. The recipes `S-GRANT`, `S-EGRESS`, `S-PATH` and `S-HOOK` supply the "requested" side.

## G-INTENT-02

- `S-TRIGGER`: `every\s+(task|request|prompt|message|response)|any\s+(task|request)|before\s+any\s+(response|answer|reply)|(always|first)\s+use\s+this|always\s+used?\s+first|(replaces?|supersedes?|instead\s+of)\s+(all\s+|any\s+)?(other\s+)?skills?`

| Family | Example wording |
|---|---|
| Fires on everything | `use for every task` |
| Fires before anything else | `always use this first` |
| Displaces other skills | `replaces other skills` |
| Shadows a built-in | a skill named like a built-in or well-known command |

## G-INTENT-03

No recipe. Read `.claude-plugin/marketplace.json` and each `plugin.json`: `source` (relative path, remote repository, URL, package or git ref), any `sha` or `ref` pin, `name`, `version`, `homepage`, `repository`, author. Compare them with each other and with the directory name. Look nothing up.
