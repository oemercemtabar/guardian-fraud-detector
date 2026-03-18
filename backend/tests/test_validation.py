from app.schemas.transaction import TransactionRequest


def test_currency_and_country_are_uppercased():
    payload = {
        "transaction_id": "txn_2001",
        "customer_id": "cust_2001",
        "merchant_id": "merch_2001",
        "amount": 100.0,
        "currency": "eur",
        "country": "it",
        "payment_method": "card",
        "device_type": "mobile",
        "timestamp": "2026-03-18T09:30:00",
        "is_international": False,
        "card_present": True,
        "hour_of_day": 10,
        "account_age_days": 50,
        "previous_failed_transactions_24h": 0,
    }

    model = TransactionRequest(**payload)

    assert model.currency == "EUR"
    assert model.country == "IT"