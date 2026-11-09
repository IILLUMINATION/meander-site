// Снимки и записи от самих игроков: телефоны, планшеты, ноутбуки. Ассеты
// лежат в public/images/devices, исходники — в Downloads у автора, поэтому
// при обновлении подборки менять нужно и файлы, и этот список.
//
// Видео идут с poster и preload="metadata": до нажатия play качается только
// постер, в сумме это доли мегабайта вместо трёх роликов сразу.

type Media = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
};

const MEDIA: Media[] = [
  {
    kind: "image",
    src: "/images/devices/device-01.webp",
    caption: "Ноутбук · главный экран",
    alt: "Meander на ноутбуке: главный экран программы",
    width: 960,
    height: 1280,
  },
  {
    kind: "video",
    src: "/images/devices/clip-desktop.mp4",
    poster: "/images/devices/clip-desktop.webp",
    caption: "Mac · страница квеста",
    alt: "Запись экрана: страница квеста в настольной версии Meander",
    width: 1440,
    height: 932,
  },
  {
    kind: "image",
    src: "/images/devices/device-05.webp",
    caption: "Телефон · редактор квеста",
    alt: "Meander на телефоне: редактор с графом квеста",
    width: 720,
    height: 1280,
  },
  {
    kind: "video",
    src: "/images/devices/clip-ipad.mp4",
    poster: "/images/devices/clip-ipad.webp",
    caption: "Планшет · прохождение в руках",
    alt: "Видео от игрока: прохождение квеста на планшете",
    width: 400,
    height: 400,
  },
  {
    kind: "image",
    src: "/images/devices/device-03.webp",
    caption: "Ноутбук · граф квеста",
    alt: "Meander на ноутбуке: визуальный скрипт с нодами",
    width: 1000,
    height: 750,
  },
  {
    kind: "image",
    src: "/images/devices/device-07.webp",
    caption: "Телефон · каталог",
    alt: "Meander на телефоне: каталог квестов",
    width: 960,
    height: 1280,
  },
  {
    kind: "image",
    src: "/images/devices/device-06.webp",
    caption: "Телефон · демо-квесты",
    alt: "Meander на телефоне: демо-версии квестов",
    width: 720,
    height: 1280,
  },
  {
    kind: "image",
    src: "/images/devices/device-08.webp",
    caption: "Телефон · активность сообщества",
    alt: "Meander на телефоне: лента последних действий сообщества",
    width: 576,
    height: 1280,
  },
  {
    kind: "image",
    src: "/images/devices/device-02.webp",
    caption: "Ноутбук · маркет",
    alt: "Meander на ноутбуке: маркет квестов с категориями",
    width: 1000,
    height: 1334,
  },
  {
    kind: "image",
    src: "/images/devices/device-04.webp",
    caption: "Ноутбук · категории",
    alt: "Meander на ноутбуке: категории и подборки квестов",
    width: 1000,
    height: 750,
  },
  {
    kind: "video",
    src: "/images/devices/clip-welcome.mp4",
    poster: "/images/devices/clip-welcome.webp",
    caption: "Телефон · первый запуск",
    alt: "Запись экрана: первый запуск приложения Meander",
    width: 400,
    height: 400,
  },
];

export default function DeviceShowcase() {
  return (
    <section id="devices" className="py-12 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="m3-headline-medium mb-3 text-center tracking-widest uppercase"
          style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
        >
          на реальных устройствах
        </h2>
        <p
          className="m3-body-medium text-center max-w-2xl mx-auto mb-8 md:mb-12"
          style={{ color: "var(--m3-on-surface-variant)" }}
        >
          Не рендеры и не макеты: снимки и записи от игроков — обычные телефоны,
          планшеты и ноутбуки. Листайте вбок.
        </p>

        <div className="m3-media-strip" tabIndex={0} aria-label="Фото и видео от игроков">
          {MEDIA.map((item) => (
            <figure key={item.src} className="m3-media-item">
              <div className="m3-media-frame">
                {item.kind === "video" ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    width={item.width}
                    height={item.height}
                    controls
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={item.alt}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <figcaption
                className="m3-body-small mt-2"
                style={{ color: "var(--m3-on-surface-variant)" }}
              >
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
