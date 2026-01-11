from fastapi import FastAPI

app = FastAPI(title="RAG Pipeline Optimizer")

@app.get("/")
def health():
    return {"status": "ok"}
