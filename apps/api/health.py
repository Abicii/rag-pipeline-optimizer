from fastapi import FastAPI
from apps.api.main import health_check

app = FastAPI()

@app.get("/")
def health():
    return health_check()
