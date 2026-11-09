import { Bot, MessageSquare, Newspaper, Send, Shield, Users, Youtube } from "lucide-react";

// Где о Meander пишут и где живёт сообщество. Порядок — от «внешние площадки»
// к «наши каналы»: так видно, что проект заметили со стороны, а не только
// сами себя хвалим. Ссылки стабильные, но при смене чата правим здесь.
const PUBLICATIONS = [
  {
    icon: Users,
    title: "Telegram-канал на 154 000 подписчиков",
    description: "Пост о Meander в крупном канале про GitHub",
    url: "https://t.me/github/11685",
  },
  {
    icon: Newspaper,
    title: "Habr",
    description: "Статья: как создать текстовый квест на телефоне",
    url: "https://habr.com/ru/sandbox/263832/",
  },
  {
    icon: Newspaper,
    title: "Pikabu",
    description: "Та же статья в песочнице — с обсуждением в комментариях",
    url: "https://pikabu.ru/story/kak_sozdat_tekstovyiy_kvest_na_telefone_13399176",
  },
  {
    icon: Users,
    title: "Канал на 1 000 подписчиков",
    description: "Упоминание Meander в канале FlutterPulse",
    url: "https://t.me/flutterpulse/3199",
  },
  {
    icon: Bot,
    title: "@mnd_robot",
    description: "Бот в Telegram: играть в квесты прямо в чате, без установки",
    url: "https://t.me/mnd_robot",
  },
  {
    icon: Send,
    title: "Канал в Telegram",
    description: "Новости, анонсы и конкурсы — @meanderRU",
    url: "https://t.me/meanderRU",
  },
  {
    icon: MessageSquare,
    title: "Чат с модерацией",
    description: "@mndRules — спокойное общение без матов",
    url: "https://t.me/mndRules",
  },
  {
    icon: MessageSquare,
    title: "Свободный чат",
    description: "@mndChat — правила мягче, обсуждаем всё",
    url: "https://t.me/mndChat",
  },
  {
    icon: Send,
    title: "Канал во ВКонтакте",
    description: "Дублируем новости и для тех, кто живёт в ВК",
    url: "https://vk.ru/im/channels/-240977476",
  },
  {
    icon: Youtube,
    title: "YouTube",
    description: "Видео о Meander и записи прохождений — @meanderRU",
    url: "https://www.youtube.com/@meanderRU",
  },
  {
    icon: Shield,
    title: "Чат в SimpleX",
    description: "Приватное общение без номера телефона и аккаунта",
    url: "https://smp8.simplex.im/c#CzSNY5nCRjC1CAI79TaFH7hW2PO1ndX24TIqBjxb9KY",
  },
];

export default function Publications() {
  return (
    <section id="publications" className="py-12 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="m3-headline-medium mb-3 text-center tracking-widest uppercase"
          style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
        >
          публикации и сообщества
        </h2>
        <p
          className="m3-body-medium text-center max-w-2xl mx-auto mb-8 md:mb-12"
          style={{ color: "var(--m3-on-surface-variant)" }}
        >
          Официальный сайт программы — meander.sbs, исходный код — в репозитории
          на GitHub. А это площадки, где о Meander писали, и каналы, где
          собрались авторы и игроки.
        </p>

        <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLICATIONS.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-card-outlined flex items-start gap-3 transition-colors"
            >
              <item.icon
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                strokeWidth={1.5}
                style={{ color: "var(--m3-primary)" }}
              />
              <span className="flex-1">
                <span
                  className="m3-label-large block mb-1"
                  style={{ color: "var(--m3-on-surface)" }}
                >
                  {item.title}
                </span>
                <span
                  className="m3-body-small block"
                  style={{ color: "var(--m3-on-surface-variant)" }}
                >
                  {item.description}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
