# Документация API Meander Backend

Это полная, техническая документация API бэкенда Meander (Express.js), предназначенная для разработчиков клиентских приложений и библиотек.

## Базовые настройки

- **Базовый URL:** `https://backend.meander.sbs` (или ваш локальный URL для разработки)
- **Формат данных:** `application/json` (если не указано `multipart/form-data`)
- **Аутентификация:** Большинство роутов требуют JWT токен, передаваемый в заголовке `Authorization`.
  - Формат: `Authorization: Bearer <TOKEN>`

---

## 1. Аутентификация (Auth)

Аутентификация работает только через Google OAuth 2.0. Вы не можете выпустить токен без реального аккаунта Google. Лимит: 100 запросов в час с одного IP.

### Обмен токена Google на токен API
\`POST /auth/google/token\`
*   **Body:** \`{ "idToken": "google_oauth_id_token_here" }\`
*   **Возвращает:** \`{ "token": "jwt_token_string", "user": { ...profile_data } }\`

---

## 2. Профили пользователей (Profiles)

### Получение чужого профиля
\`GET /profiles/:id\`
*   **Возвращает:** Статистику пользователя, никнейм, роль, дату регистрации и статус онлайна.

### Редактирование своего профиля
\`POST /profiles/me\`
*   **Auth:** Требуется
*   **Body (multipart/form-data):** 
    *   \`full_name\` (строка, опционально)
    *   \`bio\` (строка, опционально)
    *   \`avatar\` (файл, опционально)

### Подписка / Отписка
\`POST /profiles/:id/follow\`
*   **Auth:** Требуется
*   **Возвращает:** \`{ "following": true|false }\`

### Получение достижений (Ачивок)
\`GET /profiles/:id/achievements\`
*   **Возвращает:** Массив полученных достижений.

### Ежедневный Стрик (Streak)
\`POST /profiles/update-streak\`
*   **Auth:** Требуется
*   **Возвращает:** \`{ "streak": N, "last_active_at": "...", "rewardClaimed": true|false }\`

### Настройки
\`GET /profiles/sync-settings\` — Настройки облачных сохранений.
\`POST /profiles/sync-settings\` — Обновление настроек (body: \`{ "auto_sync": boolean, "sync_on_cellular": boolean }\`).
\`GET /profiles/author-notifs-settings\` — Настройки уведомлений.
\`POST /profiles/author-notifs-settings\` — Обновление уведомлений (body: \`{ "muted_authors": ["id1"] }\`).

---

## 3. Квесты (Quests)

### Список квестов (Каталог)
\`GET /quests\`
*   **Параметры (Query):** 
    *   \`page\` (по умолчанию: 1)
    *   \`limit\` (по умолчанию: 10)
    *   \`search\` (поиск по названию/тегам)
    *   \`genre\` (фильтр по жанру)
    *   \`sort\` (\`newest\`, \`popular\`, \`downloads\`, \`rating\`)
*   **Возвращает:** \`{ "quests": [...], "totalPages": N, "currentPage": N }\`

### Подборки
\`GET /quests/featured\` — Рекомендованные квесты.
\`GET /quests/activity/recent\` — Недавняя активность (отзывы).
\`GET /quests/liked-genres\` — Квесты по любимым жанрам пользователя.

### Детали квеста
\`GET /quests/:id\`
*   **Возвращает:** Полную информацию о квесте (описание, рейтинг, автор, теги).
\`GET /quests/:id/screenshots\` — Скриншоты.

### Взаимодействие
\`POST /quests/:id/vote\` — Поставить/убрать лайк (Body: \`{ "vote": 1 | 0 }\`).
\`POST /quests/:id/download\` — Скачать квест (Инкрементирует счетчик, возвращает подписанную ссылку).
\`POST /quests/:id/review\` — Написать отзыв (Body: \`{ "rating": 5, "textContent": "..." }\`).

---

## 4. Облачные сохранения (Cloud Sync)

Синхронизация игрового прогресса (файлов) с сервером.

### Получение квоты
\`GET /cloud-sync/quota\`
*   **Auth:** Требуется
*   **Возвращает:** Использованное место и лимит (базовый 50 МБ, VIP 200 МБ).

### Список сохранений
\`GET /cloud-sync/quests\`
*   **Auth:** Требуется
*   **Возвращает:** Список квестов, для которых есть сохранения на сервере.

### Проверка актуальности сохранения
\`POST /cloud-sync/quests/:questId/check\`
*   **Auth:** Требуется
*   **Body:** \`{ "localUpdatedAt": "ISOString" }\`
*   **Возвращает:** Какое сохранение новее (\`server\`, \`local\`, \`conflict\`).

### Загрузка сохранения (Upload)
\`PUT /cloud-sync/quests/:questId\`
*   **Auth:** Требуется
*   **Body (multipart/form-data):** Файл сохранения под ключом \`file\`.

### Скачивание сохранения (Download)
\`GET /cloud-sync/quests/:questId\`
*   **Auth:** Требуется
*   **Возвращает:** Бинарный файл сохранения.

### Удаление сохранения
\`DELETE /cloud-sync/quests/:questId\`
*   **Auth:** Требуется

---

## 5. Стена автора (Author Wall)

Каждый автор имеет свою "стену" для новостей, как в соцсетях.

### Загрузка картинок для постов
\`POST /api/author-walls/upload-media\`
*   **Auth:** Требуется
*   **Body (multipart/form-data):** \`file\`
*   **Возвращает:** URL картинки на CDN.

### Лента постов автора
\`GET /api/author-walls/:authorId/posts\`
*   **Параметры (Query):** \`limit\`, \`offset\`, \`viewer_id\`
*   **Возвращает:** Массив постов.

### Получение одного поста
\`GET /api/author-walls/posts/:postId\`
*   **Возвращает:** Детальную информацию по посту.

### Управление постами
\`POST /api/author-walls/:authorId/posts\` — Создать пост (Body: \`{ "content": "Текст", "media_urls": [] }\`).
\`PUT /api/author-walls/posts/:postId\` — Изменить пост.
\`DELETE /api/author-walls/posts/:postId\` — Удалить пост.
\`POST /api/author-walls/posts/:postId/view\` — Зарегистрировать просмотр (инкремент счетчика).

### Комментарии к постам
\`GET /api/author-walls/posts/:postId/comments\` — Список комментариев.
\`POST /api/author-walls/posts/:postId/comments\` — Написать комментарий (Body: \`{ "content": "Текст", "parentId": "optional_reply_id" }\`).

---

## 6. Глобальное сообщество (Community)

### Глобальная лента
\`GET /api/community/feed\`
*   **Параметры (Query):** \`limit\`, \`offset\`, \`viewer_id\`, \`tab\` ("all" или "following")
*   **Возвращает:** Единую ленту постов от всех авторов или только подписок.

### Топ авторы
\`GET /api/community/top\`
*   **Возвращает:** Массив самых популярных профилей.

---

## 7. Уведомления (Notifications)

\`GET /notifications\` — Список уведомлений (Query: \`archived=true|false\`).
\`GET /notifications/unread-count\` — Количество непрочитанных.
\`POST /notifications/:id/read\` — Пометить как прочитанное.
\`POST /notifications/:id/archive\` — Отправить в архив.

---

## 8. ИИ Функции (AI)

Возможности AI доступны за токены (выдаются бесплатно или через донат).

\`GET /ai/token-balance\` — Текущий баланс ИИ-токенов.
\`POST /ai/refresh-tokens\` — Обновить ежедневные бесплатные токены.

### Генерация и исправление
Все POST-запросы требуют передачи \`{ "text": "..." }\` в Body.
*   \`POST /ai/fix-text\` — Исправление текста (доп. \`mode\`: "grammar", "style", "expand").
*   \`POST /ai/translate\` — Перевод (доп. \`targetLanguage\`).
*   \`POST /ai/suggest-continuation\` — Продолжить абзац текста.
*   \`POST /ai/suggest-button-text\` — Сгенерировать текст для кнопок-ответов игрока.
*   \`POST /ai/generate-keywords\` — Генерация тегов для квеста по описанию.

---

## 9. Жалобы и Админ-панель (Reports & Admin)

### Создать жалобу на контент
\`POST /reports\`
*   **Auth:** Требуется
*   **Body:** 
    *   \`targetType\`: "quest" | "profile" | "review" | "wall_post" | "wall_comment"
    *   \`targetId\`: UUID
    *   \`reason\`: Категория (SPAM, NSFW, SCAM, и т.д.)
    *   \`details\`: Комментарий к жалобе

### Админ-панель (Только role='admin')
\`GET /admin/stats\` — Общая статистика по платформе.
\`GET /reports/admin\` — Очередь жалоб на модерацию.
\`POST /reports/admin/:id/resolve\` — Вынести решение по жалобе (Удалить / Игнорировать).
