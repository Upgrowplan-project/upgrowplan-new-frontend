# Backlog — upgrowplan_new (сайт)

## TS-BASELINE · 28 ошибок TypeScript, существовавших до 25.10.2026

**Найдено:** 25.10.2026 при проверке правки «В + Г» (страница исследования рынка будит сервисы и показывает
«Сервис запускается…»). Эта правка ошибок не добавила и не убрала: на `fbaa17b` до неё и после — по 28 строк
`error TS`, в изменённых файлах ошибок 0.

**Как воспроизвести:** `npx tsc --noEmit -p .` (код выхода 2).

**Оговорка к счёту:** после любого `next dev` / `next build` появляется ещё одна ошибка в сгенерированном файле
`.next/types/app/layout.ts` (TS2344, тот же корень, что п.10 — экспорт `viewport` из `app/layout.tsx`). Папка `.next`
не в git. Сравнивать по исходникам: число строк `error TS`, у которых путь не начинается с `.next/` (база 28).

**Почему не ломает выкладку:** `next.config.js:4` — `typescript: { ignoreBuildErrors: true }` (и `eslint:
{ ignoreDuringBuilds: true }`). Vercel собирает сайт, не проверяя типы, поэтому новые ошибки типов тоже не видны
никому — это не исправленная проблема, а выключенный прибор.

**Решение после исправления:** убрать `ignoreBuildErrors`, чтобы сборка краснела на новой ошибке типов
(вернуть прибор). До этого — сравнивать число ошибок до/после каждой правки (база: 28).

| # | Файл | Строки | Код | Суть |
|---|------|--------|-----|------|
| 1 | `app/[locale]/page.en.tsx` | 642, 647 | TS2345 | `speaker` — `string` вместо `"skeptic" \| "avatar"` в `setState` |
| 2 | `app/[locale]/page.ru.tsx` | 772, 777 | TS2345 | то же, что п.1 |
| 3 | `app/[locale]/page.ru.tsx` | 793 | TS2367 | сравнение `"ru"` с `"en"` — ветка никогда не выполняется |
| 4 | `app/[locale]/solutions/businessPulse/page.en.tsx` | 329 | TS2345 | `Map \| null` передаётся туда, где ждут `Map` |
| 5 | `app/[locale]/solutions/businessPulse/page.ru.tsx` | 330 | TS2345 | то же, что п.4 |
| 6 | `app/[locale]/solutions/planMaster/page.en.tsx` | 155 | TS2741 | не передан обязательный `sessionId` |
| 7 | `app/[locale]/solutions/planMaster/page.ru.tsx` | 155 | TS2741 | то же, что п.6 |
| 8 | `app/[locale]/solutions/synthFocusLab/components/HealthCheck.tsx` | 120 | TS2345 | `string` вместо `"offline" \| "online" \| "checking"` |
| 9 | `app/blog/AdminBlogPanel.tsx` | 192 | TS2322 | `RefObject<HTMLTextAreaElement \| null>` вместо `RefObject<HTMLTextAreaElement>` |
| 10 | `app/layout.tsx` | 2 | TS2614 | в установленной версии `next` нет экспорта `Viewport` |
| 11 | `app/monitoring/components/RatingsDashboard.tsx` | 319 | TS2322 | набор данных `type: "bar"` в графике типа `line` |
| 12 | `app/solutions/synthFocusLab/page.ru.tsx` | 371, 375, 790, 796, 810, 832, 838, 844, 850, 856, 912 | TS2367 | сравнение `IndustryCategory` / `TargetAudienceType` с `""` — проверки «не выбрано» никогда не срабатывают |
| 13 | `app/solutions/synthFocusLab/page.ru.tsx` | 565, 566, 567 | TS2339 | у `ResearchStatus` нет полей `created_at` / `updated_at` |

Итого строк `error TS`: 2+2+1+1+1+1+1+1+1+1+1+11+4 = 28 (п.13 — 4 ошибки на 3 строках).

**Не проверено:** какие из ошибок дают видимый сбой у пользователя. Пп. 3 и 12 похожи на мёртвые проверки
(условие всегда ложно), п.6–7 — на запуск без `sessionId`; нужна ручная проверка страниц.
