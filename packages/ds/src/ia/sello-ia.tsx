"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { InsigniaIA } from "./marca";

/**
 * Sello "DATOS EXTRAÍDOS CON [insignia IA]" del encabezado de un registro generado por IA.
 * @param texto Leyenda (se muestra en mayúsculas); viene de los textos de la pantalla, no se escribe aquí.
 */
export function SelloIA({ texto }: { texto: string }) {
  return (
    <Box sx={(t) => ({ display: "flex", alignItems: "center", gap: 0.75, ml: 0.75, color: t.palette.ai.borderStrong })}>
      <Typography variant="overline" sx={{ color: "text.secondary" }}>{texto}</Typography>
      <InsigniaIA />
    </Box>
  );
}
