# Golden: errors

1. `/hearsay --release v9.9.9 <path>/examples/inputs/notes-1.4.0.md` in a fixture repo. Expected: it stops, prints the newest 5 tags (here only `v1.3.0`) and makes no other claim. No ledger.
2. `/hearsay <path>/examples/inputs/notes-1.4.0.md` in a directory that is not a git repository. Expected: it states that change claims are unverified and that state claims were checked against the files only. In an empty directory every row is unverified, with none contradicted.
