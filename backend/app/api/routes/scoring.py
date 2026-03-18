from fastapi import APIRouter

from app.schemas.response import ScoreResponse
from app.schemas.transaction import TransactionRequest
from app.services.scoring_service import score_transaction

router = APIRouter(prefix="/score", tags=["scoring"])


@router.post("", response_model=ScoreResponse)
def score(payload: TransactionRequest) -> ScoreResponse:
    return score_transaction(payload)