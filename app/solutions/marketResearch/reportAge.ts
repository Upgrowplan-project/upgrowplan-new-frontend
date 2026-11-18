/**
 * [18.11 · владелец: «если прошло много времени между формированием отчета и попыткой его скачать — показать переход в ЛК»]
 * Порог — из поведения сервера, а не на глаз: сервис исследований на Heroku Eco засыпает после ~30 мин без запросов и будит себя
 * ~20–30 с (wakeResearchServices.ts; 17.11 владелец: «очень долго работает функция скачивания»), через 4 ч забывает отчёт
 * (page.*.tsx, запасной путь через Monitoring). После 30 мин быстрее всего — раздел «Отчёты» личного кабинета.
 */
export const ACCOUNT_AFTER_MIN = 30;

/** Минут с момента готовности; сервер пишет время без пояса (UTC на проде) — такая строка читается как UTC. null — нет / не дата. */
export function minutesSince(iso: string | null | undefined, now: number = Date.now()): number | null {
  if (!iso) return null;
  const s = /[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? null : Math.max(0, (now - t) / 60000);
}
