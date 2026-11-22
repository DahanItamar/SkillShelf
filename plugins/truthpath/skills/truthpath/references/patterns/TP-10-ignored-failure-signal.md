# TP-10 Ignored failure signal

## Shape

The code gets a failure signal and never reads it. `fetch` with no status check. A subprocess return code that is never looked at. A Go error assigned to `_` or dropped. A boolean result that is never read.

## Bad (JavaScript)

```js
export async function loadOrders(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/orders`);
  return await res.json(); // a 500 with a JSON body is returned as if it were orders
}
```

## Good (JavaScript)

```js
export async function loadOrders(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/orders`);
  if (!res.ok) throw new Error(`orders ${res.status}`);
  return await res.json();
}
```

## Bad (Python)

```python
import subprocess


def build_report(path):
    subprocess.run(["render", path])  # return code is never read
    return "report built"
```

## Good (Python)

```python
def build_report(path):
    subprocess.run(["render", path], check=True)  # a non-zero exit raises
    return "report built"
```

## Bad (Go)

```go
func total(items []string) int {
	n, _ := strconv.Atoi(items[0]) // a bad number silently becomes 0
	ok := validate(items)          // never read
	_ = ok
	return n
}
```

## Good (Go)

```go
func total(items []string) (int, error) {
	n, err := strconv.Atoi(items[0])
	if err != nil {
		return 0, fmt.Errorf("parse total: %w", err)
	}
	if !validate(items) {
		return 0, errors.New("items failed validation")
	}
	return n, nil
}
```

## How a user is misled

A failed call is treated as a good one. An error page body is shown as data, a failed build is reported as built, a malformed number becomes zero.

## Confirmed when

You read the call and every line that uses its result, and none checks the status, return code or error. For a call through a wrapper or client library, you read the wrapper and it does not check either. If the wrapper, or the server's error body, was not read, grade it suspected and name what would settle it.

## Not a finding when

- The status is checked inside a wrapper you read, such as an API client that throws on a non-2xx response.
- The return code is deliberately ignored for a probe whose outcome is read another way (a command whose output is parsed and validated).
- Best-effort cleanup, such as `defer f.Close()` on a file opened for reading.
- A `fetch` whose response is only used for its side effect in fire-and-forget telemetry that cannot change what the user sees.

## Smallest fix

Check the signal and throw, raise or return the error: `if (!res.ok) throw new Error(...)`, `check=True`, `if err != nil { return err }`.
