from fastapi import HTTPException

from app.ml.inference import build_model_input
from app.schemas.response import ScoreResponse
from app.schemas.transaction import TransactionRequest


def score_transaction(payload: TransactionRequest, model, feature_columns) -> ScoreResponse:
    if model is None or feature_columns is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")

    X = build_model_input(payload, feature_columns)
    risk_score = float(model.predict_proba(X)[0][1])

    threshold = 0.65
    prediction = "suspicious" if risk_score >= threshold else "normal"

    reasons: list[str] = []

    if payload.amount >= 5000:
        reasons.append("High transaction amount")
    if payload.is_international:
        reasons.append("International transaction")
    if not payload.card_present and payload.payment_method.value == "card":
        reasons.append("Card-not-present payment")
    if payload.previous_failed_transactions_24h >= 3:
        reasons.append("Multiple recent failed transactions")
    if payload.hour_of_day <= 5:
        reasons.append("Odd-hour transaction")

    if not reasons:
        reasons.append("Model detected low-risk transaction pattern")

    return ScoreResponse(
        transaction_id=payload.transaction_id,
        prediction=prediction,
        risk_score=round(risk_score, 4),
        threshold=threshold,
        reasons=reasons,
        logged_for_review=prediction == "suspicious",
    )