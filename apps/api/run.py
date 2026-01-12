from fastapi import FastAPI
from schemas import RunRequest
from main import handle_run

app = FastAPI()

@app.post("/")
def run(request: RunRequest):
    return handle_run(request)
