# Worked example: the pre-write scan

> Hand-authored, with synthetic data (`example.com`, a made-up id and a made-up token). The scan
> output below was observed by running the command; `check.sh` reruns it and fails if it differs.

Files, in `redaction/`: [`draft.md`](redaction/draft.md), [`edited.md`](redaction/edited.md) and the
stored output [`hits.txt`](redaction/hits.txt). Run from `examples/redaction`.

## 1. The draft

```text
patient: Jane Example
email: jane.example@example.com
record id: 4829175036
api token: tok_9fK2mQ7xLw3Zp8Rv1Ts6Yb4Nc5Hd0Ja
```

## 2. The scan (from `references/evidence-rules.md`)

```sh
grep -nEi '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|([0-9]{1,3}\.){3}[0-9]{1,3}|(sk|ghp|xox[bp]|akia)[-_a-z0-9]{8,}|[a-z0-9+/_-]{32,}|[0-9]{9,}' draft.md
```

```text
5:email: jane.example@example.com
6:record id: 4829175036
7:api token: tok_9fK2mQ7xLw3Zp8Rv1Ts6Yb4Nc5Hd0Ja
```

Three hits. The name line is not caught: the scan finds shapes, not meaning, so a human still reads
the draft.

## 3. The edited snippet

```text
patient: Jane Example
email: [email redacted]
record id: [redacted]
api token: [redacted]
```

The same scan on `edited.md` prints nothing (exit status 1, no match).

## 4. The handover table

| Row | Value |
| --- | --- |
| 1. Paths written | `README.md` (the snippet only) |
| 2. Numbers | none in this snippet |
| 3. Unverified | scan hits, all redacted: line 5 email, line 6 record id, line 7 token-shaped string |
| 4. Screenshots | none taken |
| 5. Verified on | `not run` |
| 6. Stranger test | `not run` |

Rows follow the fixed six-row handover in `SKILL.md`. This scan lowers the leak risk; it is
not a compliance claim.
