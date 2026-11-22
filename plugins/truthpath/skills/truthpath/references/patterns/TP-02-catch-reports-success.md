# TP-02 Catch reports success

## Shape

The catch or except branch returns a success-shaped value: `true`, `ok`, HTTP 200, `{status: "ok"}`, `{success: true}`. The failure is converted into a success report.

## Bad (JavaScript)

```js
app.post("/orders/:id/ship", async (req, res) => {
  try {
    await shipping.createLabel(req.params.id);
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(200).json({ status: "ok" });
  }
});
```

## Good (JavaScript)

```js
app.post("/orders/:id/ship", async (req, res) => {
  try {
    await shipping.createLabel(req.params.id);
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(502).json({ status: "error", message: "Label was not created" });
  }
});
```

## Bad (Python)

```python
def refund(order_id, amount_cents):
    try:
        r = requests.post(REFUND_URL, json={"order": order_id, "amount": amount_cents}, timeout=5)
        r.raise_for_status()
        return True
    except Exception:
        return True
```

## Good (Python)

```python
def refund(order_id, amount_cents):
    r = requests.post(REFUND_URL, json={"order": order_id, "amount": amount_cents}, timeout=5)
    r.raise_for_status()  # a failed refund raises to the caller
    return True
```

## How a user is misled

The screen, the API client or the operator is told the action worked. A refund that never happened is shown as done. Logging the error does not help the caller who only reads the response.

## Confirmed when

You read the catch or except branch, and it returns a success-shaped value on the same path where the failure was caught. Cite the returning line. Reading the caller is not needed to confirm: the success-shaped value is already on the line.

## Not a finding when

- The operation is idempotent and the caught error means "already done" (deleting something that is already gone), and the catch is narrow to that one error.
- The catch falls back to another real source and returns that source's real result.
- The caught error is not a failure of the work being reported (for example a failure to write an optional audit line, with the work itself done and checked).
- The success-shaped value carries a visible warning that the caller or UI reads (`{status: "ok", warnings: [...]}` and the caller shows the warnings). Read the caller to confirm.

## Smallest fix

Return or raise the error: respond with an error status, return `false`, or remove the catch so the error reaches the caller.
