"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { BranchPickerPrimitive } from "@assistant-ui/react";
import type { ComponentProps, FC } from "react";

// La primitiva inyecta en el elemento de `render` su `onClick`, `disabled` y `ref`: hay que reenviarlos al botón.
export const BotonAccion: FC<ComponentProps<typeof IconButton> & { label: string }> = ({ label, children, ...props }) => (
  // MUI no admite un Tooltip sobre un botón deshabilitado: sin el rótulo visible, el botón conserva su `aria-label`.
  <Tooltip title={props.disabled ? "" : label}>
    <IconButton size="small" aria-label={label} {...props}>{children}</IconButton>
  </Tooltip>
);

const RamasRaiz = styled(BranchPickerPrimitive.Root)(({ theme }) => ({
  display: "inline-flex", alignItems: "center", color: theme.palette.text.secondary, ...theme.typography.caption,
  // «10 / 10» no mueve las flechas.
  "& .contador": { minWidth: "7ch", textAlign: "center", fontVariantNumeric: "tabular-nums" },
}));

/** Las versiones de un mensaje (regenerar o editar crea una rama): «n / m». Solo aparece si hay más de una. */
export const Ramas: FC<{ persona?: boolean }> = ({ persona }) => (
  <RamasRaiz hideWhenSingleBranch>
    <BranchPickerPrimitive.Previous render={<BotonAccion label={persona ? "Ver el mensaje anterior" : "Ver la respuesta anterior"} />}><ChevronLeftIcon fontSize="inherit" /></BranchPickerPrimitive.Previous>
    <span className="contador"><BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count /></span>
    <BranchPickerPrimitive.Next render={<BotonAccion label={persona ? "Ver el mensaje siguiente" : "Ver la respuesta siguiente"} />}><ChevronRightIcon fontSize="inherit" /></BranchPickerPrimitive.Next>
  </RamasRaiz>
);
