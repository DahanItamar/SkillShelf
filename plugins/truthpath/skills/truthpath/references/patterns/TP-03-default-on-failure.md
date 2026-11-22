# TP-03 Default on failure

## Shape

The catch returns an empty or neutral value: `[]`, `{}`, `0`, `""`, `null`, `None`. Callers cannot tell "no data" from "the lookup failed", and render the failure as an empty result.

## Bad (JavaScript)

```js
export async function fetchOrders(userId) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/orders`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

// caller
if (orders.length === 0) return "You have no orders yet.";
```

## Good (JavaScript)

```js
export async function fetchOrders(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/orders`);
  if (!res.ok) throw new Error(`orders ${res.status}`);
  return await res.json(); // callers show an error state when this throws
}
```

## Bad (Python)

```python
def load_settings(user_id):
    try:
        return db.query("select * from settings where user_id = ?", user_id)
    except Exception:
        return {}
```

## Good (Python)

```python
def load_settings(user_id):
    return db.query("select * from settings where user_id = ?", user_id)  # errors reach the caller
```

## How a user is misled

A failure looks like an empty answer. A customer with orders is told they have none. An operator sees zero rows and concludes there is nothing to process. Nothing is logged, or it is logged where nobody looks.

## Confirmed when

You read the catch that returns the default, and a caller (up to two hops) that treats the default as real data, such as an empty-state message, a total of zero or a stored empty record. Cite both lines. If you cannot read the caller, grade it suspected.

## Not a finding when

- The degrade is documented and visible to the user ("Showing cached prices from 10:42").
- The empty value is the real answer for one narrow, named error, by contract (a 404 on "get profile" means "no profile yet").
- The default is a configuration default for an optional key that is absent, not a default for a failed call.
- The caller reads a separate error flag and shows it. Read the caller to confirm.

## Smallest fix

Rethrow, or return a result that carries the error (`{ error }`), and make the caller render an error state instead of an empty state.
