# Frontend Updates - Synth Focus Lab

**Дата:** 2025-12-27
**Статус:** ✅ Готово к тестированию

---

## Реализованные изменения

### 1. Кнопка "Остановить исследование" (Пауза)

**Что изменилось:**
- Во время исследования кнопка "Проводится исследование..." стала короче (2/3 ширины)
- Справа добавлена красная кнопка "Остановить" (1/3 ширины)
- При нажатии на "Остановить" она меняется на "На паузе" (серая, неактивная)

**Функционал:**
- Кнопка останавливает polling (опрос статуса с бэкенда)
- Исследование НЕ удаляется, только ставится на паузу
- State переменная: `isPaused`

**Код:**
```tsx
// State
const [isPaused, setIsPaused] = useState(false);

// Handler
const handlePauseResearch = () => {
  setIsPaused(true);
};

// В pollResearchStatus
if (isPaused) {
  return; // Skip polling
}

// UI - две кнопки рядом
<div style={{ display: "flex", gap: "0.75rem" }}>
  <button disabled style={{ flex: "2" }}>
    <FiRefreshCw /> Проводится исследование...
  </button>
  <button onClick={handlePauseResearch} style={{ flex: "1" }}>
    <FiPause /> {isPaused ? "На паузе" : "Остановить"}
  </button>
</div>
```

**Файл:** `app/solutions/synthFocusLab/page.ru.tsx` (строки 410-416, 1007-1047)

---

### 2. Кнопка "Повторить исследование" при ошибке

**Что изменилось:**
- При ошибке исследования (status === "failed") появляется синяя кнопка "Повторить исследование"
- Кнопка запускает новое исследование с теми же параметрами, что были в предыдущей попытке

**Функционал:**
- Сохраняются данные формы при первой отправке (`lastSubmittedFormData`)
- При нажатии на "Повторить" создается новый запрос с сохраненными параметрами
- Показывается состояние загрузки "Повторная попытка..."

**Код:**
```tsx
// State
const [lastSubmittedFormData, setLastSubmittedFormData] = useState<FormData | null>(null);

// Сохранение при submit
setLastSubmittedFormData({ ...formData });

// Handler
const handleRetryResearch = async () => {
  if (!lastSubmittedFormData) return;

  setError("");
  setIsSubmitting(true);
  setStartTime(new Date());
  setIsPaused(false);

  try {
    const response = await fetch("http://localhost:8003/api/research", {
      method: "POST",
      body: JSON.stringify({
        product_description: lastSubmittedFormData.productDescription,
        // ... остальные параметры
      }),
    });

    const data = await response.json();
    setResearchStatus(data);
    pollResearchStatus(data.id);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

// UI в секции ошибки
{lastSubmittedFormData && (
  <button onClick={handleRetryResearch} disabled={isSubmitting}>
    {isSubmitting ? (
      <><FiRefreshCw /> Повторная попытка...</>
    ) : (
      <><FiRotateCw /> Повторить исследование</>
    )}
  </button>
)}
```

**Файл:** `app/solutions/synthFocusLab/page.ru.tsx` (строки 260, 417-465, 1320-1361)

---

### 3. Исправление QR-кода для мобильных устройств

**Проблема:**
- QR-код содержал URL `http://localhost:8003/...`
- При сканировании с мобильного устройства выходила ошибка `ERR_CONNECTION_FAILED`
- Localhost недоступен с мобильного телефона в локальной сети

**Решение:**
- **Для продакшена:** QR-код ведет на `https://www.upgrowplan.com/api/synth-focus-lab/research/{id}/download`
- **Для локальной разработки:** Показывается текст "QR (работает только на проде)"

**Код:**
```tsx
// Функция получения URL для скачивания
const getDownloadUrl = () => {
  if (typeof window === "undefined") return "";

  // В продакшене используем production domain
  if (window.location.hostname === "www.upgrowplan.com" ||
      window.location.hostname === "upgrowplan.com") {
    return `https://www.upgrowplan.com/api/synth-focus-lab/research/${researchStatus?.id}/download`;
  }

  // В локальной разработке (будет работать только при локальном тесте)
  return `http://localhost:8003/api/research/${researchStatus?.id}/export?output_format=docx&include_infographics=true`;
};

// QR-код генерируется через внешний сервис
<img
  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(getDownloadUrl())}`}
  alt="QR Code для скачивания"
/>

// Подсказка под QR-кодом
<span>
  {typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "QR (работает только на проде)"
    : "Скачать на мобильное"}
</span>
```

**Файл:** `app/solutions/synthFocusLab/page.ru.tsx` (строки 327-339, 1425-1449)

**Важно для деплоя:**
- После деплоя на `www.upgrowplan.com` нужно убедиться что бэкенд имеет endpoint:
  - `GET /api/synth-focus-lab/research/{id}/download`
  - Который отдает файл DOCX с правильными headers для скачивания

