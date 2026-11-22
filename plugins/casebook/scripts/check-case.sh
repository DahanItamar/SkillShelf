#!/bin/sh
# Casebook case-file check. Optional maintainer tool: nothing in the plugin runs it.
#
# POSIX shell and awk only. No node, no packages. It READS one case file
# and prints findings. It never writes a file and never runs anything that
# appears inside a case file (the file is data, passed to awk as input only).
#
# Usage:  sh scripts/check-case.sh docs/bugs/007.md
#         sh scripts/check-case.sh --as 001.md examples/cases/good-closed.md
#   --as NAME   check the file as if it were named NAME (used by the examples,
#               whose file names are descriptive rather than NNN.md)
#
# Exit codes:
#   0  every rule passed
#   1  at least one rule failed; each printed as  FAIL L<n>: <file>:<line> <message>
#   2  the script could not run (no file, not readable, no awk)
#
# What this cannot see: an edit Claude made to code without recording it. The
# gate is a procedure Claude follows, not a lock; this script only checks that
# the case file itself obeys the rules.

RULE_COUNT=9

AS=""
if [ "${1:-}" = "--as" ]; then
	if [ $# -lt 3 ]; then
		printf 'cannot run: --as needs a name and a file\n' >&2
		exit 2
	fi
	AS=$2
	shift 2
fi

if [ $# -ne 1 ]; then
	printf 'usage: sh scripts/check-case.sh [--as NNN.md] docs/bugs/NNN.md\n' >&2
	exit 2
fi

FILE=$1
if [ ! -f "$FILE" ] || [ ! -r "$FILE" ]; then
	printf 'cannot run: %s is not a readable file\n' "$FILE" >&2
	exit 2
fi
if ! command -v awk >/dev/null 2>&1; then
	printf 'cannot run: awk not found\n' >&2
	exit 2
fi

if [ -n "$AS" ]; then
	BASE=$AS
else
	BASE=${FILE##*/}
fi

OUT=$(CASE_BASE="$BASE" awk '
function add(rule, ln, msg) {
	buf[rule] = buf[rule] sprintf("FAIL L%d: %s:%d %s\n", rule, FILENAME, ln, msg)
	nfail++
}
function trim(s) { sub(/^[[:space:]]+/, "", s); sub(/[[:space:]]+$/, "", s); return s }
function empty_or_notyet(s,   t) {
	t = tolower(trim(s))
	return (t == "" || t ~ /^not yet\.?$/)
}
BEGIN {
	split("Symptom|Repro|Hypotheses|Ruled out|Root cause|Fix|Regression test|Before and after|Lesson", need, "|")
	sec = ""; hyp = ""; inev = 0; nhyp = 0
}
{
	sub(/\r$/, "")
	line[NR] = $0
	if ($0 ~ /^## /) {
		sec = substr($0, 4); sec = trim(sec); seen[sec] = NR; hyp = ""; inev = 0
		next
	}
	if ($0 ~ /^# CASE/ && head == "") { head = $0; headln = NR }
	if (statln == 0 && $0 ~ /^Status:/) { status = trim(substr($0, 8)); statln = NR }
	if (rsln == 0 && $0 ~ /^Repro status:/) { rstat = trim(substr($0, 14)); rsln = NR }

	if (sec == "Repro" && $0 ~ /^[-[:space:]]*Intermittent: yes/) intermittent = 1

	if (sec == "") {
		if ($0 ~ /^Verify command:/) { vc = trim(substr($0, 16)); vcln = NR }
		else if ($0 ~ /^Verify one:/) { vo = trim(substr($0, 12)); voln = NR }
		else if ($0 ~ /^Runs:/) { runs = trim(substr($0, 6)); runsln = NR }
		else if ($0 ~ /^Proof command:/) { pc = trim(substr($0, 15)); pcln = NR }
		else if ($0 ~ /^Single hypothesis reason:/) { shr = trim(substr($0, 26)); shrln = NR }
	}

	if (sec == "Hypotheses") {
		if ($0 ~ /^### /) {
			inev = 0
			if ($0 ~ /^### H[0-9]+ /) {
				match($0, /^### H[0-9]+ /)
				hyp = substr($0, 5, RLENGTH - 5)
				nhyp++; hyps[nhyp] = hyp; hypln[hyp] = NR
				if (match($0, / -- result: (pending|ruled out|inconclusive|confirmed)$/)) {
					res[hyp] = substr($0, RSTART + 12)
				} else {
					res[hyp] = ""
					add(4, NR, "hypothesis heading must end with \" -- result: pending|ruled out|inconclusive|confirmed\"")
				}
			} else {
				hyp = ""
				add(4, NR, "hypothesis heading must start with \"### H<n> \"")
			}
			next
		}
		if (hyp != "") {
			if ($0 ~ /^- Experiment:/) {
				inev = 0
				xp[hyp] = trim(substr($0, 14)); xpln[hyp] = NR
			} else if ($0 ~ /^- Evidence:/) {
				inev = 1
				ev[hyp] = substr($0, 13); evln[hyp] = NR
			} else if ($0 ~ /^- / || $0 ~ /^#/) {
				inev = 0
			} else if (inev) {
				ev[hyp] = ev[hyp] " " $0
			}
		}
		next
	}

	if (sec == "Ruled out" && $0 ~ /^- H[0-9]+ -- /) {
		match($0, /^- H[0-9]+/)
		rid = substr($0, 3, RLENGTH - 2)
		listed[rid] = NR
	}
	if (sec != "" && trim($0) != "") {
		if (!(sec in first)) { first[sec] = trim($0); firstln[sec] = NR }
		txt[sec] = txt[sec] " " $0
		if (sec == "Regression test" && $0 ~ /^[^[:space:]]+ :: [^[:space:]]/) regline = NR
		if (sec == "Regression test" && $0 ~ /^Check: ./) checkline = NR
		if (sec == "Regression test" && $0 ~ /^Why no test: ./) whyline = NR
		if (sec == "Before and after") {
			if ($0 ~ /^- Before:/) { before = $0; beforeln = NR }
			if ($0 ~ /^- After:/) { after = $0; afterln = NR }
		}
	}
}
END {
	# L1: file name and heading
	base = ENVIRON["CASE_BASE"]
	if (base !~ /^[0-9][0-9][0-9]+\.md$/) {
		add(1, 1, "file name must be NNN.md with 3 or more digits (got " base ")")
	}
	if (head == "") {
		add(1, 1, "no heading of the form \"# CASE NNN: title\"")
	} else if (head !~ /^# CASE [0-9][0-9][0-9]+: ./) {
		add(1, headln, "heading must look like \"# CASE NNN: title\" with 3 or more digits")
	} else {
		hn = head; sub(/^# CASE /, "", hn); sub(/:.*$/, "", hn)
		bn = base; sub(/\.md$/, "", bn)
		if (base ~ /^[0-9][0-9][0-9]+\.md$/ && hn != bn) {
			add(1, headln, "heading number " hn " does not match file name " base)
		}
	}

	# L2: status vocabularies
	if (statln == 0) add(2, 1, "no Status: line")
	else if (status !~ /^(open|fixing|closed|parked)$/) add(2, statln, "Status must be open, fixing, closed or parked (got \"" status "\")")
	if (rsln == 0) add(2, 1, "no Repro status: line")
	else if (rstat != "observed failing" && rstat != "not observed") add(2, rsln, "Repro status must be \"observed failing\" or \"not observed\" (got \"" rstat "\")")

	# L2 (header lines): approved-command marks, {test} placeholder, Runs
	if (vcln && vc != "`none`" && vc !~ /^`[^`]+` \((constitution|user-approved)\)$/) add(2, vcln, "Verify command must be a backticked command followed by (constitution) or (user-approved), or `none`")
	if (voln && vo !~ /^`[^`]*\{test\}[^`]*` \(user-approved\)$/) add(2, voln, "Verify one must be a backticked command containing {test}, followed by (user-approved)")
	if (runsln && runs !~ /^[1-9][0-9]*$/) add(2, runsln, "Runs must be a positive integer (got \"" runs "\")")
	if (pcln && pc !~ /^`[^`]+` \(user-approved\)$/ && pc !~ /^manual checklist: ./) add(2, pcln, "Proof command must be a backticked command followed by (user-approved), or \"manual checklist: <name>\"")

	# L3: nine sections
	for (i = 1; i <= 9; i++) if (!(need[i] in seen)) add(3, 1, "missing section \"## " need[i] "\"")

	# L4: hypotheses and experiment kinds
	if (nhyp < 2 && !(nhyp == 1 && shr != "")) add(4, (seen["Hypotheses"] ? seen["Hypotheses"] : 1), "at least 2 hypotheses are required (found " nhyp "), or one plus a \"Single hypothesis reason:\" line")
	for (i = 1; i <= nhyp; i++) {
		h = hyps[i]
		if (!(h in xp)) add(4, hypln[h], h " has no Experiment: line")
		else if (xp[h] !~ /^\[(read|verify|user-run|bisect)\]/) add(4, xpln[h], h " Experiment must begin with [read], [verify], [user-run] or [bisect]")
	}

	# L5: the gate
	if (status == "fixing" || status == "closed") {
		anyres = 0
		for (i = 1; i <= nhyp; i++) if (res[hyps[i]] != "" && res[hyps[i]] != "pending") anyres = 1
		if (!anyres) add(5, statln, "Status is " status " but no hypothesis has a recorded result (gate not opened)")
		if (rstat != "observed failing") add(5, (rsln ? rsln : 1), "Status is " status " but Repro status is not \"observed failing\"")
	}

	# L6: evidence on every non-pending hypothesis
	for (i = 1; i <= nhyp; i++) {
		h = hyps[i]
		if (res[h] == "" || res[h] == "pending") continue
		e = ev[h]
		if (trim(e) == "") add(6, (evln[h] ? evln[h] : hypln[h]), h " is " res[h] " but Evidence is empty")
		else if (e !~ /[A-Za-z0-9_.\/-]+:[0-9]+/ && e !~ /ran:/) add(6, evln[h], h " Evidence needs a path:line pointer, \"ran: <cmd> -> <output>\" or \"user ran: ...\"")
	}

	# L7: Ruled out list matches ruled out hypotheses, both ways
	for (i = 1; i <= nhyp; i++) {
		h = hyps[i]
		if (res[h] == "ruled out" && !(h in listed)) add(7, hypln[h], h " is ruled out but missing from the Ruled out list")
	}
	for (r in listed) {
		if (!(r in res)) add(7, listed[r], r " is in the Ruled out list but is not a hypothesis")
		else if (res[r] != "ruled out") add(7, listed[r], r " is in the Ruled out list but its result is " res[r])
	}

	# L8 and L9: only for closed cases
	if (status == "closed") {
		rc = first["Root cause"]
		if (match(rc, /^Confirmed: H[0-9]+/)) {
			cid = substr(rc, 12, RLENGTH - 11)
			if (res[cid] != "confirmed") add(8, firstln["Root cause"], "Root cause names " cid " but that hypothesis is not confirmed")
		} else {
			add(8, (firstln["Root cause"] ? firstln["Root cause"] : 1), "Root cause must begin \"Confirmed: H<n>\"")
		}
		if (empty_or_notyet(txt["Fix"])) add(8, (seen["Fix"] ? seen["Fix"] : 1), "Fix section is empty")
		else if (tolower(txt["Fix"]) ~ /trial, unconfirmed/) add(8, firstln["Fix"], "Fix is a trial, unconfirmed: a trial fix cannot close a case")
		if (!regline && !checkline) add(8, (seen["Regression test"] ? seen["Regression test"] : 1), "Regression test must be one line: <path> :: <test name> (or Check: with a Why no test: line and a Proof command header)")
		else if (!regline && checkline) {
			if (!whyline) add(8, checkline, "Check: needs a \"Why no test:\" line saying why a test is impossible")
			if (pcln == 0) add(8, checkline, "Check: needs a \"Proof command:\" header line")
		}
		if (before == "") add(8, (seen["Before and after"] ? seen["Before and after"] : 1), "no \"- Before:\" line")
		else if (before !~ /^- Before: exit [0-9]+; observed by (Claude|user); ./) add(8, beforeln, "Before must read: exit <int>; observed by <Claude|user>; <excerpt>")
		else {
			bx = before; sub(/^- Before: exit /, "", bx); sub(/;.*$/, "", bx)
			if (bx + 0 == 0) add(8, beforeln, "Before exit must be non-zero (the repro must fail before the fix)")
			if (intermittent) {
				if (match(before, /runs: [0-9]+\/[0-9]+/)) {
					bn2 = substr(before, RSTART + 6, RLENGTH - 6)
					split(bn2, bq, "/")
					if (bq[1] + 0 < 1) add(8, beforeln, "intermittent case: at least one Before run must fail (runs: " bn2 ")")
					if (runsln && bq[2] != runs) add(8, beforeln, "Before total " bq[2] " does not match Runs: " runs)
				} else add(8, beforeln, "intermittent case: Before needs runs: <failed>/<total>")
			}
		}
		if (after == "") add(8, (seen["Before and after"] ? seen["Before and after"] : 1), "no \"- After:\" line")
		else if (after !~ /^- After: exit [0-9]+; observed by (Claude|user); ./) add(8, afterln, "After must read: exit <int>; observed by <Claude|user>; <excerpt>")
		else {
			ax = after; sub(/^- After: exit /, "", ax); sub(/;.*$/, "", ax)
			if (ax + 0 != 0) add(8, afterln, "After exit must be 0")
			if (intermittent) {
				if (match(after, /runs: [0-9]+\/[0-9]+/)) {
					rn = substr(after, RSTART + 6, RLENGTH - 6)
					split(rn, pq, "/")
					if (pq[1] != pq[2]) add(8, afterln, "intermittent case: every run must pass (runs: " rn ")")
					if (runsln && pq[2] != runs) add(8, afterln, "After total " pq[2] " does not match Runs: " runs)
				} else add(8, afterln, "intermittent case: After needs runs: <passed>/<total>")
			}
		}
		if (empty_or_notyet(txt["Lesson"])) add(8, (seen["Lesson"] ? seen["Lesson"] : 1), "Lesson section is empty")

		for (n = 1; n <= NR; n++) {
			s = line[n]
			if (s ~ /^<!--/) continue
			gsub(/`[^`]*`/, "", s)
			gsub(/<redacted>/, "", s)
			if (tolower(s) ~ /not yet/ || s ~ /TBD/ || s ~ /<[^<>]*>/) {
				add(9, n, "closed case still has a placeholder (Not yet, TBD or <...>)")
			}
		}
	}

	for (r = 1; r <= 9; r++) printf "%s", buf[r]
	if (nfail > 0) exit 1
	exit 0
}
' "$FILE")
STATUS=$?

if [ "$STATUS" -eq 0 ]; then
	printf 'PASS: %s (%s rules checked)\n' "$FILE" "$RULE_COUNT"
	exit 0
fi
printf '%s\n' "$OUT"
exit 1
