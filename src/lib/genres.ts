// Значения жанров как их хранит API (латиница) и как их видит русский читатель.
// Вынесено из клиентских компонентов: серверный слой (метаданные, sitemap, JSON-LD)
// не может импортировать значения из модулей с "use client", а обычный модуль
// могут импортировать обе стороны.
export const genreTranslations: Record<string, string> = {
  Fantasy: "Фэнтези",
  "Sci-Fi": "Фантастика",
  Horror: "Ужасы",
  Adventure: "Приключения",
  Mystery: "Мистика",
  Romance: "Романтика",
  Comedy: "Комедия",
  Thriller: "Триллер",
  Historical: "Исторический",
  Drama: "Драма",
};

export function translateGenre(genre: string): string {
  return genreTranslations[genre] || genre;
}
