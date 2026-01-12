from fastapi import FastAPI, UploadFile, File, HTTPException
from apps.api.state import DOCUMENT_STORE
from apps.api.schemas import RunRequest, RunResponse
from core.pipelines.config import PIPELINES
from core.pipelines.runner import run_pipeline
from core.evaluation.scorer import score_pipeline
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="RAG Pipeline Optimizer API")
# uncomment while runnning locally with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.25:3000",
        "http://localhost:3000"
    ],
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

    # Rank pipelines
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
