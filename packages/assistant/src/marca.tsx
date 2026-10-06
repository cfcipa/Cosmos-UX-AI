"use client";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { createContext, useContext, type ReactNode } from "react";

/** Marca de IA que firma cada respuesta. Por defecto, el destello de MUI; un producto puede poner la suya con `<Asistente marca>`. */
const Contexto = createContext<ReactNode>(<AutoAwesomeIcon fontSize="small" color="primary" sx={{ mt: 0.25 }} />);

export function ProveedorMarca({ marca, children }: { marca?: ReactNode; children: ReactNode }) {
  return marca === undefined ? children : <Contexto.Provider value={marca}>{children}</Contexto.Provider>;
}

export const useMarca = () => useContext(Contexto);
