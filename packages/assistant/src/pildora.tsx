"use client";

import AddIcon from "@mui/icons-material/Add";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import StopIcon from "@mui/icons-material/Stop";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import { AuiIf, ComposerPrimitive, useAuiState } from "@assistant-ui/react";
import type { MouseEvent } from "react";
import { BotonAdjuntar } from "./adjuntos";
import { ALTO_PILDORA, ANCHO_PILDORA, BORDE_PILDORA } from "./medidas-pildora";
import { useSuperficie } from "./superficie";
import { VistaPrevia, type LlamadaPendiente } from "./vista-previa";

/** Botones de 34 px con íconos de 20 px (el de detener, de 14 px). */
const BOTON = 4.25;
const ICONO = 20;
const DETENER = 14;
const sube = keyframes`from { opacity: 0; transform: translateX(-50%) translateY(6px); } to { opacity: 1; transform: translateX(-50%); }`;

/**
 * El asistente cerrado, siempre presente: una píldora con forma de composer que abre el asistente sin perder el chat. El «+»
 * adjunta y abre; mientras corre una respuesta, aparece Detener. Si llegó un documento con el asistente cerrado, lo ofrece.
 * Sobre ella asoma la última respuesta.
 */
export function Pildora({ textoAprobacion }: { textoAprobacion?: (llamada: LlamadaPendiente) => string }) {
  const { pendiente, setSuperficie, verCanvas } = useSuperficie();
  const conMensajes = useAuiState((s) => s.thread.messages.length > 0);
  const texto = pendiente ? "Documento listo · Abrir" : conMensajes ? "¿Qué hacemos ahora?" : "¿Por dónde empezamos?";
  const abrir = () => (pendiente ? verCanvas() : setSuperficie("flotante"));
  return (
    <Paper
      elevation={8}
      // Toda la píldora abre; los botones de adentro hacen lo suyo.
      onClick={(e: MouseEvent<HTMLElement>) => { if (!(e.target as HTMLElement).closest("button")) abrir(); }}
      sx={(t) => ({
        position: "absolute", left: "50%", bottom: t.spacing(BORDE_PILDORA), transform: "translateX(-50%)", zIndex: t.zIndex.speedDial,
        display: "flex", alignItems: "center", gap: 0.5, px: 0.75, boxSizing: "border-box", cursor: "text",
        width: t.spacing(ANCHO_PILDORA), maxWidth: `calc(100% - ${t.spacing(4)})`, height: t.spacing(ALTO_PILDORA), borderRadius: t.spacing(ALTO_PILDORA),
        border: 1, borderColor: "divider", "&:hover": { borderColor: "action.disabled" },
        animation: `${sube} ${t.transitions.duration.shorter}ms ease-out both`,
        "& .MuiIconButton-root": { width: t.spacing(BOTON), height: t.spacing(BOTON), borderRadius: "50%", "& svg": { width: ICONO, height: ICONO } },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      })}
    >
      <VistaPrevia textoAprobacion={textoAprobacion} />
      <BotonAdjuntar alAdjuntar={abrir} />
      <ButtonBase
        aria-label="Abrir el asistente"
        onClick={abrir}
        sx={{ flex: 1, minWidth: 0, alignSelf: "stretch", justifyContent: "flex-start", gap: 1, px: 0.5, borderRadius: 1 }}
      >
        {pendiente ? <DescriptionOutlinedIcon fontSize="small" color="primary" /> : null}
        <Typography variant="body1" noWrap color={pendiente ? "primary" : "text.secondary"}>{texto}</Typography>
      </ButtonBase>
      <AuiIf condition={(s) => s.thread.isRunning}>
        <Tooltip title="Detener la respuesta">
          <ComposerPrimitive.Cancel
            render={<IconButton aria-label="Detener la respuesta" sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" }, "&& svg": { width: DETENER, height: DETENER } }} />}
          >
            <StopIcon />
          </ComposerPrimitive.Cancel>
        </Tooltip>
      </AuiIf>
    </Paper>
  );
}
