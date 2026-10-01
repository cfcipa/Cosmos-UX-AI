"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/es";

const ISO = "YYYY-MM-DD";

/**
 * Calendario de un día que habla ISO (yyyy-mm-dd), sobre `DateCalendar` de MUI X (MIT), semana desde lunes.
 * `disponibles`: si se pasa, solo esos días se pueden elegir.
 */
export function Calendar({ value, onSelect, disponibles, mesInicial }: {
  value?: string | null;
  onSelect: (iso: string) => void;
  disponibles?: ReadonlySet<string>;
  /** Cualquier fecha ISO del mes que se muestra al abrir. Por defecto: el valor, el primer día disponible u hoy. */
  mesInicial?: string;
}) {
  const ref = value ?? mesInicial ?? (disponibles ? [...disponibles].sort()[0] : undefined);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DateCalendar
        value={value ? dayjs(value) : null}
        referenceDate={ref ? dayjs(ref) : undefined}
        onChange={(d) => d && onSelect(d.format(ISO))}
        shouldDisableDate={disponibles ? (d) => !disponibles.has(d.format(ISO)) : undefined}
      />
    </LocalizationProvider>
  );
}
