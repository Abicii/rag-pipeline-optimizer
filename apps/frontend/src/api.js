import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_BASE}/upload`, formData);
};

export const runPipelines = async (question) => {
  return axios.post(`${API_BASE}/run`, { question });
};
