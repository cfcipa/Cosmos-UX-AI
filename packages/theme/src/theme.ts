"use client";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { createTheme, type CSSObject } from "@mui/material/styles";
import type { CSSProperties } from "react";
import {
  ai, background, elevations, error, grey, info, ink, primary, scrim, secondary, success, text, tones, warning,
} from "./tokens";

// Augmentación de tipos: tonos de estado y paleta de IA viven en el tema.
declare module "@mui/material/styles" {
  interface Palette {
    tones: typeof tones;
    ai: typeof ai;
  }
  interface PaletteOptions {
    tones?: typeof tones;
    ai?: typeof ai;
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    /** Código en línea y en bloque (fuera de Cosmos: el hilo del asistente lo necesita). */
    code: CSSProperties;
  }
  interface TypographyVariantsOptions {
    code?: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    code: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    /** Contenedor con presencia de IA: borde, aura y sombra interior de `palette.ai`. */
    ai: true;
  }
}

/** Piezas del hilo del asistente que el tema gobierna: viven en `components.SincoAsistente.styleOverrides`. */
type PiezaAsistente = "viewport" | "pie" | "mensajePersona" | "mensajeAsistente" | "estadoHerramienta" | "markdown";

declare module "@mui/material/styles" {
  interface Components<Theme = unknown> {
    /** Hilo del asistente (assistant-ui): sus primitivas no traen estilo, así que cada pieza se viste desde aquí. */
    SincoAsistente?: {
      styleOverrides?: Partial<Record<PiezaAsistente, CSSObject | ((a: { theme: Theme }) => CSSObject)>>;
    };
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    /** Chip de filtro aplicado ("Proveedor: 3 seleccionados"): fondo primario claro y × que se aviva al pasar el cursor. */
    applied: true;
  }
}

const base = createTheme();
const shadows = [...base.shadows] as typeof base.shadows;
Object.entries(elevations).forEach(([i, v]) => (shadows[Number(i)] = v));

/**
 * Tema Cosmos para MUI v9. TODO valor visual sale de aquí: los componentes usan `variant`, `elevation`,
 * `palette` y `spacing` del tema, nunca px ni hex. Las variables CSS (--mui-*) quedan disponibles para CSS externo.
 */
