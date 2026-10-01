import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

/** Alto mínimo del estado vacío (prototipo, .empty). */
const ALTO_MINIMO = 380;
const ANCHO_TEXTO = 560;

/** Estado vacío de una lista: título y una línea que explica qué pasará aquí. */
export function EmptyState({ titulo, texto, sx }: { titulo: string; texto: string; sx?: SxProps<Theme> }) {
  return (
    <Box sx={[{ minHeight: ALTO_MINIMO, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 1, p: 6 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Typography variant="h2" component="h2">{titulo}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: ANCHO_TEXTO }}>{texto}</Typography>
    </Box>
  );
}
