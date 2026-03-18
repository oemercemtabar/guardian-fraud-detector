from datetime import datetime

from pydantic import BaseModel, Field


class ScoreResponse(BaseModel):
    transaction_id: str
    prediction: str
    risk_score: float = Field(..., ge=0.0, le=1.0)
    threshold: float = Field(..., ge=0.0, le=1.0)
    reasons: list[str]
    logged_for_review: bool


class SuspiciousTransactionItem(BaseModel):
    id: int
    transaction_id: str
    customer_id: str
    merchant_id: str
    amount: float
    currency: str
    country: str
    prediction: str
    risk_score: float
    threshold: float
    reasons: str
    logged_for_review: bool
    created_at: datetime


class SuspiciousTransactionListResponse(BaseModel):
    items: list[SuspiciousTransactionItem]