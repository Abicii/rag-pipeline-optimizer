from fastapi import FastAPI, UploadFile, File
from main import handle_upload

app = FastAPI()

@app.post("/")
async def upload(file: UploadFile = File(...)):
    return await handle_upload(file)
