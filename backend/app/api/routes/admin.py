from fastapi import APIRouter
from sqlalchemy import desc, select

from app.db.models import SuspiciousTransaction
from app.db.session import SessionLocal
from app.schemas.response import SuspiciousTransactionItem, SuspiciousTransactionListResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/suspicious", response_model=SuspiciousTransactionListResponse)
def list_suspicious() -> SuspiciousTransactionListResponse:
    db = SessionLocal()
    try:
        rows = db.execute(
            select(SuspiciousTransaction).order_by(desc(SuspiciousTransaction.created_at))
        ).scalars().all()

        items = [
            SuspiciousTransactionItem(
                id=row.id,
                transaction_id=row.transaction_id,
                customer_id=row.customer_id,
                merchant_id=row.merchant_id,
                amount=row.amount,
                currency=row.currency,
                country=row.country,
                prediction=row.prediction,
                risk_score=row.risk_score,
                threshold=row.threshold,
                reasons=row.reasons,
                logged_for_review=row.logged_for_review,
                created_at=row.created_at,
            )
            for row in rows
        ]

        return SuspiciousTransactionListResponse(items=items)
    finally:
        db.close()