"use client";

import { AssistantRuntimeProvider, AuiConfig, Suggestions, Tools, useAssistantInstructions, useRemoteThreadListRuntime, type AssistantRuntime, type RemoteThreadListAdapter, type SuggestionConfig, type Toolkit } from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/ai-sdk";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useMemo, type ReactNode } from "react";
import { TituloDelChat } from "./chats";

const RUTA_CHAT = "/api/chat";
const SIN_SUGERENCIAS: readonly SuggestionConfig[] = [];
const INSTRUCCIONES_BASE = "Eres el asistente de Sinco. Responde en español, breve.";

const DOCUMENTOS =
  "Usa abrir_canvas SOLO cuando la persona pida explícitamente un documento (informe, borrador, acta, carta) y con el contenido en markdown; en el chat responde una frase. Los resúmenes, listados y respuestas cortas van en el chat, sin canvas. Si piden un cambio a ese documento, vuelve a llamar abrir_canvas con el mismo título y el contenido completo actualizado.";

const CIFRAS =
  "Cantidades y totales: usa solo las cifras que traiga el contexto de la pantalla; no cuentes ni sumes filas por tu cuenta. Si no hay una cifra calculada, di que no la tienes. Nunca mezcles monedas ni unidades distintas en un mismo total.";

const HERRAMIENTAS =
  "Herramientas de pantalla (filtrar, seleccionar, proponer cambios): úsalas solo si el contexto de la pantalla actual las nombra. Si no hay contexto de pantalla, no las uses; solo puedes conversar y redactar documentos.";

/** Lo fijo: rol, tono y reglas del núcleo. Se registra una vez (`useAssistantInstructions` es para texto estático). */
function InstruccionesBase({ instrucciones }: { instrucciones: string }) {
  useAssistantInstructions([instrucciones, DOCUMENTOS, CIFRAS, HERRAMIENTAS].join("\n"));
  return null;
}

type Props = {
  toolkit: Toolkit; children: ReactNode;
  /** Sugerencias del chat vacío (`Suggestions()` de assistant-ui). Cambian con la pantalla: pasa una lista estable por pantalla. */
  sugerencias?: readonly SuggestionConfig[];
  /** Ruta del backend que atiende el chat. */
  api?: string;
  /** Instrucciones base del asistente (idioma, tono, rol). Cada producto puede cambiarlas. */
  instrucciones?: string;
  /** Dónde guarda el producto los chats (`RemoteThreadListAdapter` de assistant-ui). Sin él, los chats viven en memoria. */
  hilos?: RemoteThreadListAdapter;
};

const opcionesChat = (api: string) => ({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  transport: new AssistantChatTransport({ api }),
});

/** Los chats viven en memoria durante la sesión. */
function RuntimeEnMemoria({ api, children }: { api: string; children: (runtime: AssistantRuntime) => ReactNode }) {
  return children(useChatRuntime(opcionesChat(api)));
}

/** Los chats y sus mensajes los guarda el producto con su adaptador (guía de persistencia propia de assistant-ui). */
function RuntimeConAdaptador({ api, adapter, children }: { api: string; adapter: RemoteThreadListAdapter; children: (runtime: AssistantRuntime) => ReactNode }) {
  return children(useRemoteThreadListRuntime({ runtimeHook: () => useChatRuntime(opcionesChat(api)), adapter }));
}

/**
 * El runtime del asistente. No conoce ningún dominio: recibe el toolkit con todas las herramientas instaladas y las
 * sugerencias del chat vacío. El contexto de cada pantalla lo registra la pantalla misma con `useAssistantContext`.
 */
export function AssistantProvider({ toolkit, children, sugerencias = SIN_SUGERENCIAS, api = RUTA_CHAT, instrucciones = INSTRUCCIONES_BASE, hilos }: Props) {
  const config = useMemo(
    () => AuiConfig({ tools: Tools({ toolkit }), suggestions: Suggestions([...sugerencias]) }),
    [toolkit, sugerencias],
  );
  const montar = (runtime: AssistantRuntime) => (
    <AssistantRuntimeProvider runtime={runtime} config={config}>
      <InstruccionesBase instrucciones={instrucciones} />
      {hilos ? null : <TituloDelChat />}
      {children}
    </AssistantRuntimeProvider>
  );
  return hilos
    ? <RuntimeConAdaptador api={api} adapter={hilos}>{montar}</RuntimeConAdaptador>
    : <RuntimeEnMemoria api={api}>{montar}</RuntimeEnMemoria>;
}
