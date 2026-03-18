import time

from fastapi.testclient import TestClient

from app.main import app


def test_suspicious_transaction_is_logged_and_listed():
    payload = {
        "transaction_id": "txn_admin_1001",
        "customer_id": "cust_admin_1001",
        "merchant_id": "merch_admin_1001",
        "amount": 9000,
        "currency": "EUR",
        "country": "IT",
        "payment_method": "card",
        "device_type": "mobile",
        "timestamp": "2026-03-18T09:30:00",
        "is_international": True,
        "card_present": False,
        "hour_of_day": 2,
        "account_age_days": 10,
        "previous_failed_transactions_24h": 5,
    }

    with TestClient(app) as client:
        score_response = client.post("/api/v1/score", json=payload)
        assert score_response.status_code == 200
        assert score_response.json()["prediction"] == "suspicious"

        time.sleep(0.1)

        admin_response = client.get("/api/v1/admin/suspicious")
        assert admin_response.status_code == 200

        body = admin_response.json()
        assert "items" in body
        assert any(item["transaction_id"] == "txn_admin_1001" for item in body["items"])