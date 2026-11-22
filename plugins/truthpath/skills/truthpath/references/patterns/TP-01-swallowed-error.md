# TP-01 Swallowed error

## Shape

An error is caught, or returned, and then thrown away. The code carries on as if the call worked. Forms: an empty `catch {}`, Python `except: pass`, `.catch(() => {})` on a promise, and Go `_ = err` or `_ = someCall()`.

## Bad (JavaScript)

```js
async function saveDraft(doc) {
  try {
    await api.put(`/drafts/${doc.id}`, doc);
  } catch (e) {}
  showToast("Saved");
}

function syncCart(cart, api) {
  api.post("/cart", cart).catch(() => {});
  return true;
}
```

## Good (JavaScript)

```js
async function saveDraft(doc) {
  await api.put(`/drafts/${doc.id}`, doc); // a failure throws to the caller
  showToast("Saved");
}
```

## Bad (Python)

```python
def save_draft(doc):
    try:
        api.put(f"/drafts/{doc['id']}", doc)
    except Exception:
        pass
    return "saved"
```

## Good (Python)

```python
def save_draft(doc):
    api.put(f"/drafts/{doc['id']}", doc)  # a failure raises to the caller
    return "saved"
```

## Bad (Go)

```go
func saveConfig(path string, data []byte) {
	_ = os.WriteFile(path, data, 0o600)
	log.Println("config saved")
}
```

## Good (Go)

```go
func saveConfig(path string, data []byte) error {
	if err := os.WriteFile(path, data, 0o600); err != nil {
		return fmt.Errorf("save config: %w", err)
	}
	return nil
}
```

## How a user is misled

The action failed and nothing says so. The user, the caller or the operator believes it worked, and finds out later when the data is missing.

## Confirmed when

You read the line that discards the error and the code after it, and nothing between them reports the error, rethrows it, returns it or logs it at error level. The code after the catch behaves as if the call succeeded (a "Saved" message, `return true`, the next step running).

## Not a finding when

- The catch is narrow and the absence is the desired end state: `FileNotFoundError` when deleting a file, `ENOENT` on unlink, "already exists" when creating something that should exist.
- It is best-effort cleanup, such as closing a handle or removing a temporary file, and the result of the work does not depend on it.
- It is an optional import (`ImportError`) that falls back to a documented alternative and says so visibly.
- The error is logged at error level and then rethrown (log-and-reraise).
- Fire-and-forget telemetry whose failure cannot change what the user sees or stores.
- A comment saying "intentional" does not make a broad catch acceptable. Decide from what the code does.

## Smallest fix

Let the error propagate (remove the catch), or catch it and return or raise a typed error. For a promise, `await` it and let it throw. In Go, check `err` and return it.
