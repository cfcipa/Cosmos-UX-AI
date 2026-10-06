"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckIcon from "@mui/icons-material/Check";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import StopIcon from "@mui/icons-material/Stop";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import type { InputBaseComponentProps } from "@mui/material/InputBase";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import {
  ActionBarPrimitive, AuiIf, ComposerPrimitive, MessagePrimitive, ThreadPrimitive, useAuiState,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import type { FC } from "react";
import { BotonAccion, Ramas } from "./acciones-mensaje";
import { AvisoIA, ErrorRespuesta, Pensando, RespuestaDetenida } from "./estados-mensaje";
import { HerramientaGenerica } from "./herramienta-generica";
import { Inicios } from "./inicios";
import { useMarca } from "./marca";
import { COMPONENTES_MARKDOWN } from "./markdown";

/** Filas máximas del campo de texto antes de hacer scroll. */
const FILAS_MAX_INPUT = 8;

// Las primitivas de assistant-ui vienen sin estilo. El aspecto se arma solo con valores estándar del tema de MUI del producto
// (paleta, espaciado, tipografía), así que el asistente toma el tema que ya exista. Cada pieza lleva nombre y slot de MUI:
// un producto puede ajustarla desde `theme.components.SincoAsistente.styleOverrides` si lo necesita.
const pieza = (slot: string) => ({ name: "SincoAsistente", slot });

const Root = styled(ThreadPrimitive.Root)({ display: "flex", flexDirection: "column", height: "100%" });
const Viewport = styled(ThreadPrimitive.Viewport, pieza("viewport"))(({ theme }) => ({
  flex: 1, overflowY: "auto", display: "flex", flexDirection: "column",
  // Sin relleno inferior: el pie es `sticky bottom: 0` y, con relleno, el texto se ve pasar por debajo del compositor.
  padding: theme.spacing(2, 2, 0), gap: theme.spacing(2),
}));
const Footer = styled(ThreadPrimitive.ViewportFooter, pieza("pie"))(({ theme }) => ({
  position: "sticky", bottom: 0, marginTop: "auto", backgroundColor: theme.palette.background.paper, paddingBottom: theme.spacing(1.5),
}));
const UserMessageRoot = styled(MessagePrimitive.Root)({ display: "flex", flexDirection: "column" });
const UserBubble = styled("div", pieza("mensajePersona"))(({ theme }) => ({
  alignSelf: "flex-end", maxWidth: "85%", padding: theme.spacing(1.25, 1.75), borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.text.primary, ...theme.typography.body1,
}));
const FilaPersona = styled("div")(({ theme }) => ({
  display: "flex", justifyContent: "flex-end", alignItems: "center", gap: theme.spacing(0.5),
  "& .acciones-persona": { opacity: 0, transition: theme.transitions.create("opacity", { duration: theme.transitions.duration.shortest }) },
  "&:hover .acciones-persona, &:focus-within .acciones-persona": { opacity: 1 },
}));
const Edicion = styled("div", pieza("edicion"))(({ theme }) => ({
  display: "flex", flexDirection: "column", gap: theme.spacing(1), padding: theme.spacing(1.5), border: `1px solid ${theme.palette.divider}`, borderRadius: theme.spacing(2),
}));
const AssistantRoot = styled(MessagePrimitive.Root, pieza("mensajeAsistente"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "start", columnGap: theme.spacing(1),
}));
const FilaAcciones = styled("div")(({ theme }) => ({ display: "flex", alignItems: "center", gap: theme.spacing(0.5), marginTop: theme.spacing(0.5) }));
const Actions = styled(ActionBarPrimitive.Root)(({ theme }) => ({ display: "flex", gap: theme.spacing(0.25) }));
const Markdown = styled("div", pieza("markdown"))(({ theme }) => ({ ...theme.typography.body1, overflowWrap: "anywhere" }));

const Text: FC = () => (
  <Markdown>
    <MarkdownTextPrimitive remarkPlugins={[remarkGfm]} components={COMPONENTES_MARKDOWN} />
  </Markdown>
);

const AssistantMessage: FC = () => {
  const marca = useMarca();
  return (
  <AssistantRoot>
    {marca}
    <div>
    <MessagePrimitive.Parts components={{ Text, tools: { Fallback: HerramientaGenerica } }} />
    <ErrorRespuesta />
    <RespuestaDetenida />
    <FilaAcciones>
    <Ramas />
    <Actions hideWhenRunning autohide="not-last">
      <ActionBarPrimitive.Copy render={<BotonAccion label="Copiar" />}>
        <AuiIf condition={(s) => s.message.isCopied}><CheckIcon fontSize="inherit" /></AuiIf>
        <AuiIf condition={(s) => !s.message.isCopied}><ContentCopyIcon fontSize="inherit" /></AuiIf>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload render={<BotonAccion label="Regenerar" />}><RefreshIcon fontSize="inherit" /></ActionBarPrimitive.Reload>
    </Actions>
    </FilaAcciones>
    </div>
  </AssistantRoot>
  );
};

