#!/bin/sh
# edgecase candidate finder. ADVISORY ONLY: it prints lines worth a look, not findings.
# A model review of the same code is not deterministic and may disagree in either direction.
# Noise: R-STATE-16 is the noisiest class (it fires on every plain fetch) and server-component fetches are recommended, not blocking.
# Measured on examples/ by running it: 0 candidates on pass.jsx and files.jsx; flags status.jsx:8 (R-STATE-17), list.jsx and search.jsx (R-STATE-18); also flags one-shot graphql-or-checked.jsx (R-STATE-18, which does not apply there).
# Usage: sh scripts/candidates.sh [path ...]   (default: current directory)
# Output: file:line  pattern  (R-ID)     Nothing is written or executed beyond grep and awk.
[ $# -eq 0 ] && set -- .
find "$@" -type f \( -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' -o -name '*.vue' \
  -o -name '*.svelte' -o -name '*.html' -o -name '*.erb' \) \
  ! -path '*/node_modules/*' ! -path '*/.git/*' ! -path '*/expected/*' | sort | while read -r f; do
  awk -v F="$f" '
    { line[NR] = $0 }
    END {
      for (i = 1; i <= NR; i++) {
        l = line[i]
        if (l ~ /catch[ ]*(\([^)]*\))?[ ]*\{[ ]*\}/)
          printf "%s:%d  empty catch  (R-FEEDBACK-02)\n", F, i
        if (l ~ /\.catch\([ ]*\([^)]*\)[ ]*=>[ ]*\{[ ]*\}/)
          printf "%s:%d  .catch(() => {}) swallows the error  (R-FEEDBACK-02)\n", F, i
        if (l ~ /(^|[^A-Za-z_])fetch\(/) {
          win = ""; for (j = i; j <= i + 6 && j <= NR; j++) win = win line[j]
          if (win !~ /\.ok|\.status|raise_for_status|throwOnError/)
            printf "%s:%d  fetch with no ok/status check nearby  (R-STATE-17)\n", F, i
          if (win !~ /signal|AbortSignal|AbortController|timeout/)
            printf "%s:%d  fetch with no signal or timeout nearby  (R-STATE-16)\n", F, i
          seenfetch = 1
        }
        if (l ~ /useEffect\(/) effect = 1
        all = all l "\n"
      }
      if (effect && seenfetch && all !~ /AbortController|ignore|cancel|isCurrent|latest/)
        printf "%s:1  fetch in an effect with no abort or latest-request guard  (R-STATE-18)\n", F
      if (all ~ /useQuery\(|useSWR\(|useAsyncData\(/ && all !~ /isError|[.]error|error[ ]*[}=,]|onError/)
        printf "%s:1  query hook with no error read  (R-FEEDBACK-02)\n", F
    }' "$f"
done
echo "Candidates only. Confirm each against the rule's Applies line before treating it as a finding." >&2
