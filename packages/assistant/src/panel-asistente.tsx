"use client";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import { useEffect, type ReactNode } from "react";
import { useSuperficie, type Superficie } from "./superficie";
import { Thread } from "./thread";

/** Medidas de cada superficie, en unidades de spacing del tema. */
const FLOTANTE = { ancho: 60, alto: 75, borde: 3, margen: 10 };
const ANCHO_MAXIMO_COMPLETA = 95;
/** Alto de los encabezados del asistente y del documento, para que sus líneas coincidan. */
export const ALTO_ENCABEZADO = 5.5;

// Cada superficie entra con su gesto: el flotante sube desde la píldora, el lateral se desliza, la completa aparece.
const sube = keyframes`from { opacity: 0; transform: translateX(-50%) translateY(.75rem) scale(.98); } to { opacity: 1; transform: translateX(-50%); }`;
const desliza = keyframes`from { opacity: 0; transform: translateX(1rem); } to { opacity: 1; transform: none; }`;
const aparece = keyframes`from { opacity: 0; } to { opacity: 1; }`;
export const SIN_MOVIMIENTO = "@media (prefers-reduced-motion: reduce)";

type Modo = Exclude<Superficie, "cerrada">;

function Accion({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip title={label}>
      <IconButton size="small" aria-label={label} onClick={onClick}>{children}</IconButton>
    </Tooltip>
  );
}

/** Encabezado: el asistente, el documento (si hay uno fuera de vista) y las acciones para cambiar de superficie. */
export function EncabezadoAsistente({ modo }: { modo: Modo | "canvas" }) {
  const { setSuperficie, documento, verCanvas } = useSuperficie();
  return (
    <Box sx={(t) => ({ display: "flex", alignItems: "center", gap: 1, px: 2, minHeight: t.spacing(ALTO_ENCABEZADO), borderBottom: 1, borderColor: "divider" })}>
      <AutoAwesomeIcon fontSize="small" color="primary" />
      <Typography variant="subtitle1" sx={{ flex: 1 }}>Asistente</Typography>
      {documento && modo !== "canvas" ? (
        <Button size="small" startIcon={<DescriptionOutlinedIcon />} onClick={verCanvas}>Ver documento</Button>
      ) : null}
      {modo === "flotante" ? <Accion label="Abrir en panel lateral" onClick={() => setSuperficie("lateral")}><ViewSidebarOutlinedIcon fontSize="small" /></Accion> : null}
      {modo === "lateral" ? <Accion label="Pantalla completa" onClick={() => setSuperficie("completa")}><OpenInFullIcon fontSize="small" /></Accion> : null}
      {modo === "completa" ? <Accion label="Abrir en panel lateral" onClick={() => setSuperficie("lateral")}><CloseFullscreenIcon fontSize="small" /></Accion> : null}
      {modo === "canvas" ? null : <Accion label="Cerrar" onClick={() => setSuperficie("cerrada")}><CloseIcon fontSize="small" /></Accion>}
    </Box>
  );
}

/** Esc repliega: flotante → píldora, pantalla completa → lateral. */
function useEscape(modo: Modo) {
  const setSuperficie = useSuperficie((s) => s.setSuperficie);
  useEffect(() => {
    if (modo === "lateral") return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSuperficie(modo === "completa" ? "lateral" : "cerrada");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modo, setSuperficie]);
}

/** El hilo en la superficie elegida. Es el mismo runtime en todas: cambiar de superficie no pierde la conversación. */
export function PanelAsistente({ modo, ancho, maxAncho }: { modo: Modo; ancho: number; maxAncho: string }) {
  useEscape(modo);
  const encabezado = <EncabezadoAsistente modo={modo} />;
  if (modo === "lateral") {
    return (
      <Box component="aside" sx={(t) => ({
        position: "relative", flex: `0 0 ${t.spacing(ancho)}`, maxWidth: maxAncho, minWidth: 0, display: "flex", flexDirection: "column", bgcolor: "background.paper", animation: `${desliza} ${t.transitions.duration.enteringScreen}ms ease-out both`, [SIN_MOVIMIENTO]: { animation: "none" } })}>
        {encabezado}
        <Box sx={{ flex: 1, minHeight: 0 }}><Thread /></Box>
      </Box>
    );
  }
  const flotante = modo === "flotante";
  return (
    <Paper
      component="aside"
      elevation={flotante ? 8 : 0}
      square={!flotante}
      sx={(t) => ({
        position: "absolute", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: t.zIndex.speedDial + 1,
        ...(flotante
          ? {
              left: "50%", bottom: t.spacing(FLOTANTE.borde), transform: "translateX(-50%)", width: t.spacing(FLOTANTE.ancho), maxWidth: `calc(100% - ${t.spacing(4)})`,
              height: t.spacing(FLOTANTE.alto), maxHeight: `calc(100% - ${t.spacing(FLOTANTE.margen)})`, border: 1, borderColor: "divider",
              transformOrigin: "bottom center", animation: `${sube} ${t.transitions.duration.enteringScreen}ms ease-out both`,
            }
          : { inset: 0, animation: `${aparece} ${t.transitions.duration.shorter}ms ease-out both` }),
        [SIN_MOVIMIENTO]: { animation: "none" },
      })}
    >
      {encabezado}
      <Box sx={(t) => ({ flex: 1, minHeight: 0, width: "100%", ...(!flotante && { maxWidth: t.spacing(ANCHO_MAXIMO_COMPLETA), alignSelf: "center" }) })}><Thread /></Box>
    </Paper>
  );
}
