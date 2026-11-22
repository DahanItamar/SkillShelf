# Legal-change watch (optional, not installed)

ACSM never runs this. Copy it into your own repository as `.github/workflows/acsm-watch.yml` if
you want a nudge when a cited source changes or goes stale. It reads URLs from
`docs/CITATIONS.md` (adjust the path to where you keep a copy).

```yaml
name: acsm-watch
on: { schedule: [{ cron: "0 6 1 * *" }], workflow_dispatch: {} }
permissions: { contents: read, issues: write }
jobs:
  watch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          grep -o 'https\?://[^ |)]*' docs/CITATIONS.md | sort -u | while read -r u; do
            printf '%s %s\n' "$(curl -sL --max-time 30 "$u" | sha256sum | cut -c1-16)" "$u"
          done > now.txt
          if [ -f .acsm-hashes ] && ! diff -q .acsm-hashes now.txt >/dev/null; then echo CHANGED=1 >> "$GITHUB_ENV"; fi
          [ "$(find .acsm-hashes -mtime +180 2>/dev/null)" ] && echo CHANGED=1 >> "$GITHUB_ENV"
          cp now.txt .acsm-hashes
      - if: env.CHANGED == '1'
        run: gh issue create -t "ACSM sources changed or hashes older than 180 days" -b "Re-verify docs/CITATIONS.md." 
        env: { GH_TOKEN: "${{ github.token }}" }
```

Limits: pages with dynamic content change their hash without a legal change, and the stored
`.acsm-hashes` file must be committed or cached by you. Treat an issue as a prompt to read, not
as a finding.
