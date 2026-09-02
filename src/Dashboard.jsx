import { useEffect, useState } from "react";
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
    return (
      <div className="hero">
        <p>No hay sesion activa.</p>
        <a className="btn" href={`${API_BASE_URL}/auth/login`}>
          Iniciar sesion
        </a>
      </div>
    );
  }

  return (
    <div className="hero">
      <h1>Mis MCPs</h1>
      <p className="status">Sesion activa: {me.email}</p>

      <div className="mcp-list">
        {servers?.map((s) => (
          <div className="mcp-card" key={s.name}>
            <div>
              <strong>{s.label}</strong>
              <span className="badge">{s.protocol}</span>
            </div>
            {s.connected ? (
              <span className="status">Conectado</span>
            ) : (
              <a className="btn" href={`${API_BASE_URL}/connect/${s.name}`}>
                Conectar
              </a>
            )}
          </div>
        ))}
      </div>

      <a className="btn" href={`${API_BASE_URL}/auth/logout`}>
        Cerrar sesion
      </a>
    </div>
  );
}

export default Dashboard;
