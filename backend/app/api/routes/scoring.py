from fastapi import APIRouter, BackgroundTasks

from app.schemas.response import ScoreResponse
from app.schemas.transaction import TransactionRequest
from app.services.scoring_service import score_transaction
from app.services.suspicious_logger import log_suspicious_transaction

router = APIRouter(prefix="/score", tags=["scoring"])


@router.post("", response_model=ScoreResponse)
def score(
    payload: TransactionRequest,
    background_tasks: BackgroundTasks,
) -> ScoreResponse:
    result = score_transaction(payload)

    if result.prediction == "suspicious":
        background_tasks.add_task(log_suspicious_transaction, payload, result)

    return result