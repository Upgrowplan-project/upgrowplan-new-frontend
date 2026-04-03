#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

# Читаю page.ru.tsx
with open('d:\\UpgrowPlan\\upgrowplan_new\\app\\[locale]\\page.ru.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Словарь переводов (расширенный)
translations = {
    'Реальный мир не работает по шаблонам. Ваш план тоже не должен.': 'Stop guessing. Start winning.',
    'Мы вылечили ИИ от галлюцинаций. Upgrowplan использует данные рынка и конкурентов, моделирует ваших клиентов и проверяет качество документа агентом-скептиком, чтобы создать план, который выдержит встречу с реальностью, а не просто красиво выглядит на бумаге.': 'The only platform where AI agents test your business on live data. We use RAG to find real market prices, competitor reviews, and regulatory changes for your specific location.',
    'Попробовать бесплатно': 'Try for free',
    'Поговорить с экспертом': 'Talk to an expert',
    'запущенных проектов': 'projects launched',
    'экспертизы': 'expertise',
    'стандарты моделей': 'industry standards',
    'Как ИИ-агенты Upgrowplan создают и проверяют планы на живых данных.': 'How Upgrowplan AI agents build and verify your plan using live data.',
    'Не просто генерация текста, а пошаговая валидация каждого факта.': 'Not just text generation, but step-by-step validation of every fact.',
    'Попробовать валидацию сейчас': 'Try validation now',
    'Live Валидация...': 'Live Validation...',
    'Забудьте о галлюцинациях ИИ. Каждая цифра в вашем плане имеет автора.': 'Forget AI hallucinations. Every number in your plan has an author.',
    'Прямые ссылки на официальные отчеты, налоговые кодексы и рыночную аналитику 2026 года.': 'Direct links to official reports, tax codes, and market analytics (2026).',
    'Что это значит для вас': 'What this means for you',
    'Мы используем RAG (Retrieval-Augmented Generation). ИИ сначала находит актуальные документы, читает их, и только затем пишет ваш план.': 'We use RAG. AI first retrieves real documents, reads them, and only then writes your plan.',
    'Результат: 0% выдумок, 100% верифицируемость.': 'Result: 0% fiction, 100% verifiable.',
    'Ставка НДС (Израиль, 2026):': 'VAT rate (Israel, 2026):',
    'Объем рынка (coffee subscriptions):': 'Market size (coffee subscriptions):',
    'Рост YoY:': 'Growth rate YoY:',
    'Единственный ИИ, который не боится сказать вам «нет».': 'The only AI that isn\'t afraid to tell you "no".',
    'Ваш Агент-Скептик проверит идею на прочность, найдет скрытые расходы и укажет на перенасыщенный рынок.': 'Your Skeptic Agent stress-tests the idea, finds hidden costs, and flags overcrowded markets.',
    'Мы готовим вас к худшему сценарию, чтобы вы были готовы к лучшему.': 'We prepare you for the worst-case scenario so you are ready for the best.',
    'Показатель доверия': 'Confidence Score',
    'Не гадайте. Спросите тех, кто действительно купит.': 'Don\'t guess. Ask those who will actually buy.',
    'Забудьте о «слепой вере». Upgrowplan создает цифровую копию вашей аудитории в нужном районе и позволяет моментально проверить любую бизнес‑гипотезу.': 'Your ideas are tested by real audience data from your region.',
    # Personas
    'Петр Петрович': 'Peter',
    'Пожилой житель': 'Resident',
    'Цена/Качество': 'Price/Quality',
    'Тишина': 'Quiet',
    'Доверие': 'Trust',
    'Основано на 620 локальных отзывах': 'Based on 620 local reviews',
    'Крафтовое пиво на районе': 'Craft Beer Bar',
    'Оксана': 'Oksana',
    'Офисный профессионал': 'Office Professional',
    'Эстетика': 'Aesthetics',
    'Время': 'Time',
    'Статус': 'Status',
    'Технологии': 'Technology',
    'Основано на 1.1k офисных опросах': 'Based on 1.1k office surveys',
    'Семейная кондитерская у офиса': 'Family Bakery Near Office',
    'Мария': 'Maria',
    'Хозяйка пекарни': 'Bakery Owner',
    'Юнит-экономика': 'Unit Economics',
    'Операционка': 'Operations',
    'Качество': 'Quality',
    'Конкуренция': 'Competition',
    'Основано на 1.2k HoReCa отзывах': 'Based on 1.2k HoReCa reviews',
    'Шеринг инструментов «СтройСам»': 'Tool-Sharing Service',
    'Никита': 'Nikita',
    'Студент-мечтатель': 'Student Dreamer',
    'Тренды': 'Trends',
    'Хайп': 'Hype',
    'Экология': 'Ecology',
    'Сообщество': 'Community',
    'Основано на 900 интервью со студентами': 'Based on 900 student interviews',
    'Школа каллиграфии онлайн': 'Online Calligraphy School',
    'Виктор Борисович': 'Victor Borisovich',
    'Директор': 'Director',
    'Риски': 'Risks',
    'Масштаб': 'Scale',
    'Финмодель': 'Financial Model',
    'Стратегия': 'Strategy',
    'Основано на 420 интервью с директорами': 'Based on 420 director interviews',
    'Франшиза автомоек «Антигрязь»': 'Franchise: Auto Washes',
    'Елена': 'Elena',
    'Домохозяйка': 'Homemaker',
    'Удобство': 'Convenience',
    'Дети': 'Children',
    'Лояльность': 'Loyalty',
    'Основано на 1.5k домашних опросах': 'Based on 1.5k household surveys',
    'Подписка на уборку «Чистый Понедельник»': 'Cleaning Subscription',
    # Dialog and sections
    'Кейс:': 'Case:',
    '[RAG Validation]:': '[RAG Validation]:',
    'Гипотеза не подтверждена.': 'Hypothesis NOT validated.',
    'Гипотеза подтверждена на 50%.': 'Hypothesis PARTIALLY validated.',
    'Гипотеза подтверждена.': 'Hypothesis VALIDATED.',
}

# Применяю переводы
for rus, eng in translations.items():
    content = content.replace(rus, eng)

# Пишу page.en.tsx
with open('d:\\UpgrowPlan\\upgrowplan_new\\app\\[locale]\\page.en.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ page.en.tsx created successfully with translations!')
