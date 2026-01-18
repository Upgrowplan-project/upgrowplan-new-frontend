# Next.js Routing Setup - Social Plan Master

## 🔄 Как работает routing в Social Plan Master

### Архитектура

Social Plan Master использует **двух-уровневую архитектуру** для совместимости с `next-intl`:

```
[LOCATION 1] Components (Actual code)
└── app/solutions/socialPlanMaster/
    ├── page.ru.tsx                  (Компонент на русском)
    ├── page.en.tsx                  (Компонент на английском)
    ├── socialPlanMaster.module.css  (Стили)
    ├── labels.ts                    (Константы)
    └── ... (остальные файлы)

[LOCATION 2] Router (Next.js routing)
└── app/[locale]/solutions/socialPlanMaster/
    └── page.tsx                     (Wrapper - импортирует компоненты)
```

### Как это работает

#### Шаг 1: Пользователь открывает URL

```
User visits: http://localhost:3000/solutions/socialPlanMaster
```

#### Шаг 2: Next.js маршрутизация

```
URL matches: app/[locale]/solutions/socialPlanMaster/page.tsx
↓
Next.js automatically sets locale = "ru" (default) or "en"
↓
page.tsx wrapper получает params.locale
```

#### Шаг 3: Wrapper выбирает компонент

```tsx
// app/[locale]/solutions/socialPlanMaster/page.tsx
export default function SocialPlanMasterLocalePage({ params }: Params) {
  if (params.locale === "ru") {
    return <SocialPlanMasterPageRu />; // Russian component
  } else {
    return <SocialPlanMasterPageEn />; // English component
  }
}
```

#### Шаг 4: Компонент рендерится

```
For RU: app/solutions/socialPlanMaster/page.ru.tsx рендерится
For EN: app/solutions/socialPlanMaster/page.en.tsx рендерится
```

---

## 📍 URL Схема

### Russian URLs

```
http://localhost:3000/solutions/socialPlanMaster
│
└─→ [locale] = "ru" (default)
    └─→ app/[locale]/solutions/socialPlanMaster/page.tsx
        └─→ returns <SocialPlanMasterPageRu />
            └─→ from app/solutions/socialPlanMaster/page.ru.tsx
```

### English URLs

```
http://localhost:3000/en/solutions/socialPlanMaster
│
└─→ [locale] = "en"
    └─→ app/[locale]/solutions/socialPlanMaster/page.tsx
        └─→ returns <SocialPlanMasterPageEn />
            └─→ from app/solutions/socialPlanMaster/page.en.tsx
```

---

## 📂 File Tree

```
upgrowplan_new/
│
├─── app/
│    │
│    ├─── [locale]/          ← Dynamic locale parameter
│    │    │
│    │    ├─── layout.tsx    ← Root layout (includes Bootstrap, globals.css)
│    │    │
│    │    └─── solutions/
│    │         │
│    │         ├─── page.tsx (solutions index)
│    │         │
│    │         ├─── marketResearch/
│    │         │    └─── page.tsx (wrapper for market research)
│    │         │
│    │         └─── socialPlanMaster/
│    │              └─── page.tsx ← 🟢 OUR WRAPPER
│    │                  (imports from app/solutions/socialPlanMaster)
│    │
│    └─── solutions/         ← Actual components (no routing here)
│         │
│         ├─── marketResearch/
│         │    ├─── page.ru.tsx
│         │    ├─── page.en.tsx
│         │    └─── marketResearch.module.css
│         │
│         └─── socialPlanMaster/
│              ├─── page.ru.tsx        ← 🔴 Russian component
│              ├─── page.en.tsx        ← 🔴 English component
│              ├─── socialPlanMaster.module.css
│              ├─── labels.ts
│              ├─── ru.json
│              └─── ... (documentation)
```

---

## ⚙️ Конфигурация next-intl

### File: next-intl.config.js (или .mjs)

```javascript
module.exports = {
  locales: ["en", "ru"],
  defaultLocale: "ru",
  localePrefix: "as-needed", // '/solutions/...' для RU, '/en/solutions/...' для EN
};
```

### How it works:

- **Default locale (RU)**: URL без префикса: `/solutions/socialPlanMaster`
- **Other locales (EN)**: URL с префиксом: `/en/solutions/socialPlanMaster`

---

## 🔍 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Browser Request                                             │
│ GET http://localhost:3000/solutions/socialPlanMaster       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Next.js Router (App Router)                                │
│ Matches: app/[locale]/solutions/socialPlanMaster/page.tsx  │
│ Sets locale = "ru" (default)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Wrapper Component (page.tsx)                               │
│ Imports:                                                    │
│   - SocialPlanMasterPageRu from ../../../solutions/...     │
│   - SocialPlanMasterPageEn from ../../../solutions/...     │
│                                                             │
│ if locale === "ru":                                        │
│   return <SocialPlanMasterPageRu />                        │
│ else:                                                       │
│   return <SocialPlanMasterPageEn />                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Actual Component Rendered                                  │
│ For RU: app/solutions/socialPlanMaster/page.ru.tsx        │
│ For EN: app/solutions/socialPlanMaster/page.en.tsx        │
│                                                             │
│ Includes:                                                   │
│   - Form (9 fields)                                        │
│   - Polling logic                                          │
│   - Results display                                        │
│   - Styles (CSS Modules)                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ HTML Rendered in Browser                                   │
│ With styles from socialPlanMaster.module.css               │
│ With layout from app/[locale]/layout.tsx                   │
│ With globals from app/globals.css                          │
│ With Bootstrap from bootstrap/dist/css/bootstrap.min.css   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Как добавить новый язык (French example)

