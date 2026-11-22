# TP-04 Placeholder endpoint

## Shape

A production value that is a placeholder: a reserved example host (`example.com`, `example.org`, `example.net`, and the reserved names ending `.example`, `.test`, `.invalid`), a token such as `YOUR_API_KEY`, `changeme` or `REPLACE_ME`, or `localhost` or `127.0.0.1` as the only value with no override.

## Bad (JavaScript)

```js
const API_BASE = "https://api.example.com/v1";
const API_KEY = "YOUR_API_KEY";
const SEARCH_URL = "http://localhost:9200"; // no environment override anywhere
```

## Good (JavaScript)

```js
const API_BASE = process.env.API_BASE;
if (!API_BASE) throw new Error("API_BASE is not set");
```

## Bad (Python)

```python
PAYMENTS_URL = "https://payments.example.org/charge"
DB_PASSWORD = "changeme"
```

## Good (Python)

```python
PAYMENTS_URL = os.environ["PAYMENTS_URL"]  # KeyError at startup if it is missing
```

## How a user is misled

The feature points at nothing real. Requests go to a host that does not serve this API, or to the user's own machine, and the result is an error, a timeout or an empty response, often hidden by another pattern (see TP-03). The code looks finished because a URL is there.

## Confirmed when

You read the value, and you searched the in-scope code for an override (an environment variable, a configuration file, a parameter) and found none that replaces it in production. Cite the line. If the value may be replaced by configuration you cannot see, grade it suspected and name the file that would settle it.

## Not a finding when

- The text is in a comment, a docstring, documentation, an `.env.example` file or a README.
- The value is overridden by an environment variable or configuration that production sets, and you read that override.
- `localhost` is the real address of a sidecar or local service that runs next to the app by design.
- A real internal hostname such as `payments.internal` is not a reserved placeholder name. It may be correct.
- An example host used in a unit test or in sample data that belongs to another finding (an example e-mail in a sample user belongs to TP-05).

## Smallest fix

Read the value from configuration and fail fast at startup when it is missing. Remove the placeholder default.
