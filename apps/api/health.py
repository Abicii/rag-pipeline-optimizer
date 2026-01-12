from fastapi import FastAPI
from main import health_check

app = FastAPI()

@app.get("/")
def health():
    return health_check()
