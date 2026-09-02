const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Landing() {
  return (
    <div className="hero">
      <h1>IntegraTrip</h1>
      <p>Centraliza vuelos, hoteles y clima para planificar tu proximo viaje.</p>
      {/* Link normal, no fetch: tiene que ser una navegacion completa del
          navegador porque el backend va a redirigir a la pagina de login del AS. */}
      <a className="btn" href={`${API_BASE_URL}/auth/login`}>
        Iniciar sesion
      </a>
    </div>
  );
}

export default Landing;
