# Evidence

Run from `examples/fixture`. Format: the ledger in `references/evidence-rules.md`.

| claim | command | extracted value | tolerance | date | replay |
| --- | --- | --- | --- | --- | --- |
| 4 checks pass | `sh test.sh \| grep -c '^ok'` | 4 | exact | 2026-11-22 | yes |
| 0 checks fail | `sh test.sh \| grep -c '^not ok'` | 0 | exact | 2026-11-22 | yes |
| script is 11 lines | `wc -l < wordfreq.sh` | 11 | exact | 2026-11-22 | yes |
| top word count is 5 | `sh wordfreq.sh sample.txt 1 \| cut -d' ' -f1` | 5 | exact | 2026-11-22 | yes |
| second row count is 3 | `sh wordfreq.sh sample.txt \| sed -n 2p \| cut -d' ' -f1` | 3 | exact | 2026-11-22 | yes |
| bash version (major.minor) | `echo $BASH_VERSION \| cut -c1-3` | 5.3 | volatile, re-measure on request | 2026-11-22 | no |
