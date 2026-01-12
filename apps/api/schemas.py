from pydantic import BaseModel
from typing import List


class RunRequest(BaseModel):
    question: str


class RetrievedChunk(BaseModel):
    index: int
    text: str


class PipelineResult(BaseModel):
    pipeline: str
    chunk_size: int
    embedding_model: str
    latency: float
    retrieved_chunks: List[str]
    answer: str
    scores: dict


class RunResponse(BaseModel):
    ranked_results: List[PipelineResult]
