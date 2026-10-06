"use client";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { useAuiState, type AssistantState } from "@assistant-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSuperficie } from "./superficie";

/** Cuánto asoma la respuesta antes de recogerse sola. */
const RECOGE_MS = 4000;
const LINEAS = 2;
const ESPERA = "\u0000espera";

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

/**
 * Con el asistente cerrado, la respuesta que acaba de llegar asoma sobre la píldora: dos líneas, se recoge sola a los
 * 4 s (no mientras el cursor está encima) y al tocar abre el asistente. Si espera una aprobación, lo dice y se queda.
 */
export function VistaPrevia() {
  const superficie = useSuperficie((s) => s.superficie);
  const setSuperficie = useSuperficie((s) => s.setSuperficie);
  const clave = useAuiState(claveRespuesta);
  const texto = useAuiState(textoRespuesta);
  const [visible, setVisible] = useState(false);
  const [claveVista, setClaveVista] = useState(clave);
  const encima = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const espera = clave.endsWith(ESPERA);

  // Estado derivado al renderizar (patrón de React para ajustar estado cuando cambian las props): una respuesta nueva con el
  // asistente cerrado se muestra; abrir el asistente la oculta. Los efectos quedan solo para el temporizador.
  if (clave !== claveVista) {
    setClaveVista(clave);
    if (clave && superficie === "cerrada") setVisible(true);
  }
  if (superficie !== "cerrada" && visible) setVisible(false);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (visible && !espera) timer.current = window.setTimeout(() => { if (!encima.current) setVisible(false); }, RECOGE_MS);
    return () => window.clearTimeout(timer.current);
  }, [visible, espera, clave]);

  if (superficie !== "cerrada" || !visible || (!texto && !espera)) return null;
  return (
    <Paper
      elevation={8}
      onMouseEnter={() => { encima.current = true; window.clearTimeout(timer.current); }}
      onMouseLeave={() => { encima.current = false; if (!espera) timer.current = window.setTimeout(() => setVisible(false), RECOGE_MS / 2); }}
      sx={(t) => ({ position: "absolute", left: 0, right: 0, bottom: `calc(100% + ${t.spacing(1)})`, p: t.spacing(0.75, 0.75, 1.5, 1.5), border: 1, borderColor: "divider" })}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <AutoAwesomeIcon fontSize="small" color="primary" />
        <Tooltip title="Ocultar la respuesta">
          <IconButton size="small" aria-label="Ocultar la respuesta" onClick={() => setVisible(false)}><CloseIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
      <ButtonBase
        onClick={() => setSuperficie("flotante")}
        sx={(t) => ({
          ...t.typography.body1, display: "-webkit-box", WebkitLineClamp: LINEAS, WebkitBoxOrient: "vertical", overflow: "hidden", width: "100%", mt: 0.5, pr: 0.75,
          textAlign: "start", justifyContent: "flex-start", color: espera ? "primary.main" : "text.primary", "&:hover": { color: "primary.main" },
        })}
      >
        {espera ? "Necesito tu aprobación para continuar. Ábrelo para decidir." : texto}
      </ButtonBase>
    </Paper>
  );
}
