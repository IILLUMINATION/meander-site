// Серверные помощники SEO-слоя: читают публичный API маркета ОТ СЕРВЕРА, чтобы
// текст квеста попадал в HTML, а не появлялся там только после JS.
//
// Почему не `$apiBe`: этот хост отдаёт внутренний nginx-порт 3004 (там сидит
// админка), а не API. Наружный адрес API — ровно тот, что в rewrites у
// `next.config.ts`, поэтому берём его же и не заводим второй источник истины.
import https from "node:https";
import type { Quest } from "./quest";

export const SITE_ORIGIN = "https://meander.sbs";

const API_ORIGIN = "https://backend.meander.sbs";

const FETCH_TIMEOUT_MS = 8000;

/** Ошибка обращения к API с кодом ответа, если он был получен. */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Квеста действительно нет (в отличие от «бэкенд чихнул»). Только по этому
 * признаку странице разрешено отдавать notFound(): иначе временный сбой
 * превратился бы в живую 404-ю, закешированную ISR.
 *
 * 404 — несуществующий id, 400 — API отверг формат («Invalid ID format»);
 * оба означают «здесь никогда не будет страницы», и краулер должен получать 404,
 * а не 500.
 */
export function isNotFoundError(e: unknown): boolean {
  return e instanceof ApiError && (e.status === 404 || e.status === 400);
}

/** Правильный UUID. Нужен до запроса: id из URL иначе попадает в путь запроса к API. */
export function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function get(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: FETCH_TIMEOUT_MS }, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode > 299) {
        res.resume();
        reject(new ApiError(`${url} -> HTTP ${res.statusCode}`, res.statusCode));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c as Buffer));
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        } catch (e) {
          reject(new ApiError(`${url} -> не JSON: ${(e as Error).message}`));
        }
      });
    });
    req.on("timeout", () => req.destroy(new ApiError(`${url} -> таймаут`)));
    req.on("error", reject);
  });
}

/**
 * @param path путь внутри API, напр. "/quests" или "/quests/<id>"
 * @returns разобранный JSON
 * @throws если бэкенд недоступен — молча возвращать [] нельзя: пустая страница
 *         уедет в ISR-кэш и краулер получит пустой маркет вместо ошибки.
 */
export async function apiJson<T>(path: string): Promise<T> {
  return (await get(`${API_ORIGIN}${path}`)) as T;
}

const LIST_TTL_MS = 5 * 60 * 1000;

let listCache: { at: number; value: Quest[] } | null = null;
let listInFlight: Promise<Quest[]> | null = null;

/**
 * Весь каталог одним запросом — из него берут и маркет, и страницу квеста, и
 * sitemap. Причина не в экономии трафика: анонимный `/quests*` лимитирован
 * 60 запросами на 15 минут на IP (publicQuestLimiter в бэкенде), а краулер
 * проходит по сотням URL. Один кэш в процессе = один запрос API за TTL,
 * сколько бы страниц ни перегенеривалось.
 *
 * GET /quests отдаёт по записи с теми же полями, что и GET /quests/:id
 * (сверено на проде), поэтому за детальным запросом обращаться не нужно.
 */
export function getQuestList(): Promise<Quest[]> {
  if (listCache && Date.now() - listCache.at < LIST_TTL_MS) {
    return Promise.resolve(listCache.value);
  }
  if (!listInFlight) {
    listInFlight = apiJson<Quest[]>("/quests")
      .then((value) => {
        listCache = { at: Date.now(), value };
        return value;
      })
      .finally(() => {
        listInFlight = null;
      });
  }
  return listInFlight;
}

export async function findQuest(id: string): Promise<Quest | undefined> {
  const list = await getQuestList();
  return list.find((q) => q.id === id);
}

/**
 * Авторы опубликованного каталога и их квесты — из того же кэша, что и маркет,
 * поэтому генерация страницы автора не стоит ни одного лишнего запроса к API
 * (кроме самой карточки профиля).
 *
 * Публичный GET /quests отдаёт автора в каждом элементе (author_id, author_name),
 * так что список авторов — это просто группировка каталога.
 */
export async function getAuthors(): Promise<Map<string, Quest[]>> {
  const list = await getQuestList();
  const byAuthor = new Map<string, Quest[]>();
  for (const quest of list) {
    const quests = byAuthor.get(quest.author_id);
    if (quests) quests.push(quest);
    else byAuthor.set(quest.author_id, [quest]);
  }
  return byAuthor;
}

/**
 * Витрина главной: самые скачиваемые квесты. Тот же кэш каталога, поэтому
 * главная не стоит ни одного лишнего запроса к API.
 */
export async function getTopQuests(limit = 5): Promise<Quest[]> {
  const list = await getQuestList();
  return [...list]
    .sort((a, b) => b.downloads_count - a.downloads_count)
    .slice(0, limit);
}

export function questUrl(id: string): string {
  return `${SITE_ORIGIN}/market/${id}`;
}

export function authorUrl(id: string): string {
  return `${SITE_ORIGIN}/profile/${id}`;
}

/**
 * Форма числительного по-русски: pluralRu(200, ["история", "истории", "историй"]).
 * Нужна, потому что количество квестов подставляется в description живым числом,
 * и без склонения поисковик показывает «200 истории».
 */
export function pluralRu(n: number, forms: [string, string, string]): string {
  const ten = n % 10, hundred = n % 100;
  if (ten === 1 && hundred !== 11) return forms[0];
  if (ten >= 2 && ten <= 4 && (hundred < 10 || hundred >= 20)) return forms[1];
  return forms[2];
}

/** Короткое описание для meta/OG: одна строка, без переносов, вразумительной длины. */
export function excerpt(text: string | null | undefined, max = 200): string {
  const flat = (text || "").replace(/\s+/g, " ").trim();
  if (!flat) return "";
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max - 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/**
 * Готовый содержимое для <script type="application/ld+json">.
 * Экранирование "<" обязательно: заголовок и описание квеста пишет пользователь,
 * и без него "…</script>" ломает разметку страницы прямо из чужого текста.
 */
export function jsonLd(value: unknown): { __html: string } {
  return {
    __html: JSON.stringify(value).replace(/</g, "\\u003c"),
  };
}
