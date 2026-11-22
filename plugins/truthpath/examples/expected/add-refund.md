Scope: diff examples/changes/add-refund.diff (2 production files changed: src/payments.py read in full; src/notify.py seen only as the diff hunk, which holds the whole function; 0 skipped as test code)

Confirmed:

### src/payments.py:24  TP-02 Catch reports success
- Blast radius: money
- What happens: refund() posts to the payments service, and when the call or its status check fails, the except branch returns True, the same value as the success path at :22.
- User is misled: A customer or support agent is told the refund went through when it may not have, and nothing records the failure.
- Certainty: confirmed (read src/payments.py:18-24; the except at :23 returns True and nothing between the failure and that return reports it)
- Smallest fix: remove the except branch so the error reaches the caller, or return False there.
- Check it yourself: make the refund endpoint return 500 and call refund(); it returns True.

### src/payments.py:29  TP-08 (also TP-02) Retry hides final failure, reached through a new caller
- Blast radius: money
- Depends on: pre-existing TP-08 at src/payments.py:15
- What happens: place_order() is new. It treats charge()'s status "ok" as a paid order. charge() returns {"status": "ok", "id": None} after three failed attempts, so place_order() returns True for an order that was never charged.
- User is misled: A customer or the order system believes an unpaid order is paid.
- Certainty: confirmed (read src/payments.py:8-15 and :27-29; nothing between the discarded failure at :15 and the comparison at :29 reports it)
- Smallest fix: make charge() raise after the last attempt, or have place_order() also require res["id"] is not None.

Suspected:

### src/notify.py:2  TP-10 Ignored failure signal (deleted error handling)
- Blast radius: user-text
- What happens: The diff removes the status check and the raise on a non-200 response, and keeps only send(user, msg) before return True. If send() reports failure through its return value, the failure is now dropped and notify() still returns True.
- User is misled: A user who should have been notified is treated as notified.
- Certainty: suspected (not read: the body of send(); would settle: whether send() itself raises on a non-200 response)
- Smallest fix: restore the status check and the raise.

Not reported: none.

Truthpath: 2 confirmed, 1 suspected, 0 candidates not reported; 1 pre-existing candidate outside the diff, not reported. Read-only; nothing was run or changed.

To apply one fix, say 'apply fix for <file>:<line>'.
