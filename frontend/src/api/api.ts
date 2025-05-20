import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // 👉 ESSA linha aqui é essencial para CORS com cookies/headers
});

// Interceptador para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Interceptador de requisição:", config);
  return config;
});

export default api;
