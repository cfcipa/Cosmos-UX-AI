import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/** Nota con presencia de IA (aura azul degradada, de theme.palette.ai). */
export function AiNote({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(t) => ({
        display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, borderRadius: 1,
        background: `linear-gradient(90deg, ${t.palette.ai.auraStart}, ${t.palette.ai.auraEnd})`,
      })}
    >
      <AutoAwesomeIcon fontSize="small" color="primary" />
      <Typography variant="body2">{children}</Typography>
    </Box>
  );
}
