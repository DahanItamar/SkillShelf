# Run recipes

Load this only in Phase 1, after Phase 0 has named the ecosystem. These are the likely commands, not
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
