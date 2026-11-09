import { ExternalLink, Trophy } from "lucide-react";

// Карточка текущего события: чистая разметка без логики. Решает, показывать
// ли её, HomeClient по флагу contestActive из page.tsx — дата окончания
// конкурса (31 декабря 2026) лежит в lib/contest. Новое событие — меняем дату
// там или подменяем содержимое этой карточки.
const CONTEST_POST = "https://t.me/meanderRU/2118";
const CONTEST_RULES = "https://teletype.in/@meanderru/ZP9GHH861hR";

const PRIZES = [
  { place: "1 место", prize: "4 000 ₽", extra: "стартовый экран, галочка, ачивка и легендарное оформление профиля" },
  { place: "2 место", prize: "1 800 ₽", extra: "стартовый экран, галочка, ачивка и эпическое оформление профиля" },
  { place: "3 место", prize: "1 000 ₽", extra: "стартовый экран, галочка, ачивка и редкое оформление профиля" },
];

export default function ContestCard() {
  return (
    <section
      id="events"
      className="py-12 md:py-24 px-4 md:px-6"
      style={{ background: "var(--m3-surface-container-lowest)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-10">
          <h2
            className="m3-headline-medium tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface)", fontSize: "1.125rem" }}
          >
            события
          </h2>
          <span className="m3-badge m3-badge-primary">идёт сейчас</span>
        </div>

        <div className="m3-card p-5 md:p-8">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
            <img
              src="/images/contest-poster.webp"
              alt="Постер конкурса квестов Meander: призовой фонд 6 800 ₽"
              width={1200}
              height={718}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
              style={{ borderRadius: "var(--m3-radius-lg)" }}
            />

            <div>
              <h3
                className="m3-title-large mb-3"
                style={{ color: "var(--m3-on-surface)" }}
              >
                Конкурс квестов: лучший короткий квест для новичков
              </h3>
              <p
                className="m3-body-medium mb-5"
                style={{ color: "var(--m3-on-surface-variant)" }}
              >
                Ищем историю, которая с первых секунд влюбит новичка в Meander:
                примерно 10 минут прохождения, красивый визуал, звук и развилки.
                Жанр — любой популярный: детектив, выживание, сай-фай, мистика,
                триллер или приключения. Призовой фонд — 6 800 ₽.
              </p>

              <ul className="space-y-2 mb-5">
                {PRIZES.map((row) => (
                  <li key={row.place} className="flex flex-wrap items-baseline gap-x-2">
                    <Trophy
                      className="w-4 h-4 self-center"
                      strokeWidth={1.5}
                      style={{ color: "var(--m3-primary)" }}
                    />
                    <span className="m3-label-large" style={{ color: "var(--m3-on-surface)" }}>
                      {row.place}: {row.prize}
                    </span>
                    <span
                      className="m3-body-small"
                      style={{ color: "var(--m3-on-surface-variant)" }}
                    >
                      + {row.extra}
                    </span>
                  </li>
                ))}
                <li className="flex items-baseline gap-x-2">
                  <Trophy
                    className="w-4 h-4 self-center"
                    strokeWidth={1.5}
                    style={{ color: "var(--m3-outline)" }}
                  />
                  <span className="m3-body-small" style={{ color: "var(--m3-on-surface-variant)" }}>
                    всем допущенным участникам — памятная ачивка конкурса и редкое
                    оформление профиля
                  </span>
                </li>
              </ul>

              <p
                className="m3-body-medium mb-5"
                style={{ color: "var(--m3-on-surface-variant)" }}
              >
                Квесты трёх победителей станут витриной Meander: их закрепят на
                главном экране, и новые игроки будут знакомиться с платформой
                именно с этих историй.
              </p>

              <p
                className="m3-label-large mb-5"
                style={{ color: "var(--m3-on-surface)" }}
              >
                Приём работ — до 31 декабря 2026 года. Создайте квест в Meander и
                пришлите ссылку в комментарии или в личные сообщения сообщества с
                пометкой #Конкурс.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={CONTEST_POST}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m3-btn m3-btn-filled"
                >
                  <ExternalLink size={16} />
                  Пост о конкурсе в Telegram
                </a>
                <a
                  href={CONTEST_RULES}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m3-btn m3-btn-outlined"
                >
                  <ExternalLink size={16} />
                  Критерии и баллы
                </a>
              </div>

              <p
                className="m3-body-small mt-5"
                style={{ color: "var(--m3-outline)" }}
              >
                Призы денежные и отправляются через Boosty; участникам из Украины
                выдать их не получится.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
