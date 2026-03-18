from contextlib import asynccontextmanager
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = None
    app.state.model_metadata = {
        "status": "not_loaded_yet",
        "version": None,
    }

    yield

    app.state.model = None