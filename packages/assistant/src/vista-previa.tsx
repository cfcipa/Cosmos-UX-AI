"use client";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { keyframes } from "@mui/material/styles";
import { useAuiState, type AssistantState } from "@assistant-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMarca } from "./marca";
import { ALTO_PILDORA } from "./medidas-pildora";
import { useSuperficie } from "./superficie";

/** Una herramienta que espera a la persona: su nombre y sus argumentos, para que el producto redacte el aviso. */
export type LlamadaPendiente = { toolName: string; args: unknown };

/** Cuánto asoma la tarjeta antes de recogerse en la pestaña. */
const RECOGE_MS = 4000;
/** Salir de la tarjeta la recoge tras este respiro (para cruzar hacia la píldora sin que parpadee). */
const SALIDA_MS = 250;
const LINEAS = 2;
const ESPERA = "\u0000espera";
const APROBACION = "Necesito tu aprobación para continuar. Ábrelo para decidir.";
/** Medidas, en unidades de spacing: separación sobre la píldora, asa de 32 × 4 px y avatar de 24 px. */
const SEPARACION = 1;
const SOLAPE_PESTANA = 2;
const ASA_ANCHO = 4;
const ASA_ALTO = 0.5;
const AVATAR = 3;
/** Un arrastre de más de 12 px hacia arriba abre el asistente. */
const ARRASTRE_ABRE_PX = 12;
const SUAVE = "cubic-bezier(.32, .72, 0, 1)";
const SIN_MOVIMIENTO = "@media (prefers-reduced-motion: reduce)";
const entra = keyframes`from { opacity: 0; translate: 0 6px; } to { opacity: 1; translate: 0 0; }`;

type Asoma = "tarjeta" | "pestana" | null;

/** Clave de la última respuesta terminada (cambia con cada una); vacía mientras corre. Si espera una aprobación, lo marca. */
function claveRespuesta(s: AssistantState) {
  const m = s.thread.messages[s.thread.messages.length - 1];
  if (!m || m.role !== "assistant") return "";
  if (m.status?.type === "requires-action") return `${m.id}${ESPERA}`;
  if (m.status?.type === "running" || s.thread.isRunning) return "";
  const texto = m.content.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
  return texto ? `${m.id}\u0000${texto.length}` : "";
}

