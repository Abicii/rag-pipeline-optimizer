import { useState } from "react";
import { uploadFile, runPipelines } from "./api";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
  if (!file) {
    alert("Please select a .txt file first");
    return;
  }

  try {
    await uploadFile(file);
    alert("Document uploaded successfully");
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};

const handleRun = async () => {
  if (!question.trim()) {
    alert("Please enter a question");
    return;
  }

  try {
    setLoading(true);
    const res = await runPipelines(question);
    setResults(res.data.ranked_results);
  } catch (err) {
    console.error(err.response?.data || err);
    alert(
      err.response?.data?.detail ||
      "Failed to run pipelines. Did you upload a document?"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container">
      <h1>RAG Pipeline Optimizer</h1>

      <div className="card">
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload Document</button>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={handleRun}>Run Evaluation</button>
      </div>

      {loading && <p>Running pipelines...</p>}

      {results.map((r, idx) => (
        <div key={r.pipeline} className="result">
          <h2>
            #{idx + 1} — {r.pipeline}
          </h2>

          <p><b>Chunk Size:</b> {r.chunk_size}</p>
          <p><b>Embedding:</b> {r.embedding_model}</p>

          <p><b>Faithfulness:</b> {r.scores.faithfulness}</p>
          <p><b>Relevance:</b> {r.scores.relevance}</p>
          <p><b>Context Recall:</b> {r.scores.context_recall}</p>
          <p><b>Latency:</b> {r.scores.latency}s</p>
          <p><b>Cost:</b> {r.scores.cost}</p>

          <h4>Answer</h4>
          <pre>{r.answer}</pre>

          <h4>Retrieved Chunks</h4>
          {r.retrieved_chunks.map((c, i) => (
            <pre key={i}>{c}</pre>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
