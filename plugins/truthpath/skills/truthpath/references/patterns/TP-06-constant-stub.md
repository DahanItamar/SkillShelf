# TP-06 Constant stub

## Shape

A function ignores its inputs and returns a constant: a tax of 0, a validator that is always true, an authorization check that always allows, a health check that reports "connected" without checking anything.

## Bad (TypeScript)

```ts
export interface Order { subtotalCents: number; region: string }

// TODO: look up real regional rates
export function taxFor(order: Order): number {
  return 0;
}

app.get("/health", (_req, res) => res.json({ db: "connected" }));
```

## Good (TypeScript)

```ts
export function taxFor(order: Order): number {
  throw new Error("tax rates not implemented");
}

app.get("/health", async (_req, res) => {
  try {
    await db.ping();
    res.json({ db: "connected" });
  } catch {
    res.status(503).json({ db: "down" });
  }
});
```

## Bad (Python)

```python
def is_authorized(user, action):
    return True


def check_database():
    return {"db": "connected"}
```

## Good (Python)

```python
def is_authorized(user, action):
    return action in permissions_for(user)


def check_database():
    db.execute("select 1")  # raises if the database is unreachable
    return {"db": "connected"}
```

## How a user is misled

Every answer is the same and looks normal. Every order is charged no tax and the totals look fine. Every request is allowed. A monitor shows a database as connected when it is not.

## Confirmed when

You read the whole function body and it never uses its inputs or anything that can vary, and you found a caller (up to two hops) that relies on the result as if it were computed, or the name or a nearby note says it should compute something (`taxFor`, `isAuthorized`, `check...`). Cite the function and the caller. A TODO beside it supports the finding but is not the proof; the code is.

## Not a finding when

- The constant is configuration by design and is named so (`FREE_TIER_FEE = 0`), not a function pretending to compute.
- The function is a base-class or interface default that subclasses override, and no caller relies on the base result.
- The function is documented as always returning that value because the product rule says so (for example "there is no tax in this product"), and the documentation matches the code.
- A fake used in one place for a missing dependency belongs to TP-09. The stub's line is cited inside that finding.

## Smallest fix

Throw "not implemented" until the real computation exists, or compute the real value. For a health check, perform the check and report failure.
