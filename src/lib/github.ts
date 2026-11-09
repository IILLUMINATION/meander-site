import { SOURCE_REPO } from "./downloads";

// Активность исходного репозитория для виджета на главной. Два запроса к
// GitHub API на пересборку страницы (ISR раз в 30 минут) — это 4 запроса в
// час, анонимный лимит 60, так что в потолок не упираемся.
const API_BASE = "https://api.github.com";
const CACHE_SECONDS = 1800;

export interface RepoCommit {
  sha: string;
  message: string;
  author: string | null;
  avatarUrl: string | null;
  url: string;
  date: string;
}

export interface RepoActivity {
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  language: string | null;
  license: string | null;
  pushedAt: string;
  commits: RepoCommit[];
}

/** Данные репозитория и последние коммиты; null, если GitHub недоступен. */
export async function getRepoActivity(): Promise<RepoActivity | null> {
  const path = SOURCE_REPO.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const init: RequestInit = {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "meander-site",
    },
    next: { revalidate: CACHE_SECONDS },
  };

  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`${API_BASE}/repos/${path}`, init),
      fetch(`${API_BASE}/repos/${path}/commits?per_page=5`, init),
    ]);
    if (!repoRes.ok || !commitsRes.ok) {
      // 403 — упёрлись в лимит, 404 — репозиторий переименовали. В обоих
      // случаях виджет просто не рисуем: врать про активность хуже, чем
      // показать только ссылку на репозиторий.
      console.warn(
        `github: репозиторий ${path} — repo ${repoRes.status}, commits ${commitsRes.status}`,
      );
      return null;
    }

    const repo = (await repoRes.json()) as Record<string, unknown>;
    const commits = (await commitsRes.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(commits)) return null;

    return {
      fullName: String(repo.full_name ?? path),
      url: String(repo.html_url ?? SOURCE_REPO),
      stars: Number(repo.stargazers_count ?? 0),
      forks: Number(repo.forks_count ?? 0),
      issues: Number(repo.open_issues_count ?? 0),
      language: (repo.language as string | null) ?? null,
      license: ((repo.license as { spdx_id?: string } | null)?.spdx_id) ?? null,
      pushedAt: String(repo.pushed_at ?? ""),
      commits: commits.map((c) => {
        const commit = (c.commit ?? {}) as Record<string, unknown>;
        const author = (c.author ?? null) as Record<string, unknown> | null;
        const gitAuthor = (commit.author ?? {}) as Record<string, unknown>;
        return {
          sha: String(c.sha ?? "").slice(0, 7),
          message: String(commit.message ?? "").split("\n")[0],
          author:
            (author?.login as string | undefined) ??
            (gitAuthor.name as string | undefined) ??
            null,
          avatarUrl: (author?.avatar_url as string | undefined) ?? null,
          url: String(c.html_url ?? ""),
          date: String(gitAuthor.date ?? ""),
        };
      }),
    };
  } catch (error) {
    console.warn(`github: не смог прочитать ${path}`, error);
    return null;
  }
}

/** «2 дня назад», «5 часов назад» — грубо, но для коммитов этого хватает. */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const minutes = Math.max(0, Math.floor((now - then) / 60000));
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${plural(days, "день", "дня", "дней")} назад`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${plural(months, "месяц", "месяца", "месяцев")} назад`;
  const years = Math.floor(months / 12);
  return `${years} ${plural(years, "год", "года", "лет")} назад`;
}

/**
 * Русские числительные: 1 день, 2 дня, 5 дней. Исключение — 11–14, они всегда
 * требуют формы множественного числа («11 дней»), хотя оканчиваются на 1–4.
 */
function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = n % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/** Дата коммита в виде «8 ноября 2026», для подсказки при наведении. */
export function fullDate(iso: string): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(then);
}
