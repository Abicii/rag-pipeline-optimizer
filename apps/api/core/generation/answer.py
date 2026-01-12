def generate_answer(context_chunks, question):
    context = "\n".join(context_chunks)
    return f"Question: {question}\n\nBased on the documents:\n{context}"


# from core.generation.synthesizer import synthesize_answer

# def generate_answer(context_chunks, question):
#     return synthesize_answer(question, context_chunks)