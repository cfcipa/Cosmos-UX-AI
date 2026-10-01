"use client";

import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/es";
import { useState } from "react";
import { isoDeDayjs, primerDiaDelMes, type Mes } from "../calendar";

/** Botón de texto que abre un calendario (MUI X, en español) y devuelve la fecha elegida en ISO. */
export function DatePopover({ trigger, mesInicial, onSelect }: { trigger: string; mesInicial: Mes; onSelect: (iso: string) => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <Button size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ minHeight: 0, p: 0 }}>{trigger}</Button>
      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateCalendar
            referenceDate={primerDiaDelMes(mesInicial)}
            onChange={(d) => {
              if (!d) return;
              onSelect(isoDeDayjs(d));
              setAnchor(null);
            }}
          />
        </LocalizationProvider>
      </Popover>
    </>
  );
}
