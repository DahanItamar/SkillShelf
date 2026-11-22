# TP-05 Sample data in production

## Shape

Fixture-like data returned on a real path, or on failure: a person called Jane Doe, lorem ipsum text, a hardcoded demo array of products or invoices.

## Bad (JavaScript)

```js
const SAMPLE_USER = { name: "Jane Doe", email: "jane@example.com", plan: "Pro" };

export async function loadProfile(api) {
  try {
    return await api.get("/me");
  } catch {
    return SAMPLE_USER;
  }
}
```

## Good (JavaScript)

```js
export async function loadProfile(api) {
  return await api.get("/me"); // a failure throws; the page shows a sign-in or error state
}
```

## Bad (Python)

```python
def list_invoices(customer_id):
    # real query is not wired up yet
    return [
        {"id": 1, "customer": "Acme Corp", "total": 120.0},
        {"id": 2, "customer": "Acme Corp", "total": 89.5},
    ]
```

## Good (Python)

```python
def list_invoices(customer_id):
    return db.query("select * from invoices where customer_id = ?", customer_id)
```

## How a user is misled

A user sees invented data as their own, or someone else's. A signed-in user is shown "Jane Doe" on the Pro plan. A dashboard shows invoices that do not exist.

## Confirmed when

You read the sample data and the line where it is returned or rendered on a path a real user reaches (a route, a handler, the catch branch of a real call). Cite both.

## Not a finding when

- The data is loaded only by an explicit demo mode that the user can see ("Demo data").
- The data is a real product default (a default avatar, a default currency, a default template), not a stand-in for the user's data.
- Placeholder text is only an input hint or a design placeholder in a form field.
- The file is test code, a fixture, a story or a seed script that is never reached at runtime (these are also out of scope).

## Smallest fix

Remove the sample data from the production path. Rethrow on failure and show an error or sign-in state.