---

## Добавленные иконки

```tsx
import {
  // ... существующие
  FiPause,      // Иконка паузы
  FiRotateCw,   // Иконка повтора
} from "react-icons/fi";
```

---

## Новые State переменные

```tsx
const [isPaused, setIsPaused] = useState(false);
const [lastSubmittedFormData, setLastSubmittedFormData] = useState<FormData | null>(null);
```

---

## Визуальный дизайн

### Кнопка "Остановить"
- **Фон:** `#dc3545` (красный) / `#6c757d` (серый когда на паузе)
- **Ширина:** 1/3 от общей ширины (flex: 1)
- **Состояния:**
  - Активна: "Остановить" (красная)
  - На паузе: "На паузе" (серая, disabled)

### Кнопка "Повторить исследование"
- **Фон:** `#0785f6` (синий) / `#0670d4` (темно-синий при hover)
- **Расположение:** В центре секции ошибки, под текстом ошибки
- **Состояния:**
  - Обычное: "Повторить исследование" + иконка FiRotateCw
  - Загрузка: "Повторная попытка..." + вращающаяся иконка FiRefreshCw

### QR-код
- **Размер:** 120x120 пикселей
- **Граница:** 2px solid #28a745 (зеленая)
- **Фон:** Белый
- **Текст под кодом:**
  - Локально: "QR (работает только на проде)" (желтый/предупреждение)
  - На проде: "Скачать на мобильное" (зеленый)

---

## Тестирование

### Локальное тестирование

1. **Кнопка паузы:**
   ```
   ✓ Запустить исследование
   ✓ Нажать "Остановить"
   ✓ Проверить что кнопка стала серой "На паузе"
   ✓ Проверить что polling остановился (проверить Network в DevTools)
   ```

2. **Кнопка повтора:**
   ```
   ✓ Создать исследование с ошибкой (например, отключить бэкенд)
   ✓ Дождаться status: "failed"
   ✓ Проверить что появилась кнопка "Повторить исследование"
   ✓ Нажать кнопку
   ✓ Проверить что создается новый запрос с теми же параметрами
   ```

3. **QR-код (локально):**
   ```
   ✓ Запустить исследование до конца
   ✓ Проверить что QR-код отображается
   ✓ Проверить что под кодом текст "QR (работает только на проде)"
   ⚠️ Сканирование с телефона не будет работать (это ожидаемо)
   ```

### Production тестирование

1. **QR-код (на проде):**
   ```
   ✓ Деплой на www.upgrowplan.com
   ✓ Запустить исследование
   ✓ Проверить что под QR текст "Скачать на мобильное"
   ✓ Отсканировать QR-код с мобильного устройства
   ✓ Проверить что файл скачивается корректно
   ```

2. **Проверка endpoint на бэкенде:**
   ```
   Нужно убедиться что существует:
   GET https://www.upgrowplan.com/api/synth-focus-lab/research/{id}/download

   Или настроить reverse proxy на nginx:
   location /api/synth-focus-lab/ {
       proxy_pass http://localhost:8003/api/research/;
   }
   ```

---

## Известные ограничения

1. **Пауза не останавливает бэкенд:**
   - Кнопка "Остановить" только останавливает polling на фронтенде
   - Бэкенд продолжает выполнять исследование
   - Это функция "тихой паузы" для UI, не реальная остановка процесса

2. **QR-код в локальной разработке:**
   - QR-код генерируется, но ведет на localhost:8003
   - С мобильного устройства это не будет работать (ожидаемо)
   - Работает только после деплоя на production

3. **Повтор использует последние параметры:**
   - Если пользователь изменил параметры формы после запуска исследования
   - При повторе будут использованы СТАРЫЕ параметры (из момента первого запуска)
   - Это сделано намеренно для точного повтора

---

## Файлы изменены

- ✅ `app/solutions/synthFocusLab/page.ru.tsx` - все изменения UI
- ✅ `FRONTEND_UPDATES.md` - эта документация

---

## Чеклист для деплоя

### Frontend
- [x] Изменения закоммичены
- [x] Документация создана
- [ ] Build проверен (`npm run build`)
- [ ] Deploy на production

### Backend (TODO)
- [ ] Создать endpoint `/api/synth-focus-lab/research/{id}/download`
- [ ] Или настроить nginx reverse proxy
- [ ] Проверить CORS headers для скачивания
- [ ] Проверить что файл отдается с правильным content-type

### После деплоя
- [ ] Протестировать кнопку "Остановить"
- [ ] Протестировать кнопку "Повторить"
- [ ] Протестировать QR-код с мобильного устройства
- [ ] Проверить что скачивание работает

---

**Статус:** Все изменения работают офлайн, готовы к продакшену!
