# Public surface

Read in release mode, or for a compatibility claim (kind K). This is a checklist a model reads, not a
parser. It tells you where an API, a CLI or a config format shows up, so a change there is not missed.

## Where the public surface lives, by ecosystem

- **JS and TS:** `package.json` fields `main`, `module`, `exports`, `bin`, `types`, `engines`;
  `index.*` re-exports; `export` statements; `.d.ts` files.
- **Python:** `__all__`, re-exports in `__init__.py`, names without a leading underscore,
  `[project.scripts]`, `python_requires`.
- **Go:** capitalised identifiers outside `internal/`, the `go` directive.
- **Rust:** `pub` and `pub use` in the crate root, Cargo `[features]`, `rust-version`.
- **Other languages:** public or exported declarations outside paths named internal or private.

## Where it lives, by kind of surface

- **CLI flags:** the argument-parser definition (argparse, click, commander, yargs, clap, cobra,
  `parseArgs`), usage strings, defaults, exit codes.
- **Config keys:** schema files, defaults objects, environment variable reads.
- **Routes:** router definitions, decorators, OpenAPI files, status codes, response shapes, auth
  requirements.
- **Also:** file formats, database migrations, event names, plugin manifest keys.

## Classification

| Class | Changes that belong here |
|---|---|
| Breaking | remove or rename anything public; narrow a type; add a required parameter or key; change a default, a return value, a status code, an exit code or an error type; stricter validation; raise the minimum runtime; drop a platform |
| Feature | add an export, flag, key or route that is optional and additive; widen what is accepted |
| Neutral | anything under an internal marker, or unexported |

Fix, Dependency, Docs and Internal are classified from the diff itself: a change that makes documented
behavior work is a Fix; a visible dependency or engine change is a Dependency; comments, docs and tests
only are Docs or Internal.

A change with both an additive and a breaking part is Breaking, and the additive part is listed
separately as a Feature.

## Search tips

- Rename: grep the old name across the whole repo and the docs, not only the file that changed.
- Removal: check the name is gone from re-exports and from the manifest `exports` map.
- Default change: read both sides of the diff; a default can move to a constant in another file.
- Flag change: check the usage string and the README, not only the parser.
- Version floor: compare `engines`, `python_requires`, the `go` directive or `rust-version` between the
  tag and HEAD with `git show <tag>:<path>`.

## What this checklist cannot see

Dynamic registration, reflection, generated code, macros, and cross-package effects in a monorepo.
Anything in that area is `needs-maintainer`. Behavior changes that keep the same signature are also
outside what reading a diff can settle: report them as `needs-maintainer`, never as safe.
