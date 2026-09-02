# IntegraTrip — Frontend

Cliente MCP para IIC3103 - Taller de Integración (Tarea 1, semestre 2026-2). Esta es la interfaz que consume la API del backend (repo separado) para conectar a tres servidores MCP (Andes Air, StayWell, Cielo Sur) y ejecutar sus tools.

**Deadline: viernes 4 de septiembre, 18:00.**

## Regla de arquitectura no negociable

Este frontend **nunca** habla directo con Supabase, con el Authorization Server del curso, ni con ningún servidor MCP. Todo pasa por la API del backend (repo aparte). Este frontend no debe:

- Recibir, guardar, ni manejar tokens de acceso, refresh tokens, ni ningún secret
- Guardar nada sensible en `localStorage` o `sessionStorage`
- Incluir ningún `client_secret`, API key, o credencial en el código JS/TS

Si en algún momento parece que hace falta un token o secret en el frontend para algo, es señal de que esa lógica debería vivir en el backend en su lugar.

## Lo que el usuario debe poder hacer (casos de uso, del enunciado)

1. **Landing page + autenticación**: ver landing sin loguearse, poder iniciar sesión, poder cerrar sesión y que otro usuario inicie sesión después sin ver datos del anterior
2. **Gestión de MCPs conectados**: ver lista de MCPs ya conectados (Andes Air, StayWell, Cielo Sur), botón para conectar cada uno (dispara el flujo OAuth que maneja el backend — el frontend solo redirige)
3. **Listado de tools**: por cada MCP conectado, mostrar sus tools disponibles (`tools/list`) de forma clara y legible
4. **Ejecución de tools**: al seleccionar una tool, generar un **formulario dinámico** a partir de su `inputSchema` (JSON Schema) para que el usuario ingrese los argumentos, y un botón para ejecutar (`tools/call`)
5. **Visualización de resultados**: mostrar la respuesta de forma clara y contenida — con padding/espaciado adecuado, scroll horizontal/vertical cuando haga falta, sin que contenido extenso o JSON rompa el layout o desborde la página
6. **Logout**: visible y funcional en todo momento tras loguearse

## Contrato de API con el backend

**Aún no definido en detalle** — coordinar con el repo de backend antes de construir las llamadas. Se espera algo en la línea de:

- Login / logout (probablemente vía redirect a un endpoint del backend, no una llamada AJAX directa)
- `GET` conexiones MCP del usuario actual
- Acción para conectar un MCP nuevo por nombre (ej. `andes_air`, `staywell`, `cielo_sur`) — dispara redirect al backend, que maneja el OAuth
- `GET` tools de un MCP conectado
- `POST` para ejecutar una tool con sus argumentos

Actualizar esta sección en cuanto el contrato quede definido con el backend.

## Notas de diseño visual

Los tres servidores MCP son fijos y conocidos (no hay que pedirle al usuario que escriba URLs de servidor a mano) — conectar es, en la práctica, un botón por servidor, mostrando qué protocolo usa cada uno (PRE / DCR / CMID) para que se note que la UI entiende la diferencia, aunque el usuario no tenga que interactuar con esos datos directamente.
