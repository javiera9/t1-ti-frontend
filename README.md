# t1-ti-frontend

IntegraTrip — Tarea 1 de Taller de Integración - Javiera Martínez. 

React + Vite (JavaScript). Consume la API de [`t1-ti-backend`](https://github.com/javiera9/t1-ti-backend); nunca habla directo con Supabase, el Authorization Server ni los servidores MCP.

## Herramientas y referencias usadas

Se utilizó Claude Sonnet 5 para la construcción de código, estudio de contenidos y apoyo en general para la tarea. También, se contó con la documentación proporcionada por el equipo docente en el enunciado de la tarea, además de la documentación de Authlib y OAuth 2.0, además de material sobre los protocolos PRE, DCR, CMID y videos en YouTube para entender MCP y los flujos.

Links referencias:
- https://www.scalekit.com/blog/dynamic-client-registration-oauth2
- https://www.mcpjam.com/blog/mcp-oauth-guide
- https://auth0.com/docs/get-started/authentication-and-authorization-flow/which-oauth-2-0-flow-should-i-use
- https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow
- https://auth0.com/docs/secure/attack-protection/state-parameters
- https://blog.modelcontextprotocol.io/posts/client_registration/
- https://www.youtube.com/watch?v=ZDuRmhLSLOY&t=176s

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
