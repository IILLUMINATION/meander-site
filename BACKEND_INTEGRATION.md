# Meander Site - Интеграция с бэкендом

## Настройка

### Google OAuth

Google OAuth Client ID уже настроен в `src/app/layout.tsx`:
- Windows Client ID: `410112450155-mgd0ic4883lg6ic2e2ljrnipt6n2jrdc.apps.googleusercontent.com`

### CORS на бэкенде

Бэкенд работает на VPS (`https://backend.meander.sbs`). Если нужно добавить localhost для разработки:

1. Откройте `/home/user/projects/mnd/backend/.env`
2. Добавьте URL сайта в `CORS_ORIGINS`:
   ```
   CORS_ORIGINS="https://meander.sbs,https://www.meander.sbs,http://localhost:3001"
   ```
3. Перезапустите бэкенд

## API Endpoints

### Квесты
- `GET /quests` - Список всех квестов (требуется токен)
- `GET /quests/{id}` - Детальная информация о квесте
- `POST /quests/{id}/download` - Отметить скачивание (требуется авторизация)
- `POST /quests/{id}/vote` - Голосовать за квест (требуется авторизация)

### Авторизация
- `POST /auth/google/token` - Вход через Google OAuth (принимает idToken)

### Профили
- `GET /profiles/{userId}` - Информация о пользователе
- `GET /profiles/{userId}/quests` - Квесты пользователя
- `GET /profiles/{userId}/is-following` - Проверка подписки

## Запуск сайта

```bash
cd /home/user/projects/meander-site
npm run dev
```

Сайт будет доступен на `http://localhost:3000`

## Структура страниц

- `/` - Главная страница
- `/market` - Маркет квестов (интеграция с API)
- `/branding` - Брендинг материалы
- `/gallery` - Галерея (на главной)

## Авторизация на сайте

Реализована через Google OAuth (@react-oauth/google):

1. Пользователь нажимает кнопку "Войти через Google"
2. Получаем ID токен от Google
3. Отправляем POST на `/auth/google/token` с idToken
4. Бэкенд возвращает JWT токен и данные пользователя
5. Сохраняем в localStorage:
   - `meander_token` - JWT токен для API запросов
   - `meander_user` - Данные пользователя

## Что работает

✅ Загрузка списка квестов с реального API (требуется токен)
✅ Google OAuth авторизация
✅ Фильтрация по жанрам
✅ Сортировка (популярные, скачивания, новые, обновлённые)
✅ Поиск по названию и описанию
✅ Голосование (лайки) - требуется авторизация
✅ Скачивание квестов
✅ Отображение верифицированных авторов

## Что можно доработать

⏳ Личный кабинет пользователя
⏳ Публикация квестов через сайт
⏳ Подписка на авторов
⏳ Страница профиля автора
⏳ Комментарии и отзывы
