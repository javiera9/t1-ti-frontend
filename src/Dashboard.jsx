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

  const loadServers = () => {
    apiFetch("/mcp/status")
      .then(setServers)
      .catch(() => setServers([]));
  };

  useEffect(() => {
    if (me?.authenticated) {
      loadServers();
    }
  }, [me]);

  const disconnect = async (name) => {
    await apiFetch(`/mcp/${name}/disconnect`, { method: "DELETE" });
    loadServers();
  };

  if (!me) return <p className="status">Cargando...</p>;

  if (!me.authenticated) {
    // Sin sesion (por ejemplo, volviendo atras despues de un logout) -- de
    // vuelta a la landing de verdad, no un fallback aparte.
    return <Navigate to="/" replace />;
  }

  return (
    <div className="hero hero-wide">
      <h1>🌴 Bienvenido a IntegraTrip</h1>
      <p className="tagline">Tu plataforma ideal para planear tus vacaciones.</p>
      <p className="status">Sesion activa: {me.email}</p>

      <h2>Mis MCPs</h2>
      <div className="mcp-list">
        {servers?.map((s) => (
          <div className="mcp-card" key={s.name}>
            <span className="mcp-icon">{s.icon}</span>
            <div className="mcp-info">
              <div>
                <strong>{s.label}</strong>
                <span className="badge">{s.protocol}</span>
              </div>
              <p className="status mcp-description">{s.description}</p>
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
              <div className="mcp-connected">
                <Link className="btn" to={`/mcp/${s.name}/tools`}>
                  Ver tools
                </Link>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => disconnect(s.name)}
                >
                  Desconectar
                </button>
              </div>
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
