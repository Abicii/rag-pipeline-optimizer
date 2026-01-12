# 🌱 RAG Pipeline Optimizer

A simple, experimental project to explore and evaluate **Retrieval-Augmented Generation (RAG)** pipelines in practice.

This repo focuses on **retrieval, chunking, embeddings, and evaluation** — not full LLM generation.

Deployed : https://rag-pipeline-optimizer-qpsa-k6n8wam3v.vercel.app/

---

## ✨ What This Project Does

- Upload a text document
- Ask a question
- Run a RAG pipeline on the document
- Inspect:
  - Retrieved chunks
  - Generated answer (retrieval-grounded)
  - Basic evaluation metrics

The deployed version runs **one optimized pipeline** for stability on free infrastructure,  
but the codebase is structured to support **multiple pipelines locally**.

---
Snapshots

<img src="Screenshot 2026-01-12 150249.png" width="500" />
<img src="Screenshot 2026-01-12 150519.png" width="500" />
<img src="Screenshot 2026-01-12 150552.png" width="500" />
<img src="Screenshot 2026-01-12 150624.png" width="500" />
<img src="Screenshot 2026-01-12 150610.png" width="500" />

## 🧠 Important Note

> This is a **retrieval-only system**.  
> It does not use a full LLM or external APIs.  
> All answers are grounded in retrieved document context.

---


---

## 🚀 Run Locally

### 1️⃣ Clone the repo

```bash
git clone https://github.com/<your-username>/rag-pipeline-optimizer.git
cd rag-pipeline-optimizer

2️⃣ Backend (FastAPI)
cd apps/api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

3️⃣ Frontend (React)
cd apps/frontend
npm install


Create .env:

VITE_API_BASE=http://127.0.0.1:8000


Start the app:

npm run dev

🧪 How to Use

Upload a .txt file

Enter a question related to the document

Run the pipeline

View:

Retrieved chunks

Answer

Evaluation metrics

⚠️ Deployment Notes

The backend is resource-constrained in the deployed demo

Large documents are intentionally limited

Multi-pipeline evaluation is recommended locally

These trade-offs are intentional and documented.

📄 License

MIT — feel free to learn from it, fork it, and build on it 🌱

Made with curiosity, patience, and a lot of debugging.

