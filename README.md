# IT Project Lab — Task Manager 🧪

MVP для Лабораторної роботи №2: **Забезпечення якості через тестування**.

## Стек

- Vite + Vanilla JS
- **Vitest** — Unit тести + Code Coverage
- **Playwright** — E2E тести

## Запуск

```bash
npm install
npm run dev
```

## Тести

```bash
# Unit тести
npm run test:unit

# Unit тести + Coverage звіт
npm run test:unit:coverage

# E2E тести (потребує запущеного dev-сервера)
npm run test:e2e

# UI режим Vitest
npm run test:unit:ui
```

## Структура

```
├── index.html
├── src/
│   ├── tasks.js          ← бізнес-логіка (чисті функції)
│   ├── tasks.test.js     ← Unit тести (Vitest)
│   └── main.js / style.css
├── tests/
│   └── app.spec.js       ← E2E тести (Playwright)
├── vite.config.js
└── playwright.config.js
```
