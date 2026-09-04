import { useSearchParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Landing() {
  const [searchParams] = useSearchParams();
  const justLoggedOut = searchParams.get("logged_out") === "1";

  return (
    <div className="hero">
      <h1>✈️ IntegraTrip</h1>

      {justLoggedOut ? (
        <p className="tagline">
          ¡Hasta pronto! Cuando quieras volver a planear tu viaje, aquí estaremos.
        </p>
      ) : (
        <p className="tagline">
          Centraliza vuelos, hoteles y clima para planificar tu próximo viaje.
        </p>
      )}

      <a className="btn" href={`${API_BASE_URL}/auth/login`}>
        Iniciar sesion
      </a>
    </div>
  );
}

export default Landing;
