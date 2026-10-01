"use client";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ButtonBase from "@mui/material/ButtonBase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useAuiState } from "@assistant-ui/react";
import { useSuperficie } from "./superficie";
import textos from "./textos.json";
import { VistaPrevia } from "./vista-previa";

/** Medidas de la píldora, en unidades de spacing del tema. */
const ALTO = 6;
const ANCHO = 55;
const BORDE = 3;
/** Cuánto espacio deja la pantalla debajo para que la píldora no tape el final del contenido. */
export const RESERVA_PILDORA = 12;

/**
 * El asistente cerrado, siempre presente: una píldora con forma de composer que abre el asistente sin perder el chat.
 * Si llegó un documento con el asistente cerrado, lo ofrece. Sobre ella asoma la última respuesta.
 */
export function Pildora() {
  const { pendiente, setSuperficie, verCanvas } = useSuperficie();
  const conMensajes = useAuiState((s) => s.thread.messages.length > 0);
  const texto = pendiente ? textos.documentoListo : conMensajes ? textos.pildoraSeguir : textos.pildoraInicio;
  return (
    <Paper
      elevation={8}
      sx={(t) => ({
        position: "absolute", left: "50%", bottom: t.spacing(BORDE), transform: "translateX(-50%)", zIndex: t.zIndex.speedDial,
        width: t.spacing(ANCHO), maxWidth: `calc(100% - ${t.spacing(4)})`, height: t.spacing(ALTO), borderRadius: t.spacing(ALTO),
        border: 1, borderColor: "divider", "&:hover": { borderColor: "action.disabled" },
      })}
    >
      <VistaPrevia />
      <ButtonBase
        aria-label={textos.abrir}
        onClick={pendiente ? verCanvas : () => setSuperficie("flotante")}
        sx={{ width: "100%", height: "100%", borderRadius: "inherit", justifyContent: "flex-start", gap: 1, px: 2 }}
      >
        {pendiente ? <DescriptionOutlinedIcon fontSize="small" color="primary" /> : <AutoAwesomeIcon fontSize="small" color="primary" />}
        <Typography variant="body1" noWrap color={pendiente ? "primary" : "text.secondary"}>{texto}</Typography>
      </ButtonBase>
    </Paper>
  );
}
