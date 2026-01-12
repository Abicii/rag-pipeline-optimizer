from fastapi import UploadFile, File, HTTPException
from apps.api.state import DOCUMENT_STORE
from apps.api.schemas import RunRequest
from core.pipelines.config import PIPELINES
from core.pipelines.runner import run_pipeline
from core.evaluation.scorer import score_pipeline


def health_check():
    return {"status": "ok"}


async def handle_upload(file: UploadFile):
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files supported")

    content = await file.read()
    text = content.decode("utf-8")
    DOCUMENT_STORE["text"] = text

    return {
        "message": "File uploaded successfully",
        "length": len(text.split())
    }


def handle_run(request: RunRequest):
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
