# Sinco Cosmos UX · AI

La experiencia de IA de Sinco y su sistema de diseño, como paquetes que cualquier producto instala. Un producto pone sus pantallas
y sus herramientas; estos paquetes ponen todo lo demás (tema, componentes, asistente, voz y tono).

| Paquete | Qué trae |
|---|---|
| `@sinco/theme` | Tokens y tema MUI 9 (Cosmos), con las piezas del hilo del asistente (`SincoAsistente`) |
| `@sinco/ds` | Componentes (`ui`), marca y piezas de IA (`ia`), formato es-CO y calendario |
| `@sinco/assistant` | Núcleo del asistente sobre assistant-ui: superficies, hilo, canvas, aprobación humana y contrato por pantalla |
| `@sinco/content` | Guías de voz, tono y estilo compiladas como instrucciones del asistente |

**Cómo instalar el asistente en un producto:** [`packages/assistant/README.md`](packages/assistant/README.md).

## Requisitos
Next 16 con Turbopack, React 19 y MUI 9. Los paquetes se publican como TypeScript fuente: el producto los compila con
`transpilePackages`. El compilador de assistant-ui (`"use generative"`) solo se probó con Turbopack.

## Estado
Validado en dos productos internos de dominios distintos (pagos e inventario) dentro de un monorepo; esos productos no viven aquí.
Sin probar: instalación desde un registro, otras versiones de Next o MUI, productos que no usen MUI y modo oscuro.

## Desarrollo
`npm install` en la raíz. `npm run lint` revisa los paquetes (un error conocido en `packages/assistant/src/vista-previa.tsx`).
`npm run contenido` regenera `@sinco/content` desde `sinco-content-system`, que debe ser carpeta hermana de este repo; sin ella se
usa el texto ya generado.
