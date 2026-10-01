"use generative";

import { defineToolkit } from "@assistant-ui/react";
import { z } from "zod";
import { estadoTexto } from "./estado-herramienta";
import { useSuperficie } from "./superficie";

/** Herramientas del núcleo del asistente: valen en cualquier pantalla y en cualquier producto. */
export default defineToolkit({
  abrir_canvas: {
    description:
      "Abre un documento en el canvas (informe, borrador, resumen extenso). Contenido en markdown. Para modificarlo, llámala de nuevo con el mismo título y el contenido completo.",
    parameters: z.object({ titulo: z.string(), contenido: z.string().describe("Markdown del documento completo") }),
    execute: async ({ titulo, contenido }) => {
      "use client";
      useSuperficie.getState().abrirCanvas({ titulo, contenido });
      return { abierto: true, version: useSuperficie.getState().documento?.version };
    },
    renderText: estadoTexto("Redactando el documento…", "Documento listo"),
  },
});
