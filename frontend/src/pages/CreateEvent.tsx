// src/pages/CreateEvent.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/api";

export default function CreateEvent() {
  const navigate = useNavigate();

  // Estados do formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [starts_at, setStartsAt] = useState("");
  const [ends_at, setEndsAt] = useState("");
  const [max_subscription, setMaxSubscription] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [zipcode, setZipCode] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");

  const [endereco, setEndereco] = useState<{
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  } | null>(null);

  const buscarCep = async () => {
    if (!zipcode) {
      alert("Digite um CEP válido");
      return;
    }

    try {
      const res = await axios.get(`https://viacep.com.br/ws/${zipcode}/json/`);
      if (res.data.erro) {
        alert("CEP não encontrado");
        setEndereco(null);
      } else {
        setEndereco(res.data);
      }
    } catch (error) {
      alert("Erro ao buscar CEP");
      setEndereco(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/events", {
        name,
        description,
        zipcode,
        number,
        complement,
        starts_at,
        ends_at,
        max_subscription,
        is_active: isActive,
        endereco
      });
      alert("Evento criado com sucesso!");
      navigate("/");
    } catch (err) {
      alert("Erro ao criar evento.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-60">
      <div className="min-h-screen bg-gray-100 py-10">
        <h1 className="text-2xl font-bold text-center mb-2">Cadastrar Evento</h1>
        <p className="text-center text-sm text-gray-500 mb-8">Cadastre-se para participar ou criar um evento.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div>
            {/* Checkbox Ativo */}
            <div className="flex items-center gap-2 mb-4">
              <input
                id="ativo"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="ativo" className="text-sm">Ativo?</label>
            </div>

            {/* Nome do Evento */}
            <div>
              <label className="block text-sm mb-1">Nome do Evento</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="text"
                placeholder="Digite nome do evento"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Descrição */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Descrição do Evento</label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-white"
                placeholder="Sobre o evento"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Início */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Data/Hora Início do Evento</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="datetime-local"
                value={starts_at}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>

            {/* Fim */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Data/Hora Fim do Evento</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="datetime-local"
                value={ends_at}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>

            {/* Vagas */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Vagas para o Evento</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="number"
                placeholder="Limite máximo de pessoas"
                value={max_subscription}
                onChange={(e) => setMaxSubscription(e.target.value)}
              />
            </div>
          </div>

          {/* Coluna Direita */}
          <div>
            {/* CEP */}
            <div>
              <label className="block text-sm mb-1">CEP</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 border rounded px-3 py-2 bg-white"
                  type="text"
                  placeholder="00000-000"
                  value={zipcode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={buscarCep}
                  className=" ring-2 ... bg-black text-black px-4 rounded"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Endereço */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Endereço</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="text"
                value={endereco?.logradouro || ""}
                readOnly
              />
            </div>

            {/* Complemento */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Complemento</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="text"
                placeholder="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </div>

            {/* Número */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Número</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>

            {/* Bairro */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Bairro</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="text"
                value={endereco?.bairro || ""}
                readOnly
              />
            </div>

            {/* Cidade */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Cidade</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="text"
                value={endereco?.localidade || ""}
                readOnly
              />
            </div>

            {/* Estado */}
            <div className="mt-4">
              <label className="block text-sm mb-1">Estado</label>
              <input
                className="w-full border rounded px-3 py-2 bg-white"
                type="text"
                value={endereco?.uf || ""}
                readOnly
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
            <button className="ring-2 ... bg-black text-black px-10 py-3 rounded-full hover:bg-gray-800">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
