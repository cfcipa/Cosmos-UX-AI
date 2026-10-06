"use client";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import type { ToolCallMessagePartStatus } from "@assistant-ui/react";
import type { ReactNode } from "react";

/** Línea de estado de una herramienta, con valores estándar del tema de MUI (ajustable en `SincoAsistente.estadoHerramienta`). */
const Estado = styled("div", { name: "SincoAsistente", slot: "estadoHerramienta" })(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(0.75), marginBlock: theme.spacing(0.5),
  color: theme.palette.text.secondary, ...theme.typography.caption,
  "& .MuiSvgIcon-root": { color: theme.palette.success.dark },
}));

/** Cómo se ve una herramienta sin tarjeta propia: un indicador de progreso mientras corre y una marca al terminar, con su texto. */
export function EstadoHerramienta({ terminada, children }: { terminada: boolean; children: ReactNode }) {
  return (
    <Estado role="status">
      {terminada ? <CheckCircleOutlinedIcon fontSize="inherit" /> : <CircularProgress size="1em" color="inherit" />}
      {children}
    </Estado>
  );
}

/**
 * El `render` de una herramienta con el aspecto de `EstadoHerramienta`: dos textos, mientras corre y al terminar.
 * Va en `render` y no en `renderText`: la documentación de assistant-ui reserva `renderText` para texto plano.
 */
export const estadoHerramienta = (corriendo: string, terminada: string) =>
  function RenderEstado({ status }: { status: ToolCallMessagePartStatus }) {
    if (status.type === "running") return <EstadoHerramienta terminada={false}>{corriendo}</EstadoHerramienta>;
    if (status.type === "complete") return <EstadoHerramienta terminada>{terminada}</EstadoHerramienta>;
    return null;
  };