function textoRespuesta(s: AssistantState) {
  const m = s.thread.messages[s.thread.messages.length - 1];
  if (!m || m.role !== "assistant") return "";
  return m.content.map((p) => (p.type === "text" ? p.text : "")).join(" ").replace(/[*_`#>|]/g, "").replace(/\s+/g, " ").trim();
}

/** La llamada que espera a la persona, serializada (el selector devuelve un valor estable). */
function llamadaPendiente(s: AssistantState) {
  const m = s.thread.messages[s.thread.messages.length - 1];
  if (!m || m.status?.type !== "requires-action") return "";
  const llamada = m.content.find((p) => p.type === "tool-call" && p.result === undefined);
  return llamada && llamada.type === "tool-call" ? JSON.stringify({ toolName: llamada.toolName, args: llamada.args }) : "";
}

/**
 * Con el asistente cerrado, la respuesta que acaba de llegar asoma sobre la píldora: una tarjeta con dos líneas. A los 4 s se
 * recoge en una pestaña detrás de la píldora; al pasar el cursor vuelve a asomar y al salir se recoge. Tocar el texto, la
 * pestaña o arrastrar el asa hacia arriba abre el asistente; la X la recoge. Si espera una aprobación, lo dice y se queda.
 * Solo asoma lo que llega de una ejecución de esta sesión, no el historial que se carga.
 */
export function VistaPrevia({ textoAprobacion }: { textoAprobacion?: (llamada: LlamadaPendiente) => string }) {
  const superficie = useSuperficie((s) => s.superficie);
  const setSuperficie = useSuperficie((s) => s.setSuperficie);
  const marca = useMarca();
  const clave = useAuiState(claveRespuesta);
  const texto = useAuiState(textoRespuesta);
  const llamada = useAuiState(llamadaPendiente);
  const conMensajes = useAuiState((s) => s.thread.messages.length > 0);
  const corriendo = useAuiState((s) => s.thread.isRunning);
  const espera = clave.endsWith(ESPERA);
  const [asoma, setAsoma] = useState<Asoma>(null);
  const ultimaClave = useRef(clave);
  const superficiePrevia = useRef(superficie);
  const encima = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const agarre = useRef<number | null>(null);
  const hubo = useRef(false);
  useEffect(() => { if (corriendo) hubo.current = true; }, [corriendo]);

  const recogerLuego = useCallback((ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { if (!encima.current) setAsoma((a) => (a === "tarjeta" ? "pestana" : a)); }, ms);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Al cerrar el asistente: la pestaña (o la tarjeta, si hay una aprobación pendiente).
  useEffect(() => {
    const antes = superficiePrevia.current;
    superficiePrevia.current = superficie;
    if (superficie !== "cerrada" || antes === "cerrada") return;
    ultimaClave.current = clave;
    setAsoma(!conMensajes || corriendo ? null : espera ? "tarjeta" : "pestana");
  }, [superficie, clave, conMensajes, corriendo, espera]);

  // Una respuesta nueva con el asistente cerrado asoma y se recoge sola.
  useEffect(() => {
    if (superficie !== "cerrada") { ultimaClave.current = clave; return; }
    if (!clave || clave === ultimaClave.current) return;
    ultimaClave.current = clave;
    if (!hubo.current) return;
    hubo.current = false;
    setAsoma("tarjeta");
    if (!clave.endsWith(ESPERA)) recogerLuego(RECOGE_MS);
  }, [clave, superficie, recogerLuego]);

  if (superficie !== "cerrada" || !asoma || (!texto && !espera)) return null;
  const mostrado = espera ? (textoAprobacion && llamada ? textoAprobacion(JSON.parse(llamada) as LlamadaPendiente) : APROBACION) : texto;
  const abrir = () => setSuperficie("flotante");
  const pestana = asoma === "pestana";
  return (
    <Box sx={{ position: "absolute", left: 0, right: 0, bottom: "100%", zIndex: 1, pointerEvents: "none" }}>
      <Paper
        elevation={pestana ? 0 : 8}
        data-asoma={asoma}
        onMouseEnter={() => { encima.current = true; window.clearTimeout(timer.current); setAsoma("tarjeta"); }}
        onMouseLeave={() => { encima.current = false; recogerLuego(SALIDA_MS); }}
        onClick={() => { if (pestana) abrir(); }}
        sx={(t) => ({
          position: "absolute", left: 0, right: 0, bottom: t.spacing(SEPARACION), pointerEvents: "auto", boxSizing: "border-box", p: t.spacing(0.75, 0.75, 1.5, 1.5),
          border: 1, borderColor: "divider", overflow: "hidden", clipPath: `inset(0 0 0 0 round ${t.shape.borderRadius}px)`,
          transition: `transform 320ms ${SUAVE}, clip-path 320ms ${SUAVE}, box-shadow 320ms ease`,
          animation: `${entra} ${t.transitions.duration.enteringScreen}ms ${SUAVE} backwards`,
          '&[data-asoma="pestana"]': {
            // Solo asoma sobre el tramo recto de la píldora: se recorta su radio a cada lado y termina justo en su borde.
            transform: `translateY(calc(100% - ${SOLAPE_PESTANA}px))`, cursor: "pointer",
            clipPath: `inset(0 ${t.spacing(ALTO_PILDORA / 2)} calc(100% - ${t.spacing(SEPARACION)} - ${SOLAPE_PESTANA}px) ${t.spacing(ALTO_PILDORA / 2)} round ${t.shape.borderRadius}px ${t.shape.borderRadius}px 0 0)`,
            transition: `transform 260ms ${t.transitions.easing.sharp}, clip-path 260ms ${t.transitions.easing.sharp}, box-shadow 200ms ease`,
          },
          "& .cuerpo": { transition: "opacity 220ms ease-in 80ms" },
          '&[data-asoma="pestana"] .cuerpo': { opacity: 0, transition: "opacity 120ms linear" },
          [SIN_MOVIMIENTO]: { animation: "none", transition: "opacity 150ms", '&[data-asoma="pestana"]': { transition: "opacity 150ms" } },
        })}
      >
        <Box
          aria-hidden="true"
          onPointerDown={(e) => { agarre.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerUp={(e) => { if (agarre.current !== null && agarre.current - e.clientY > ARRASTRE_ABRE_PX) abrir(); agarre.current = null; }}
          sx={(t) => ({
            position: "absolute", top: t.spacing(0.5), left: "50%", width: t.spacing(ASA_ANCHO), height: t.spacing(ASA_ALTO), ml: `-${t.spacing(ASA_ANCHO / 2)}`,
            borderRadius: 1, bgcolor: "action.disabled", cursor: "grab", touchAction: "none",
            "&::after": { content: '""', position: "absolute", inset: t.spacing(-1, -2) },
          })}
        />
        <Box className="cuerpo" ref={(nodo: HTMLDivElement | null) => { if (nodo) nodo.inert = pestana; }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 0.5 }}>
            <Box component="span" aria-hidden="true" sx={(t) => ({ height: t.spacing(AVATAR), display: "inline-flex", alignItems: "center" })}>{marca}</Box>
            <Tooltip title="Ocultar la respuesta">
              <IconButton size="small" aria-label="Ocultar la respuesta" onClick={(e) => { e.stopPropagation(); window.clearTimeout(timer.current); encima.current = false; setAsoma("pestana"); }}><CloseIcon fontSize="small" /></IconButton>
            </Tooltip>
          </Box>
          <ButtonBase
            onClick={(e) => { e.stopPropagation(); abrir(); }}
            sx={(t) => ({
              ...t.typography.body1, display: "-webkit-box", WebkitLineClamp: LINEAS, WebkitBoxOrient: "vertical", overflow: "hidden", width: "100%", mt: 0.5, pr: 0.75,
              textAlign: "start", justifyContent: "flex-start", color: espera ? "primary.main" : "text.primary", borderRadius: 0.5,
              fontWeight: espera ? t.typography.fontWeightMedium : undefined, "&:hover": { color: "primary.main" },
            })}
          >
            {mostrado}
          </ButtonBase>
        </Box>
      </Paper>
    </Box>
  );
}
