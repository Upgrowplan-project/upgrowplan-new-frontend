# Social Plan Master - Deployment Guide

## 🚀 Развёртывание и запуск

### Локальное развёртывание

#### 1. Frontend (Next.js)

```bash
cd upgrowplan_new

# Установка зависимостей (один раз)
npm install

# Запуск в dev режиме
npm run dev

# Приложение будет доступно на:
# http://localhost:3000/solutions/socialPlanMaster (русский)
# http://localhost:3000/en/solutions/socialPlanMaster (английский)
```

#### 2. Backend (Social Plan Master Service)

```bash
cd social-plan-master

# Установка зависимостей (один раз)
pip install -r requirements.txt

# Запуск сервиса
python main.py
# или
uvicorn main:app --reload --port 8004

# API будет доступен на:
# http://localhost:8004/api/synthesis/*
# http://localhost:8004/api/health
```

---

## 🔗 API Integration Points

### Endpoints, которые должны быть реализованы на бэкенде

#### 1. Health Check (опционально)

```http
GET /api/health
```

Response:

```json
{
  "status": "healthy",
  "service": "synthesis-service",
  "version": "1.0.0"
}
```

#### 2. Запуск синтеза

```http
POST /api/synthesis/plan
Content-Type: application/json
```

Request:

```json
{
  "business_idea": "Specialty coffee shop",
  "target_market": "Office workers in city center",
  "business_category": "specialty coffee",
  "region": "Kaliningrad, Russia",
  "business_types": ["B2C"],
  "product_types": ["horeca"],
  "initial_investment": 1500000,
  "planned_headcount": 4,
  "has_social_impact": false
}
```

Response:

```json
{
  "synthesis_id": "uuid-v4-string",
  "status": "pending",
  "progress": 0,
  "current_stage": "initializing"
}
```

#### 3. Получение статуса

```http
GET /api/synthesis/{synthesis_id}
```

Response:

```json
{
  "synthesis_id": "uuid",
  "status": "in_progress|completed|failed",
  "progress": 0-100,
  "current_stage": "stage_name",
  "error": "error message (if failed)"
}
```

Status values:

- `pending` - Запрос создан, ожидает обработки
- `in_progress` - Идёт обработка
- `completed` - Синтез завершён успешно
- `failed` - Ошибка при синтезе

#### 4. Получение результата

```http
GET /api/synthesis/{synthesis_id}/result
```

Response:

```json
{
  "synthesis_id": "uuid",
  "status": "completed",
  "market_research_quality": "high|medium|low",
  "warnings": ["warning 1", "warning 2"],
  "tech_chain": {
    "general_description": "...",
    "tech_stack": ["..."],
    "infrastructure": {...}
  },
  "marketing_plan": {
    "positioning": "...",
    "channels": ["..."],
    "budget": {...}
  },
  "social_analysis": {
    "impact_score": 0-100,
    "sustainability": "...",
    "sdg_alignment": [...]
  },
  "docx_path": "/files/synthesis_uuid.docx",
  "created_at": "2026-01-13T10:30:00Z"
}
```

#### 5. Скачивание документа

```http
GET /api/synthesis/download/{synthesis_id}
```

Response: Binary DOCX file

---

## 🔐 CORS Configuration

Бэкенд должен принимать запросы с фронтенда:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🌐 Environment Variables

### Frontend (.env/.env.local)

```env
# Optional - already hardcoded to localhost:8004
NEXT_PUBLIC_SOLUTIONS_API_URL=http://localhost:8004
```

### Backend (.env)

```env
# Server
PORT=8004
HOST=0.0.0.0

# LLM Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
TEMPERATURE=0.7
MAX_TOKENS_PER_CALL=1500

# Logging
LOG_LEVEL=INFO
DEBUG=false
```

---

## 📂 File Structure

```
upgrowplan_new/
├── app/
│   ├── [locale]/layout.tsx          (Bootstrap + CSS imported here)
│   ├── globals.css                  (Global styles - 276 lines)
│   └── solutions/
│       ├── marketResearch/          (Reference implementation)
│       │   ├── page.ru.tsx
│       │   ├── page.en.tsx
│       │   ├── marketResearch.module.css
│       │   └── ...
│       └── socialPlanMaster/        (This implementation)
│           ├── page.ru.tsx          (Russian - main component)
│           ├── page.en.tsx          (English - main component)
│           ├── socialPlanMaster.module.css  (CSS Modules - isolated)
│           ├── labels.ts
│           ├── ru.json
│           ├── README.md
│           ├── STYLE_COMPATIBILITY.md
│           ├── DEPLOYMENT.md         (this file)
│           └── page_backup.txt

social-plan-master/
├── main.py                          (FastAPI app)
├── app/
│   ├── llm_orchestrator/
│   │   ├── synthesis_service.py
│   │   ├── routes.py
│   │   └── deep_research_integration.py
│   ├── financial_engine/
│   │   ├── calculator.py
│   │   └── ...
│   └── document_generator/
│       └── ...
└── requirements.txt
```

