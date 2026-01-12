from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Question(BaseModel):
    question: str

@app.post("/api/run")
async def run(question: Question):
    # your existing evaluation logic here
    return {"ranked_results": [...]}
