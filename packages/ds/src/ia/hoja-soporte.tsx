"use client";

import Box from "@mui/material/Box";

/** Medidas de la hoja del prototipo (viewBox y caja). */
const ANCHO = 150;
const ALTO = 186;

/**
 * Vista previa esquemática de un documento soporte (líneas grises sobre hoja blanca).
 * Es un marcador de posición: al haber visor real se reemplaza el interior conservando las medidas.
 * Las líneas usan `currentColor` (texto primario del tema).
 * @param etiqueta Texto accesible de la imagen.
 */
export function HojaSoporte({ etiqueta }: { etiqueta: string }) {
  return (
    <Box sx={{ width: ANCHO, height: ALTO, overflow: "hidden", borderRadius: 0.5, bgcolor: "background.paper", color: "text.primary" }}>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label={etiqueta} fill="currentColor">
        <rect x="12" y="12" width="34" height="5" rx="1" opacity=".7" />
        <g opacity=".28">
          <rect x="12" y="24" width="58" height="3" rx="1" />
          <rect x="12" y="30" width="48" height="3" rx="1" />
          <rect x="12" y="36" width="54" height="3" rx="1" />
          <rect x="12" y="42" width="40" height="3" rx="1" />
          <rect x="12" y="62" width="126" height="1" />
          <rect x="12" y="70" width="40" height="3" rx="1" />
          <rect x="70" y="70" width="28" height="3" rx="1" />
          <rect x="108" y="70" width="30" height="3" rx="1" />
          <rect x="12" y="80" width="46" height="3" rx="1" />
          <rect x="70" y="80" width="24" height="3" rx="1" />
          <rect x="108" y="80" width="30" height="3" rx="1" />
          <rect x="12" y="90" width="38" height="3" rx="1" />
          <rect x="70" y="90" width="26" height="3" rx="1" />
          <rect x="108" y="90" width="30" height="3" rx="1" />
          <rect x="12" y="112" width="126" height="1" />
          <rect x="90" y="120" width="24" height="3" rx="1" />
          <rect x="118" y="120" width="20" height="3" rx="1" />
          <rect x="90" y="130" width="24" height="3" rx="1" />
          <rect x="118" y="130" width="20" height="3" rx="1" />
        </g>
        <rect x="90" y="144" width="24" height="5" rx="1" opacity=".72" />
        <rect x="118" y="144" width="20" height="5" rx="1" opacity=".72" />
        <rect x="12" y="168" width="52" height="3" rx="1" opacity=".2" />
      </svg>
    </Box>
  );
}
