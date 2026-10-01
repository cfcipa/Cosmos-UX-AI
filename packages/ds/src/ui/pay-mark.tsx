import Box from "@mui/material/Box";

/** Marca de franquicia (MC, VISA…) en miniatura. */
export function PayMark({ marca }: { marca: string }) {
  return (
    <Box
      component="span"
      sx={{
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 23, height: 16,
        borderRadius: "2px", border: 1, borderColor: "grey.200", bgcolor: "grey.100", color: "text.secondary",
        fontSize: 6, fontWeight: 700, letterSpacing: ".2px",
      }}
    >
      {marca}
    </Box>
  );
}
