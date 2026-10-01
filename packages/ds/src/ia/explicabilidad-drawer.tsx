"use client";

import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import type { Explicacion } from "./explicacion";

/** Ancho del panel lateral del prototipo. */
const ANCHO_PANEL = 320;

/** Textos fijos del drawer (viven en los textos de la pantalla; el drawer no conoce ningún dominio). */
export type TextosExplicabilidad = {
  /** Nombre accesible del panel. */
  label: string;
  cerrar: string;
  /** "Editado por" (se le añade el nombre). */
  editadoPor: string;
  verMas: string;
  verMenos: string;
};

/**
 * Panel lateral de explicabilidad de la IA: resumen, por qué se aplicó, qué lo cambiaría y qué se descartó.
 * Reutilizable en registro y en detalles.
 * @param explicacion Objeto a mostrar; `null` lo mantiene cerrado.
 * @param textos Etiquetas fijas del panel.
 * @param onClose Se llama al cerrar (botón, Esc o clic fuera).
 * @param maxBloques Bloques visibles antes de "Ver más" (por defecto todos).
 */
export function ExplicabilidadDrawer({
  explicacion,
  textos,
  onClose,
  maxBloques,
}: {
  explicacion: Explicacion | null;
  textos: TextosExplicabilidad;
  onClose: () => void;
  maxBloques?: number;
}) {
  const [verTodo, setVerTodo] = useState(false);
  const bloques = explicacion?.bloques ?? [];
  const limite = maxBloques ?? bloques.length;
  const visibles = verTodo ? bloques : bloques.slice(0, limite);

  return (
    <Drawer
      anchor="right"
      open={Boolean(explicacion)}
      onClose={onClose}
      slotProps={{ paper: { "aria-label": textos.label, sx: { width: ANCHO_PANEL, maxWidth: "92vw", px: 2.5, pt: 2, pb: 4 } } }}
    >
      {explicacion && (
        <>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Typography variant="h2" sx={{ flex: 1 }}>{explicacion.titulo}</Typography>
            <IconButton size="small" aria-label={textos.cerrar} onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {explicacion.editadoPor && (
            <Chip
              size="small"
              icon={<EditOutlinedIcon />}
              label={`${textos.editadoPor} ${explicacion.editadoPor}`}
              sx={(t) => ({ mt: 1, alignSelf: "flex-start", bgcolor: t.palette.tones.primary.bg, color: t.palette.tones.primary.fg, "& .MuiChip-icon": { color: "inherit" } })}
            />
          )}
          <Typography variant="body1" sx={{ mt: 1.5 }}>{explicacion.resumen}</Typography>
          {bloques.length > limite && (
            <Button size="small" sx={{ mt: 0.5, alignSelf: "flex-start" }} onClick={() => setVerTodo((v) => !v)}>
              {verTodo ? textos.verMenos : textos.verMas}
            </Button>
          )}
          {visibles.map((b) => (
            <Box component="section" key={b.titulo} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" component="h3" sx={{ mb: 0.5 }}>{b.titulo}</Typography>
              {b.parrafos.map((p) => (
                <Typography key={p} variant="body1" color="text.secondary" sx={{ mb: 1 }}>{p}</Typography>
              ))}
            </Box>
          ))}
        </>
      )}
    </Drawer>
  );
}
