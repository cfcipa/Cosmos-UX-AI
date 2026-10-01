"use client";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

/** Tamaño de la miniatura (unidades del prototipo: 200 x 170). */
const ANCHO = 25;
const ALTO = 21.25;
const LINEAS = [
  { x: 1.75, y: 3, w: 7.5 }, { x: 1.75, y: 3.75, w: 5.5 }, { x: 1.75, y: 4.5, w: 6.5 },
  { x: 1.75, y: 10.25, w: 8.75 }, { x: 1.75, y: 11, w: 7 }, { x: 1.75, y: 11.75, w: 8 },
];
const FILAS = [16, 17.25, 18.5];

/** Miniatura de un documento (extracto bancario) con botón de ampliar. La imagen real vendrá del ERP. */
export function MiniaturaDocumento({ etiqueta, ampliar, onAmpliar }: { etiqueta: string; ampliar: string; onAmpliar: () => void }) {
  return (
    <Box sx={{ position: "relative", flexShrink: 0 }}>
      <Tooltip title={ampliar}>
        <IconButton
          size="small"
          aria-label={ampliar}
          onClick={onAmpliar}
          sx={(t) => ({ position: "absolute", top: 6, right: 6, zIndex: 1, bgcolor: t.palette.tones.primary.bg, color: "primary.main", "&:hover": { bgcolor: t.palette.tones.primary.sel } })}
        >
          <SearchIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Box sx={(t) => ({ width: t.spacing(ANCHO), height: t.spacing(ALTO), borderRadius: 1, border: 1, borderColor: "grey.200", bgcolor: "background.paper", overflow: "hidden", color: "text.primary" })}>
        <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} width="100%" height="100%" role="img" aria-label={etiqueta} fill="currentColor">
          <Box component="rect" x={1} y={1} width={ANCHO - 2} height={6.5} rx={0.25} sx={{ fill: (t) => t.palette.grey[100] }} />
          <rect x={1.75} y={1.75} width={5.75} height={0.6} opacity={0.7} />
          <g opacity={0.25}>{LINEAS.slice(0, 3).map((l) => <rect key={l.y} x={l.x} y={l.y} width={l.w} height={0.4} />)}</g>
          <Box component="rect" x={1} y={8.25} width={ANCHO - 2} height={5.75} rx={0.25} sx={{ fill: (t) => t.palette.grey[100] }} />
          <g opacity={0.22}>{LINEAS.slice(3).map((l) => <rect key={l.y} x={l.x} y={l.y} width={l.w} height={0.4} />)}</g>
          <Box component="rect" x={14.75} y={9} width={8.25} height={4.25} rx={0.25} sx={{ fill: (t) => t.palette.grey[300] }} />
          <g opacity={0.2}>
            <rect x={1} y={15} width={ANCHO - 2} height={0.15} />
            {FILAS.map((y, i) => (
              <g key={y}>
                <rect x={1.75} y={y} width={[5, 5.75, 4.75][i]} height={0.4} />
                <rect x={8.75} y={y} width={[3.75, 3.25, 4][i]} height={0.4} />
                <rect x={18.75} y={y} width={4.25} height={0.4} />
              </g>
            ))}
          </g>
        </svg>
      </Box>
    </Box>
  );
}
