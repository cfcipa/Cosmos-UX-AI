"use client";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { alpha, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { ToolCallMessagePartStatus } from "@assistant-ui/react";
import type { ReactNode } from "react";

/** Contenedor con presencia de IA: borde y aura de la paleta primaria del tema de MUI. */
const Tarjeta = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0)} 160px), ${theme.palette.background.paper}`,
  boxShadow: `inset 0 1px 0 0 ${alpha(theme.palette.primary.main, 0.1)}, ${theme.shadows[1]}`,
}));

export type Propuesta = {
  /** Qué se propone: «Confirmar 2 elementos». */
  titulo: string;
  /** Por qué, si el modelo lo dio. */
  motivo?: string;
  /** Lo que se afecta: una fila por elemento. */
  elementos: readonly { id: string | number; etiqueta: ReactNode; valor: ReactNode }[];
  /** Total de lo afectado, si aplica. */
  total?: ReactNode;
  /** Texto del botón que aprueba. */
  verboAprobar: string;
};

/** Lo que devuelve la persona al decidir; cada pantalla puede añadir el detalle de lo que ejecutó. */
export type Decision = { aprobado: boolean; resumen?: string };

/**
 * La IA propone, la persona decide. Tarjeta genérica de aprobación dentro del hilo: la pantalla arma la propuesta y ejecuta
 * la acción; la tarjeta solo la muestra y recoge la decisión.
 */
export function TarjetaAprobacion({ propuesta, decision, status, onDecidir }: {
  propuesta: Propuesta; decision?: Decision; onDecidir: (aprobado: boolean) => void;
  /** El `status` que assistant-ui entrega al `render` de la herramienta: mientras llegan los argumentos no se puede decidir. */
  status?: ToolCallMessagePartStatus;
}) {
  const preparando = status?.type === "running";
  const incompleta = status?.type === "incomplete";
  return (
    <Tarjeta sx={{ my: 1, p: 2, maxWidth: (t) => t.spacing(52) }}>
      <Typography variant="subtitle1">{propuesta.titulo}</Typography>
      {propuesta.motivo ? <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{propuesta.motivo}</Typography> : null}
      <Divider sx={{ my: 1 }} />
      {propuesta.elementos.map((e) => (
        <Box key={e.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 0.5 }}>
          <Typography variant="body2" sx={{ minWidth: 0, overflowWrap: "anywhere" }}>{e.etiqueta}</Typography>
          <Typography variant="body2" component="span" sx={{ flexShrink: 0 }}>{e.valor}</Typography>
        </Box>
      ))}
      {decision ? (
        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 0.75, color: decision.aprobado ? "success.dark" : "error.dark" }}>
          {decision.aprobado ? <CheckCircleOutlinedIcon fontSize="small" /> : <HighlightOffOutlinedIcon fontSize="small" />}
          <Typography variant="subtitle1">{decision.aprobado ? `Aprobado${decision.resumen ? ` · ${decision.resumen}` : ""}` : "Rechazado por la persona"}</Typography>
        </Box>
      ) : incompleta ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>La propuesta no se completó</Typography>
      ) : (
        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary" component="div">
            {preparando ? "Preparando la propuesta…" : propuesta.total ? <>Total {propuesta.total}</> : null}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" color="inherit" disabled={preparando} onClick={() => onDecidir(false)}>Rechazar</Button>
            <Button size="small" variant="contained" disabled={preparando} onClick={() => onDecidir(true)}>{propuesta.verboAprobar}</Button>
          </Box>
        </Box>
      )}
    </Tarjeta>
  );
}
