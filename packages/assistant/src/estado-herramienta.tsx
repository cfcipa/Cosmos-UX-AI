"use client";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

/** Línea de estado de una herramienta; su aspecto sale del tema (`SincoAsistente.estadoHerramienta`). */
const Estado = styled("div", { name: "SincoAsistente", slot: "estadoHerramienta" })({ display: "flex", alignItems: "center" });

/** Cómo se ve una herramienta sin tarjeta propia: un indicador de progreso mientras corre y una marca al terminar, con su texto. */
export function EstadoHerramienta({ terminada, children }: { terminada: boolean; children: ReactNode }) {
  return (
    <Estado role="status">
      {terminada ? <CheckCircleOutlinedIcon fontSize="inherit" /> : <CircularProgress size="1em" color="inherit" />}
      {children}
    </Estado>
  );
}

/** El `renderText` de una herramienta con el aspecto de `EstadoHerramienta`: dos textos, mientras corre y al terminar. */
export const estadoTexto = (corriendo: string, terminada: string) => ({
  running: () => <EstadoHerramienta terminada={false}>{corriendo}</EstadoHerramienta>,
  complete: () => <EstadoHerramienta terminada>{terminada}</EstadoHerramienta>,
});
