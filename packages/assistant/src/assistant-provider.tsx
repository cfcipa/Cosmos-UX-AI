"use client";

import { AssistantRuntimeProvider, AuiConfig, Tools, useAssistantContext, type Toolkit } from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/ai-sdk";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { contratoDe, type ContratoPantalla } from "./contrato";
import { ProveedorPantallaActual, usePantallaActual } from "./pantalla-actual";

const DOCUMENTOS =
  "Usa abrir_canvas SOLO cuando la persona pida explícitamente un documento (informe, borrador, acta, carta) y con el contenido en markdown; en el chat responde una frase. Los resúmenes, listados y respuestas cortas van en el chat, sin canvas. Si piden un cambio a ese documento, vuelve a llamar abrir_canvas con el mismo título y el contenido completo actualizado.";

/** Lo que la IA "ve": las reglas del núcleo y lo que aporta la pantalla actual, calculado al enviar cada mensaje. */
function ContextoDePantalla() {
  const { pathname, pantallas, contrato } = usePantallaActual();
  useAssistantContext({
    getContext: () => {
      const propias = contrato?.herramientas ?? [];
      const ajenas = pantallas.flatMap((c) => c.herramientas).filter((h) => !propias.includes(h));
      return [
        "Eres el asistente de Sinco. Responde en español, breve.",
        contrato
          ? `Pantalla actual: ${contrato.nombre}.`
          : `Pantalla actual: ${pathname}. Esta pantalla todavía no aporta herramientas propias; puedes conversar y redactar documentos.`,
        ajenas.length ? `Las herramientas ${ajenas.join(", ")} pertenecen a otras pantallas: no las uses aquí.` : "",
        DOCUMENTOS,
        contrato?.contexto() ?? "",
      ].filter(Boolean).join("\n");
    },
  });
  return null;
}

/**
 * El runtime del asistente y el contexto de pantalla. No conoce ningún dominio: recibe las pantallas registradas y el
 * toolkit con todas las herramientas instaladas.
 */
export function AssistantProvider({ pantallas, toolkit, children }: { pantallas: readonly ContratoPantalla[]; toolkit: Toolkit; children: ReactNode }) {
  const pathname = usePathname();
  const config = useMemo(() => AuiConfig({ tools: Tools({ toolkit }) }), [toolkit]);
  const actual = useMemo(() => ({ pathname, pantallas, contrato: contratoDe(pantallas, pathname) }), [pathname, pantallas]);
  const runtime = useChatRuntime({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new AssistantChatTransport({ api: "/api/chat" }),
  });
  return (
    <ProveedorPantallaActual value={actual}>
      <AssistantRuntimeProvider runtime={runtime} config={config}>
        <ContextoDePantalla />
        {children}
      </AssistantRuntimeProvider>
    </ProveedorPantallaActual>
  );
}
