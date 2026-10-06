"use client";

import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";
import type { SuggestionConfig, Toolkit } from "@assistant-ui/react";
import { useRef, useState, type ReactNode } from "react";
import { useSuperficie } from "./superficie";
import { AssistantProvider } from "./assistant-provider";
import { ProveedorMarca } from "./marca";
import { VistaCanvas } from "./documento-canvas";
import { PanelAsistente, SIN_MOVIMIENTO } from "./panel-asistente";
import { Pildora, RESERVA_PILDORA } from "./pildora";
import { Separador } from "./separador";

const aparece = keyframes`from { opacity: 0; } to { opacity: 1; }`;

/**
 * Ancho del asistente lateral, en unidades de spacing (8 px): 400 por defecto, como en Cosmos, y no un porcentaje: en
 * pantallas grandes el asistente no crece y la pantalla de trabajo se queda con el espacio. Se arrastra entre 320 y 640;
 * en áreas chicas nunca pasa de la mitad.
 */
const LATERAL = { inicial: 50, min: 40, max: 80 };
const MITAD = "50%";

/**
 * El asistente en todo el producto: un solo runtime y una superficie que la persona elige (píldora, flotante,
 * lateral, completa) o que el modelo pide con la herramienta `abrir_canvas`. La pantalla nunca se desmonta. El contenedor
 * es su propio nivel de apilamiento (`isolation`): el encabezado de la aplicación queda por encima de todo y su sombra cae igual sobre la pantalla y sobre el asistente.
 */
export function Asistente({ toolkit, children, sugerencias, api, instrucciones, marca }: {
  toolkit: Toolkit; children: ReactNode;
  /** Sugerencias del chat vacío para la pantalla actual (`Suggestions()` de assistant-ui). Pasa una lista estable por pantalla. */
  sugerencias?: readonly SuggestionConfig[];
  /** Ruta del backend del chat (por defecto `/api/chat`). */
  api?: string;
  /** Instrucciones base del asistente: idioma, tono y rol (por defecto, el asistente de Sinco en español). */
  instrucciones?: string;
  /** Marca que firma cada respuesta (por defecto, el destello de MUI). Por ejemplo, la insignia de IA de tu sistema de diseño. */
  marca?: ReactNode;
}) {
  const { superficie, canvas, setSuperficie } = useSuperficie();
  const [ancho, setAncho] = useState(LATERAL.inicial);
  const raiz = useRef<HTMLDivElement>(null);
  const lateral = !canvas && superficie === "lateral";
  return (
    <AssistantProvider toolkit={toolkit} sugerencias={sugerencias} api={api} instrucciones={instrucciones}>
      <ProveedorMarca marca={marca}>
      <Box ref={raiz} sx={{ position: "relative", isolation: "isolate", flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        <Box
          // Con el canvas encima la pantalla sigue montada y con su scroll, pero fuera del alcance del teclado y los lectores.
          inert={canvas}
          // Un clic en la pantalla repliega el flotante.
          onPointerDown={() => { if (superficie === "flotante") setSuperficie("cerrada"); }}
          sx={(t) => ({
            minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", flex: 1,
            // El espacio para la píldora va DENTRO del scroll y es fijo: el contenido llega al fondo sin cortes y abrir o cerrar no mueve nada.
            "& > main": { pb: t.spacing(RESERVA_PILDORA) },
          })}
        >
          {children}
        </Box>
        {lateral ? <Separador ancho={ancho} min={LATERAL.min} max={LATERAL.max} onCambio={setAncho} contenedor={raiz} /> : null}
        {canvas ? (
          <Box sx={(t) => ({ position: "absolute", inset: 0, zIndex: t.zIndex.speedDial + 1, display: "flex", bgcolor: "background.paper", animation: `${aparece} ${t.transitions.duration.shorter}ms ease-out both`, [SIN_MOVIMIENTO]: { animation: "none" } })}>
            <VistaCanvas />
          </Box>
        ) : null}
        {!canvas && superficie !== "cerrada" ? <PanelAsistente modo={superficie} ancho={ancho} maxAncho={MITAD} /> : null}
        {!canvas && superficie === "cerrada" ? <Pildora /> : null}
      </Box>
      </ProveedorMarca>
    </AssistantProvider>
  );
}
