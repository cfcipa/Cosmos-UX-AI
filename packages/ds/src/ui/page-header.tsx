"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/** Cabecera de pantalla interna: volver, título y acciones a la derecha. */
export function PageHeader({ titulo, volver, onVolver, children }: { titulo: string; volver: string; onVolver: () => void; children?: ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, pt: 2, pb: 1.5 }}>
      <Tooltip title={volver}>
        <IconButton aria-label={volver} onClick={onVolver} sx={{ color: "text.secondary" }}>
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="h1" component="h1">{titulo}</Typography>
      <Box sx={{ flex: 1 }} />
      {children}
    </Box>
  );
}
