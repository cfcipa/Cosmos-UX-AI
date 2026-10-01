"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export function ConfirmDialog({ open, titulo, cuerpo, nota, confirmar, onConfirm, onClose }: {
  open: boolean; titulo: string; cuerpo: ReactNode; nota?: string; confirmar: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{titulo}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{cuerpo}</Typography>
        {nota && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>{nota}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onConfirm} autoFocus>{confirmar}</Button>
      </DialogActions>
    </Dialog>
  );
}
