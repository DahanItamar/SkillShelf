# Catalogue

Ten patterns, one shape each. All of them are the same story: a failure can happen, and what comes out looks like success, or comes out as nothing.

A match here is a candidate, never a finding. Every pattern file has a "Not a finding when" section, and you must apply it before reporting. Open a pattern file when a candidate matches its shape, or when you are unsure.

| ID | Name | Shape in one line | How a user is misled (one line) | File |
| --- | --- | --- | --- | --- |
| TP-01 | Swallowed error | An empty catch, `except: pass`, `.catch(() => {})` or a Go `_ = err` throws the error away and carries on. | The action failed, and nothing says so. | [TP-01-swallowed-error.md](patterns/TP-01-swallowed-error.md) |
| TP-02 | Catch reports success | The catch or except branch returns ok, true, 200 or `{status: "ok"}`. | The screen or API says it worked when it did not. | [TP-02-catch-reports-success.md](patterns/TP-02-catch-reports-success.md) |
| TP-03 | Default on failure | The catch returns `[]`, `{}`, 0, `""`, null or None, and callers show it as "no data". | A failure looks like an empty result, such as "you have no orders". | [TP-03-default-on-failure.md](patterns/TP-03-default-on-failure.md) |
| TP-04 | Placeholder endpoint | A reserved example host, a `YOUR_API_KEY` or `changeme` token, or localhost as the only production value with no override. | The feature points at nothing real and fails or returns nothing. | [TP-04-placeholder-endpoint.md](patterns/TP-04-placeholder-endpoint.md) |
| TP-05 | Sample data in production | Fixture-like data (Jane Doe, lorem ipsum, demo arrays) returned on a real path or on failure. | A user sees someone else's data, or invented data, as their own. | [TP-05-sample-data-in-production.md](patterns/TP-05-sample-data-in-production.md) |
| TP-06 | Constant stub | A function ignores its inputs and returns a constant: a tax of 0, validation that is always true, a health check that says "connected" without checking. | Every answer is the same, and it looks normal. | [TP-06-constant-stub.md](patterns/TP-06-constant-stub.md) |
| TP-07 | Not implemented behind success | A TODO, `pass` or NotImplementedError branch returns a success-shaped value, or the error is caught upstream and turned into success. | A feature that does nothing reports that it is done. | [TP-07-not-implemented-behind-success.md](patterns/TP-07-not-implemented-behind-success.md) |
| TP-08 | Retry hides final failure | A retry loop ends without raising and returns null or success after the last attempt, discarding the last error. | An action that failed three times is reported as done. | [TP-08-retry-hides-final-failure.md](patterns/TP-08-retry-hides-final-failure.md) |
| TP-09 | Fake as only dependency | A production path silently builds a Fake, Mock or in-memory client when configuration is missing, or an in-memory store stands in for persistence. | The app runs, answers, and is not connected to anything real. | [TP-09-fake-as-only-dependency.md](patterns/TP-09-fake-as-only-dependency.md) |
| TP-10 | Ignored failure signal | `fetch` with no status check, an unchecked subprocess return code, an ignored Go error, a boolean result never read. | A failed call is treated as a good one. | [TP-10-ignored-failure-signal.md](patterns/TP-10-ignored-failure-signal.md) |

## Choosing between two patterns

- A location that fits two patterns gets the more specific one, written `TP-NN (also TP-MM)`. A retry loop that ends by returning `{"status": "ok"}` is `TP-08 (also TP-02)`.
- A fake class used at one entry point is reported once, at the entry point (TP-09). The line inside the fake is cited in that finding and is not a second finding.
- Sample data returned by the catch branch is TP-05, not TP-03: the data is invented, not empty.
- A placeholder value inside sample data (an example e-mail in a sample user) belongs to the TP-05 finding, not to a separate TP-04.

## Language shapes

Extra shapes for TP-01, TP-02, TP-03 and TP-10. Same rule: a match is a candidate, apply "Not a finding when".

| Language | Shape | Pattern |
| --- | --- | --- |
| Python | `with contextlib.suppress(Exception):` around the real work | TP-01 |
| JavaScript, TypeScript | `Promise.allSettled(...)` whose results are never checked for `rejected` | TP-10 |
| Shell | `cmd || true`, or `set +e` with no later `$?` check | TP-01, TP-10 |
| Rust | `let _ = call();` on a `Result`; `.unwrap_or_default()` or `.ok()` that drops the error | TP-01, TP-03 |
| Java, Kotlin | `catch (Exception e) {}`; `e.printStackTrace()` as the only handling; `runCatching { ... }.getOrDefault(x)` | TP-01, TP-03 |
| C# | `catch { }`; a catch that returns `default` or an empty collection | TP-01, TP-03 |
| Swift | `try?` on a call whose failure matters | TP-01, TP-03 |

## Not covered

Security vulnerabilities, performance, UI loading and empty states, test quality and style are out of scope.
