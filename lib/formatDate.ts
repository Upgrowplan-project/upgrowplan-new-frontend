/**
 * [18.11 · владелец: «отображение даты 11/12/2026 мне не понятно → 12-Nov-2026 (про все места Monitoring, где видно дату)»]
 * Единый формат даты на экранах Monitoring и личного кабинета: день-месяц словом-год, без двусмысленности «месяц/день».
 * Было: new Date(x).toLocaleDateString() / toLocaleString() — формат браузера («11/12/2026» = 12 ноября у американской локали).
 * Время — 24 часа, часовой пояс браузера (как было). Пусто / не дата — «—».
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** «12-Nov-2026» */
export function fmtDate(value: string | number | Date | null | undefined): string {
  const d = toDate(value);
  return d ? `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()}` : "—";
}

/** «14:05» */
export function fmtTime(value: string | number | Date | null | undefined): string {
  const d = toDate(value);
  return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "—";
}

/** «12-Nov-2026 14:05» */
export function fmtDateTime(value: string | number | Date | null | undefined): string {
  const d = toDate(value);
  return d ? `${fmtDate(d)} ${fmtTime(d)}` : "—";
}
