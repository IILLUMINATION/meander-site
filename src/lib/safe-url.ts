// Безопасные схемы для ссылок/картинок в пользовательском Markdown.
// `meander:` — deep-links приложения (quest/profile/post), остальные —
// обычные веб-ссылки. javascript:, data:, vbscript:, file: и прочее
// отсекаются.
const ALLOWED_PROTOCOLS: Record<string, true> = {
  "http:": true,
  "https:": true,
  "mailto:": true,
  "meander:": true,
};

/**
 * urlTransform для react-markdown: оставляет относительные ссылки и
 * разрешённые протоколы, всё остальное превращает в пустую строку.
 */
export function safeUrlTransform(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  // Нет схемы — относительная ссылка (#anchor, /path), безопасна.
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return url;
  try {
    return ALLOWED_PROTOCOLS[new URL(trimmed).protocol] ? url : "";
  } catch {
    return "";
  }
}