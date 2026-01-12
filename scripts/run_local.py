from core.ingestion.loader import load_text
from core.ingestion.chunker import chunk_text
from core.embeddings.embedder import Embedder
from core.retrieval.vector_store import VectorStore
from core.generation.answer import generate_answer

TEXT_PATH = "experiments/sample_data/sample.txt"

def run():
    text = load_text(TEXT_PATH)
    chunks = chunk_text(text)

    embedder = Embedder()
    chunk_embeddings = embedder.embed(chunks)

    store = VectorStore(chunk_embeddings)

    question = "What is this document about?"
    query_embedding = embedder.embed([question])[0]

    
    top_k = min(3, len(chunks))
    top_indices = store.search(query_embedding, top_k=top_k)
    top_indices = list(dict.fromkeys(top_indices))
    retrieved_chunks = [chunks[i] for i in top_indices]

    answer = generate_answer(retrieved_chunks, question)
    print(answer)

if __name__ == "__main__":
    run()



