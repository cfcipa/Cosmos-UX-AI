"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import StopIcon from "@mui/icons-material/Stop";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import type { InputBaseComponentProps } from "@mui/material/InputBase";
import OutlinedInput from "@mui/material/OutlinedInput";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import {
  ActionBarPrimitive, AuiIf, ComposerPrimitive, ErrorPrimitive, MessagePrimitive, ThreadPrimitive, useAuiState,
  type ToolCallMessagePartComponent,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import type { ComponentProps, FC } from "react";
import { EstadoHerramienta } from "./estado-herramienta";
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
const AssistantRoot = styled(MessagePrimitive.Root, pieza("mensajeAsistente"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "start", columnGap: theme.spacing(1),
}));
const Actions = styled(ActionBarPrimitive.Root)(({ theme }) => ({ display: "flex", gap: theme.spacing(0.25), marginTop: theme.spacing(0.5) }));
const Markdown = styled("div", pieza("markdown"))(({ theme }) => ({ ...theme.typography.body1, overflowWrap: "anywhere" }));

const Text: FC = () => (
  <Markdown>
    <MarkdownTextPrimitive remarkPlugins={[remarkGfm]} components={COMPONENTES_MARKDOWN} />
  </Markdown>
);

/** Fallback de herramienta sin interfaz propia: una línea con su estado. */
const ToolFallback: ToolCallMessagePartComponent = ({ toolName, status }) => (
  <EstadoHerramienta terminada={status.type !== "running"}>{toolName}</EstadoHerramienta>
);

// La primitiva inyecta en el elemento de `render` su `onClick`, `disabled` y `ref`: hay que reenviarlos al botón.
const ActionButton: FC<ComponentProps<typeof IconButton> & { label: string }> = ({ label, children, ...props }) => (
  <Tooltip title={label}>
    <IconButton size="small" aria-label={label} {...props}>{children}</IconButton>
  </Tooltip>
);

/** Verdadero entre el envío y el primer fragmento de la respuesta (condición de la documentación de assistant-ui). */
const useEsperandoPrimerToken = () =>
  useAuiState((s) => {
    if (!s.thread.isRunning) return false;
    const ultimo = s.thread.messages.at(-1);
    return ultimo?.role === "assistant" && ultimo.parts.length === 0;
  });

const Generando: FC = () => {
  const esperando = useEsperandoPrimerToken();
  return esperando ? <EstadoHerramienta terminada={false}>Generando la respuesta…</EstadoHerramienta> : null;
};

const AssistantMessage: FC = () => {
  const marca = useMarca();
  return (
  <AssistantRoot>
    {marca}
    <div>
    <MessagePrimitive.Parts components={{ Text, tools: { Fallback: ToolFallback } }} />
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root>
        <Typography color="error" variant="body2"><ErrorPrimitive.Message /></Typography>
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
    <Actions hideWhenRunning autohide="not-last">
      <ActionBarPrimitive.Copy render={<ActionButton label="Copiar" />}>
        <AuiIf condition={(s) => s.message.isCopied}><CheckIcon fontSize="inherit" /></AuiIf>
        <AuiIf condition={(s) => !s.message.isCopied}><ContentCopyIcon fontSize="inherit" /></AuiIf>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload render={<ActionButton label="Regenerar" />}><RefreshIcon fontSize="inherit" /></ActionBarPrimitive.Reload>
    </Actions>
    </div>
  </AssistantRoot>
  );
};

const UserMessage: FC = () => (
  <UserMessageRoot>
    <UserBubble><MessagePrimitive.Parts /></UserBubble>
  </UserMessageRoot>
);

const Message: FC = () => (
  <>
    <AuiIf condition={(s) => s.message.role === "user"}><UserMessage /></AuiIf>
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
      <AuiIf condition={(s) => s.thread.isEmpty}><Inicios /></AuiIf>
      <ThreadPrimitive.Messages>{() => <Message />}</ThreadPrimitive.Messages>
      <Generando />
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
