import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { registerUser } from "../api/auth";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUserName] = useState("");
 

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser({ username, email, password });
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err) {
      alert("Erro ao registrar usuário.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log(res.data); // ← Verifica a resposta do servidor
      localStorage.setItem("token", res.data.access_token); // ← salva o token
      localStorage.setItem("user_id", res.data.user.id); // ← salva o ID do usuário
      localStorage.setItem("user_name", res.data.user.username); // ← salva o nome do usuário
      alert("Login realizado com sucesso!");
      navigate("/");
    } catch (err) {
      alert("Erro ao fazer login. Verifique seu email e senha.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Login */}
        <form onSubmit={handleLogin} className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Entre com sua conta</h2>
          <p className="text-gray-600 mb-4">Entre com sua conta para participar do evento</p>
          <input
            type="email"
            placeholder="Digite seu email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            className="border p-2 w-full mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="ring-2 ... bg-red-600 text-blue px-4 py-2 rounded text-blue-600">Acessar</button>
        </form>

        {/* Cadastro */}
        <form onSubmit={handleRegister} className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cadastre-se</h2>
          <p className="text-gray-600 mb-4">Cadastre-se para participar ou criar um evento.</p>
          <input
            type="text"
            placeholder="Digite seu Nome"
            className="border p-2 w-full mb-3 rounded"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Digite seu email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            className="border p-2 w-full mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="ring-2 ... bg-red-600 text-blue px-4 py-2 rounded text-blue-600">Criar Conta</button>
        </form>
      </div>
    </div>
  );
}
