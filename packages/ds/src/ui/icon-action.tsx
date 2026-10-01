"use client";

import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

/** Botón de icono con tooltip y nombre accesible (misma etiqueta). */
export function IconAction({ label, sx, ...props }: IconButtonProps & { label: string }) {
  return (
    <Tooltip title={label}>
      <IconButton size="small" aria-label={label} sx={[{ color: "text.secondary" }, ...(Array.isArray(sx) ? sx : [sx])]} {...props} />
    </Tooltip>
  );
}
