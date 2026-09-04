# t1-ti-frontend

IntegraTrip — Tarea 1 de Taller de Integración - Javiera Martínez. 

React + Vite (JavaScript). Consume la API de [`t1-ti-backend`](https://github.com/javiera9/t1-ti-backend); nunca habla directo con Supabase, el Authorization Server ni los servidores MCP.

## URL en producción

**App desplegada: https://t1-ti-frontend.onrender.com**

Ahí se puede iniciar sesión, conectar los 3 MCPs, listar sus tools y ejecutarlas.

## Regla de arquitectura no negociable

Este frontend no debe recibir, guardar ni manejar tokens de acceso, refresh tokens, `client_secret`s ni ninguna credencial. Nada sensible en `localStorage`/`sessionStorage`. Si algo parece requerir un secret aca, esa logica deberia vivir en el backend.

## Setup local

```bash
npm install
cp .env.example .env
```

`.env` solo necesita `VITE_API_BASE_URL` apuntando al backend (`http://localhost:8000` en dev). No es secreto, es solo la URL publica de la API.

## Correr localmente

```bash
npm run dev
```

Abre `http://localhost:5173`. Con el backend corriendo en `http://localhost:8000`, la landing deberia mostrar "Backend: conectado".

## Deploy

Static site (Render Static Site, Vercel, Netlify, etc.):
- Build command: `npm run build`
- Publish directory: `dist`
- Variable de entorno: `VITE_API_BASE_URL` apuntando a la URL de produccion del backend.
