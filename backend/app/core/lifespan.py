from contextlib import asynccontextmanager
from pathlib import Path

import joblib
from fastapi import FastAPI

from app.db.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    artifacts_dir = Path(__file__).resolve().parents[1] / "ml" / "artifacts"
    model_path = artifacts_dir / "fraud_model.joblib"
    feature_columns_path = artifacts_dir / "feature_columns.joblib"

    if model_path.exists() and feature_columns_path.exists():
        app.state.model = joblib.load(model_path)
        app.state.feature_columns = joblib.load(feature_columns_path)
        app.state.model_metadata = {
            "status": "loaded",
            "version": "rf_v1",
        }
    else:
        app.state.model = None
        app.state.feature_columns = None
        app.state.model_metadata = {
            "status": "not_loaded",
            "version": None,
        }

    yield

    app.state.model = None
    app.state.feature_columns = None