"use client";

import Chip from "@mui/material/Chip";
import type { ReactNode } from "react";
import type { Tone } from "@sinco/theme";

/** Chip de estado: el color sale de theme.palette.tones, no de una clase por estado. */
export function StatusChip({ tone, label }: { tone: Tone; label: ReactNode }) {
  return (
    <Chip
      size="small"
      label={label}
      sx={(t) => ({
        height: 20,
        fontSize: 11,
        borderRadius: 1,
        bgcolor: t.palette.tones[tone].bg,
        color: t.palette.tones[tone].fg,
      })}
    />
  );
}
