"use client";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSuperficie } from "./superficie";
import textos from "./textos.json";
import { COMPONENTES_MARKDOWN } from "./markdown";
import { ALTO_ENCABEZADO, EncabezadoAsistente } from "./panel-asistente";
import { Thread } from "./thread";

/** Ancho del hilo mientras el documento ocupa la pantalla, en unidades de spacing del tema. */
const ANCHO_HILO = 50;
const COPIADO_MS = 1500;

/** El documento: encabezado con versión, copiar y cerrar, y el cuerpo en markdown. */
function Documento() {
  const { documento, cerrarCanvas } = useSuperficie();
  const [copiado, setCopiado] = useState(false);
  if (!documento) return null;
  const copiar = () => {
    void navigator.clipboard?.writeText(`${documento.titulo}\n\n${documento.contenido}`);
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), COPIADO_MS);
  };
  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>
      <Box sx={(t) => ({ display: "flex", alignItems: "center", gap: 1, px: 2, minHeight: t.spacing(ALTO_ENCABEZADO), borderBottom: 1, borderColor: "divider" })}>
        <DescriptionOutlinedIcon fontSize="small" color="action" />
        <Typography variant="subtitle1" noWrap sx={{ flex: 1 }}>{documento.titulo}</Typography>
        <Chip size="small" label={`${textos.version}${documento.version}`} />
        <Tooltip title={textos.copiarDocumento}>
          <IconButton size="small" aria-label={textos.copiarDocumento} onClick={copiar}>
            {copiado ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title={textos.cerrarDocumento}>
          <IconButton size="small" aria-label={textos.cerrarDocumento} onClick={cerrarCanvas}><CloseIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 3 }}>
        <Markdown remarkPlugins={[remarkGfm]} components={COMPONENTES_MARKDOWN}>{documento.contenido}</Markdown>
      </Box>
    </Box>
  );
}

/** Canvas: el hilo se hace a un lado y el documento ocupa la pantalla. La pantalla queda detrás, sin perder su estado. */
export function VistaCanvas() {
  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
      <Box sx={(t) => ({ width: t.spacing(ANCHO_HILO), flexShrink: 0, display: "flex", flexDirection: "column", borderRight: 1, borderColor: "divider", bgcolor: "background.paper" })}>
        <EncabezadoAsistente modo="canvas" />
        <Box sx={{ flex: 1, minHeight: 0 }}><Thread /></Box>
      </Box>
      <Documento />
    </Box>
  );
}
