from pydantic import BaseModel, Field

class ScoreResponse(BaseModel):
    transaction_id: str
    prediction: str
    risk_score: float = Field(..., ge=0.0, le=1.0)
    threshold: float = Field(..., ge=0.0, le=1.0)
    reasons: list[str]
    logged_for_review: bool