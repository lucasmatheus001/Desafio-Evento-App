// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Criar Conta</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <input
          className="border p-2"
          type="text"
          placeholder="Nome"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          className="border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-dark-600 text-dark p-2 rounded">
          Registrar
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Já tem uma conta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Faça login
          </a>
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="/terms" className="text-blue-500 hover:underline">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </form>
    </div>
  );
}
