from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    # your existing upload logic here
    return {"status": "ok"}