# TP-07 Not implemented behind success

## Shape

A TODO, `pass` or `NotImplementedError` branch returns a success-shaped value. Or a `NotImplementedError` is raised and then caught upstream and turned into success. The feature does nothing and says it is done.

## Bad (JavaScript)

```js
export function exportReport(rows, fmt) {
  if (fmt === "csv") return { status: "done", data: toCsv(rows) };
  // TODO: pdf export
  return { status: "done", data: "" };
}
```

## Good (JavaScript)

```js
export function exportReport(rows, fmt) {
  if (fmt === "csv") return { status: "done", data: toCsv(rows) };
  throw new Error(`export format not supported: ${fmt}`);
}
```

## Bad (Python)

```python
def export_report(rows, fmt):
    if fmt == "csv":
        return {"status": "done", "data": to_csv(rows)}
    # TODO: pdf export
    return {"status": "done", "data": ""}


def sync_all():
    try:
        sync_inventory()  # raises NotImplementedError today
    except NotImplementedError:
        pass
    return {"status": "ok"}
```

## Good (Python)

```python
def export_report(rows, fmt):
    if fmt == "csv":
        return {"status": "done", "data": to_csv(rows)}
    raise ValueError(f"export format not supported: {fmt}")
```

## How a user is misled

A feature that does nothing reports that it is done. A user asks for a PDF and receives "done" with an empty file. A sync job reports ok and nothing was synced.

## Confirmed when

You read the branch that does nothing (the TODO, the `pass`, the empty return) and the success-shaped value it returns or falls through to. For the caught-upstream form, you read both the raise and the catch that turns it into success.

## Not a finding when

- The TODO is a note about an improvement and the branch really does the job.
- `NotImplementedError` is raised in an abstract base class and is never caught and turned into success.
- The branch raises, or returns a clear "unsupported" error that the caller shows.
- The feature is switched off and the state is visible to the user ("Coming soon" shown in the interface). Read where it is shown.

## Smallest fix

Raise `NotImplementedError` or a clear unsupported error for the missing branch, and remove the success-shaped return.