---

## 🚨 Common Issues & Troubleshooting

### Issue 1: "Failed to connect to backend service"

```
Error: Не удалось подключиться к бэкенд сервису
```

**Solution:**

1. Проверить, что Backend запущен: `python main.py`
2. Проверить, что слушает на `localhost:8004`
3. Проверить CORS настройки
4. Проверить firewall

### Issue 2: "Synthesis failed: Unknown error"

```
Error: Синтез не удалось выполнить
```

**Solution:**

1. Проверить Backend console для ошибок
2. Проверить, что OpenAI API key установлен в .env
3. Проверить network connectivity к OpenAI
4. Проверить, что Deep Research Agent доступен (если используется)

### Issue 3: "Form validation error"

```
Error: Пожалуйста, заполните все обязательные поля
```

**Solution:**

1. Убедиться, что заполнены все обязательные поля (отмечены \*)
2. Выбрать хотя бы один Business Type
3. Выбрать хотя бы один Product Type
4. Ввести валидные числа (Investment, Headcount)

### Issue 4: CSS styles not applied

```
Проблема: CSS не применяется к элементам
```

**Solution:**

1. Проверить DevTools → Inspect Element
2. Убедиться, что импортирован socialPlanMaster.module.css
3. Проверить, что используется `styles.className`
4. Очистить браузер кеш (Ctrl+Shift+Delete)

### Issue 5: Progress bar stuck at X%

```
Проблема: Polling зависает
```

**Solution:**

1. Проверить Backend logs - может быть ошибка
2. Проверить консоль фронтенда - может быть ошибка запроса
3. Увеличить polling timeout в коде (если нужно долгое время обработки)
4. Перезагрузить страницу

---

## 🧪 Testing Checklist

### Pre-deployment Tests

- [ ] Frontend запускается без ошибок: `npm run dev`
- [ ] Backend запускается без ошибок: `python main.py`
- [ ] Страница доступна: `http://localhost:3000/solutions/socialPlanMaster`
- [ ] Форма загружается и отображается корректно
- [ ] Все input поля активны
- [ ] Toggle кнопки работают (B2B, B2C, Product Types)
- [ ] Checkbox "Social Impact" работает
- [ ] Кнопка "Start Synthesis" отправляет форму

### Functional Tests

- [ ] Заполнить форму со всеми полями
- [ ] Нажать "Start Synthesis"
- [ ] Progress bar появляется
- [ ] Polling начинается (видно в Console)
- [ ] Progress обновляется каждые 2 сек
- [ ] Через 1-2 минуты Synthesis завершается
- [ ] Результаты загружаются
- [ ] Tabs (Overview, Tech, Marketing, Social) работают
- [ ] Кнопка "Download DOCX" скачивает файл
- [ ] Кнопка "Start Over" очищает результаты

### Style Tests

- [ ] Резайзить окно до 768px → mobile layout работает
- [ ] Резайзить окно до 1024px → tablet layout работает
- [ ] Резайзить окно до 1920px → desktop layout работает
- [ ] Input focus border правильный цвет (#1e6078)
- [ ] Кнопки меняют цвет при hover
- [ ] Нет CSS конфликтов в DevTools
- [ ] Шрифты отображаются правильно

### Compatibility Tests

- [ ] Chrome/Edge - работает
- [ ] Firefox - работает
- [ ] Safari - работает
- [ ] Mobile Safari (iOS) - работает
- [ ] Mobile Chrome (Android) - работает

---

## 📊 Performance Optimization (Optional)

### Frontend

```bash
# Проверить bundle size
npm run build

# Verify output in: .next/
```

### Backend

```python
# Добавить caching для результатов
from functools import lru_cache

@lru_cache(maxsize=100)
def get_synthesis_result(synthesis_id: str):
    ...
```

---

## 🔄 Continuous Integration / Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: Deploy Social Plan Master

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

## 📞 Support & Documentation

- **Frontend Docs**: [README.md](./README.md)
- **Style Guide**: [STYLE_COMPATIBILITY.md](./STYLE_COMPATIBILITY.md)
- **Reference Implementation**: [Market Research Page](../marketResearch/README.md)
- **Backend Docs**: [social-plan-master/README.md](../../social-plan-master/README.md)

---

## 🎉 Deployment Complete

Когда закончите все тесты и проверки:

1. Коммитните изменения в Git
2. Запушьте в production ветку
3. Запустите backend на production сервере
4. Обновите NEXT_PUBLIC_SOLUTIONS_API_URL на production URL
5. Делпойте frontend на хостинг
6. Проверьте, что всё работает на production

**Status**: ✅ Ready for Deployment
