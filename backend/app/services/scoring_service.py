from app.schemas.response import ScoreResponse
from app.schemas.transaction import TransactionRequest


def score_transaction(payload: TransactionRequest) -> ScoreResponse:
    reasons: list[str] = []
    risk_score = 0.08
    threshold = 0.65

    if payload.amount >= 5000:
        risk_score += 0.30
        reasons.append("High transaction amount")

    if payload.is_international:
        risk_score += 0.20
        reasons.append("International transaction")

    if not payload.card_present and payload.payment_method == "card":
        risk_score += 0.18
        reasons.append("Card-not-present payment")

    if payload.previous_failed_transactions_24h >= 3:
        risk_score += 0.24
        reasons.append("Multiple recent failed transactions")

    if payload.hour_of_day <= 5:
        risk_score += 0.10
        reasons.append("Odd-hour transaction")

    risk_score = min(risk_score, 0.99)
    prediction = "suspicious" if risk_score >= threshold else "normal"

    if not reasons:
        reasons.append("No major risk indicators detected")

    return ScoreResponse(
        transaction_id=payload.transaction_id,
        prediction=prediction,
        risk_score=round(risk_score, 2),
        threshold=threshold,
        reasons=reasons,
        logged_for_review=prediction == "suspicious",
    )