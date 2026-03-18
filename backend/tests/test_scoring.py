from fastapi.testclient import TestClient

from app.main import app


def test_score_valid_transaction():
    payload = {
        "transaction_id": "txn_1001",
        "customer_id": "cust_1001",
        "merchant_id": "merch_1001",
        "amount": 7200.50,
        "currency": "eur",
        "country": "it",
        "payment_method": "card",
        "device_type": "mobile",
        "timestamp": "2026-03-18T09:30:00",
        "is_international": True,
        "card_present": False,
        "hour_of_day": 2,
        "account_age_days": 15,
        "previous_failed_transactions_24h": 4,
    }

    with TestClient(app) as client:
        response = client.post("/api/v1/score", json=payload)

    assert response.status_code == 200
    body = response.json()

    assert body["transaction_id"] == "txn_1001"
    assert body["prediction"] in ["normal", "suspicious"]
    assert 0 <= body["risk_score"] <= 1
    assert isinstance(body["reasons"], list)

def test_score_valid_transaction(client):
    payload = {
        "transaction_id": "txn_1001",
        "customer_id": "cust_1001",
        "merchant_id": "merch_1001",
        "amount": 7200.50,
        "currency": "eur",
        "country": "it",
        "payment_method": "card",
        "device_type": "mobile",
        "timestamp": "2026-03-18T09:30:00",
        "is_international": True,
        "card_present": False,
        "hour_of_day": 2,
        "account_age_days": 15,
        "previous_failed_transactions_24h": 4,
    }

    response = client.post("/api/v1/score", json=payload)

    assert response.status_code == 200
    body = response.json()

    assert body["transaction_id"] == "txn_1001"
    assert body["prediction"] in ["normal", "suspicious"]
    assert 0 <= body["risk_score"] <= 1
    assert isinstance(body["reasons"], list)