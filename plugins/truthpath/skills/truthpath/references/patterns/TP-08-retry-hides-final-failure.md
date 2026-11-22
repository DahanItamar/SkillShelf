# TP-08 Retry hides final failure

## Shape

A retry loop that, after the last attempt, leaves the loop without raising. It returns null or a success-shaped value and the last error is discarded.

## Bad (JavaScript)

```js
async function withRetry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      await sleep(2 ** i * 100);
    }
  }
  return null; // three failures, no error
}
```

## Good (JavaScript)

```js
async function withRetry(fn, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await sleep(2 ** i * 100);
    }
  }
  throw lastErr;
}
```

## Bad (Python)

```python
def charge(order_id, amount_cents):
    for attempt in range(3):
        try:
            r = requests.post(PAYMENTS_URL, json={"order": order_id, "amount": amount_cents}, timeout=5)
            r.raise_for_status()
            return {"status": "ok", "id": r.json()["id"]}
        except requests.RequestException:
            time.sleep(2 ** attempt)
    return {"status": "ok", "id": None}
```

## Good (Python)

```python
def charge(order_id, amount_cents):
    last_error = None
    for attempt in range(3):
        try:
            r = requests.post(PAYMENTS_URL, json={"order": order_id, "amount": amount_cents}, timeout=5)
            r.raise_for_status()
            return {"status": "ok", "id": r.json()["id"]}
        except requests.RequestException as err:
            last_error = err
            time.sleep(2 ** attempt)
    raise last_error
```

## Bad (Go)

```go
func send(msg []byte) error {
	var err error
	for i := 0; i < 3; i++ {
		if err = post(msg); err == nil {
			return nil
		}
		time.Sleep(time.Duration(i+1) * time.Second)
	}
	return nil // the last err is dropped
}
```

## Good (Go)

```go
func send(msg []byte) error {
	var err error
	for i := 0; i < 3; i++ {
		if err = post(msg); err == nil {
			return nil
		}
		time.Sleep(time.Duration(i+1) * time.Second)
	}
	return fmt.Errorf("send failed after 3 attempts: %w", err)
}
```

## How a user is misled

An action that failed every attempt is reported as done, or as an empty result. An unpaid order is treated as paid. The retries looked like care, which makes the missing error harder to notice.

## Confirmed when

You read the loop, the catch that swallows each failure, and the line after the loop that returns null or a success-shaped value. If the value is success-shaped (`{"status": "ok"}`), report as `TP-08 (also TP-02)`. If the value is null, read a caller to confirm it is not checked; otherwise grade it suspected.

## Not a finding when

- The loop ends by raising or returning the last error.
- It is a polling loop waiting for a condition, and running out of time is reported visibly ("Timed out waiting for the job").
- The null return is documented and every caller you read checks it and shows an error.
- The retry is best-effort telemetry whose failure cannot change what the user sees.

## Smallest fix

Keep the last error and raise or return it after the loop.
