# Run recipes

Load this in Phase 1, before running anything. It holds the safety checklist first, then the likely
commands per ecosystem.

## Run-safety checklist

This is risk reduction, not a sandbox. Run unfamiliar code in a container or VM.

| Question | Answer | Action |
| --- | --- | --- |
| Whose repository is it? | The user wrote it, their organisation owns it, or they said "yes, run it" for this repository in this session | Own: continue |
| | Any other clone, or one the user only asked you to look at | Ask for an explicit yes; the default is Static mode |
| Can anyone answer? | No (headless or non-interactive run) | Treat as unconfirmed; Static mode |
| Does it need a service? Check the manifest and CI | Network service, paid API, remote or shared database, migrations, deploy or seed scripts, or `.env` values that look like real credentials | Ask before; no confirmation means no execution |
| Which copy runs? | The original | Offer a throwaway copy (`git worktree` or `cp -r` to a temp directory) or a container first |
| Where does a server bind? | 0.0.0.0, or cannot be confirmed | Set it to 127.0.0.1 or ask; with no answer do not run it, mark `unverified`, do not retry |
| Which env file? | `.env.example` | Never read `.env` |
| Cleanup | Background processes, db files, coverage output, logs you created | Stop and delete them before Phase 6 |

**Allowed first commands** (an organisation lead can approve this card once): the project's test
command, and its dev server bound to 127.0.0.1. Nothing else without a further yes.

## Commands per ecosystem

These are the likely commands, not
facts: confirm each against the manifest's own `scripts` or the repo's CI file before running it,
and prefer what the project states over this table.

| Ecosystem | Manifest | Likely test command | Likely dev-server command | Keep it on localhost |
| --- | --- | --- | --- | --- |
| Node (npm, pnpm, yarn) | `package.json` | `npm test` | `npm run dev` or `npm start` | `--host 127.0.0.1`, `HOST=127.0.0.1` |
| Python (pip, uv, poetry) | `pyproject.toml`, `requirements.txt` | `pytest`, or `python -m unittest` | `flask run`, `uvicorn app:app`, `python manage.py runserver` | `--host 127.0.0.1` |
| Go | `go.mod` | `go test ./...` | `go run .` | the listen address in code or config |
| Rust | `Cargo.toml` | `cargo test` | `cargo run` | the bind address in code or config |
| Java, Maven | `pom.xml` | `mvn test` | `mvn spring-boot:run` | `server.address=127.0.0.1` |
| Java, Gradle | `build.gradle*` | `gradle test` | `gradle bootRun` | `server.address=127.0.0.1` |
| .NET | `*.csproj` | `dotnet test` | `dotnet run` | `--urls http://127.0.0.1:5000` |
| Ruby | `Gemfile` | `bundle exec rspec`, `rake test` | `rails server` | `-b 127.0.0.1` |
| PHP | `composer.json` | `vendor/bin/phpunit` | `php artisan serve`, `php -S 127.0.0.1:8000` | `--host=127.0.0.1` |
| Docker Compose | `compose.yaml` | the service's own test target | `docker compose up` | publish ports as `127.0.0.1:8080:80` |

Port diff, only when a server was started: before the run and again after cleanup, and report any new port (use the one for the OS you are on):

| OS | Command |
| --- | --- |
| Linux | `ss -ltnp` |
| macOS | `lsof -iTCP -sTCP:LISTEN -nP` |
| Windows (PowerShell) | `Get-NetTCPConnection -State Listen` |

If no command works, say so and mark the port check `unverified`.

Notes:

- A Compose file starts databases and other services. That reaches the "ask before" list in the
  run-safety gate unless every service is local and disposable.
- If a flag is not listed or the project binds a port in its own config, read that config. If the
  bind address cannot be confirmed, set it to localhost or ask.
- If no row fits, run what the README, CI file or `Makefile` already names, under the same gate.
  No row (Deno, Bun, Elixir, Swift, C/C++)? Use the CI file or Makefile; if neither names a
  command, ask the user and mark the claim `unverified`.
- Monorepo: use the manifest's own workspace command (`pnpm -r test`, `npm test -w <pkg>`), scoped
  to the package being documented.
- If the dev server cannot be confirmed as localhost-only, or Compose publishes 0.0.0.0, skip and
  mark `unverified`; do not retry. A failed run is `unverified: <exit or reason>`, retried once.
