"use client";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

/** Porcentaje entero de `parte` sobre `total` (0 si el total es 0). */
const porcentaje = (parte: number, total: number) => (total ? Math.round((parte / total) * 100) : 0);

/** Grosor de la pista según el prototipo: fina en filas, media en cabeceras. */
const GROSOR = { fino: 0.5, medio: 0.75 } as const;
/** Ancho del progreso con etiquetas en las filas de extracto. */
const ANCHO_ETIQUETADO = 17.5;

/** Barra de progreso (LinearProgress). Completa toma el tono de éxito; si no, el primario. */
export function ProgressBar({ parte, total, grosor = "fino", sx }: { parte: number; total: number; grosor?: keyof typeof GROSOR; sx?: SxProps<Theme> }) {
  const pct = porcentaje(parte, total);
  return (
    <LinearProgress
      variant="determinate"
      value={pct}
      color={pct === 100 ? "success" : "primary"}
      aria-valuemax={total}
      aria-valuenow={parte}
      sx={[
        { height: (t) => t.spacing(GROSOR[grosor]), borderRadius: 16, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { borderRadius: 16 } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

/** Barra con "12 / 40" y porcentaje debajo (filas de extracto). */
export function ProgressLabeled({ parte, total }: { parte: number; total: number }) {
  return (
    <Box sx={(t) => ({ display: "flex", flexDirection: "column", gap: 0.25, width: t.spacing(ANCHO_ETIQUETADO) })}>
      <ProgressBar parte={parte} total={total} />
      <Box sx={{ display: "flex", justifyContent: "space-between", color: "text.secondary" }}>
        <Typography variant="caption">{parte} / {total}</Typography>
        <Typography variant="caption">{porcentaje(parte, total)}%</Typography>
      </Box>
    </Box>
  );
}
