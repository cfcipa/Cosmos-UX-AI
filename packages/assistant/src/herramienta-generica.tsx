"use client";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import { useToolCallElapsed, type ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useState, type ReactNode } from "react";

const Raiz = styled("div", { name: "SincoAsistente", slot: "herramienta" })(({ theme }) => ({
  marginBlock: theme.spacing(0.5), color: theme.palette.text.secondary, ...theme.typography.caption,
}));
const Cabecera = styled(ButtonBase)(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(0.75), maxWidth: "100%", borderRadius: theme.shape.borderRadius, ...theme.typography.caption,
  "&:hover": { color: theme.palette.text.primary },
  "& .MuiSvgIcon-root": { fontSize: "1.25em" },
}));
const Detalle = styled("pre")(({ theme }) => ({
  margin: theme.spacing(0.5, 0, 0, 2.75), padding: theme.spacing(1), overflow: "auto", maxHeight: theme.spacing(25), borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.hover, color: theme.palette.text.primary, fontFamily: "monospace", fontSize: theme.typography.caption.fontSize, whiteSpace: "pre-wrap", overflowWrap: "anywhere",
}));

const texto = (valor: unknown) => {
  if (typeof valor === "string") return valor;
  try { return JSON.stringify(valor, null, 2) ?? String(valor); } catch { return String(valor); }
};

const duracion = (ms: number) => `${(ms / 1000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} s`;

/** Herramienta sin interfaz propia: una línea plegable «Herramienta usada: nombre» con su estado y duración; al abrirla, argumentos y resultado. */
export const HerramientaGenerica: ToolCallMessagePartComponent = ({ toolName, argsText, result, status }) => {
  const [abierta, setAbierta] = useState(false);
  const ms = useToolCallElapsed();
  const corriendo = status.type === "running";
  const fallo = status.type === "incomplete";
  const error = status.type === "incomplete" && status.error !== undefined ? texto(status.error) : status.type === "incomplete" && status.reason === "cancelled" ? "La ejecución se canceló." : undefined;
  const bloques: [string, ReactNode][] = [];
  if (argsText) bloques.push(["Argumentos", argsText]);
  if (result !== undefined) bloques.push(["Resultado", texto(result)]);
  if (error) bloques.push(["Error", error]);
  const puedeAbrir = bloques.length > 0;
  return (
    <Raiz>
      <Cabecera disabled={!puedeAbrir} aria-expanded={puedeAbrir ? abierta : undefined} onClick={() => setAbierta((v) => !v)} sx={{ "&.Mui-disabled": { opacity: 1 } }}>
        {corriendo ? <CircularProgress size="1em" color="inherit" /> : fallo ? <ErrorOutlineIcon color="error" /> : <CheckCircleOutlinedIcon color="success" />}
        <span>{corriendo ? "Usando herramienta" : fallo ? "Herramienta con error" : "Herramienta usada"}: <b>{toolName}</b></span>
        {ms != null && !corriendo ? <span>· {duracion(ms)}</span> : null}
        {puedeAbrir ? <ExpandMoreIcon sx={{ transform: abierta ? "rotate(180deg)" : "none", transition: (t) => t.transitions.create("transform") }} /> : null}
      </Cabecera>
      <Collapse in={abierta} unmountOnExit>
        {bloques.map(([titulo, contenido]) => (
          <div key={titulo}>
            <Detalle aria-label={titulo}>{contenido}</Detalle>
          </div>
        ))}
      </Collapse>
    </Raiz>
  );
};
