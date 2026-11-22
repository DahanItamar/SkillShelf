#!/bin/sh
# Replay an evidence ledger (docs/EVIDENCE.md format from references/evidence-rules.md).
# Usage: sh scripts/replay.sh LEDGER WORKDIR
# Prints one STALE line per row whose command no longer gives the stored value; exits non-zero if any.
# WARNING: this executes the commands in the ledger. Only point it at a ledger you trust.
# Optional maintainer or CI check. Nothing executes at install, and the skill does not require it.
if [ $# -ne 2 ] || [ ! -f "$1" ] || [ ! -d "$2" ]; then
  echo "usage: replay.sh LEDGER WORKDIR" >&2
  exit 2
fi
led=$1; work=$2
trim() { printf '%s' "$1" | sed 's/^ *//; s/ *$//'; }
sed 's/\|/@PIPE@/g' "$led" | grep '^|' | while IFS='|' read -r _ claim cmd val tol _ rp _; do
  [ "$(trim "$rp")" = yes ] || continue
  tol=$(trim "$tol"); val=$(trim "$val")
  case "$tol" in volatile*) continue;; esac
  cmd=$(trim "$cmd" | sed 's/^`//; s/`$//; s/@PIPE@/|/g')
  got=$(cd "$work" && sh -c "$cmd" 2>/dev/null | tr -d ' \n')
  pct=$(printf '%s' "$tol" | sed -n 's|^+/-\([0-9]*\)%.*|\1|p')
  if [ -n "$pct" ]; then
    awk -v g="$got" -v v="$val" -v p="$pct" 'BEGIN{d=g-v;if(d<0)d=-d;exit !(v!=0 && d*100<=p*v)}' ||
      echo "STALE: $(trim "$claim") (stored $val, got $got)"
  else
    [ "$got" = "$val" ] || echo "STALE: $(trim "$claim") (stored $val, got $got)"
  fi
done | { n=0; while read -r line; do echo "$line"; n=1; done; [ "$n" = 0 ]; }
