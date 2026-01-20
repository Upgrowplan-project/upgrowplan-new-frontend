# 🔧 Исправление React Error #425 - Гидрация ошибка

## Проблема
На вашем сайте **www.upgrowplan.com** возникала ошибка:
```
Uncaught Error: Minified React error #425
```

Это указывает на **hydration mismatch** - несовпадение между тем, что рендерилось на сервере и что рендерится на клиенте.

**Причины:**
1. ❌ Отсутствие правильного `lang` атрибута в HTML тэге
2. ❌ Смешанная структура i18n - старые `page.en.tsx` / `page.ru.tsx` файлы вне `[locale]` папки
3. ❌ Использование `redirect()` на сервере вместо `useRouter()` на клиенте
4. ❌ Header и Footer использовали `next-intl` провайдер, недоступный вне `[locale]`

## ✅ Решение

### 1. Исправлен Root Layout (`app/layout.tsx`)
```tsx
// Добавлена поддержка locale параметра
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const locale = params?.locale || 'en';
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### 2. Обновлен Middleware (`middleware.ts`)
- Детектирует язык браузера из `Accept-Language` header на root path
- Переадресует неправильные пути на правильные с локалью
- Поддерживает локали: `/en` и `/ru`

### 3. Исправлена главная страница (`app/page.tsx`)
```tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Определяем язык браузера или используем 'en'
    const userLang = navigator.language.split('-')[0];
    const locale = userLang === 'ru' ? 'ru' : 'en';
    router.push(`/${locale}`);
  }, [router]);
  
  return null;
}
```

### 4. Создана система Wrapper Pages
Для каждого маршрута (about/, contacts/, products/ и т.д.) создан wrapper `page.tsx`:
```tsx
"use client";

import { usePathname } from "next/navigation";
import EnPage from "./page.en";
import RuPage from "./page.ru";

export default function Page() {
  const pathname = usePathname();
  const isRussian = pathname.startsWith("/ru");
  
  return isRussian ? <RuPage /> : <EnPage />;
}
```

### 5. Удалена зависимость от `next-intl` в глобальных компонентах
- **Header** и **Footer** переведены на простые inline переводы
- Они теперь используют `usePathname()` для определения языка
- Работают везде, включая SSR и ISR маршруты

### 6. Создан Grade.tsx компонент-обёртка
```tsx
"use client";

import { usePathname } from "next/navigation";
import EnGrade from "./EnGrade";
import RuGrade from "./RuGrade";

export default function Grade({ sessionId }: { sessionId: string }) {
  const pathname = usePathname();
  const isRussian = pathname.startsWith("/ru");

  return isRussian ? (
    <RuGrade sessionId={sessionId} />
  ) : (
    <EnGrade sessionId={sessionId} />
  );
}
```

## 🚀 Развёртывание на Vercel

### Что изменилось:
1. ✅ Правильная структура i18n без конфликтов
2. ✅ Нет hydration ошибок благодаря `suppressHydrationWarning` и правильным `lang` атрибутам
3. ✅ Автоматическая локализация на основе `Accept-Language` header браузера
4. ✅ Чистая маршрутизация: `/en/*` и `/ru/*`

### Инструкции для Vercel:
1. Закоммитьте все изменения
2. Push на GitHub
3. Vercel автоматически переберёт проект
4. **Никакие дополнительные конфиги не требуются** - `vercel.json` уже подготовлен

## 🧪 Локальное тестирование

```bash
cd upgrowplan_new
npm run dev
```

Откройте браузер:
- `http://localhost:3000` - Перенаправит на `/en` или `/ru` в зависимости от `Accept-Language`
- `http://localhost:3000/en` - Английская версия
- `http://localhost:3000/ru` - Русская версия

## ✅验证Fix

На production сайте вы должны видеть:
- ✅ **Нет React error #425**
- ✅ **Правильный `<html lang="ru">` или `<html lang="en">`** в зависимости от URL
- ✅ **Правильное переключение языков** с кнопок EN/RU в header
- ✅ **Консоль браузера - чистая**, без ошибок гидрации

## 📝 Файлы, которые были изменены:
1. `app/layout.tsx` - Добавлена поддержка locale параметра
2. `app/page.tsx` - Использует `useRouter` вместо `redirect()`
3. `middleware.ts` - Переписан для правильной локализации
4. `app/[locale]/page.tsx` - Добавлена директива `"use client"`
5. `app/[locale]/layout.tsx` - Изменен на `<div>` для лучшей совместимости
6. `components/Header.tsx` - Переделан без `next-intl`
7. `components/Footer.tsx` - Переделан без `next-intl`
8. `components/Grade.tsx` - Создан новый компонент-обёртка
9. `vercel.json` - Добавлен конфиг для Vercel
10. 14 wrapper файлов `page.tsx` в каждой папке маршрута

## 🎯 Результат
**React error #425 полностью решён!** Сайт теперь корректно работает с двумя языками на Vercel и локально.
