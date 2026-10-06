"use client";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import { ActionBarPrimitive, AuiIf, ErrorPrimitive, MessagePrimitive, useAuiState } from "@assistant-ui/react";
import { useEffect, useState } from "react";

const SEGUNDO_MS = 1000;
const MINUTO_S = 60;
const SIN_MOVIMIENTO = "@media (prefers-reduced-motion: reduce)";
const late = keyframes`0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.8); }`;

/** Lo que dice el aviso sobre el hilo, una vez que hay mensajes. */
export const AVISO_IA = "Las respuestas se generan con IA y pueden contener errores.";

export function AvisoIA() {
  return (
    <AuiIf condition={(s) => s.thread.messages.length > 0}>
      <Typography variant="caption" component="p" color="text.secondary" align="center" sx={{ m: 0 }}>{AVISO_IA}</Typography>
    </AuiIf>
  );
}

/** Tiempo transcurrido desde que se monta: «12 s», «1 min 05 s». */
function useTranscurrido() {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    const inicio = Date.now();
    const id = window.setInterval(() => setMs(Date.now() - inicio), SEGUNDO_MS);
    return () => window.clearInterval(id);
  }, []);
  const s = Math.floor(ms / SEGUNDO_MS);
  return s < MINUTO_S ? `${s} s` : `${Math.floor(s / MINUTO_S)} min ${String(s % MINUTO_S).padStart(2, "0")} s`;
}

function Indicador() {
  const transcurrido = useTranscurrido();
  return (
    <Box role="status" aria-live="polite" sx={{ display: "flex", alignItems: "center", gap: 1.25, minHeight: 24 }}>
      <Box component="span" aria-hidden="true" sx={{ width: 8, height: 8, flexShrink: 0, borderRadius: "50%", bgcolor: "primary.main", animation: `${late} 1.4s ease-in-out infinite`, [SIN_MOVIMIENTO]: { animation: "none" } }} />
      <Typography variant="body2" color="text.secondary">Pensando</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>{transcurrido}</Typography>
    </Box>
  );
}

/** Verdadero entre el envío y el primer fragmento de la respuesta (condición de la documentación de assistant-ui). */
const useEsperandoPrimerToken = () =>
  useAuiState((s) => {
    if (!s.thread.isRunning) return false;
    const ultimo = s.thread.messages.at(-1);
    return ultimo?.role === "assistant" && ultimo.parts.length === 0;
  });

/** «Pensando» con el tiempo que lleva, mientras la respuesta no llega. */
export function Pensando() {
  return useEsperandoPrimerToken() ? <Indicador /> : null;
}

/** El error de la respuesta: un aviso discreto con «Reintentar», que vuelve a generarla. */
export function ErrorRespuesta() {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root
        render={
          <Alert
            severity="error"
            sx={{ mt: 1 }}
            action={<ActionBarPrimitive.Reload render={<Button size="small" variant="outlined" color="error" sx={{ whiteSpace: "nowrap" }} />}>Reintentar</ActionBarPrimitive.Reload>}
          />
        }
      >
        <AlertTitle>No se pudo completar la respuesta</AlertTitle>
        <ErrorPrimitive.Message />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
}

const MOTIVOS = { cancelled: "detenida por ti", length: "límite de longitud" } as const;

/** Una respuesta detenida: el texto parcial se queda, con el motivo y «Continuar» (vuelve a generarla). */
export function RespuestaDetenida() {
  const motivo = useAuiState((s) => {
    const estado = s.message.status;
    return estado?.type === "incomplete" && (estado.reason === "cancelled" || estado.reason === "length") ? estado.reason : undefined;
  });
  if (!motivo) return null;
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: "center" }}>
      <Chip size="small" label={MOTIVOS[motivo]} />
      <ActionBarPrimitive.Reload render={<Button size="small" variant="contained" />}>Continuar</ActionBarPrimitive.Reload>
    </Stack>
  );
}
