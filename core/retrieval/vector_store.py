import faiss
import numpy as np

class VectorStore:
    def __init__(self, embeddings):
        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(embeddings)

    def search(self, query_embedding, top_k=3):
        distances, indices = self.index.search(
            np.array([query_embedding]), top_k
        )
        return indices[0]