### 1. Создать компонент

```bash
# Копируем page.en.tsx
cp app/solutions/socialPlanMaster/page.en.tsx \
   app/solutions/socialPlanMaster/page.fr.tsx
# Затем отредактируем текст на французский
```

### 2. Обновить wrapper (page.tsx)

```tsx
// app/[locale]/solutions/socialPlanMaster/page.tsx
import SocialPlanMasterPageRu from "../../../solutions/socialPlanMaster/page.ru";
import SocialPlanMasterPageEn from "../../../solutions/socialPlanMaster/page.en";
import SocialPlanMasterPageFr from "../../../solutions/socialPlanMaster/page.fr"; // NEW

export default function SocialPlanMasterLocalePage({ params }: Params) {
  if (params.locale === "ru") {
    return <SocialPlanMasterPageRu />;
  } else if (params.locale === "fr") {
    return <SocialPlanMasterPageFr />; // NEW
  } else {
    return <SocialPlanMasterPageEn />;
  }
}
```

### 3. Обновить next-intl config

```javascript
// next-intl.config.js
module.exports = {
  locales: ["en", "ru", "fr"], // ADD 'fr'
  defaultLocale: "ru",
};
```

### 4. Test

```
http://localhost:3000/fr/solutions/socialPlanMaster
```

---

## 🔧 Troubleshooting

### Issue: 404 на странице /solutions/socialPlanMaster

**Причины:**

1. ❌ Файл `app/[locale]/solutions/socialPlanMaster/page.tsx` не создан
2. ❌ Wrapper не импортирует компоненты правильно
3. ❌ next-intl не сконфигурирован

**Решение:**

```bash
# Проверить, что wrapper существует
ls -la app/[locale]/solutions/socialPlanMaster/

# Должно быть:
# page.tsx (wrapper)

# Если нет - создать:
mkdir -p app/[locale]/solutions/socialPlanMaster
# И создать page.tsx (см. выше)
```

### Issue: Компонент не импортируется

**Причина:** Неправильный путь в import

```tsx
// ❌ WRONG
import SocialPlanMasterPageRu from "../../solutions/socialPlanMaster/page.ru";

// ✅ CORRECT
import SocialPlanMasterPageRu from "../../../solutions/socialPlanMaster/page.ru";
```

**Файловая структура для правильного пути:**

```
app/
├── [locale]/
│   ├── solutions/
│   │   └── socialPlanMaster/
│   │       └── page.tsx              ← Здесь находимся
│   │
│   └── (нужно подняться на 3 уровня: .. -> .. -> ..)
│
├── solutions/
│   └── socialPlanMaster/
│       ├── page.ru.tsx               ← Туда импортируем
│       └── page.en.tsx
```

---

## 📊 Сравнение с Market Research

Market Research использует **идентичную архитектуру**:

```
✅ app/solutions/marketResearch/          (components)
   ├── page.ru.tsx
   ├── page.en.tsx
   └── marketResearch.module.css

✅ app/[locale]/solutions/marketResearch/ (router)
   └── page.tsx
```

Social Plan Master следует **тому же паттерну**:

```
✅ app/solutions/socialPlanMaster/        (components)
   ├── page.ru.tsx
   ├── page.en.tsx
   └── socialPlanMaster.module.css

✅ app/[locale]/solutions/socialPlanMaster/ (router)
   └── page.tsx
```

---

## ✅ Verification Checklist

- [ ] ✅ File exists: `app/[locale]/solutions/socialPlanMaster/page.tsx`
- [ ] ✅ File exists: `app/solutions/socialPlanMaster/page.ru.tsx`
- [ ] ✅ File exists: `app/solutions/socialPlanMaster/page.en.tsx`
- [ ] ✅ page.tsx imports from correct paths (../../../)
- [ ] ✅ page.tsx handles locale === "ru" and else
- [ ] ✅ URL works: http://localhost:3000/solutions/socialPlanMaster
- [ ] ✅ URL works: http://localhost:3000/en/solutions/socialPlanMaster
- [ ] ✅ No console errors (F12 DevTools)
- [ ] ✅ Components render correctly
- [ ] ✅ Styles load from socialPlanMaster.module.css

---

## 🎯 Quick Reference

| Item            | Location                                                     |
| --------------- | ------------------------------------------------------------ |
| **Components**  | `app/solutions/socialPlanMaster/`                            |
| **Routing**     | `app/[locale]/solutions/socialPlanMaster/page.tsx`           |
| **Styles**      | `app/solutions/socialPlanMaster/socialPlanMaster.module.css` |
| **Russian URL** | `/solutions/socialPlanMaster`                                |
| **English URL** | `/en/solutions/socialPlanMaster`                             |
| **Config**      | `next-intl.config.js`                                        |

---

**Last Updated**: 13 января 2026  
**Status**: ✅ Routing Configured  
**Version**: 1.0.0
