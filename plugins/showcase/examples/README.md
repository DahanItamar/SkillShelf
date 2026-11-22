# wordfreq

Prints the most frequent words in a text file, one `count word` per line. One POSIX sh script,
zero dependencies, no build step.

> Hand-authored reference example of a README that follows the showcase skill's rules. It is not
> generated output. The numbers below were observed by running the commands in
> [`docs/EVIDENCE.md`](docs/EVIDENCE.md).

## Run it

From the `fixture` folder:

```sh
sh wordfreq.sh sample.txt
```

```text
5 the
3 cat
3 saw
```

Pass a second argument to change how many lines print (the default is 3). A missing file prints a
usage line to stderr and exits with status 2.

## Tests

```sh
sh test.sh
```

```text
ok - top word is the
ok - default is three lines
ok - case is ignored
ok - missing file exits 2
```

All 4 checks pass and 0 fail. Case is ignored, so `A a A` counts as 3 of `a`.

## Under the hood

The script is 11 lines: `tr` splits words and lowercases them, `sort | uniq -c` counts, and a
second `sort` orders by count then alphabetically, so ties are stable (`cat` before `saw`).

Verified on Git Bash, Windows 11, GNU bash 5.3, 2026-11-22. Not run on Linux or macOS.
