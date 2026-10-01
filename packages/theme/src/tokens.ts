// Tokens Cosmos UX. Única fuente de valores de color y forma:
// el tema de MUI se construye solo desde aquí; ningún componente escribe un hex.
/** Tono visual de un estado del negocio: el nombre; su color sale de `tones`. */
export type Tone = "primary" | "indigo" | "warning" | "error" | "info" | "secondary" | "success" | "neutral";

export const primary = { 50: "#f1f5fc", 100: "#e6edf9", 200: "#789fde", 300: "#4c82d9", 400: "#2464c9", 500: "#1053b7", 600: "#003d94", 700: "#002a6c" };
export const secondary = { 50: "#e0f7fa", 500: "#00bcd4", 900: "#0097b9" };
export const error = { 50: "#f9e8e8", 500: "#d14343", 900: "#b51e1e" };
export const warning = { 50: "#fff0e0", 500: "#fb8500", 900: "#f85500" };
export const info = { 50: "#e6f3f8", 500: "#2d9fc5", 900: "#1172a3" };
export const success = { 50: "#f2f9e7", 500: "#8fc93a", 900: "#60a918" };
export const indigo = { 50: "#e1e6ff", 500: "#2f43d0" };
export const grey = { 50: "#fbfbfb", 100: "#f5f5f6", 200: "#eaebec", 300: "#dcdee0", 400: "#ced1d4" };

export const text = { primary: "rgba(16,24,64,.87)", secondary: "rgba(16,24,64,.6)", disabled: "rgba(16,24,64,.38)" };
export const background = { default: "#f5f5f5", paper: "#ffffff" };
/** Tinta Sinco opaca (tooltips, superficies inversas). Fuera de Cosmos: sin token en el sistema. */
export const ink = "#101840";

/** Tono de un estado del negocio → colores del chip. Se lee desde theme.palette.tones. */
export const tones: Record<Tone, { bg: string; fg: string; sel: string }> = {
  primary: { bg: primary[50], fg: primary[500], sel: "rgba(16,83,183,.08)" },
  indigo: { bg: indigo[50], fg: indigo[500], sel: "rgba(47,67,208,.08)" },
  warning: { bg: warning[50], fg: warning[900], sel: "rgba(251,133,0,.10)" },
  error: { bg: error[50], fg: error[900], sel: "rgba(209,67,67,.10)" },
  info: { bg: info[50], fg: info[900], sel: "rgba(45,159,197,.12)" },
  secondary: { bg: secondary[50], fg: secondary[900], sel: "rgba(0,188,212,.14)" },
  success: { bg: success[50], fg: success[900], sel: "rgba(143,201,58,.16)" },
  neutral: { bg: grey[200], fg: text.secondary, sel: "rgba(16,24,64,.08)" },
};

/** Presencia de IA (borde, aura, insignia). Fuera de Cosmos como tokens; tomados del prototipo. */
export const ai = {
  borderStrong: "#2464c9",
  borderEnd: "#4c82d9",
  borderStart: "rgba(120,159,222,.64)",
  auraStart: "rgba(36,100,201,.1)",
  auraStartSm: "rgba(36,100,201,.16)",
  auraEnd: "rgba(255,255,255,0)",
  innerShadow: "rgba(36,100,201,.1)",
  hoverBackground: "#f1f5fc",
  /** Degradado del marco de la insignia de IA (fuera de Cosmos: tomado del prototipo). */
  gradStart: "#1053b7",
  gradMid: "#2464c9",
  gradEnd: "#00b6cf",
};

/** Velo de diálogos y carril del slider: sin token en Cosmos, nombrados aquí para que se vean. */
export const scrim = "rgba(16,24,64,.32)";
export const sliderRail = "rgba(16,83,183,.38)";

/** Elevaciones Material teñidas con la tinta Sinco: índice de MUI → sombra. */
export const elevations: Record<number, string> = {
  1: "0 2px 1px -1px rgba(16,24,64,.12), 0 1px 1px rgba(16,24,64,.084), 0 1px 3px rgba(16,24,64,.072)",
  // Fuera de Cosmos: punto medio entre 1 y 4, para el encabezado de la aplicación.
  2: "0 3px 1px -2px rgba(16,24,64,.12), 0 2px 2px rgba(16,24,64,.084), 0 1px 5px rgba(16,24,64,.072)",
  4: "0 2px 4px -1px rgba(16,24,64,.12), 0 4px 5px rgba(16,24,64,.084), 0 1px 10px rgba(16,24,64,.072)",
  6: "0 3px 5px -1px rgba(16,24,64,.12), 0 6px 10px rgba(16,24,64,.084), 0 1px 18px rgba(16,24,64,.072)",
  8: "0 5px 5px -3px rgba(16,24,64,.12), 0 8px 10px 1px rgba(16,24,64,.084), 0 3px 14px 2px rgba(16,24,64,.072)",
  16: "0 8px 10px -5px rgba(16,24,64,.12), 0 16px 24px 2px rgba(16,24,64,.084), 0 6px 30px 5px rgba(16,24,64,.072)",
  24: "0 11px 15px -7px rgba(16,24,64,.12), 0 24px 38px 3px rgba(16,24,64,.084), 0 9px 46px 8px rgba(16,24,64,.072)",
};
