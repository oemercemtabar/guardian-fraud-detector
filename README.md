# Guardian Fraud Detector

A real-time fraud risk scoring system built with **FastAPI**, **scikit-learn**, **SQLite**, and a polished **Next.js** dashboard.

Guardian validates transaction payloads, scores them with a pre-trained ML model, logs suspicious events asynchronously, and exposes a clean analyst-style UI for review.

---

## Overview

Guardian is a full-stack ML application designed as a production-minded portfolio project.

It combines:

- a **FastAPI** backend for inference and API orchestration
- a **Random Forest fraud model** loaded once at startup via **FastAPI lifespan**
- **strict Pydantic validation** for transaction inputs
- **background logging** of suspicious transactions into a local SQLite database
- a **Next.js + Tailwind** frontend for real-time scoring and review workflows

The project is structured to reflect a realistic MLOps-friendly separation between:

- **training**
- **serving**
- **persistence**
- **UI**

---

## Features

### Backend
- FastAPI REST API
- Strict request validation with Pydantic v2
- Model loaded once at startup using lifespan events
- Real-time fraud scoring endpoint
- Background task logging for suspicious transactions
- SQLite persistence for flagged events
- Admin endpoint for reviewing suspicious transactions
- Pytest test suite

### Machine Learning
- Synthetic fraud dataset generation
- Feature engineering with categorical encoding
- Random Forest binary classification model
- Saved inference artifacts with `joblib`
- Consistent training/inference feature alignment

### Frontend
- Next.js App Router
- Tailwind CSS v4 UI
- Fraud analyst dashboard
- Transaction scoring form
- Risk result panel
- Suspicious activity table with search and sorting
- Analytics summary cards
- Refreshable operational status badges

---

## Tech Stack

### Backend
- Python
- FastAPI
- Pydantic v2
- SQLAlchemy 2.0
- SQLite
- Uvicorn

### Machine Learning
- scikit-learn
- pandas
- numpy
- joblib

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Tooling
- Docker
- Docker Compose
- Pytest
- GitHub

---

## Architecture

```text
Frontend (Next.js)
    |
    v
FastAPI API
    |
    |-- Pydantic validation
    |-- ML inference service
    |-- Background suspicious logger
    |
    +--> SQLite database
```

## Runtime flow
1.	A transaction is submitted from the frontend.
2.	FastAPI validates the payload with strict schema rules.
3.	The preloaded fraud model generates a probability score.
4.	The API returns:
	- prediction
	- risk score
	- threshold
	- human-readable reasons
5.	If the result is suspicious, a background task logs the event to SQLite.
6.	The dashboard refreshes and shows the latest suspicious activity.

--- 
## Project strcuture
```text
guardian-fraud-detector/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── admin.py
│   │   │   │   ├── health.py
│   │   │   │   └── scoring.py
│   │   │   ├── __init__.py
│   │   │   └── router.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── lifespan.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   ├── init_db.py
│   │   │   ├── models.py
│   │   │   └── session.py
│   │   ├── ml/
│   │   │   ├── artifacts/
│   │   │   └── inference.py
│   │   ├── schemas/
│   │   │   ├── response.py
│   │   │   └── transaction.py
│   │   ├── services/
│   │   │   ├── scoring_service.py
│   │   │   └── suspicious_logger.py
│   │   └── main.py
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── Dockerfile
│   └── .env.local.example
├── ml/
│   └── scripts/
│       └── train.py
├── docs/
├── docker-compose.yml
└── README.md
```

--- 
## API Endpoints
### Health

- GET /api/v1/health
    - Returns API and model status.

Example response:
```json
{
  "status": "ok",
  "service": "guardian-backend",
  "model_status": "loaded",
  "model_version": "rf_v1"
}
```

### Score Transaction

- POST /api/v1/score
    - Scores a transaction and returns fraud risk metadata.

Example request:
```json
{
  "transaction_id": "txn_1001",
  "customer_id": "cust_1001",
  "merchant_id": "merch_1001",
  "amount": 7200.5,
  "currency": "EUR",
  "country": "IT",
  "payment_method": "card",
  "device_type": "mobile",
  "timestamp": "2026-03-18T09:30:00Z",
  "is_international": true,
  "card_present": false,
  "hour_of_day": 2,
  "account_age_days": 15,
  "previous_failed_transactions_24h": 4
}
```
Example response:
```json
{
  "transaction_id": "txn_1001",
  "prediction": "suspicious",
  "risk_score": 0.8123,
  "threshold": 0.65,
  "reasons": [
    "High transaction amount",
    "International transaction",
    "Card-not-present payment",
    "Multiple recent failed transactions",
    "Odd-hour transaction"
  ],
  "logged_for_review": true
}
```

### List Suspicious Transactions

- GET /api/v1/admin/suspicious
     - Returns logged suspicious transactions from the database.

--- 
