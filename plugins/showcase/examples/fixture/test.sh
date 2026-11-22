#!/bin/sh
# Four checks, no dependencies. Run: sh test.sh
cd "$(dirname "$0")" || exit 2
fail=0
check() { if [ "$2" = "$3" ]; then echo "ok - $1"; else echo "not ok - $1"; fail=1; fi; }
check "top word is the" "$(sh wordfreq.sh sample.txt 1)" "5 the"
check "default is three lines" "$(sh wordfreq.sh sample.txt | wc -l | tr -d ' ')" "3"
check "case is ignored" "$(printf 'A a A\n' > /tmp/wf$$ && sh wordfreq.sh /tmp/wf$$ 1; rm -f /tmp/wf$$)" "3 a"
sh wordfreq.sh /nonexistent >/dev/null 2>&1; check "missing file exits 2" "$?" "2"
exit "$fail"
