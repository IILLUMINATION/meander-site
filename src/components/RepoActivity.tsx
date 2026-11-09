import { Star, GitFork, CircleDot, GitCommitHorizontal, ExternalLink, type LucideIcon } from "lucide-react";
import { relativeTime, fullDate, type RepoActivity } from "@/lib/github";

/**
 * Виджет активности репозитория: звёзды, форки, открытые вопросы и последние
 * коммиты. Данные приходят с сервера (page.tsx) — в браузере запросов к
 * GitHub нет, иначе каждый посетитель получал бы свой лимит запросов.
 */
export default function RepoActivity({ activity }: { activity: RepoActivity }) {
  const stats: { icon: LucideIcon | null; value: string | number; label: string }[] = [
    { icon: Star, value: activity.stars, label: "звёзд" },
    { icon: GitFork, value: activity.forks, label: "форков" },
    { icon: CircleDot, value: activity.issues, label: "открытых вопросов" },
    ...(activity.language ? [{ icon: null, value: activity.language, label: "язык" }] : []),
    ...(activity.license ? [{ icon: null, value: activity.license, label: "лицензия" }] : []),
  ];

  return (
    <div className="m3-container mb-12 md:mb-16">
      <div className="m3-card p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <img
            src="/images/social/github.svg"
            alt=""
            width={26}
            height={26}
            className="w-[26px] h-[26px] object-contain"
          />
          <h3 className="m3-title-large font-mono" style={{ color: "var(--m3-on-surface)" }}>
            {activity.fullName}
          </h3>
          <span
            className="m3-badge"
            title={fullDate(activity.pushedAt)}
          >
            последний коммит {relativeTime(activity.pushedAt)}
          </span>
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="m3-btn m3-btn-text ml-auto"
          >
            Открыть на GitHub <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
          {stats.map((stat) => (
            <span
              key={stat.label}
              className="flex items-center gap-2 m3-body-medium"
              style={{ color: "var(--m3-on-surface-variant)" }}
            >
              {stat.icon && <stat.icon className="w-4 h-4" style={{ color: "var(--m3-primary)" }} />}
              <strong style={{ color: "var(--m3-on-surface)" }}>{stat.value}</strong> {stat.label}
            </span>
          ))}
        </div>

        <ul className="flex flex-col">
          {activity.commits.map((commit) => (
            <li key={commit.sha}>
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2.5 transition-colors hover:opacity-80"
                style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
              >
                <GitCommitHorizontal
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "var(--m3-primary)" }}
                />
                <span
                  className="hidden sm:block font-mono m3-body-small flex-shrink-0"
                  style={{ color: "var(--m3-outline)" }}
                >
                  {commit.sha}
                </span>
                <span
                  className="flex-1 truncate m3-body-medium"
                  style={{ color: "var(--m3-on-surface)" }}
                  title={commit.message}
                >
                  {commit.message}
                </span>
                <span
                  className="hidden md:block m3-body-small flex-shrink-0"
                  style={{ color: "var(--m3-on-surface-variant)" }}
                >
                  {commit.author}
                </span>
                <span
                  className="m3-body-small flex-shrink-0"
                  style={{ color: "var(--m3-outline)" }}
                  title={fullDate(commit.date)}
                >
                  {relativeTime(commit.date)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
