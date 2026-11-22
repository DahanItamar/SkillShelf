Scope: directory examples/planted (10 production files read; 1 skipped as test code: test/orders.test.js)

Confirmed:

### src/payments.py:15  TP-08 Retry hides final failure (also TP-02)
- Blast radius: money
- What happens: After 3 failed attempts charge() leaves the loop and returns {"status": "ok", "id": None}. The last RequestException is discarded.
- User is misled: A caller that reads the status treats an unpaid order as paid.
- Certainty: confirmed (read src/payments.py:8-15; the except at :13 only sleeps, and :15 returns ok)
- Smallest fix: keep the last RequestException and raise it after the loop.
- Check it yourself: make requests.post raise in charge() three times; it returns {"status": "ok", "id": None}.

### src/tax.ts:5  TP-06 Constant stub
- Blast radius: money
- What happens: taxFor ignores the order and returns 0 for every order. The TODO at :3 says the real lookup is missing.
- User is misled: Every order is charged no tax, and the totals look normal.
- Certainty: confirmed (read src/tax.ts:1-6; the body never uses order)
- Smallest fix: throw new Error("tax rates not implemented") until real rates exist.
- Check it yourself: call taxFor with any order; it returns 0.

### src/export.py:11  TP-07 Not implemented behind success
- Blast radius: data-loss
- What happens: Any format other than csv falls through the TODO at :10 and returns {"status": "done", "data": ""}.
- User is misled: A user who asks for a PDF export is told it is done and receives an empty file.
- Certainty: confirmed (read src/export.py:5-11; the TODO branch returns a done status and nothing reports the missing format)
- Smallest fix: raise NotImplementedError or ValueError for unsupported formats.

### src/sync.js:2  TP-01 Swallowed error
- Blast radius: data-loss
- What happens: The cart save is not awaited and its failure is discarded by .catch(() => {}). syncCart still returns true at :3.
- User is misled: The shopper believes the cart was saved when the request may have failed, and nothing records it.
- Certainty: confirmed (read src/sync.js:1-4; nothing between the discarded failure at :2 and the return at :3 reports it)
- Smallest fix: await the post and let it throw, or return false in the catch.
- Check it yourself: make the /cart endpoint return 500 and call syncCart; it still returns true.

### src/orders.js:1  TP-04 Placeholder endpoint
- Blast radius: user-text
- What happens: Every orders request goes to https://api.example.com/v1, a reserved example domain that does not serve this API. Combined with the catch at :8, the failure is hidden.
- User is misled: Every user is shown "You have no orders yet." and believes the account has no orders.
- Certainty: confirmed (read src/orders.js:1, :5 and :8, caller src/ordersPage.js:5; no override of API_BASE exists in scope)
- Smallest fix: read API_BASE from configuration and fail at startup when it is missing.

### src/orders.js:8  TP-03 Default on failure
- Blast radius: user-text
- What happens: Any network or parse failure returns [] and nothing is logged. ordersPage.js:5 treats the empty list as "no orders".
- User is misled: A customer who has orders is told they have none.
- Certainty: confirmed (read src/orders.js:4-9, caller src/ordersPage.js:5)
- Smallest fix: rethrow, or return { error }, and render an error message in the caller.

### src/profile.js:7  TP-05 Sample data in production
- Blast radius: user-text
- What happens: When api.get("/me") fails, the catch returns SAMPLE_USER, which is Jane Doe on the Pro plan. The jane@example.com on :1 belongs to this finding and is not a separate TP-04.
- User is misled: A signed-in user is shown someone else's name and plan, and believes it is their own profile.
- Certainty: confirmed (read src/profile.js:1-9; the catch returns the sample object and nothing reports the failure)
- Smallest fix: rethrow and show a sign-in or error state.

### src/warehouse.py:10  TP-09 Fake as only dependency
- Blast radius: user-text
- What happens: When WAREHOUSE_URL is unset, get_client() silently returns FakeWarehouse, whose stock() returns 100 for every SKU (src/fakes.py:3).
- User is misled: Shoppers are shown items as in stock that may not exist.
- Certainty: confirmed (read src/warehouse.py:6-10 and src/fakes.py:1-3)
- Smallest fix: raise a configuration error when WAREHOUSE_URL is missing.

Suspected:

### src/orders.js:6  TP-10 Ignored failure signal
- Blast radius: user-text
- What happens: res.json() is read with no res.ok check. A non-2xx response with a JSON body is returned as if it were orders.
- User is misled: A server error body reaches the page as data, so the user sees a broken or empty order list instead of an error.
- Certainty: suspected (not read: the server's error body shape; would settle: the API's error response contract)
- Smallest fix: if (!res.ok) throw new Error(`orders ${res.status}`)

Not reported:
- src/cleanup.py:8, TP-01, narrow FileNotFoundError on delete: the absence is the desired end state.
- src/fakes.py:3, TP-06, folded into the finding at src/warehouse.py:10.
- src/payments.py:4, TP-04, payments.internal is a real internal hostname shape, not a reserved placeholder.

Truthpath: 8 confirmed, 1 suspected, 3 candidates not reported. Read-only; nothing was run or changed.

To apply one fix, say 'apply fix for <file>:<line>'.
