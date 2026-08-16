from fastapi import FastAPI
from sqlalchemy import text

from .database import engine

app = FastAPI(title="Practice Session App", version="1.1.0")


@app.get("/")
def route_check() -> dict[str, str]:
    return {"status": "api is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/db")
def db_health_check() -> dict[str, str | int]:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "result": result.scalar_one(),
        }
