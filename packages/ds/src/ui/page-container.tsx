import Box from "@mui/material/Box";
import type { ReactNode } from "react";

/** Ancho máximo del contenido de las pantallas (unidades de px del diseño). */
const ANCHO_MAXIMO = 1254;

/** Contenedor centrado de las pantallas de la app. `anchoMaximo` lo cambia un producto que lo necesite distinto. */
export function PageContainer({ children, anchoMaximo = ANCHO_MAXIMO }: { children: ReactNode; anchoMaximo?: number }) {
  return <Box sx={{ maxWidth: anchoMaximo, mx: "auto", px: 2 }}>{children}</Box>;
}
