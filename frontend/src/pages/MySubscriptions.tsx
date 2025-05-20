import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

interface Event {
  uuid_code: string;
  name: string;
  description: string;
  created_at: string;
  address?: string;
  city?: string;
  starts_at?: string;
}

export default function MySubscriptions() {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  const loadSubscriptions = () => {
    api.get("/my-subscriptions")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error("Erro ao carregar eventos inscritos", err);
        alert("Erro ao carregar eventos.");
      });
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleUnsubscribe = async (uuid: string) => {
    if (!confirm("Tem certeza que deseja cancelar sua inscrição neste evento?")) return;

    try {
      await api.delete(`/event/${uuid}/unsubscribe`);
      alert("Inscrição cancelada com sucesso!");
      loadSubscriptions(); // Recarrega a lista de eventos
    } catch (error) {
      console.error("Erro ao cancelar inscrição", error);
      alert("Não foi possível cancelar a inscrição.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
        Meus Eventos Inscritos
      </h2>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">Você ainda não está inscrito em nenhum evento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {events.map((event) => (
            <div
              key={event.uuid_code}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <p className="text-xs text-gray-500 mb-1">
                {event.starts_at
                  ? new Date(event.starts_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Data não informada"}
              </p>

              <h2
                onClick={() => navigate(`/event/${event.uuid_code}`)}
                className="text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:underline"
              >
                {event.name}
              </h2>

              <p className="text-sm text-gray-700 mb-2">
                {event.address && event.city
                  ? `${event.address} - ${event.city}`
                  : "Local não informado"}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                {event.description}
              </p>

              <button
                onClick={() => handleUnsubscribe(event.uuid_code)}
                className="ring-2 ... mt-auto bg-black text-black px-3 py-2 rounded hover:bg-black-800 w-full"
              >
                Cancelar inscrição
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
