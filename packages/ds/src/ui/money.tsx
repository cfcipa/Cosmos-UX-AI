import Typography, { type TypographyProps } from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { formatMoney } from "../format";

/** Monto con su moneda en pequeño: "$ 1.345.678,00 COP". */
export function Money({ value, currency, sx, variant = "body2" }: { value: number; currency?: string; sx?: SxProps<Theme>; variant?: TypographyProps["variant"] }) {
  return (
    <Typography component="span" variant={variant} sx={[{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {formatMoney(value)}
      {currency && (
        <Typography component="span" variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>
          {currency}
        </Typography>
      )}
    </Typography>
  );
}
