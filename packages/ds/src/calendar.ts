import dayjs, { type Dayjs } from "dayjs";
// Utilidades de calendario sin Date-zona: trabajan con año/mes/día y ISO (yyyy-mm-dd).

export type Mes = { anio: number; mes: number }; // mes: 0-11

/** Celdas del mes en filas de 7, semana desde lunes. null = celda vacía. */
export function semanasDelMes({ anio, mes }: Mes): (number | null)[][] {
  const inicio = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const dias = new Date(anio, mes + 1, 0).getDate();
  const celdas: (number | null)[] = [...Array(inicio).fill(null), ...Array.from({ length: dias }, (_, i) => i + 1)];
  while (celdas.length % 7) celdas.push(null);
  return Array.from({ length: celdas.length / 7 }, (_, r) => celdas.slice(r * 7, r * 7 + 7));
}

export const desplazarMes = ({ anio, mes }: Mes, delta: number): Mes => {
  const t = anio * 12 + mes + delta;
  return { anio: Math.floor(t / 12), mes: ((t % 12) + 12) % 12 };
};

export const aIso = ({ anio, mes }: Mes, dia: number) =>
  `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

export const mesDeIso = (iso: string): Mes => {
  const [y, m] = iso.split("-").map(Number);
  return { anio: y, mes: m - 1 };
};

/** "1.234.567,89" o "1234567.89" → número; null si no es válido. */
export function parseMonto(texto: string): number | null {
  const t = texto.trim().replace(/[^\d.,]/g, "");
  if (!t) return null;
  const hasComa = t.includes(",");
  const normal = hasComa ? t.replace(/\./g, "").replace(",", ".") : /^\d{1,3}(\.\d{3})+$/.test(t) ? t.replace(/\./g, "") : t;
  const n = Number(normal);
  return Number.isFinite(n) ? n : null;
}

/** Mes siguiente al de una fecha ISO (el pago sigue al cierre del período); sin fecha, el mes actual. */
export const mesSiguienteDeIso = (iso: string | null | undefined): Mes => {
  if (iso) return desplazarMes(mesDeIso(iso), 1);
  const hoy = new Date();
  return { anio: hoy.getFullYear(), mes: hoy.getMonth() };
};

/** Mes de calendario → primer día como fecha de dayjs (para el mes inicial de un DateCalendar). */
export const primerDiaDelMes = ({ anio, mes }: Mes) => dayjs(new Date(anio, mes, 1));

/** Fecha de dayjs → ISO (yyyy-mm-dd). */
export const isoDeDayjs = (d: Dayjs) => d.format("YYYY-MM-DD");