export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: primary[500], light: primary[300], dark: primary[600], contrastText: "#fff" },
    secondary: { main: secondary[500], dark: secondary[900] },
    error: { main: error[500], dark: error[900] },
    warning: { main: warning[500], dark: warning[900] },
    info: { main: info[500], dark: info[900] },
    success: { main: success[500], dark: success[900] },
    grey,
    text,
    background,
    divider: "rgba(0,0,0,.12)",
    action: { hover: "rgba(16,24,64,.04)", selected: "rgba(16,24,64,.08)", disabled: "rgba(16,24,64,.26)", disabledBackground: "rgba(16,24,64,.12)" },
    tones,
    ai,
  },
  shape: { borderRadius: 4 },
  shadows,
  typography: {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    fontSize: 13,
    h1: { fontSize: "1.125rem", lineHeight: "1.5rem", fontWeight: 600, letterSpacing: 0 }, // 18/24 títulos de página
    h2: { fontSize: "1rem", lineHeight: "1.375rem", fontWeight: 600, letterSpacing: ".15px" }, // 16/22 títulos de sección
    subtitle1: { fontSize: ".875rem", lineHeight: "1.25rem", fontWeight: 500, letterSpacing: ".15px" }, // 14/20
    subtitle2: { fontSize: ".8125rem", lineHeight: "1rem", fontWeight: 500, letterSpacing: ".1px" }, // 13/16
    body1: { fontSize: ".875rem", lineHeight: "1.25rem", letterSpacing: ".15px" }, // 14/20 diálogos y formularios
    body2: { fontSize: ".8125rem", lineHeight: "1rem", letterSpacing: ".17px" }, // 13/16 base de la UI
    caption: { fontSize: ".6875rem", lineHeight: ".875rem", letterSpacing: ".4px" }, // 11/14 metadatos
    overline: { fontSize: ".6875rem", lineHeight: "1.5rem", letterSpacing: "1px", fontWeight: 500, textTransform: "uppercase" },
    code: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: ".75rem", lineHeight: "1rem" }, // 12/16 código
    button: { fontSize: ".8125rem", lineHeight: "1rem", fontWeight: 500, letterSpacing: ".1px", textTransform: "none" },
  },
  components: {
    // Hilo del asistente: forma, color y tipografía de cada pieza salen del tema, como en el resto de la aplicación.
    SincoAsistente: {
      styleOverrides: {
        viewport: ({ theme }) => ({ padding: theme.spacing(2), gap: theme.spacing(2) }),
        pie: ({ theme }) => ({ backgroundColor: theme.palette.background.paper, paddingBottom: theme.spacing(1.5) }),
        mensajePersona: ({ theme }) => ({
          maxWidth: "85%",
          padding: theme.spacing(1.25, 1.75),
          borderRadius: theme.spacing(2),
          backgroundColor: theme.palette.tones.primary.bg,
          color: theme.palette.text.primary,
          ...theme.typography.body1,
        }),
        // La IA se firma con su insignia a la izquierda de cada respuesta.
        mensajeAsistente: ({ theme }) => ({ columnGap: theme.spacing(1) }),
        estadoHerramienta: ({ theme }) => ({
          gap: theme.spacing(0.75),
          marginBlock: theme.spacing(0.5),
          color: theme.palette.text.secondary,
          ...theme.typography.caption,
          "& .MuiSvgIcon-root": { color: theme.palette.success.dark },
        }),
        markdown: ({ theme }) => ({ ...theme.typography.body1, overflowWrap: "anywhere" }),
      },
    },
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: background.default } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        sizeSmall: { fontSize: ".75rem", lineHeight: "1.125rem", letterSpacing: ".4px", padding: "4px 10px", minHeight: 26 },
      },
    },
    MuiChip: {
      styleOverrides: { sizeSmall: { height: 20, borderRadius: 4, fontSize: ".6875rem", letterSpacing: ".16px" } },
      variants: [
        {
          props: { variant: "applied" },
          style: {
            backgroundColor: tones.primary.bg, color: primary[500],
            "& .MuiChip-deleteIcon": { color: "inherit", opacity: 0.26, fontSize: "0.875rem", transition: "opacity .1s" },
            "&:hover .MuiChip-deleteIcon": { color: "inherit", opacity: 1 },
          },
        },
      ],
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({ ...theme.typography.caption, letterSpacing: ".4px", border: 0, borderRadius: 4, gap: theme.spacing(0.75), padding: "4px 8px", color: text.secondary }),
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { minWidth: 22, height: 22, margin: 0, padding: "0 6px", fontSize: ".75rem", color: text.secondary, borderRadius: 999 },
        page: { "&.Mui-selected": { backgroundColor: primary[50], color: primary[500], fontWeight: 500, "&:hover": { backgroundColor: primary[50] } } },
      },
    },
    MuiTabs: { styleOverrides: { root: { minHeight: 40 } } },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 40, padding: "9px 16px", borderRadius: "4px 4px 0 0",
          ...theme.typography.subtitle2, "&.Mui-selected": { backgroundColor: grey[50] },
        }),
      },
    },
    MuiDialog: { styleOverrides: { paper: { boxShadow: elevations[24] } }, defaultProps: {} },
    // El scrim es de los diálogos; el backdrop "invisible" (Popover/Menu) no debe oscurecer la pantalla.
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: scrim, "&.MuiBackdrop-invisible": { backgroundColor: "transparent" } } } },
    MuiPopover: { defaultProps: { elevation: 8 } },
    MuiMenu: { defaultProps: { elevation: 8 } },
    // Ítem de menú del prototipo (.mi): 36px, 16/24, casilla de 3px de padding.
    MuiMenuItem: {
      styleOverrides: {
        root: { minHeight: 36, padding: "6px 16px", gap: 8, fontSize: "1rem", lineHeight: 1.5, letterSpacing: ".15px", "& .MuiCheckbox-root": { padding: 3 } },
      },
    },
    MuiCheckbox: { defaultProps: { size: "small" } },
    // Presencia de IA en un contenedor generado (registro con datos extraídos).
    MuiPaper: {
      variants: [
        {
          props: { variant: "ai" },
          style: ({ theme }) => ({
            border: `1px solid ${ai.borderStrong}`,
            background: `linear-gradient(180deg, ${ai.auraStart}, ${ai.auraEnd} 160px), ${theme.palette.background.paper}`,
            boxShadow: `inset 0 1px 0 0 ${ai.innerShadow}, ${theme.shadows[1]}`,
          }),
        },
      ],
    },
    // El asterisco de obligatorio siempre es rojo (Cosmos), también cuando el campo no está en error.
    MuiFormLabel: { styleOverrides: { asterisk: { color: error[500] } } },
    MuiAlert: {
      variants: [
        { props: { severity: "success", variant: "standard" }, style: { backgroundColor: success[50], color: text.primary, "& .MuiAlert-icon": { color: success[900] } } },
      ],
    },
    // Tablas de detalle (conceptos, impuestos): filas de 34, encabezado gris, línea divisoria fina.
    MuiTableRow: {
      styleOverrides: {
        root: { "&.MuiTableRow-hover:hover, &.Mui-selected, &.Mui-selected:hover": { backgroundColor: primary[50] } },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({ ...theme.typography.body2, color: text.primary, borderBottom: `1px solid ${grey[200]}` }),
        sizeSmall: { padding: "0 8px", height: 34 },
        head: ({ theme }) => ({ ...theme.typography.caption, fontSize: ".75rem", color: text.secondary, backgroundColor: grey[100], whiteSpace: "nowrap" }),
      },
    },
    MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: ink, fontSize: ".625rem", lineHeight: ".875rem" } } },
    // Densidad Cosmos para todas las tablas: se define una vez y aplica a cada DataGrid.
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // Tipografía de celda = body2 (13/16, .17px) del prototipo: DataGrid la hereda del root, no de cada celda.
          border: 0,
          fontSize: ".8125rem",
          lineHeight: "1rem",
          letterSpacing: ".17px",
          "--DataGrid-t-header-background-base": grey[100],
          "& .MuiDataGrid-columnHeaders": { color: text.secondary },
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 400 },
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": { padding: "0 8px" },
          "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center", lineHeight: "1rem", borderColor: grey[200] },
          "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover": { backgroundColor: primary[50] },
        },
      },
    },
  },
});
