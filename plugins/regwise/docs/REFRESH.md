# Refreshing the modules

Law moves; a module is a dated reading of it. Refresh by hand, outside the install path.

1. Run `sh scripts/verify.sh`. A warning line names any module whose `last_verified` is more than
   180 days old.
2. For each instrument in that module, open its official URL from `skills/regwise/references/citations.md`, and re-read
   the sections the module cites. Start with those marked volatile.
3. Update the module text and audit rows. Set `last_verified` to today only when you re-read
   primary text. A summary from a blog or tracker does not count.
4. Update the Accessed date in `skills/regwise/references/citations.md`. The US state table (module 2, section 2.6) has
   its own section there, with `not verified` rows to clear first.
5. Run verify again, then bump the plugin version.

A scheduled bot may later open a reminder issue, but it must stay outside the plugin and never run
at install.