const UserMessage: FC = () => (
  <UserMessageRoot>
    <FilaPersona>
      <ActionBarPrimitive.Root hideWhenRunning autohide="not-last" className="acciones-persona">
        <ActionBarPrimitive.Edit render={<BotonAccion label="Editar" />}><EditOutlinedIcon fontSize="inherit" /></ActionBarPrimitive.Edit>
      </ActionBarPrimitive.Root>
      <UserBubble><MessagePrimitive.Parts /></UserBubble>
    </FilaPersona>
    <Ramas persona />
  </UserMessageRoot>
);

/** Editar un mensaje enviado, en su lugar. Avisa cuántas respuestas descarta; la versión original queda como rama anterior. */
const EditarMensaje: FC = () => {
  const descartadas = useAuiState((s) => s.thread.messages.slice(s.message.index + 1).filter((m) => m.role === "assistant").length);
  return (
    <MessagePrimitive.Root>
      <ComposerPrimitive.Root>
        <Edicion>
          <OutlinedInput fullWidth multiline autoFocus size="small" inputComponent={EntradaComposer} slotProps={{ input: { "aria-label": "Editar mensaje" } }} />
          {descartadas > 0 ? (
            <Typography variant="caption" color="text.secondary">{descartadas === 1 ? "Al enviar se descarta 1 respuesta" : `Al enviar se descartan ${descartadas} respuestas`}</Typography>
          ) : null}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <ComposerPrimitive.Cancel render={<Button size="small" />}>Cancelar</ComposerPrimitive.Cancel>
            <ComposerPrimitive.Send render={<Button size="small" variant="contained" />}>Enviar</ComposerPrimitive.Send>
          </div>
        </Edicion>
      </ComposerPrimitive.Root>
    </MessagePrimitive.Root>
  );
};

const Message: FC = () => (
  <>
    <AuiIf condition={(s) => s.message.role === "user" && !s.composer.isEditing}><UserMessage /></AuiIf>
    <AuiIf condition={(s) => s.message.role === "user" && s.composer.isEditing}><EditarMensaje /></AuiIf>
    <AuiIf condition={(s) => s.message.role !== "user"}><AssistantMessage /></AuiIf>
  </>
);

/** El campo del composer es un `OutlinedInput` de MUI (igual que los campos del producto); la primitiva pone la lógica del chat. */
// MUI pasa `value` (indefinido) y `type`: quitarlos deja el control del texto a la primitiva, que lo vacía al enviar.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- se descartan a propósito
const EntradaComposer = ({ inputRef, type: _type, style: _style, value: _value, defaultValue: _defaultValue, ...props }: InputBaseComponentProps) => (
  <ComposerPrimitive.Input ref={inputRef} minRows={1} maxRows={FILAS_MAX_INPUT} {...(props as object)} />
);

const Composer: FC = () => {
  const placeholder = useAuiState((s) => (s.thread.messages.length > 0 ? "¿Qué hacemos ahora?" : "¿Por dónde empezamos?"));
  return (
    <ComposerPrimitive.Root>
      <OutlinedInput
        fullWidth
        multiline
        autoFocus
        size="small"
        placeholder={placeholder}
        inputComponent={EntradaComposer}
        slotProps={{ input: { "aria-label": placeholder } }}
        endAdornment={
          <InputAdornment position="end" sx={{ alignSelf: "flex-end", height: "auto", maxHeight: "none" }}>
            <AuiIf condition={(s) => !s.composer.canCancel}>
              <ComposerPrimitive.Send render={<IconButton size="small" color="primary" aria-label="Enviar" />}><ArrowUpwardIcon fontSize="small" /></ComposerPrimitive.Send>
            </AuiIf>
            <AuiIf condition={(s) => s.composer.canCancel}>
              <ComposerPrimitive.Cancel render={<IconButton size="small" color="primary" aria-label="Detener" />}><StopIcon fontSize="small" /></ComposerPrimitive.Cancel>
            </AuiIf>
          </InputAdornment>
        }
      />
    </ComposerPrimitive.Root>
  );
};

/** Hilo de assistant-ui con piel MUI. Toda la lógica viene de las primitivas; todo el estilo, del tema de MUI del producto. */
export const Thread: FC = () => (
  <Root>
    <Viewport turnAnchor="top">
      <AvisoIA />
      <AuiIf condition={(s) => s.thread.isEmpty}><Inicios /></AuiIf>
      <ThreadPrimitive.Messages>{() => <Message />}</ThreadPrimitive.Messages>
      <Pensando />
      <Footer>
        <ThreadPrimitive.ScrollToBottom
          render={<IconButton size="small" aria-label="Ir al final" sx={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", bgcolor: "background.paper", boxShadow: 2, "&:disabled": { display: "none" } }} />}
        >
          <ArrowDownwardIcon fontSize="small" />
        </ThreadPrimitive.ScrollToBottom>
        <Composer />
      </Footer>
    </Viewport>
  </Root>
);
