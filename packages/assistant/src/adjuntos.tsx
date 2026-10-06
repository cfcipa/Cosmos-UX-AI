"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { alpha, styled } from "@mui/material/styles";
import { AttachmentPrimitive, AuiIf, ComposerPrimitive, MessagePrimitive, useAuiEvent, useAuiState } from "@assistant-ui/react";
import { useState, type FC } from "react";
import { BotonAccion } from "./acciones-mensaje";

const Ficha = styled(AttachmentPrimitive.Root)(({ theme }) => ({
  display: "inline-flex", alignItems: "center", gap: theme.spacing(0.75), maxWidth: theme.spacing(28), padding: theme.spacing(0.5, 0.5, 0.5, 1),
  border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius, color: theme.palette.text.primary, ...theme.typography.caption,
  "& .nombre": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  "& .MuiSvgIcon-root": { flexShrink: 0 },
}));

const Imagen = styled("img")(({ theme }) => ({ display: "block", maxWidth: theme.spacing(24), maxHeight: theme.spacing(16), borderRadius: theme.shape.borderRadius }));

function EstadoAdjunto() {
  const subiendo = useAuiState((s) => s.attachment.status.type === "running");
  return subiendo ? <CircularProgress size="1em" color="inherit" /> : <InsertDriveFileOutlinedIcon fontSize="inherit" color="action" />;
}

/** Los archivos que se van a enviar, sobre el texto del composer. Quitar uno antes de enviar es de la persona. */
export const AdjuntosComposer: FC = () => (
  <ComposerPrimitive.Attachments>
    {() => (
      <Ficha>
        <EstadoAdjunto />
        <span className="nombre"><AttachmentPrimitive.Name /></span>
        <AttachmentPrimitive.Remove render={<BotonAccion label="Quitar adjunto" sx={{ p: 0.25 }} />}><CloseIcon fontSize="inherit" /></AttachmentPrimitive.Remove>
      </Ficha>
    )}
  </ComposerPrimitive.Attachments>
);

/** «+» de la barra del composer. Solo aparece si el runtime tiene un adaptador de adjuntos. `alAdjuntar` se suma al clic (la píldora abre el asistente). */
export const BotonAdjuntar: FC<{ alAdjuntar?: () => void }> = ({ alAdjuntar }) => (
  <AuiIf condition={(s) => s.thread.capabilities.attachments}>
    <ComposerPrimitive.AddAttachment render={<BotonAccion label="Adjuntar archivo" onClick={alAdjuntar} />}><AddIcon fontSize="small" /></ComposerPrimitive.AddAttachment>
  </AuiIf>
);

/** Los archivos de un mensaje ya enviado (solo lectura): la imagen, o una ficha con el nombre. */
export const AdjuntosMensaje: FC = () => (
  <MessagePrimitive.Attachments>
    {({ attachment }) => {
      const imagen = attachment.content?.find((p) => p.type === "image");
      if (imagen && imagen.type === "image") return <Imagen src={imagen.image} alt={attachment.name} />;
      return (
        <Ficha>
          <InsertDriveFileOutlinedIcon fontSize="inherit" color="action" />
          <span className="nombre"><AttachmentPrimitive.Name /></span>
        </Ficha>
      );
    }}
  </MessagePrimitive.Attachments>
);

const MOTIVOS = {
  "no-adapter": "Este asistente no admite archivos.",
  "not-accepted": "Ese tipo de archivo no se puede adjuntar.",
  "adapter-error": "No se pudo adjuntar el archivo.",
} as const;

/** Avisa por qué no se adjuntó un archivo (evento `composer.attachmentAddError` de assistant-ui). */
export const AvisoAdjuntoFallido: FC = () => {
  const [aviso, setAviso] = useState<string | null>(null);
  useAuiEvent("composer.attachmentAddError", ({ reason, message }) => setAviso(message || MOTIVOS[reason as keyof typeof MOTIVOS] || MOTIVOS["adapter-error"]));
  return <Snackbar open={aviso !== null} autoHideDuration={4000} onClose={() => setAviso(null)} message={aviso} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} sx={{ position: "absolute" }} />;
};

/** El velo que cubre el composer mientras se arrastra un archivo encima (`data-dragging` de la primitiva). */
export const ZonaSoltar = styled(ComposerPrimitive.AttachmentDropzone)(({ theme }) => ({
  position: "relative",
  "&[data-dragging] .MuiOutlinedInput-root": { backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity) },
  "&[data-dragging] .MuiOutlinedInput-notchedOutline": { borderStyle: "dashed", borderColor: theme.palette.primary.main },
  "&[data-dragging]::after": {
    content: '"Suelta los archivos para adjuntarlos"', position: "absolute", inset: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
    borderRadius: theme.shape.borderRadius, backgroundColor: alpha(theme.palette.background.paper, 0.94), color: theme.palette.primary.main, ...theme.typography.subtitle1,
  },
}));
