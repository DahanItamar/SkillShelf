import time
import requests

PAYMENTS_URL = "https://payments.internal/charge"


def charge(order_id, amount_cents):
    for attempt in range(3):
        try:
            r = requests.post(PAYMENTS_URL, json={"order": order_id, "amount": amount_cents}, timeout=5)
            r.raise_for_status()
            return {"status": "ok", "id": r.json()["id"]}
        except requests.RequestException:
            time.sleep(2 ** attempt)
    return {"status": "ok", "id": None}
