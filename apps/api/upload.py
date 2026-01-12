from fastapi import FastAPI, UploadFile, File
from apps.api.main import handle_upload

app = FastAPI()

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    return await handle_upload(file)
