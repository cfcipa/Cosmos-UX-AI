"use client";

import Snackbar from "@mui/material/Snackbar";
import { create } from "zustand";

type ToastState = { mensaje: string | null; show: (m: string) => void; hide: () => void };
const useToast = create<ToastState>((set) => ({ mensaje: null, show: (mensaje) => set({ mensaje }), hide: () => set({ mensaje: null }) }));

export const toast = (mensaje: string) => useToast.getState().show(mensaje);

export function ToastHost() {
  const { mensaje, hide } = useToast();
  return <Snackbar open={Boolean(mensaje)} message={mensaje} autoHideDuration={4000} onClose={hide} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />;
}
