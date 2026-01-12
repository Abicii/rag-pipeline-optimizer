from fastapi import FastAPI
from apps.api.schemas import RunRequest
from apps.api.main import handle_run

app = FastAPI()

@app.post("/")
def run(request: RunRequest):
    return handle_run(request)
