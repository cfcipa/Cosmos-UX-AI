# Sinco Cosmos UX · AI

La experiencia de IA de Sinco y su sistema de diseño, como paquetes que cualquier producto instala. Un producto pone sus pantallas
y sus herramientas; estos paquetes ponen todo lo demás (tema, componentes, asistente, voz y tono). Son independientes: el asistente se instala solo,
con el tema de MUI que el producto ya tenga.

| Paquete | Qué trae |
|---|---|
| `@sinco/theme` | Tokens y tema MUI 9 (Cosmos) |
| `@sinco/ds` | Componentes (`ui`), marca y piezas de IA (`ia`), formato es-CO y calendario |
| `@sinco/assistant` | Asistente sobre assistant-ui y MUI: superficies, hilo, canvas y aprobación humana. Autónomo: toma el tema de MUI del producto y no necesita los otros paquetes |
| `@sinco/content` | Guías de voz, tono y estilo compiladas como instrucciones del asistente |

**Cómo instalar el asistente en un producto:** [`packages/assistant/README.md`](packages/assistant/README.md).

## Requisitos
Next 16 con Turbopack, React 19 y MUI 9. **Ningún modelo:** el repo no importa ninguno; cada producto elige el suyo y su proveedor en su ruta de chat. Los paquetes se publican como TypeScript fuente: el producto los compila con
`transpilePackages`. El compilador de assistant-ui (`"use generative"`) solo se probó con Turbopack.

## Estado
Validado en dos productos de dominios distintos (uno con el tema de Sinco y otro con el tema estándar de MUI, solo con `@sinco/assistant`); esos productos no viven aquí.
Sin probar: instalación desde un registro, otras versiones de Next o MUI, productos que no usen MUI y modo oscuro.

## Desarrollo
`npm install` en la raíz. `npm run lint` revisa los paquetes.
`npm run contenido` regenera `@sinco/content` desde `sinco-content-system`, que debe ser carpeta hermana de este repo; sin ella se
usa el texto ya generado.
