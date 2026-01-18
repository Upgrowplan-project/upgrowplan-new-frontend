# Social Plan Master - Frontend Documentation

## 📋 Обзор

**Social Plan Master** - это фронтенд страница для генерации социального плана бизнеса с использованием синтеза LLM и анализа рынка.

Страница расположена в папке: `app/solutions/socialPlanMaster/`

## 📁 Структура файлов

**Компоненты** (в `app/solutions/socialPlanMaster/`):

```
├── page.ru.tsx                    # Основной компонент (русский)
├── page.en.tsx                    # Основной компонент (английский)
├── socialPlanMaster.module.css    # Стили компонента
├── labels.ts                      # Константы и метки
├── ru.json                        # Локализация (JSON)
└── page_backup.txt                # Документация и резервная копия
```

**Роутер** (в `app/[locale]/solutions/socialPlanMaster/`):

```
└── page.tsx                       # Wrapper для i18n (импортирует RU/EN)
```

## 🌐 Маршруты

- **Русская версия**: `http://localhost:3000/solutions/socialPlanMaster` → `page.ru.tsx`
- **Английская версия**: `http://localhost:3000/en/solutions/socialPlanMaster` → `page.en.tsx`
- **Auto-routing**: `app/[locale]/solutions/socialPlanMaster/page.tsx` (wrapper)

## ⚙️ Интеграция с бэкендом

### API Endpoints

Страница взаимодействует с бэкенд сервисом на порту **8004** (social-plan-master):

#### 1. Запуск синтеза

```
POST http://localhost:8004/api/synthesis/plan
Content-Type: application/json

{
  "business_idea": "string",
  "target_market": "string",
  "business_category": "string",
  "region": "string",
  "business_types": ["B2B", "B2C"],
  "product_types": ["retail_fmcg", "electronics"],
  "initial_investment": 1000000,
  "planned_headcount": 5,
  "has_social_impact": true
}

Response:
{
  "synthesis_id": "uuid",
  "status": "pending",
  "progress": 0,
  "current_stage": "initializing"
}
```

#### 2. Получение статуса

```
GET http://localhost:8004/api/synthesis/{synthesis_id}

Response:
{
  "synthesis_id": "uuid",
  "status": "in_progress|completed|failed",
  "progress": 0-100,
  "current_stage": "string",
  "error": "string (optional)"
}
```

#### 3. Получение результата

```
GET http://localhost:8004/api/synthesis/{synthesis_id}/result

Response:
{
  "synthesis_id": "uuid",
  "status": "string",
  "market_research_quality": "high|medium|low",
  "warnings": ["string"],
  "tech_chain": { ...JSON... },
  "marketing_plan": { ...JSON... },
  "social_analysis": { ...JSON... },
  "docx_path": "/path/to/file.docx",
  "created_at": "ISO8601 timestamp"
}
```

#### 4. Скачивание документа

```
GET http://localhost:8004/api/synthesis/download/{synthesis_id}

Response: File (DOCX)
```

#### 5. Health Check (опционально)

```
GET http://localhost:8004/api/health

Response:
{
  "status": "healthy",
  "service": "synthesis-service"
}
```

## 🎨 Функционал страницы

### Форма (Form State)

- **Business Idea**: Описание бизнес-идеи
- **Target Market**: Целевой рынок и аудитория
- **Business Category**: Категория бизнеса (free text)
- **Region**: Географический регион
- **Business Types**: Toggle selection (B2B, B2C, B2B2C, C2C, D2C)
- **Product Types**: Toggle selection (26+ категорий)
- **Initial Investment**: Начальные инвестиции в рублях/долларах
- **Planned Headcount**: Численность команды
- **Has Social Impact**: Чекбокс для социального воздействия

### Процесс выполнения (Polling)

1. Пользователь отправляет форму
2. Фронтенд делает POST запрос → получает `synthesis_id`
3. Запускается polling каждые 2 секунды (GET /api/synthesis/{id})
4. Отображается progress bar, текущий этап
5. При `status: "completed"` → GET /api/synthesis/{id}/result
6. Результаты отображаются в табах (Overview, Tech, Marketing, Social)
7. Опция скачать DOCX или начать заново

### Результаты (Results Display)

