import axios from "axios";
import { SimulationResult } from "../types";

// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  await axios.post(`${API_BASE}/upload`, formData);
}

export async function runEvaluation(question: string): Promise<SimulationResult[]> {
  const res = await axios.post(`${API_BASE}/run`, { question });
  return res.data.ranked_results;
}
