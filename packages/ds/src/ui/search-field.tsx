"use client";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

/** Ancho máximo del buscador en línea (diseño). */
const ANCHO_MAXIMO = 52.5;

/** Buscador en línea de un panel. */
export function SearchField({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  return (
    <Box sx={(t) => ({ maxWidth: t.spacing(ANCHO_MAXIMO), px: 2, pb: 0.5 })}>
      <TextField
        autoFocus
        fullWidth
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        slotProps={{
          htmlInput: { "aria-label": label },
          input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> },
        }}
      />
    </Box>
  );
}
