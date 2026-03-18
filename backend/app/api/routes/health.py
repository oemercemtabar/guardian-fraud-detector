from fastapi import APIRouter, Request

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health_check(request: Request):
    model_metadata = getattr(
        request.app.state,
        "model_metadata",
        {"status": "unknown", "version": None},
    )

    return {
        "status": "ok",
        "service": "guardian-backend",
        "model_status": model_metadata["status"],
        "model_version": model_metadata["version"],
    }