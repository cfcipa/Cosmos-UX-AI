# @sinco/assistant

Asistente de IA sobre [assistant-ui](https://www.assistant-ui.com) y MUI. **Toma el tema de MUI de tu producto** (paleta, espaciado y
tipografía): no trae tema propio ni depende de ningún otro paquete de Sinco. No sabe de dominios ni de modelos: cada pantalla aporta su
contexto, sus sugerencias y sus herramientas con las APIs de assistant-ui, y cada producto pone **su propio modelo**.

## Qué trae
- Superficies (píldora, flotante, lateral, completa), hilo, canvas de documentos, vista previa, tarjeta de aprobación y sugerencias.
- API (`index.ts`): `Asistente`, `TarjetaAprobacion`, `estadoHerramienta`, `abrirCanvas`, `useSuperficie`.

## Instalarlo en un producto con MUI
1. **MUI.** Lo que ya tienes: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` y tu `ThemeProvider`.
2. **assistant-ui y el paquete:**
   ```bash
   npm install @sinco/assistant @assistant-ui/react @assistant-ui/ai-sdk @assistant-ui/next ai zod @ai-sdk/google
   ```
   Cambia `@ai-sdk/google` por el paquete del proveedor de tu modelo (`@ai-sdk/openai`, `@ai-sdk/anthropic`…). El resto
   (`@assistant-ui/react-markdown`, `react-markdown`, `remark-gfm`, `zustand`) llega solo como peer del paquete.
3. **`next.config.ts`:** `withAui(...)` de `@assistant-ui/next` y `transpilePackages: ["@sinco/assistant"]` (el paquete se publica
   como TypeScript fuente).
   ```ts
   import { withAui } from "@assistant-ui/next";
   export default withAui({ transpilePackages: ["@sinco/assistant"] });
   ```
4. **Montarlo** envolviendo el `<main>` (componente de cliente):
   ```tsx
   <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
     <Asistente toolkit={toolkit}>
       <Box component="main" sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>{children}</Box>
     </Asistente>
   </Box>
   ```
   Dos supuestos: el `<main>` es **hijo directo** de `<Asistente>` (el paquete le reserva espacio para la píldora), y el contenedor que
   rodea a `<Asistente>` tiene **altura definida y es flex en columna**.
5. **La ruta del chat,** `app/api/chat/route.ts`. El modelo lo elige el producto: `modelo` es cualquier modelo de AI SDK.
   ```ts
   import { AISDKToolkit } from "@assistant-ui/ai-sdk";
   import { convertToModelMessages, streamText, type JSONSchema7, type UIMessage } from "ai";
   import { modelo } from "@/lib/modelo"; // p. ej. google("…"), openai("…") o anthropic("…")
   import toolkit from "@/lib/assistant/toolkit";

   export const maxDuration = 30;
   const aiToolkit = new AISDKToolkit({ toolkit });

   export async function POST(req: Request) {
     const { messages, system, tools }: {
       messages: UIMessage[]; system?: string; tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
     } = await req.json();
     const result = streamText({
       model: modelo,
       messages: await convertToModelMessages(messages),
       system, // las instrucciones y el contexto de pantalla llegan del cliente; antepón aquí las guías de tu producto si las tienes
       tools: await aiToolkit.tools({ frontend: tools }),
     });
     return result.toUIMessageStreamResponse({ sendReasoning: true });
   }
   ```
6. **El toolkit del producto,** `lib/assistant/toolkit.tsx`. Incluye `abrir_canvas` (el modelo la usa cuando se pide un documento) y
   suma el toolkit de cada pantalla:
   ```tsx
   "use generative";
   import { defineToolkit } from "@assistant-ui/react";
   import { z } from "zod";
   import { abrirCanvas, estadoHerramienta } from "@sinco/assistant";
   import pantallaToolkit from "@/lib/assistant/pantallas/mi-pantalla.toolkit";

   export default defineToolkit({
     ...pantallaToolkit,
     abrir_canvas: {
       description: "Abre un documento en el canvas (informe, borrador, resumen extenso). Contenido en markdown. Para modificarlo, llámala de nuevo con el mismo título y el contenido completo.",
       parameters: z.object({ titulo: z.string(), contenido: z.string().describe("Markdown del documento completo") }),
       execute: async ({ titulo, contenido }) => {
         "use client";
         return abrirCanvas({ titulo, contenido });
       },
       render: estadoHerramienta("Redactando el documento…", "Documento listo"),
     },
   });
   ```

## Qué decide el producto
| Lo que cambia por producto | Dónde se define |
|---|---|
| El modelo y su proveedor | Su ruta `/api/chat`. El paquete no importa ningún modelo |
| Aspecto | Su tema de MUI. Ajustes puntuales: `theme.components.SincoAsistente.styleOverrides` (piezas `viewport`, `pie`, `mensajePersona`, `mensajeAsistente`, `estadoHerramienta`, `markdown`) |
| La marca que firma las respuestas | Propiedad `marca` de `<Asistente>` (por defecto, el destello de MUI) |
| Rol, idioma y tono base | Propiedad `instrucciones` de `<Asistente>` (por defecto: asistente de Sinco, en español, breve) |
| La ruta del chat | Propiedad `api` de `<Asistente>` (por defecto `/api/chat`) |
| Dónde se guardan los chats | Propiedad `hilos` de `<Asistente>`: un `RemoteThreadListAdapter` de assistant-ui con el historial según su [guía de persistencia propia](https://www.assistant-ui.com/docs/integrations/persistence/custom-adapter). Sin ella, los chats viven en memoria |
| Contexto, sugerencias y herramientas de cada pantalla | El producto, con `useAssistantContext`, `<Asistente sugerencias>` y `defineToolkit` |

## Sumar una pantalla
Todo con las APIs de assistant-ui; el paquete no pone una capa propia encima.

**Contexto** (`useAssistantContext`): un componente de cliente de la pantalla que llama a `useAssistantContext({ getContext })` y se
monta junto con ella (al salir de la pantalla, su contexto deja de existir). `getContext` devuelve el texto que ve el modelo, calculado
al enviar cada mensaje: di cuál es la pantalla, las reglas propias y el estado. **Incluye los conteos y totales ya calculados**, por
estado y por moneda o unidad: el modelo se equivoca al contar y sumar filas, y el paquete le ordena no hacerlo.

**Sugerencias** (`Suggestions()`): una lista estable por pantalla, en el formato de assistant-ui (una frase o `{ title, label, prompt }`),
que el producto pasa a `<Asistente sugerencias>` según la ruta. Sin lista, el chat vacío no muestra sugerencias.

**Herramientas** (`defineToolkit`): un archivo `"use generative"` por pantalla (por ejemplo `lib/assistant/pantallas/<pantalla>.toolkit.tsx`).
Lo que cambia datos usa `humanTool()` y arma una propuesta para `TarjetaAprobacion`: la IA propone, la persona decide. Usa las mismas
acciones y reglas que la interfaz. Se suma `...<pantalla>Toolkit` en el toolkit único del producto; assistant-ui registra un solo toolkit
en el proveedor y el modelo ve todas sus herramientas, así que en el contexto de cada pantalla di cuáles usar.

Ojo: un aviso en las instrucciones **no impide** que el modelo use una herramienta en otra pantalla (lo probamos). assistant-ui ofrece
`disabled: true` y `useAuiToolOverrides` (experimental), pero un override **reemplaza la definición completa** de la herramienta: para
ocultarla sirve, para habilitarla sin su `execute` la deja sin ejecución. Úsalo solo para ocultar.

Una pantalla sin contexto ni sugerencias funciona: el asistente conversa y redacta documentos.

## Qué asume el paquete
- **Protocolo de chat de AI SDK** (`ai` y `@assistant-ui/ai-sdk`): es la forma en que el hilo habla con el backend. No es un modelo:
  AI SDK acepta decenas de proveedores.
- **Next 16 con Turbopack, React 19 y MUI 9.** El compilador de `"use generative"` solo se probó con Turbopack.
- **Textos en español**, escritos dentro de cada componente, igual que en los componentes de assistant-ui (que tampoco traen sistema de textos ni propiedades para cambiarlos). Para otro idioma o tono, se edita el texto en el componente.
- **Tema de MUI estándar:** solo usa claves que todo tema de MUI tiene (`palette` primary, success, error, text, action, background y divider; `spacing`, `shadows`, `transitions`, `zIndex` y las variantes tipográficas `body1`, `caption` y `subtitle1`). Ningún token propio.
