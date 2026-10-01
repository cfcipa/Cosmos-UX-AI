// Formato es-CO en un solo lugar. Las fechas viajan como ISO (yyyy-mm-dd) y se muestran dd/mm/yyyy.

const money = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "$ 1.345.678,00" */
export const formatMoney = (n: number) => `$ ${money.format(n)}`;

/** "27/09/2026" desde "2026-09-27". Sin objeto Date: no hay zonas horarias que estropeen el día. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** "1 día" / "3 días". */
export const pluralize = (n: number, singular: string, plural: string) =>
  `${n} ${n === 1 ? singular : plural}`;

/** Texto de vencimiento a partir de los días que faltan (negativo: ya venció). */
export function formatVence(dias: number | null | undefined): {
  texto: string;
  tone: "off" | "due" | "warn" | "ok";
} {
  if (dias == null) return { texto: "-", tone: "off" };
  if (dias < 0)
    return { texto: `hace ${pluralize(-dias, "día", "días")}`, tone: "due" };
  if (dias === 0) return { texto: "hoy", tone: "due" };
  if (dias === 1) return { texto: "mañana", tone: "due" };
  if (dias <= 3) return { texto: `${dias} días`, tone: "warn" };
  return { texto: `${dias} días`, tone: "ok" };
}

/** Rellena "{clave}" en un texto de copy: interpolar("¿Por qué {x}?", { x: "Retefuente" }). */
export const interpolar = (texto: string, vars: Record<string, string | number>) =>
  texto.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

/** "01/08/2026 → 31/08/2026" desde dos fechas ISO. */
export const formatPeriodo = (p: { desde: string; hasta: string } | null | undefined) =>
  p ? `${formatDate(p.desde)} → ${formatDate(p.hasta)}` : "-";
