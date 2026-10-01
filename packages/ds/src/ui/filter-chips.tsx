"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import type { Tone } from "@sinco/theme";

export type FilterChip = { key: string; label: string; count: number; tone: Tone };

/** Grupo de estados con contador. El seleccionado toma el tono del estado (theme.palette.tones). */
export function FilterChips({ chips, value, onChange, label }: { chips: FilterChip[]; value: string; onChange: (k: string) => void; label: string }) {
  return (
    <Box role="group" aria-label={label} sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, bgcolor: "grey.50", borderRadius: 1, p: 0.5 }}>
      {chips.map((c) => {
        const on = c.key === value;
        return (
          <ButtonBase
            key={c.key}
            aria-pressed={on}
            onClick={() => onChange(c.key)}
            sx={(t) => ({
              display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: "2px", fontSize: 11,
              color: on ? t.palette.tones[c.tone].fg : "text.secondary",
              bgcolor: on ? t.palette.tones[c.tone].sel : "transparent",
              fontWeight: on ? 500 : 400,
              "&:hover": { bgcolor: on ? t.palette.tones[c.tone].sel : "action.hover" },
            })}
          >
            {c.label}
            <Box
              component="span"
              sx={(t) => ({
                fontSize: 11,
                ...(on ? { bgcolor: t.palette.tones[c.tone].fg, color: t.palette.tones[c.tone].bg, borderRadius: 10, px: "5px", py: "2px", lineHeight: "11px" } : { color: "text.disabled" }),
              })}
            >
              {c.count}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
