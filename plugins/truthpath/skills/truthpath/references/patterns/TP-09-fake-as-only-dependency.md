# TP-09 Fake as only dependency

## Shape

A production path that silently builds a Fake, Mock or in-memory client when configuration is missing, or an in-memory store that stands in for persistence. The app runs and answers, and it is not connected to anything real.

## Bad (JavaScript)

```js
import { FakeMailer } from "./fakes/mailer.js";

export function getMailer() {
  if (process.env.SMTP_URL) return new SmtpMailer(process.env.SMTP_URL);
  return new FakeMailer(); // "sent" is logged, nothing is sent
}

const sessions = new Map(); // the only session store; lost on every restart
```

## Good (JavaScript)

```js
export function getMailer() {
  if (!process.env.SMTP_URL) throw new Error("SMTP_URL is not set");
  return new SmtpMailer(process.env.SMTP_URL);
}
```

## Bad (Python)

```python
import os

from .fakes import FakeWarehouse


def get_client():
    if os.environ.get("WAREHOUSE_URL"):
        from .real import WarehouseClient
        return WarehouseClient(os.environ["WAREHOUSE_URL"])
    return FakeWarehouse()
```

## Good (Python)

```python
def get_client():
    url = os.environ.get("WAREHOUSE_URL")
    if not url:
        raise RuntimeError("WAREHOUSE_URL is not set")
    from .real import WarehouseClient
    return WarehouseClient(url)
```

## How a user is misled

The app looks connected. Shoppers see items in stock because the fake says 100 for every SKU. Customers are told an e-mail was sent, and it was not. Data saved in memory is gone after a restart.

## Confirmed when

You read the line that builds the fake (or the in-memory store) on a path that real execution reaches when the configuration is missing, and the class or object it builds (to cite what it returns). The fake's own lines go inside this finding, not into a second one. If you cannot tell whether production sets the configuration, the finding is still confirmed as a silent fallback; say what you could not read in the text.

## Not a finding when

- The fake is chosen only by an explicit setting such as `DEMO_MODE=1` or `NODE_ENV=test`, and the app says so where users or operators see it.
- The in-memory object is a cache in front of a real store, and a miss goes to the store.
- A local-development default that logs an error-level warning at startup and refuses to start when `NODE_ENV` is production. Read the check.
- The file is test code or a test helper (out of scope).

## Smallest fix

Fail fast with a configuration error when the real dependency is not configured. Remove the fake from the production path.
