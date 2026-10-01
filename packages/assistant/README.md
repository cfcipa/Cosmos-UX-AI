# @sinco/assistant

Núcleo del asistente de IA de Sinco sobre assistant-ui. No sabe de dominios: cada pantalla de un producto le aporta un **contrato**
y sus **herramientas**.

Depende solo del sistema de diseño: el tema (`@sinco/theme`, con la pieza `components.SincoAsistente` que viste el hilo) y la
insignia de IA (`@sinco/ds`). Forma, color y tipografía del hilo viven en el tema, no en los componentes.

## Qué trae
- Superficies (píldora, flotante, lateral, completa), hilo, canvas, vista previa, tarjeta de aprobación y sugerencias de inicio.
- `nucleo.toolkit.tsx`: herramientas de cualquier pantalla (`abrir_canvas`).
- API (`index.ts`): `Asistente`, `ContratoPantalla`, `TarjetaAprobacion`, `estadoTexto`, `useSuperficie`.
  El toolkit del núcleo se importa aparte: `@sinco/assistant/nucleo.toolkit`.

## Instalarlo en un producto
1. Dependencias: `@sinco/assistant`, `@sinco/ds`, `@sinco/theme` y `@sinco/content`. En `next.config.ts`: `withAui(...)` y
   `transpilePackages` con los cuatro.
2. En `tsconfig.json`, el alias del toolkit del núcleo:
   `"@sinco/assistant/nucleo.toolkit": ["<ruta a packages/assistant/src/nucleo.toolkit.tsx>"]`.
   **Es obligatorio:** el compilador de `"use generative"` solo sigue imports relativos y alias de `tsconfig`; un paquete "pelado"
   lo trata como no generativo y el build falla (`each tool must be an inline object literal…`).
3. Montar `<Asistente pantallas={PANTALLAS} toolkit={toolkit}>` envolviendo el `<main>` del producto.
4. Una ruta `app/api/chat/route.ts` con el modelo y el toolkit del producto:

```ts
import { google } from "@ai-sdk/google";
import { AISDKToolkit } from "@assistant-ui/ai-sdk";
import { SINCO_CONTENT } from "@sinco/content";
import { convertToModelMessages, streamText, type JSONSchema7, type UIMessage } from "ai";
import toolkit from "@/lib/assistant/toolkit";

export const maxDuration = 30;
const aiToolkit = new AISDKToolkit({ toolkit });

export async function POST(req: Request) {
  const { messages, system, tools }: {
    messages: UIMessage[]; system?: string; tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
  } = await req.json();
  const result = streamText({
    model: google("gemini-3.5-flash-lite"),
    messages: await convertToModelMessages(messages),
    // Primero las guías de Sinco (voz, tono, estilo); después lo específico de la pantalla.
    system: [SINCO_CONTENT, system].filter(Boolean).join("\n\n"),
    tools: await aiToolkit.tools({ frontend: tools }),
  });
  return result.toUIMessageStreamResponse({ sendReasoning: true, onError: (e) => (e instanceof Error ? e.message : String(e)) });
}
```

## Sumar una pantalla
**Contrato** (`lib/assistant/pantallas/<pantalla>.tsx`): `id`, `nombre` (cómo la llama el modelo), `aplica(pathname)`, `contexto()`
(reglas y estado que ve el modelo, calculado al enviar cada mensaje), `inicios` (sugerencias del chat vacío) y `herramientas`
(nombres de sus herramientas).

**Herramientas** (`lib/assistant/pantallas/<pantalla>.toolkit.tsx`): un archivo `"use generative"` con `defineToolkit({...})`.
Lo que cambia datos usa `humanTool()` y arma una propuesta para `TarjetaAprobacion`: la IA propone, la persona decide. Usa las
mismas acciones y reglas que la interfaz.

**Registrar:** el contrato en `lib/assistant/pantallas/index.ts` y `...<pantalla>Toolkit` en `lib/assistant/toolkit.tsx`.

Una pantalla sin contrato funciona: el asistente conversa y redacta documentos, sin herramientas ni sugerencias propias.
