"use client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark.css';

const markdownContent = `
### 1. Авторизация

Авторизация происходит через Google OAuth ID токены.

#### Обмен токена Google на токен API
\`POST /auth/google/token\`
*   **Body:** \`{ "idToken": "google_oauth_id_token_here" }\`
*   **Возвращает:** \`{ "token": "jwt_token_string", "user": { ...profile_data } }\`

### 2. Квесты

#### Получение списка квестов
\`GET /quests\`
*   **Параметры запроса (Query):** 
    *   \`page\` (по умолчанию: 1)
    *   \`limit\` (по умолчанию: 10)
    *   \`search\` (строка)
    *   \`genre\` (строка)
    *   \`sort\` (\`newest\`, \`popular\`, \`downloads\`)
*   **Возвращает:** \`{ "quests": [...], "totalPages": N, "currentPage": N }\`

#### Получение деталей квеста
\`GET /quests/:id\`
*   **Возвращает:** Детальные метаданные квеста.

#### Отзыв на квест
\`POST /quests/:id/review\`
*   **Авторизация:** Требуется
*   **Body:** \`{ "rating": 5, "textContent": "Отличная игра!" }\`

### 3. Сообщество (Глобальная лента)

#### Глобальная лента постов
\`GET /api/community/feed\`
*   **Параметры (Query):** \`limit\`, \`offset\`, \`viewer_id\`, \`tab\` ("all" или "following")
*   **Возвращает:** Массив постов от всех авторов.

#### Создание поста на стене
\`POST /api/author-walls/:authorId/posts\`
*   **Авторизация:** Требуется (must match \`authorId\`)
*   **Body:** \`{ "content": "Ваш текст", "media_urls": ["url1"] }\`

#### Получение комментариев к посту
\`GET /api/author-walls/posts/:postId/comments\`
*   **Возвращает:** Массив комментариев.
`;

export default function ApiDocs() {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
