import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Calendar, MapPin } from "lucide-react";

export default function EventDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    already_subscribed: false,
    has_conflict: false,
    is_owner: false,
  });

  useEffect(() => {
    api.get(`/events/${uuid}`)
      .then((res) => setEvent(res.data))
      .catch(() => alert("Erro ao carregar evento."));

    api.get(`/events/${uuid}/subscription-status`)
      .then((res) => setSubscriptionStatus(res.data))
      .catch(() => console.error("Erro ao verificar status de inscrição"));
  }, [uuid]);

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        await api.delete(`/events/${uuid}`);
        alert("Evento excluído com sucesso");
        navigate("/");
      } catch (err) {
        alert("Erro ao excluir evento");
      }
    }
  };

  if (!event) return <p className="p-4">Carregando...</p>;

  const currentUserId = localStorage.getItem("user_id");
  const isOwner = event.owner_id?.toString() === currentUserId;

  return (
    <div className=" bg-gray-100 py-10">
      <div className=" min-h-screen bg-gray-100 py-10 px-10">
        <h2 className="text-3xl font-bold mb-7 flex items-center ">{event.name}</h2>

        {/* Data e hora */}
        <div className="flex items-start gap-3 mb-4">
          <Calendar className="mt-1 w-5 h-5" />
          <div>
            <p className="font-bold">
              {new Date(event.starts_at).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600">
              Início: {new Date(event.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · 
              Encerramento: {new Date(event.ends_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>

          </div>
        </div>

        {/* Localização */}
        <div className="flex items-start gap-3 mb-6">
          <MapPin className="mt-1 w-5 h-5" />
          <div>
            <p className="font-bold flex items-center gap-1">
              {event.address}
            </p>
            <p className="text-sm text-gray-600">
              {event.complement ? `${event.complement} - ` : ""} {event.number ? `${event.number}` : ""} {event.city? ` - ${event.city}` : ""}
              {event.state ? ` - ${event.state}` : ""} {event.zipcode ? ` - ${event.zipcode}` : ""}
            </p>
          </div>
        </div>

        {/* Informações do evento */}
        <div className="mb-6">
          <h2 className="text-lg font-bold flex items-center gap-1">Informações do evento</h2>
          <p className=" whitespace-pre-line text-sm text-black-800 flex items-center">{event.description}</p>
        </div>

        {/* Botões de ação */}
        {isOwner && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate(`/event/${uuid}/edit`)}
              className="ring-2 ... bg-black-800 text-black px-4 py-2 rounded text-blue-600"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="ring-2 ... bg-red-600 text-red px-4 py-2 rounded text-red-600"
            >
              Excluir
            </button>
          </div>
        )}

        {/* Inscrição */}
        {!subscriptionStatus.is_owner &&
          !subscriptionStatus.already_subscribed &&
          !subscriptionStatus.has_conflict && (
            <div className="mt-6">
              <button
                className="ring-2 ... bg-black text-black px-6 py-2 rounded-full"
                onClick={async () => {
                  try {
                    await api.post(`/events/${uuid}/subscribe`);
                    alert("Inscrição realizada com sucesso!");
                    setSubscriptionStatus((prev) => ({
                      ...prev,
                      already_subscribed: true,
                    }));
                  } catch (error: any) {
                    alert(
                      error.response?.data?.message || "Erro ao se inscrever."
                    );
                  }
                }}
              >
                Inscrever
              </button>
            </div>
          )}

        {subscriptionStatus.already_subscribed && (
          <p className="mt-6 text-green-600 font-semibold">
            Você já está inscrito neste evento.
          </p>
        )}

        {subscriptionStatus.has_conflict && (
          <p className="mt-6 text-red-600 font-semibold">
            Você já está inscrito em outro evento que ocorre nesse mesmo horário.
          </p>
        )}
      </div>
    </div>
  );
}
