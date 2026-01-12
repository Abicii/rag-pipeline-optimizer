def synthesize_answer(question: str, retrieved_chunks: list[str]) -> str:
    """
    Simple, deterministic answer synthesis.
    - Removes redundancy
    - Groups ideas
    - Keeps answer grounded in retrieved context
    """

    # Deduplicate chunks (order-preserving)
    seen = set()
    unique_chunks = []
    for chunk in retrieved_chunks:
        normalized = chunk.strip().lower()
        if normalized not in seen:
            seen.add(normalized)
            unique_chunks.append(chunk.strip())

    # Heuristic grouping: sentences instead of raw chunks
    sentences = []
    for chunk in unique_chunks:
        for s in chunk.split("."):
            s = s.strip()
            if len(s.split()) > 6:  # ignore tiny fragments
                sentences.append(s)

    # Remove near-duplicate sentences
    final_sentences = []
    seen_sentences = set()
    for s in sentences:
        key = s.lower()
        if key not in seen_sentences:
            seen_sentences.add(key)
            final_sentences.append(s)

    # Construct structured answer
    answer = f"**Answer:**\n\n"
    answer += f"{' '.join(final_sentences[:8])}."

    return answer
