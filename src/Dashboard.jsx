import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiFetch } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [me, setMe] = useState(null);
  const [servers, setServers] = useState(null);

  useEffect(() => {
    apiFetch("/auth/me")
      .then(setMe)
      .catch(() => setMe({ authenticated: false }));
  }, []);

  useEffect(() => {
    if (me?.authenticated) {
      apiFetch("/mcp/status")
        .then(setServers)
        .catch(() => setServers([]));
    }
  }, [me]);

  if (!me) return <p className="status">Cargando...</p>;

  if (!me.authenticated) {
    // Sin sesion (por ejemplo, volviendo atras despues de un logout) -- de
    // vuelta a la landing de verdad, no un fallback aparte.
    return <Navigate to="/" replace />;
  }

  return (
    <div className="hero">
      <h1>🌴 Bienvenido a IntegraTrip</h1>
      <p className="tagline">Tu plataforma ideal para planear tus vacaciones.</p>
      <p className="status">Sesion activa: {me.email}</p>

      <h2>Mis MCPs</h2>
      <div className="mcp-list">
        {servers?.map((s) => (
          <div className="mcp-card" key={s.name}>
            <div>
              <strong>{s.label}</strong>
              <span className="badge">{s.protocol}</span>
              <div className="status-line">
                <span
                  className={`status-dot ${
                    s.connected ? "status-dot-connected" : "status-dot-disconnected"
                  }`}
                />
                {s.connected ? "Conectado" : "Desconectado"}
              </div>
            </div>
            {s.connected ? (
              <Link className="btn" to={`/mcp/${s.name}/tools`}>
                Ver tools
              </Link>
            ) : (
              <a className="btn" href={`${API_BASE_URL}/connect/${s.name}`}>
                Conectar
              </a>
            )}
          </div>
        ))}
      </div>

      <a className="btn btn-secondary" href={`${API_BASE_URL}/auth/logout`}>
        Cerrar sesion
      </a>
    </div>
  );
}

export default Dashboard;
