from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    app.state.model = None
    app.state.model_metadata = {
        "status": "not_loaded_yet",
        "version": None,
    }

    yield

    app.state.model = None