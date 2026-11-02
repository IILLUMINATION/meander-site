# meander.sbs

Маркет квестов, документация и играбельная демонстрация Meander. Next.js 16,
React 19.

## Что внутри

- `/` — лендинг, живое демо в браузере (`/play/`), топ квестов;
- `/market` — каталог опубликованных квестов;
- `/market/[id]` — карточка квеста, запуск в браузере и deep-link;
- `/docs`, `/api-docs` — документация;
- `/profile/[id]` — публичный профиль автора.

Демо-блок на главной играет квест через iframe `/play/?quest=<id>`.
Плеер и архивы `/quest-src/` раздаёт nginx того же origin; wasm-движку нужны
COOP/COEP, поэтому чужой хост без CORS не подойдёт.

## Разработка

```bash
npm install --no-package-lock   # lockfile исторически содержит npmmirror URL
npm run dev
npx tsc --noEmit
```

Сборка читает публичный API с сервера, поэтому требует живого
`https://backend.meander.sbs`; при недоступном API `next build` падает — это
сделано намеренно, чтобы пустой каталог не уехал в ISR-кэш.

## Деплой

```bash
ssh srv
cd /var/www/meander-site && git pull
npm run build
pm2 restart meander-site
```

nginx `meander.sbs` проксирует `/` на `127.0.0.1:3002`, `/play/` — на
`/var/www/web-player`, `/quest-src/` — в backend.
