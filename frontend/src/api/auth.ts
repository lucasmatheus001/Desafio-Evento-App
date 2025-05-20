import api from "./api"; // importa a instância do axios com withCredentials já ativado

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/login", data);

export const registerUser = (data: {
  username: string;
  email: string;
  password: string;
}) => api.post("/register", data);
