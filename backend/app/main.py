from fastapi import FastAPI

app = FastAPI(title="Practice Session App", version="1.1.0")


@app.get("/")
def route_check():
    return {"status": "api is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
