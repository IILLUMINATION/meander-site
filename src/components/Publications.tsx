// Где о Meander пишут и где живёт сообщество. Порядок — от «внешние площадки»
// к «наши каналы»: так видно, что проект заметили со стороны, а не только
// сами себя хвалим. Ссылки стабильные, но при смене чата правим здесь.
//
// Иконки — настоящие логотипы площадок (лежат в public/images/social):
// у Telegram, GitHub, VK, YouTube и SimpleX это официальные знаки из
// simple-icons, у Habr и Pikabu — их собственные файлы с сайтов, потому что
// в наборах иконок их нет.
const PUBLICATIONS = [
  {
    icon: "/images/social/github.svg",
    title: "Telegram-канал на 154 000 подписчиков",
    description: "Пост о Meander в крупном канале про GitHub",
    url: "https://t.me/github/11685",
  },
  {
    icon: "/images/social/habr.png",
    title: "Habr",
    description: "Статья: как создать текстовый квест на телефоне",
    url: "https://habr.com/ru/sandbox/263832/",
  },
  {
    icon: "/images/social/pikabu.png",
    title: "Pikabu",
    description: "Та же статья в песочнице — с обсуждением в комментариях",
    url: "https://pikabu.ru/story/kak_sozdat_tekstovyiy_kvest_na_telefone_13399176",
  },
  {
    icon: "/images/social/telegram.svg",
    title: "Канал на 1 000 подписчиков",
    description: "Упоминание Meander в канале FlutterPulse",
    url: "https://t.me/flutterpulse/3199",
  },
  {
    icon: "/images/social/telegram.svg",
    title: "@mnd_robot",
    description: "Бот в Telegram: играть в квесты прямо в чате, без установки",
    url: "https://t.me/mnd_robot",
  },
  {
    icon: "/images/social/telegram.svg",
    title: "Канал в Telegram",
    description: "Новости, анонсы и конкурсы — @meanderRU",
    url: "https://t.me/meanderRU",
  },
  {
    icon: "/images/social/telegram.svg",
    title: "Чат с модерацией",
    description: "@mndRules — спокойное общение без матов",
    url: "https://t.me/mndRules",
  },
  {
    icon: "/images/social/telegram.svg",
    title: "Свободный чат",
    description: "@mndChat — правила мягче, обсуждаем всё",
    url: "https://t.me/mndChat",
  },
  {
    icon: "/images/social/vk.svg",
    title: "Канал во ВКонтакте",
    description: "Дублируем новости и для тех, кто живёт в ВК",
    url: "https://vk.ru/im/channels/-240977476",
  },
  {
    icon: "/images/social/youtube.svg",
    title: "YouTube",
    description: "Видео о Meander и записи прохождений — @meanderRU",
    url: "https://www.youtube.com/@meanderRU",
  },
  {
    icon: "/images/social/simplex.svg",
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
              <img
                src={item.icon}
                alt=""
                width={22}
                height={22}
                loading="lazy"
                decoding="async"
                className="w-[22px] h-[22px] flex-shrink-0 mt-0.5 object-contain"
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
