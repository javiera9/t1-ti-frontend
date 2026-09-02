import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function App() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    apiFetch("/health")
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="hero">
      <h1>IntegraTrip</h1>
      <p>Centraliza vuelos, hoteles y clima para planificar tu proximo viaje.</p>
      <p className="status">
        Backend:{" "}
        {status === "loading" ? "verificando..." : status === "ok" ? "conectado" : "sin conexion"}
      </p>
    </div>
  );
}

export default App;
