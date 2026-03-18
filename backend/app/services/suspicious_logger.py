import json

from app.db.models import SuspiciousTransaction
from app.db.session import SessionLocal
from app.schemas.response import ScoreResponse
from app.schemas.transaction import TransactionRequest


def log_suspicious_transaction(
    payload: TransactionRequest,
    result: ScoreResponse,
) -> None:
    db = SessionLocal()
    try:
        row = SuspiciousTransaction(
            transaction_id=payload.transaction_id,
            customer_id=payload.customer_id,
            merchant_id=payload.merchant_id,
            amount=payload.amount,
            currency=payload.currency,
            country=payload.country,
            prediction=result.prediction,
            risk_score=result.risk_score,
            threshold=result.threshold,
            reasons=json.dumps(result.reasons),
            logged_for_review=result.logged_for_review,
        )
        db.add(row)
        db.commit()
    finally:
        db.close()