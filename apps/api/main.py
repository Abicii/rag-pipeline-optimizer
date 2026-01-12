from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from state import DOCUMENT_STORE
from schemas import RunRequest, RunResponse
from core.pipelines.config import PIPELINES
from core.pipelines.runner import run_pipeline
from core.evaluation.scorer import score_pipeline

app = FastAPI(title="RAG Pipeline Optimizer API")

# Enable CORS for frontend (Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # safe for demo; lock down later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files supported")

    content = await file.read()
    text = content.decode("utf-8")
    DOCUMENT_STORE["text"] = text

    return {
        "message": "File uploaded successfully",
        "length": len(text.split())
    }


@app.post("/run", response_model=RunResponse)
def run_pipelines(request: RunRequest):
    if DOCUMENT_STORE["text"] is None:
        raise HTTPException(status_code=400, detail="No document uploaded")

    text = DOCUMENT_STORE["text"]
    question = request.question
    results = []

    for config in PIPELINES:
        output = run_pipeline(text, question, config)
        scores = score_pipeline(output)

        results.append({
            "pipeline": output["pipeline"],
            "chunk_size": output["chunk_size"],
            "embedding_model": output["embedding_model"],
            "latency": scores["latency"],
            "retrieved_chunks": output["retrieved_chunks"],
            "answer": output["answer"],
            "scores": scores,
        })

    ranked = sorted(
        results,
        key=lambda x: (
            x["scores"]["faithfulness"],
            x["scores"]["relevance"],
            -x["scores"]["cost"],
            -x["scores"]["latency"],
        ),
        reverse=True,
    )

    return {"ranked_results": ranked}
