#!/bin/sh
# Truthpath hint list. Optional maintainer tool: nothing in the plugin runs it.
# HINTS ONLY: candidates for a reader, not findings. Many hints are not problems;
# some problems produce no hint.
#
# POSIX sh and awk only. It READS source files and prints hint lines. It writes
# nothing and runs nothing from the files it reads (they are passed to awk as data).
#
# Usage:  sh scripts/hints.sh [path ...]     (default: current directory)
# Output: file:line  <hint>  (TP-NN)
# Exit:   0 after printing (hints or none); 2 on bad usage (unknown option, missing path).
#
# Mechanical shapes only (see skills/truthpath/references/catalogue.md for all ten patterns):
#   TP-01 empty catch, .catch(() => {}), except followed by pass, Go "_ = err"
#   TP-04 example.com/.org/.net and placeholder tokens
#   TP-06 a function body that is only "return <literal>"
#   TP-07 TODO, FIXME, "not implemented", NotImplementedError
#   TP-09 an import or from line that names mock or fake
# Test and non-production paths are skipped, using the same list as
# skills/truthpath/references/scope.md. Generated and minified files are skipped only
# when the name says so (*.min.*); a reader still has to judge the rest.

printf 'HINTS ONLY: candidates for a reader, not findings. Many hints are not problems; some problems produce no hint.\n' >&2

if [ $# -eq 0 ]; then
	set -- .
fi

for a in "$@"; do
	case "$a" in
	-*)
		printf 'usage: sh scripts/hints.sh [path ...]\n' >&2
		exit 2
		;;
	esac
	if [ ! -e "$a" ]; then
		printf 'usage: sh scripts/hints.sh [path ...]  (no such path: %s)\n' "$a" >&2
		exit 2
	fi
done

for root in "$@"; do
	find "$root" -type f \( -name '*.js' -o -name '*.jsx' -o -name '*.mjs' -o -name '*.cjs' \
		-o -name '*.ts' -o -name '*.tsx' -o -name '*.py' -o -name '*.go' \) | LC_ALL=C sort | while IFS= read -r f; do
		if [ -f "$root" ]; then
			# a file given directly: judge it by its own folder name and file name
			d=${f%/*}
			[ "$d" = "$f" ] && d=.
			rel="/${d##*/}/${f##*/}"
		else
			# a folder: judge each file by the folder name given plus the path below it
			b=${root%/}
			rel="/${b##*/}/${f#"$root"}"
		fi
		case "/$rel" in
		*/test/* | */tests/* | */__tests__/* | */spec/* | */__mocks__/* | */mocks/* | */fixtures/* | */testdata/* | */e2e/* | */cypress/* | */node_modules/* | */vendor/* | */dist/* | */build/* | */.git/*)
			continue
			;;
		esac
		case "${f##*/}" in
		*.test.* | *.spec.* | *_test.go | test_*.py | *_test.py | conftest.py | *.stories.* | *.min.*)
			continue
			;;
		esac
		awk -v F="$f" '
		BEGIN {
			LIT = "(-?[0-9][0-9.]*|true|false|null|undefined|nil|None|True|False|\"[^\"]*\"|\047[^\047]*\047|[[][]]|[{][}])"
			FN = "(^|[^A-Za-z0-9_])(function|func)[ \t(]|=>"
			METHOD = "^[ \t]*(async[ \t]+)?[A-Za-z_$][A-Za-z0-9_$]*[ \t]*[(][^)]*[)][ \t]*(:[^{]*)?[{][ \t]*$"
			KEYW = "^[ \t]*(if|for|while|switch|catch|else|with)([^A-Za-z0-9_]|$)"
		}
		{ line[NR] = $0 }
		function indent(s,   m) { m = s; sub(/[^ \t].*$/, "", m); return length(m) }
		function nextnb(i,   j) {
			for (j = i + 1; j <= NR; j++) if (line[j] !~ /^[ \t]*$/) return j
			return 0
		}
		END {
			for (i = 1; i <= NR; i++) {
				l = line[i]
				if (l ~ /catch[ ]*([(][^)]*[)])?[ ]*[{][ ]*[}]/)
					printf "%s:%d  empty catch  (TP-01)\n", F, i
				if (l ~ /[.]catch[(][ ]*[(][^)]*[)][ ]*=>[ ]*[{][ ]*[}]/)
					printf "%s:%d  .catch(() => {}) discards the error  (TP-01)\n", F, i
				if (l ~ /^[ \t]*except([ \t(].*)?:[ \t]*pass[ \t]*(#.*)?$/)
					printf "%s:%d  except ... pass  (TP-01)\n", F, i
				else if (l ~ /^[ \t]*except([ \t(].*)?:[ \t]*(#.*)?$/) {
					n = nextnb(i)
					if (n && line[n] ~ /^[ \t]*pass[ \t]*(#.*)?$/)
						printf "%s:%d  except ... pass  (TP-01)\n", F, i
				}
				if (l ~ /(^|[^A-Za-z0-9_])_[ \t]*=[ \t]*err[ \t]*$/)
					printf "%s:%d  Go error assigned to _  (TP-01)\n", F, i
				lc = tolower(l)
				if (l ~ /example[.](com|org|net)/ || l ~ /YOUR_[A-Z_]*(KEY|TOKEN|SECRET)/ || l ~ /REPLACE_ME/ || lc ~ /changeme/)
					printf "%s:%d  placeholder host or token  (TP-04)\n", F, i
				if (l ~ ("(^|[^A-Za-z0-9_])return[ \t]+" LIT "[ \t]*;?[ \t]*$")) {
					p = i - 1
					while (p >= 1 && line[p] ~ /^[ \t]*$/) p--
					n = nextnb(i)
					if (p >= 1 && line[p] ~ /^[ \t]*(async[ \t]+)?def[ \t].*:[ \t]*$/ && (n == 0 || indent(line[n]) <= indent(line[p])))
						printf "%s:%d  function body is only a constant return  (TP-06)\n", F, i
					else if (p >= 1 && n && line[n] ~ /^[ \t]*[}][ \t]*;?[ \t]*$/ && line[p] !~ KEYW && (line[p] ~ FN || line[p] ~ METHOD) && line[p] ~ /[{][ \t]*$/)
						printf "%s:%d  function body is only a constant return  (TP-06)\n", F, i
				}
				if (l ~ ("[{][ \t]*return[ \t]+" LIT "[ \t]*;?[ \t]*[}]") && l !~ KEYW && l ~ /[)][ \t]*(:[^{]*)?[{]/ && l !~ /(^|[^A-Za-z0-9_])(if|for|while|else)[ \t(]/)
					printf "%s:%d  function body is only a constant return  (TP-06)\n", F, i
				if (l ~ /(^|[^A-Za-z])(TODO|FIXME)([^A-Za-z]|$)/ || lc ~ /not implemented/ || l ~ /NotImplementedError/)
					printf "%s:%d  TODO, FIXME or not-implemented marker  (TP-07)\n", F, i
				if ((l ~ /^[ \t]*(import|from)[ \t]/ || l ~ /require[ \t]*[(]/) && lc ~ /mock|fake/)
					printf "%s:%d  imports a mock or fake  (TP-09)\n", F, i
			}
		}' "$f"
	done
done
exit 0
