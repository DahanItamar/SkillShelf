# Build-mode case: orders panel

Build mode has no source file to review, so this case is a prompt and an expected behaviour. Give the prompt to a model with edgecase installed and an empty React project, then compare with `orders-expected.md`.

Prompt:

```text
Add an Orders panel to the account page. It lists the signed-in user's orders from GET /api/orders
(each has id, ref, total, status) and has a "Cancel" button per row that sends DELETE /api/orders/:id.
```
