#!/bin/sh
# wordfreq: print the most frequent words in a file, one "count word" per line.
# Usage: sh wordfreq.sh FILE [N]     (N defaults to 3)
if [ $# -lt 1 ] || [ ! -f "$1" ]; then
  echo "usage: wordfreq.sh FILE [N]" >&2
  exit 2
fi
n=${2:-3}
tr -cs 'A-Za-z' '\n' < "$1" | tr 'A-Z' 'a-z' | grep -v '^$' |
  sort | uniq -c | sort -k1,1nr -k2,2 | head -n "$n" |
  awk '{print $1, $2}'
