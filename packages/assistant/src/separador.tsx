"use client";

import Box from "@mui/material/Box";
import { useRef } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import textos from "./textos.json";

/** Pasos del teclado, en unidades de spacing. */
const PASO = 2;
const PASO_GRANDE = 10;

/**
 * Borde entre la pantalla y el asistente lateral. Se arrastra o, enfocado, se mueve con ← → (Shift: pasos grandes).
 * El ancho del asistente va en unidades de spacing; el asistente está a la derecha, así que arrastrar a la izquierda lo ensancha.
 */
export function Separador({ ancho, min, max, onCambio, contenedor }: {
  ancho: number; min: number; max: number; onCambio: (v: number) => void; contenedor: RefObject<HTMLElement | null>;
}) {
  // Cuántos píxeles vale una unidad de spacing, medido en el DOM al empezar a arrastrar (el tema puede expresarlo con variables CSS).
  const unidad = useRef(0);
  const acota = (v: number) => Math.min(max, Math.max(min, v));
  const empezar = (e: ReactPointerEvent<HTMLElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = contenedor.current?.getBoundingClientRect();
    unidad.current = r ? (r.right - e.currentTarget.getBoundingClientRect().right) / ancho : 0;
  };
  const mover = (e: ReactPointerEvent) => {
    if (e.buttons !== 1 || !unidad.current) return;
    const r = contenedor.current?.getBoundingClientRect();
    if (r) onCambio(acota((r.right - e.clientX) / unidad.current));
  };
  const teclas = (e: KeyboardEvent) => {
    const paso = e.shiftKey ? PASO_GRANDE : PASO;
    const siguiente = ({ ArrowLeft: ancho + paso, ArrowRight: ancho - paso, Home: min, End: max } as Record<string, number>)[e.key];
    if (siguiente === undefined) return;
    e.preventDefault();
    onCambio(acota(siguiente));
  };
  return (
    <Box
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={textos.separador}
      aria-valuenow={Math.round(ancho)}
      aria-valuemin={min}
      aria-valuemax={max}
      onPointerDown={empezar}
      onPointerMove={mover}
      onKeyDown={teclas}
      sx={(t) => ({
        position: "relative", flexShrink: 0, width: 0, borderLeft: 1, borderColor: "divider", cursor: "col-resize", touchAction: "none", outline: "none",
        "&::after": { content: '""', position: "absolute", top: 0, bottom: 0, left: t.spacing(-0.5), right: t.spacing(-0.5) },
        transition: t.transitions.create("border-color", { duration: t.transitions.duration.shortest }),
        "&:hover, &:focus-visible": { borderColor: "primary.main" },
      })}
    />
  );
}
