"use client";

import IconButton from "@mui/material/IconButton";
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material/styles";
import { useId, type ComponentProps } from "react";

/** Tamaños de los íconos de marca (px del prototipo): campos 16, filas de tabla 14. */
const TAMANOS = { md: 16, sm: 14 } as const;
export type TamanoMarca = keyof typeof TAMANOS;

type MarcaProps = Omit<SvgIconProps, "fontSize" | "children"> & {
  /** `md` (16) en campos y encabezados; `sm` (14) en filas de tabla. */
  tamano?: TamanoMarca;
};

/**
 * Insignia de IA de Cosmos: la "AI" con destellos dentro de un marco de degradado.
 * El degradado sale de `theme.palette.ai` (gradStart/gradMid/gradEnd); las letras heredan el color del texto.
 * @param tamano `md` (16) o `sm` (14).
 */
export function InsigniaIA({ tamano = "md", sx, ...rest }: MarcaProps) {
  const { palette, typography } = useTheme();
  const uid = useId().replace(/\W/g, "");
  const grad = `ia-g-${uid}`;
  const mask = `ia-m-${uid}`;
  return (
    <SvgIcon aria-hidden focusable="false" viewBox="0 0 24 24" sx={[{ fontSize: typography.pxToRem(TAMANOS[tamano]) }, ...(Array.isArray(sx) ? sx : [sx])]} {...rest}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor={palette.ai.gradStart} />
          <stop offset="0.48" stopColor={palette.ai.gradMid} />
          <stop offset="1" stopColor={palette.ai.gradEnd} />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="413" y="51" width="28" height="28">
          <path d="M440.636 60.0909H437.364H436.818V56.2727H417.727V74.8182H435.727V70.4545H440.636V78.0909H413.364V51.9091H440.636V60.0909Z" fill={palette.common.white} />
        </mask>
      </defs>
      <g transform="translate(-414.455 -53)">
        <path d="M438.713 64.0326L438.028 62.5248C437.878 62.1887 437.395 62.1887 437.244 62.5248L436.559 64.0326L435.052 64.7176C434.716 64.8727 434.716 65.3509 435.052 65.5017L436.559 66.1867L437.244 67.6946C437.399 68.0307 437.878 68.0307 438.028 67.6946L438.713 66.1867L440.221 65.5017C440.557 65.3466 440.557 64.8684 440.221 64.7176L438.713 64.0326Z" />
        <path d="M433.785 62.3485L433.39 63.2183C433.303 63.4121 433.024 63.4121 432.937 63.2183L432.542 62.3485L431.672 61.9534C431.479 61.864 431.479 61.5881 431.672 61.5011L432.542 61.106L432.937 60.2363C433.027 60.0425 433.303 60.0425 433.39 60.2363L433.785 61.106L434.654 61.5011C434.848 61.5906 434.848 61.8664 434.654 61.9534L433.785 62.3485Z" />
        <path d="M421.246 68.8963C420.894 68.8963 420.622 68.8003 420.43 68.6083C420.238 68.4083 420.142 68.1283 420.142 67.7683V61.3483C420.142 60.9803 420.238 60.7003 420.43 60.5083C420.622 60.3163 420.894 60.2203 421.246 60.2203C421.606 60.2203 421.878 60.3163 422.062 60.5083C422.254 60.7003 422.35 60.9803 422.35 61.3483V67.7683C422.35 68.1283 422.258 68.4083 422.074 68.6083C421.89 68.8003 421.614 68.8963 421.246 68.8963Z" />
        <path d="M424.877 68.8963C424.629 68.8963 424.421 68.8403 424.253 68.7283C424.085 68.6083 423.981 68.4483 423.941 68.2483C423.901 68.0403 423.937 67.8083 424.049 67.5523L427.037 61.1203C427.181 60.8083 427.357 60.5803 427.565 60.4363C427.781 60.2923 428.025 60.2203 428.297 60.2203C428.569 60.2203 428.805 60.2923 429.005 60.4363C429.213 60.5803 429.393 60.8083 429.545 61.1203L432.533 67.5523C432.661 67.8083 432.705 68.0403 432.665 68.2483C432.633 68.4563 432.533 68.6163 432.365 68.7283C432.205 68.8403 432.005 68.8963 431.765 68.8963C431.445 68.8963 431.197 68.8243 431.021 68.6803C430.853 68.5363 430.701 68.3043 430.565 67.9843L429.917 66.4603L430.757 67.0723H425.813L426.665 66.4603L426.017 67.9843C425.873 68.3043 425.725 68.5363 425.573 68.6803C425.421 68.8243 425.189 68.8963 424.877 68.8963ZM428.273 62.6323L426.881 65.9563L426.545 65.3803H430.037L429.701 65.9563L428.297 62.6323H428.273Z" />
        <g mask={`url(#${mask})`}>
          <rect x="415.205" y="53.75" width="22.5" height="22.5" rx="3.61364" stroke={`url(#${grad})`} strokeWidth="1.5" fill="none" />
        </g>
      </g>
    </SvgIcon>
  );
}

