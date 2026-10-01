import type { ReactNode } from "react";

/** Una sugerencia del chat vacío: lo que se ve y el prompt completo que se envía. */
export type Inicio = {
  titulo: string;
  prompt: string;
  icono: ReactNode;
  color: "primary" | "success" | "warning" | "error" | "info";
};

/**
 * Lo que una pantalla (o un producto) aporta al asistente. El núcleo del asistente no sabe nada de dominios: cada
 * pantalla se registra con este contrato y el núcleo hace el resto (superficie, hilo, canvas, aprobación, contenido).
 */
export type ContratoPantalla = {
  id: string;
  /** Cómo se llama la pantalla para el modelo: «Nombre del módulo · Pantalla». */
  nombre: string;
  /** Qué rutas cubre. */
  aplica: (pathname: string) => boolean;
  /** Qué ve el modelo de la pantalla (reglas propias y estado), calculado al enviar cada mensaje. */
  contexto: () => string;
  /** Sugerencias del chat vacío en esta pantalla. */
  inicios: readonly Inicio[];
  /** Nombres de las herramientas que operan esta pantalla; viven en su toolkit. */
  herramientas: readonly string[];
};

/** El contrato de la pantalla actual, o undefined si esa pantalla aún no aporta nada al asistente. */
export const contratoDe = (contratos: readonly ContratoPantalla[], pathname: string) => contratos.find((c) => c.aplica(pathname));
