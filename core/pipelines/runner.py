import time

from core.ingestion.chunker import chunk_text
from core.embeddings.embedder import Embedder
from core.retrieval.vector_store import VectorStore
from core.generation.answer import generate_answer


def run_pipeline(text: str, question: str, config: dict):
    start_time = time.time()

    # 1. Chunking
    chunks = chunk_text(
        text,
        chunk_size=config["chunk_size"],
        overlap=config["overlap"],
    )

    # 2. Embeddings
    embedder = Embedder(config["embedding_model"])
    chunk_embeddings = embedder.embed(chunks)

    # 3. Vector store
    store = VectorStore(chunk_embeddings)

    # 4. Retrieval
    query_embedding = embedder.embed([question])[0]
    top_k = min(config["top_k"], len(chunks))
    indices = store.search(query_embedding, top_k)
    indices = list(dict.fromkeys(indices))
    retrieved_chunks = [chunks[i] for i in indices]

    # 5. Generation
    answer = generate_answer(retrieved_chunks, question)

    latency = time.time() - start_time

    return {
        "pipeline": config["name"],
        "chunk_size": config["chunk_size"],
        "embedding_model": config["embedding_model"],
        "latency": round(latency, 3),
        "retrieved_chunks": retrieved_chunks,
        "answer": answer,
    }
