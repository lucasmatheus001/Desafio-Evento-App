// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // Simulação: pegar nome do usuário do localStorage (ou do backend futuramente)
  useEffect(() => {
    const user = localStorage.getItem("user_name");
    if (user) setUserName(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <nav className="border-b p-4 flex justify-between items-center bg-white">
      {/* Lado esquerdo: Logo */}
      <div className="text-2xl font-extrabold">
        <Link to="/" className="text-black">
          morena
        </Link>
      </div>

      {/* Lado direito: Navegação */}
      <div className="text-lg font-bold flex items-center gap-3  font-medium text-black">
        <Link to="/create-event" className="hover:underline">
          Criar Evento
        </Link>

        {token ? (
          <>
            <span className="text-lg text-gray-800 font-semibold"> | </span>
            <span className="text-lg text-gray-800 font-semibold">{userName}</span>
            <span className="text-lg text-gray-800 font-semibold"> | </span>
             <div className="text-lg font-bold">
              <Link to="/my-subscriptions"  className="hover:underline">Eventos Inscritos</Link>
            </div>
            <span className="text-lg text-gray-800 font-semibold"> | </span>
            
            <button
              onClick={handleLogout}
              className="hover:underline text-red-600"
            >
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
