"use client";

import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import { useAui } from "@assistant-ui/react";
import { usePantallaActual } from "./pantalla-actual";
import textos from "./textos.json";

/** Sugerencias del chat vacío: las que aporta la pantalla actual; al tocar una, se envía su prompt. Sin contrato, no hay sugerencias. */
export function Inicios() {
  const aui = useAui() as unknown as { thread: () => { append: (m: { role: "user"; content: Array<{ type: "text"; text: string }> }) => void } };
  const inicios = usePantallaActual().contrato?.inicios ?? [];
  if (!inicios.length) return null;
  return (
    <Box sx={{ mt: "auto", width: "100%" }}>
      <Typography variant="subtitle2" component="h3" sx={{ mb: 0.5, ml: 1 }}>{textos.inicios}</Typography>
      <MenuList disablePadding>
        {inicios.map((i) => (
          <MenuItem key={i.titulo} sx={{ borderRadius: 1, px: 1, typography: "body1" }} onClick={() => aui.thread().append({ role: "user", content: [{ type: "text", text: i.prompt }] })}>
            <ListItemIcon sx={{ color: `${i.color}.main` }}>{i.icono}</ListItemIcon>
            {i.titulo}
          </MenuItem>
        ))}
      </MenuList>
    </Box>
  );
}
