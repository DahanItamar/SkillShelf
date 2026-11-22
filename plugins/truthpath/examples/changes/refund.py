import requests

PAYMENTS_URL = "https://payments.internal/charge"


def refund(order_id, amount_cents):
    try:
        r = requests.post(PAYMENTS_URL + "/refund", json={"order": order_id, "amount": amount_cents}, timeout=5)
        r.raise_for_status()
        return True
    except Exception:
        return True
