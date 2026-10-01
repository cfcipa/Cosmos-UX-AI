"use client";

import { createContext, useContext } from "react";
import type { ContratoPantalla } from "./contrato";

type PantallaActual = { pathname: string; pantallas: readonly ContratoPantalla[]; contrato: ContratoPantalla | undefined };

const Contexto = createContext<PantallaActual>({ pathname: "", pantallas: [], contrato: undefined });

export const ProveedorPantallaActual = Contexto.Provider;

/** Qué pantalla está a la vista y qué aporta al asistente (undefined si esa pantalla aún no aporta nada). */
export const usePantallaActual = () => useContext(Contexto);
