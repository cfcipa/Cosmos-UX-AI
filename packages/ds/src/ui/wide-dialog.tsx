"use client";

import CloseIcon from "@mui/icons-material/CloseOutlined";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/** Ancho del diálogo de flujo según el prototipo. */
const ANCHO = 75;
/** Alto máximo respecto de la ventana. */
const ALTO_MAXIMO = "88vh";

/** Diálogo ancho de flujo: título, contenido a la derecha del título (progreso) y cierre. */
export function WideDialog({ open, titulo, cerrar, aside, onClose, children }: {
  open: boolean; titulo: string; cerrar: string; aside?: ReactNode; onClose: () => void; children: ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      slotProps={{ paper: { sx: (t) => ({ width: t.spacing(ANCHO), maxWidth: "100%", maxHeight: ALTO_MAXIMO, px: 2.5, pt: 2, pb: 1.5 }) } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="h1" component="h2">{titulo}</Typography>
        <Box sx={{ flex: 1 }} />
        {aside}
        <IconButton size="small" aria-label={cerrar} onClick={onClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ display: "flex", flexDirection: "column", p: 0, overflow: "hidden" }}>{children}</DialogContent>
    </Dialog>
  );
}
