"use client";

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
import { styled } from "@mui/material/styles";
import {
  ActionBarPrimitive, AuiIf, ComposerPrimitive, ErrorPrimitive, MessagePrimitive, ThreadPrimitive, useAuiState,
  type ToolCallMessagePartComponent,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import type { FC } from "react";
import { InsigniaIA } from "@sinco/ds";
import { EstadoHerramienta } from "./estado-herramienta";
import { Inicios } from "./inicios";
import { COMPONENTES_MARKDOWN } from "./markdown";
import textos from "./textos.json";

/** Filas máximas del campo de texto antes de hacer scroll. */
const FILAS_MAX_INPUT = 8;

// Las primitivas de assistant-ui vienen sin estilo. Aquí solo va la estructura (flex, scroll); forma, color y tipografía
// salen del tema (`components.SincoAsistente`), igual que en el resto de la aplicación.
const pieza = (slot: string) => ({ name: "SincoAsistente", slot });

const Root = styled(ThreadPrimitive.Root)({ display: "flex", flexDirection: "column", height: "100%" });
const Viewport = styled(ThreadPrimitive.Viewport, pieza("viewport"))({ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" });
const Footer = styled(ThreadPrimitive.ViewportFooter, pieza("pie"))({ position: "sticky", bottom: 0, marginTop: "auto" });
const UserMessageRoot = styled(MessagePrimitive.Root)({ display: "flex", flexDirection: "column" });
const UserBubble = styled("div", pieza("mensajePersona"))({ alignSelf: "flex-end" });
const AssistantRoot = styled(MessagePrimitive.Root, pieza("mensajeAsistente"))({ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "start" });
const Actions = styled(ActionBarPrimitive.Root)(({ theme }) => ({ display: "flex", gap: theme.spacing(0.25), marginTop: theme.spacing(0.5) }));
const Markdown = styled("div", pieza("markdown"))({});

const Text: FC = () => (
  <Markdown>
    <MarkdownTextPrimitive remarkPlugins={[remarkGfm]} components={COMPONENTES_MARKDOWN} />
  </Markdown>
);

/** Fallback de herramienta sin interfaz propia: una línea con su estado. */
const ToolFallback: ToolCallMessagePartComponent = ({ toolName, status }) => (
  <EstadoHerramienta terminada={status.type !== "running"}>{toolName}</EstadoHerramienta>
);

const ActionButton: FC<{ label: string; children?: React.ReactNode }> = ({ label, children }) => (
  <Tooltip title={label}>
    <IconButton size="small" aria-label={label}>{children}</IconButton>
  </Tooltip>
);

const AssistantMessage: FC = () => (
  <AssistantRoot>
    <InsigniaIA sx={{ mt: 0.25 }} />
    <div>
    <MessagePrimitive.Parts components={{ Text, tools: { Fallback: ToolFallback } }} />
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root>
        <Typography color="error" variant="body2"><ErrorPrimitive.Message /></Typography>
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
    <Actions hideWhenRunning autohide="not-last">
      <ActionBarPrimitive.Copy render={<ActionButton label={textos.copiar} />}>
        <AuiIf condition={(s) => s.message.isCopied}><CheckIcon fontSize="inherit" /></AuiIf>
        <AuiIf condition={(s) => !s.message.isCopied}><ContentCopyIcon fontSize="inherit" /></AuiIf>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload render={<ActionButton label={textos.regenerar} />}><RefreshIcon fontSize="inherit" /></ActionBarPrimitive.Reload>
    </Actions>
    </div>
  </AssistantRoot>
);

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
  const placeholder = useAuiState((s) => (s.thread.messages.length > 0 ? textos.placeholderSeguir : textos.placeholderInicio));
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
              <ComposerPrimitive.Send render={<IconButton size="small" color="primary" aria-label={textos.enviar} />}><ArrowUpwardIcon fontSize="small" /></ComposerPrimitive.Send>
            </AuiIf>
            <AuiIf condition={(s) => s.composer.canCancel}>
              <ComposerPrimitive.Cancel render={<IconButton size="small" color="primary" aria-label={textos.detener} />}><StopIcon fontSize="small" /></ComposerPrimitive.Cancel>
            </AuiIf>
          </InputAdornment>
        }
      />
    </ComposerPrimitive.Root>
  );
};

/** Hilo de assistant-ui con piel MUI. Toda la lógica viene de las primitivas; todo el estilo, del tema (`SincoAsistente`). */
export const Thread: FC = () => (
  <Root>
    <Viewport turnAnchor="top">
      <AuiIf condition={(s) => s.thread.isEmpty}><Inicios /></AuiIf>
      <ThreadPrimitive.Messages>{() => <Message />}</ThreadPrimitive.Messages>
      <Footer><Composer /></Footer>
    </Viewport>
  </Root>
);