- **Overview Tab**: ID, статус, качество данных, предупреждения
- **Technology Tab**: JSON с технологической цепью
- **Marketing Tab**: JSON с планом маркетинга
- **Social Tab**: JSON с социальным анализом

## 🎯 Стилизация

Все стили находятся в `socialPlanMaster.module.css`:

### Основные классы

| Класс                  | Назначение                              |
| ---------------------- | --------------------------------------- |
| `.container`           | Главный контейнер (min-height: 100vh)   |
| `.hero`                | Hero секция с заголовком                |
| `.card`                | Основная карточка с белым фоном и тенью |
| `.form`                | Контейнер формы                         |
| `.section`             | Раздел формы                            |
| `.toggleButton`        | Кнопка выбора (B2B, B2C и т.д.)         |
| `.toggleButton.active` | Активная кнопка (синий фон)             |
| `.progressCard`        | Карточка с progress bar                 |
| `.resultCard`          | Карточка результата                     |
| `.tab` / `.activeTab`  | Вкладки результатов                     |

### Цветовая схема

- **Primary**: `#1e6078` (тёмно-синий)
- **Accent**: `#0785f6` (светло-синий)
- **Error**: `#ff6b6b` (красный)
- **Success**: `#10b981` (зелёный)
- **Background**: `#f8f9fa` (светло-серый)

## 🔄 Data Flow

```
User Input (Form)
    ↓
[POST] /api/synthesis/plan
    ↓
Show Progress Card
    ↓
Poll [GET] /api/synthesis/{id}  (every 2 sec)
    ↓
status: "in_progress" → Update progress
    ↓
status: "completed" → [GET] /api/synthesis/{id}/result
    ↓
Display Results Tabs
    ↓
[Optional] Download [GET] /api/synthesis/download/{id}
```

## 🚀 Использование

### Запуск локально

```bash
# Frontend
cd upgrowplan_new
npm run dev

# Backend (в отдельном терминале)
cd social-plan-master  # или equivalent
python main.py
```

### Доступ

- Frontend: `http://localhost:3000/solutions/socialPlanMaster` (ru)
- Frontend: `http://localhost:3000/en/solutions/socialPlanMaster` (en)
- Backend API: `http://localhost:8004`

## 🔧 Customization

### Изменение API URL

Найдите в `page.ru.tsx` и `page.en.tsx`:

```typescript
const apiBaseUrl = "http://localhost:8004"; // Измените здесь
```

### Добавление новых типов продуктов

В `page.ru.tsx`:

```typescript
const productTypeOptions = [
  // ... existing options
  { value: "new_type" as ProductType, label: "New Type" },
];
```

### Изменение polling интервала

В `pollSynthesisStatus()`:

```typescript
const pollInterval = 2000; // миллисекунды (измените на нужное значение)
```

## 📝 Локализация

- **Русский**: `page.ru.tsx` + `ru.json` + `labels.ts`
- **Английский**: `page.en.tsx`

Для добавления новой языковой версии создайте:

- `page.{lang}.tsx`
- `{lang}.json` (если нужно)

## ✅ Проверка работоспособности

### Тесты

1. Заполнить форму (все поля должны быть валидными)
2. Нажать "Начать синтез"
3. Должны появиться progress bar
4. Через ~1-2 минуты должны появиться результаты
5. Скачать документ (если доступен)

### Debug

- Откройте DevTools (F12)
- Console будет содержать логи вида:
  ```
  [Social Plan Master] Starting synthesis submission...
  [Social Plan Master] Synthesis started with ID: ...
  🔄 [POLLING] Starting status polling for ID: ...
  ✅ ✅ ✅ SYNTHESIS COMPLETED! ✅ ✅ ✅
  ```

## 📞 Связанные компоненты

- **Header**: `components/Header` - навигационная панель
- **Layout**: использует стандартный Next.js layout
- **Styling**: CSS Modules (не использует Tailwind, чтобы соответствовать Market Research)

## 🐛 Known Issues

Нет известных проблем. При возникновении проверьте:

1. Бэкенд сервис запущен и слушает на `localhost:8004`
2. CORS настроен на бэкенде
3. API endpoints совпадают с документацией
4. Browser console логирует события

## 📚 References

- [Market Research Page](./app/solutions/marketResearch) - исходная страница для вдохновения
- [Backend API](../../social-plan-master) - исходный код сервиса синтеза
