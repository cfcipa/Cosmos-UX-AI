/** Un bloque de la explicación de un valor propuesto por la IA: un título y sus párrafos. */
export type BloqueExplicacion = { titulo: string; parrafos: string[] };

/** Explicación de un valor propuesto por la IA. */
export type Explicacion = {
  titulo: string;
  resumen: string;
  bloques: BloqueExplicacion[];
  /** Quién cambió el valor propuesto (si lo cambió alguien). */
  editadoPor?: string;
};
