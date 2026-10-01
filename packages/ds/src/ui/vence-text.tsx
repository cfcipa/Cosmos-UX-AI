import Typography from "@mui/material/Typography";
import { formatVence } from "../format";

/** Tono del texto de vencimiento (formatVence) -> color del tema. */
const COLOR = { off: "text.disabled", due: "error.dark", warn: "warning.dark", ok: "text.primary" } as const;

/** "hace 2 días" / "hoy" / "5 días", coloreado según la urgencia. Reutilizable en anticipos y extractos. */
export function VenceText({ dias }: { dias: number | null | undefined }) {
  const v = formatVence(dias);
  return <Typography component="span" variant="body2" noWrap sx={{ color: COLOR[v.tone] }}>{v.texto}</Typography>;
}