/**
 * Destello (dos estrellas) de la acción "Extraer con IA". Hereda el color del texto.
 * @param tamano `md` (16) o `sm` (14).
 */
export function Destello({ tamano = "md", sx, ...rest }: MarcaProps) {
  const { typography } = useTheme();
  return (
    <SvgIcon aria-hidden focusable="false" viewBox="0 0 24 24" sx={[{ fontSize: typography.pxToRem(TAMANOS[tamano]) }, ...(Array.isArray(sx) ? sx : [sx])]} {...rest}>
      <g transform="translate(-414.045 -131.045)">
        <path d="M428.898 142.101L427.691 139.444C427.425 138.851 426.575 138.851 426.309 139.444L425.102 142.101L422.445 143.309C421.853 143.582 421.853 144.425 422.445 144.691L425.102 145.898L426.309 148.556C426.583 149.148 427.425 149.148 427.691 148.556L428.898 145.898L431.556 144.691C432.148 144.417 432.148 143.574 431.556 143.309L428.898 142.101Z" />
        <path d="M422.759 139.759L422.276 140.822C422.17 141.059 421.83 141.059 421.724 140.822L421.241 139.759L420.178 139.276C419.941 139.167 419.941 138.83 420.178 138.724L421.241 138.241L421.724 137.178C421.833 136.941 422.17 136.941 422.276 137.178L422.759 138.241L423.822 138.724C424.059 138.833 424.059 139.17 423.822 139.276L422.759 139.759Z" />
      </g>
    </SvgIcon>
  );
}

type InsigniaBotonProps = Omit<ComponentProps<typeof IconButton>, "children" | "size"> & {
  /** `md` (16) en campos, `sm` (14) en filas de tabla. */
  tamano?: TamanoMarca;
  /** Texto accesible: qué explica la insignia ("Por qué se propuso este valor"). */
  label: string;
};

/**
 * Insignia de IA clicable junto a un valor propuesto. `onClick` suele abrir la explicabilidad
 * (`ExplicabilidadDrawer`). Sin `onClick` es solo decorativa.
 * @param label Texto accesible y tooltip nativo.
 * @param tamano `md` (16) o `sm` (14, sin relleno para caber en filas).
 */
export function InsigniaIABoton({ tamano = "md", label, sx, ...rest }: InsigniaBotonProps) {
  return (
    <IconButton
      aria-label={label}
      title={label}
      size="small"
      sx={[
        (t) => ({ color: t.palette.ai.borderStrong, p: tamano === "sm" ? 0 : 0.25, "&:hover": { bgcolor: t.palette.ai.hoverBackground } }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <InsigniaIA tamano={tamano} />
    </IconButton>
  );
}
