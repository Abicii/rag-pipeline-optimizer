from core.embeddings.embedder import Embedder
from core.evaluation.metrics import (
    faithfulness_score,
    relevance_score,
    context_recall,
    cost_proxy,
)


def score_pipeline(result: dict):
    embedder = Embedder("all-MiniLM-L6-v2")

    answer = result["answer"]
    retrieved_chunks = result["retrieved_chunks"]

    scores = {
        "pipeline": result["pipeline"],
        "faithfulness": round(
            faithfulness_score(embedder, answer, retrieved_chunks), 3
        ),
        "relevance": round(
            relevance_score(embedder, "What is this document about?", answer), 3
        ),
        "context_recall": round(
            context_recall(answer, retrieved_chunks), 3
        ),
        "latency": result["latency"],
        "cost": cost_proxy(answer, retrieved_chunks),
    }

    return scores
