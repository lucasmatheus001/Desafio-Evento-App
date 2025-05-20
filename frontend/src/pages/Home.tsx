// src/pages/Home.tsx
import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Erro ao buscar eventos", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
        Eventos da morena.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {events.map((event: any) => (
          <Link to={`/event/${event.uuid_code}`} key={event.uuid} className="block">
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow">
              <p className="text-xs text-gray-500 mb-1">
                {new Date(event.starts_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
              </p>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {event.name}
              </h2>
              <p className="text-sm text-gray-700">
                {event.address + " - " + event.city || "Local não informado"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
