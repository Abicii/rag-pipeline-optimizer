import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def semantic_similarity(embeddings, text_a, text_b):
    emb_a = embeddings.embed([text_a])[0]
    emb_b = embeddings.embed([text_b])[0]
    score = cosine_similarity([emb_a], [emb_b])[0][0]
    return float(score)


def faithfulness_score(embeddings, answer, retrieved_chunks):
    context = " ".join(retrieved_chunks)
    return semantic_similarity(embeddings, answer, context)


def relevance_score(embeddings, question, answer):
    return semantic_similarity(embeddings, question, answer)


def context_recall(answer, retrieved_chunks):
    answer_tokens = set(answer.lower().split())
    context_tokens = set(" ".join(retrieved_chunks).lower().split())

    if not answer_tokens:
        return 0.0

    overlap = answer_tokens.intersection(context_tokens)
    return len(overlap) / len(answer_tokens)


def cost_proxy(answer, retrieved_chunks):
    # simple token approximation
    tokens = len(answer.split()) + sum(len(c.split()) for c in retrieved_chunks)
    return tokens
