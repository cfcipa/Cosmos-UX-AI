"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import { SuggestionPrimitive, ThreadPrimitive, useAuiState } from "@assistant-ui/react";

/** Sugerencias del chat vacío, con las primitivas de assistant-ui; las define `Suggestions()` con la lista que el producto pasa a `<Asistente sugerencias>`. */
export function Inicios() {
  const hay = useAuiState((s) => s.suggestions.suggestions.length > 0);
  if (!hay) return null;
  return (
    <Box sx={{ mt: "auto", width: "100%" }}>
      <Typography variant="subtitle2" component="h3" sx={{ mb: 0.5, ml: 1 }}>¿En qué te ayudo?</Typography>
      <MenuList disablePadding>
        <ThreadPrimitive.Suggestions>
        {() => (
          <SuggestionPrimitive.Trigger send render={<MenuItem sx={{ borderRadius: 1, px: 1, typography: "body1", width: "100%" }} />}>
            <SuggestionPrimitive.Title />
          </SuggestionPrimitive.Trigger>
        )}
        </ThreadPrimitive.Suggestions>
      </MenuList>
    </Box>
  );
}
