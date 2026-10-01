"use client";

import { create } from "zustand";

/** Dónde vive el asistente: píldora (cerrada), flotante, lateral o pantalla completa. El canvas es el lateral con un documento. */
export type Superficie = "cerrada" | "flotante" | "lateral" | "completa";

export type Documento = { titulo: string; contenido: string; version: number };

type SuperficieState = {
  superficie: Superficie;
  documento: Documento | null;
  /** El documento está a la vista: hilo a un lado y documento ocupando la pantalla. */
  canvas: boolean;
  /** Llegó un documento con el asistente cerrado: la píldora lo ofrece y no se abre solo. */
  pendiente: boolean;
  /** A qué superficie vuelve la persona al cerrar el canvas. */
  previa: Superficie;
  setSuperficie: (s: Superficie) => void;
  /** Lo llama el modelo (herramienta `abrir_canvas`). Con el asistente cerrado solo deja el documento pendiente. */
  abrirCanvas: (d: { titulo: string; contenido: string }) => void;
  verCanvas: () => void;
  cerrarCanvas: () => void;
};

export const useSuperficie = create<SuperficieState>((set, get) => ({
  superficie: "cerrada",
  documento: null,
  canvas: false,
  pendiente: false,
  previa: "lateral",
  // Elegir una superficie a mano siempre gana: sale del canvas, el documento sigue disponible.
  setSuperficie: (superficie) => set({ superficie, canvas: false, pendiente: superficie === "cerrada" ? get().pendiente : false }),
  abrirCanvas: ({ titulo, contenido }) => {
    const { documento, superficie, canvas, previa } = get();
    const version = documento?.titulo === titulo ? documento.version + 1 : 1;
    const nuevo = { titulo, contenido, version };
    if (superficie === "cerrada") return set({ documento: nuevo, pendiente: true });
    set({ documento: nuevo, canvas: true, pendiente: false, superficie: "lateral", previa: canvas ? previa : superficie });
  },
  verCanvas: () => {
    const { documento, superficie, canvas, previa } = get();
    if (!documento) return;
    set({ canvas: true, pendiente: false, superficie: "lateral", previa: canvas ? previa : superficie === "cerrada" ? "lateral" : superficie });
  },
  cerrarCanvas: () => set({ canvas: false, superficie: get().previa }),
}));
