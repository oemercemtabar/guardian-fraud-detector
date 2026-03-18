from fastapi import APIRouter, BackgroundTasks, Request

from app.schemas.response import ScoreResponse
from app.schemas.transaction import TransactionRequest
from app.services.scoring_service import score_transaction
from app.services.suspicious_logger import log_suspicious_transaction

router = APIRouter(prefix="/score", tags=["scoring"])


@router.post("", response_model=ScoreResponse)
def score(
    payload: TransactionRequest,
    request: Request,
    background_tasks: BackgroundTasks,
) -> ScoreResponse:
    result = score_transaction(
        payload=payload,
        model=request.app.state.model,
        feature_columns=request.app.state.feature_columns,
    )

    if result.prediction == "suspicious":
        background_tasks.add_task(log_suspicious_transaction, payload, result)

    return result