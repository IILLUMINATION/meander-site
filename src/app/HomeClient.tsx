"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Quest } from "@/lib/quest";
import {
  LayoutGrid,
  GitBranch,
  Image,
  Save,
  Globe,
  Package,
  Smartphone,
  Laptop,
  Monitor,
  Terminal,
  MonitorPlay,
  Apple,
  Menu,
  X,
  Download,
  ChevronRight,
  Copy,
  Code,
} from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import InfoCards from "@/components/InfoCards";
import ForDevelopers from "@/components/ForDevelopers";
import DemoPlayer from "@/components/DemoPlayer";
import DeviceShowcase from "@/components/DeviceShowcase";
import ContestCard from "@/components/ContestCard";
import Publications from "@/components/Publications";
import { DOWNLOAD_LINKS, LICENSE_NAME, RELEASES_REPO, SOURCE_REPO } from "@/lib/downloads";

const features = [
  {
    icon: LayoutGrid,
    title: "Визуальный редактор скриптов",
    description: "Создавайте квесты без написания кода. Интуитивный интерфейс для построения логики.",
  },
  {
    icon: GitBranch,
    title: "Ветвящиеся сюжеты",
    description: "Условия, выборы и множественные концовки. Полная свобода творчества.",
  },
  {
    icon: Image,
    title: "Мультимедиа",
    description: "Поддержка изображений, аудио и кастомных шрифтов для атмосферы.",
  },
  {
    icon: Save,
    title: "Сохранения",
    description: "Автосохранения и слоты сохранений. Без рекламы и ограничений.",
  },
  {
    icon: Globe,
    title: "Маркет квестов",
    description: "Публикуйте свои истории и проходите чужие. Лайки, подписки, отзывы.",
  },
  {
    icon: Package,
    title: "Открытый формат",
    description: "Экспорт/импорт в .mnd. Формат полностью открытый, можно править вручную.",
  },
  {
    icon: Code,
    title: "Открытый исходный код",
    description: "Движок, редактор и маркет — под AGPL-3.0. Форкайте и присылайте pull requests.",
  },
];

const platforms = [
  { name: "Android", icon: Smartphone, type: "android" },
  { name: "iOS", icon: Apple, type: "ios" },
  { name: "macOS", icon: MonitorPlay, type: "macos" },
  { name: "Linux", icon: Terminal, type: "linux" },
  { name: "Windows", icon: Monitor, type: "windows" },
];

const roadmapItems = [
  {
    title: "Сохранения в веб-плеере",
    description: "Продолжать квест в браузере с того же слота, что и в приложении.",
    status: "planned",
  },
  {
    title: "Облачные сохранения",
    description: "Синхронизация слотов между устройствами и платформами.",
    status: "planned",
  },
  {
    title: "Квесты в Telegram",
    description: "Прохождение квестов прямо в чате, без установки приложения.",
    status: "planned",
  },
];

export default function HomeClient({
  topQuests,
  demoQuest,
  contestActive = false,
}: Readonly<{ topQuests: Quest[]; demoQuest?: Quest | null; contestActive?: boolean }>) {
  const [currentPlatform, setCurrentPlatform] = useState("android");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const detectPlatform = () => {
      const ua = navigator.userAgent;
      if (/android/i.test(ua)) {
        return "android";
      } else if (/iPad|iPhone|iPod/.test(ua)) {
        return "ios";
      } else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) {
        return "macos";
      } else if (/Linux/.test(ua)) {
        return "linux";
      } else if (/Windows/.test(ua)) {
        return "windows";
      }
      return "android";
    };

    const platform = detectPlatform();
    setDetectedPlatform(platform);
    setCurrentPlatform(platform);

    const isDesktopPlatform = ["macos", "linux", "windows"].includes(platform);
    const isWideScreen = window.innerWidth >= 768;
    setIsDesktop(isDesktopPlatform && isWideScreen);

    const handleResize = () => {
      setIsDesktop(isDesktopPlatform && window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDownloadLink = (platform: string) => {
    if (platform === "android") {
      return DOWNLOAD_LINKS.android.googlePlay;
    }
    if (platform === "ios") {
      return DOWNLOAD_LINKS.ios.appStore;
    }
    if (platform === "macos") {
      return DOWNLOAD_LINKS.macos.appStore;
    }
    if (platform === "linux") {
      return DOWNLOAD_LINKS.linux.github;
    }
    if (platform === "windows") {
      return DOWNLOAD_LINKS.windows.github;
    }
    return DOWNLOAD_LINKS.android.github;
  };

  // Кнопка магазина приложений: Android, iOS и macOS ставятся из стора,
  // поэтому у них отдельная карточка с бейджем. У macOS ссылка ровно та же,
  // что у iOS: Apple Silicon запускает тот же билд, отдельного нет.
  const storeButton =
    currentPlatform === "android"
      ? {
          href: DOWNLOAD_LINKS.android.googlePlay,
          badge: "/google-play-ru.svg",
          alt: "Доступно в Google Play",
          aria: "Скачать в Google Play",
          note: "Рекомендуемый способ установки",
        }
      : currentPlatform === "macos"
        ? {
            href: DOWNLOAD_LINKS.macos.appStore,
            badge: "/app-store-ru.svg",
            alt: "Загрузите в App Store",
            aria: "Скачать в App Store",
            note: "Тот же билд, что на iPhone: Mac с Apple Silicon (M1 и новее) ставит его из App Store",
          }
        : {
            href: DOWNLOAD_LINKS.ios.appStore,
            badge: "/app-store-ru.svg",
            alt: "Загрузите в App Store",
            aria: "Скачать в App Store",
            note: "Для iPhone и iPad (iOS 15 или новее) — бесплатно в App Store",
          };

  const getAlternativeLinks = (platform: string) => {
    if (platform === "android") {
      const links = DOWNLOAD_LINKS.android;
      return [
        { name: "GitHub (APK)", url: links.github },
        { name: "APKPure", url: links.apkpure },
        { name: "TrashBox", url: links.trashbox },
        { name: "RuStore", url: links.rustore, note: "старая" },
      ];
    }
    if (platform === "macos") {
      // Отдельной сборки под Intel Mac в App Store нет, а .zip в релизах
      // отстаёт от стора: держим ссылку как запасной путь для старых машин.
      return [
        {
          name: "GitHub (.zip для Intel Mac)",
          url: DOWNLOAD_LINKS.macos.github,
          note: "версия отстаёт",
        },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--m3-surface)" }}>
      <header className="m3-top-app-bar">
        <nav className="m3-top-app-bar-inner justify-between">
          <Link href="/" className="m3-logo">
            <img
              src="/images/logo.svg"
              alt="Meander"
              className="h-7 md:h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Link href="#features" className="m3-nav-item">Возможности</Link>
            <Link href="#download" className="m3-nav-item">Скачать</Link>
            <Link href="/market" className="m3-nav-item">Маркет</Link>
            <Link href="#gallery" className="m3-nav-item">Демо</Link>
            {contestActive && (
              <Link href="#events" className="m3-nav-item">Конкурс</Link>
            )}
            <Link href="#publications" className="m3-nav-item">Сообщество</Link>
            <Link href="/branding" className="m3-nav-item">Брендинг</Link>
            <Link href="/docs" className="m3-nav-item">Документация</Link>
            <Link href="#roadmap" className="m3-nav-item">Roadmap</Link>
            <a href="#download" className="m3-btn m3-btn-filled ml-2">
              Скачать
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:!hidden m3-icon-button ml-auto"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

      </header>

      <div
        className={`m3-drawer-scrim md:hidden ${mobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`m3-drawer md:hidden ${mobileMenuOpen ? "is-open" : ""}`}
        aria-hidden={!mobileMenuOpen}
        aria-label="Главное меню"
      >
        <div className="m3-drawer-header">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="m3-icon-button"
            aria-label="Закрыть меню"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="m3-drawer-list">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Возможности
          </Link>
          <Link href="#download" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Скачать
          </Link>
          <Link href="/market" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Маркет
          </Link>
          <hr className="m3-drawer-divider" />
          <Link href="#gallery" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Демо
          </Link>
          {contestActive && (
            <Link href="#events" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
              Конкурс
            </Link>
          )}
          <Link href="#publications" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Сообщество
          </Link>
          <Link href="/branding" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Брендинг
          </Link>
          <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Документация
          </Link>
          <Link href="#roadmap" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">
            Roadmap
          </Link>
        </nav>
        <div className="m3-drawer-footer">
          <a
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            className="m3-btn m3-btn-filled w-full"
          >
            Скачать
          </a>
        </div>
      </aside>

      <section className="min-h-[calc(100svh-4rem)] md:min-h-screen flex flex-col items-center justify-center px-4 pt-14 md:pt-20 pb-8">
        <div className="text-center space-y-5 max-w-4xl">
          <h1 className="m3-display-large" style={{ color: "var(--m3-primary)" }}>
            Meander
          </h1>
          <p className="m3-headline-medium" style={{ color: "var(--m3-on-surface)" }}>
            Текстовые квесты
          </p>
          <p
            className="max-w-2xl mx-auto m3-body-large"
            style={{ color: "var(--m3-on-surface-variant)" }}
          >
            Бесплатная программа для создания и прохождения текстовых квестов.
            Визуальный редактор, ветвящиеся сюжеты и маркет историй.
          </p>
          <p
            className="max-w-2xl mx-auto m3-body-medium"
            style={{ color: "var(--m3-on-surface-variant)" }}
          >
            Есть на Android, iPhone, iPad и Mac (в App Store), а также для
            Windows и Linux. Бесплатно на всех платформах — без рекламы и
            платных подписок.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <a
              href={getDownloadLink(currentPlatform)}
              className="m3-btn m3-btn-filled m3-btn-lg"
            >
              Скачать
            </a>
            <a href="#gallery" className="m3-btn m3-btn-outlined m3-btn-lg">
              Смотреть демо
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-4 md:gap-8 mt-10 md:mt-16">
          <img
            src="/images/phone-mockup-1.png"
            alt="Meander на Android"
            className="h-48 md:h-80 w-auto object-contain"
          />
          <img
            src="/images/phone-mockup-2.png"
            alt="Meander интерфейс"
            className="h-48 md:h-80 w-auto object-contain"
          />
        </div>
      </section>

      <section
        id="features"
        className="py-12 md:py-24 px-4 md:px-6"
        style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            возможности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="m3-card">
                <feature.icon
                  className="w-7 h-7 md:w-8 md:h-8 mb-3"
                  strokeWidth={1.5}
                  style={{ color: "var(--m3-primary)" }}
                />
                <h3 className="m3-title-large mb-2" style={{ color: "var(--m3-on-surface)" }}>
                  {feature.title}
                </h3>
                <p className="m3-body-medium" style={{ color: "var(--m3-on-surface-variant)" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="download"
        className="py-12 md:py-24 px-4 md:px-6"
        style={{ background: "var(--m3-surface-container-lowest)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            скачать
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10">
            {platforms.map((platform) => (
              <button
                key={platform.type}
                onClick={() => setCurrentPlatform(platform.type)}
                className={`m3-chip ${currentPlatform === platform.type ? "is-selected" : ""}`}
              >
                <platform.icon className="w-4 h-4" strokeWidth={1.5} />
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          <div className="m3-download-card mb-8 md:mb-10">
            {currentPlatform === "android" ||
            currentPlatform === "ios" ||
            currentPlatform === "macos" ? (
              <div className="m3-download-android">
                <div className="m3-download-android-main">
                  <a
                    href={storeButton.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={storeButton.aria}
                    style={{ display: "inline-block", lineHeight: 0 }}
                  >
                    <img
                      src={storeButton.badge}
                      alt={storeButton.alt}
                      style={{ height: 56, width: "auto", display: "block" }}
                    />
                  </a>
                  <p
                    className="m3-body-small mt-3 md:max-w-md"
                    style={{ color: "var(--m3-on-surface-variant)" }}
                  >
                    {storeButton.note}
                  </p>
                </div>
                {/* На macOS QR не нужен: тот же Mac и открывает Mac App Store. */}
                {isDesktop && currentPlatform !== "macos" && (
                  <div className="m3-download-qr">
                    <div className="m3-download-qr-frame">
                      <QRCodeSVG
                        value={storeButton.href}
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p
                      className="m3-body-small mt-3"
                      style={{ color: "var(--m3-on-surface-variant)" }}
                    >
                      Сканируй с телефона
                    </p>
                  </div>
                )}
              </div>
            ) : currentPlatform === "linux" && isDesktop ? (
              <div className="m3-download-desktop">
                <div
                  className="p-5 text-left w-full"
                  style={{
                    background: "var(--m3-surface-container-high)",
                    borderRadius: "var(--m3-radius-lg)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-5 h-5" strokeWidth={1.5} style={{ color: "var(--m3-primary)" }} />
                    <span className="m3-label-large" style={{ color: "var(--m3-on-surface-variant)" }}>
                      Установка из AUR (Arch Linux)
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      background: "var(--m3-surface-container-lowest)",
                      borderRadius: "var(--m3-radius-md)",
                      border: "1px solid var(--m3-outline-variant)",
                    }}
                  >
                    <code
                      style={{
                        color: "var(--m3-primary)",
                        fontFamily: "monospace",
                        fontSize: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      yay -S meander-bin
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText("yay -S meander-bin")}
                      className="m3-icon-button ml-auto"
                      aria-label="Копировать команду"
                      style={{ flexShrink: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="m3-body-small mt-3" style={{ color: "var(--m3-on-surface-variant)" }}>
                    Arch Linux, Manjaro, EndeavourOS и другие дистрибутивы на базе Arch
                  </p>
                </div>
                <a
                  href={getDownloadLink("linux")}
                  className="m3-btn m3-btn-text mt-2"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  <span>Скачать AppImage с GitHub</span>
                </a>
              </div>
            ) : (
              <div className="m3-download-desktop">
                <a
                  href={getDownloadLink(currentPlatform)}
                  className="m3-btn m3-btn-filled m3-btn-lg"
                >
                  <Download className="w-5 h-5" strokeWidth={1.5} />
                  <span>
                    Скачать для {platforms.find((p) => p.type === currentPlatform)?.name}
                  </span>
                </a>
                <p
                  className="m3-body-small mt-4"
                  style={{ color: "var(--m3-on-surface-variant)" }}
                >
                  Прямая загрузка с GitHub Releases
                </p>
              </div>
            )}
          </div>

          <p
            className="m3-body-medium mb-4"
            style={{ color: "var(--m3-on-surface-variant)" }}
          >
            Meander бесплатна целиком и на всех платформах: без рекламы и
            платных подписок, весь функционал открыт сразу. iPhone, iPad и Mac
            (Apple Silicon) — в{" "}
            <a
              href={DOWNLOAD_LINKS.ios.appStore}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--m3-primary)" }}
            >
              App Store
            </a>
            , на Mac это тот же билд, что на iPhone. Android — в Google Play,
            сборки для Windows и Linux, а также .zip для старых Intel-Mac — в{" "}
            <a
              href={`${RELEASES_REPO}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--m3-primary)" }}
            >
              архиве релизов
            </a>
            .
          </p>

          <p
            className="m3-body-medium mb-6"
            style={{ color: "var(--m3-on-surface-variant)" }}
          >
            Meander — проект с открытым исходным кодом под лицензией{" "}
            {LICENSE_NAME}: движок, редактор, маркет и этот сайт лежат в{" "}
            <a
              href={SOURCE_REPO}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--m3-primary)" }}
            >
              репозитории на GitHub
            </a>
            . Хотите помочь — присылайте issues и pull requests: пригодятся
            баг-репорты, переводы, квесты и код.
          </p>

          {(currentPlatform === "android" || currentPlatform === "macos") && (
            <div className="m3-download-alt">
              <p
                className="m3-label-large uppercase tracking-widest mb-4"
                style={{ color: "var(--m3-on-surface-variant)", fontSize: "0.75rem" }}
              >
                Альтернативные источники
              </p>
              <div className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-3">
                {getAlternativeLinks(currentPlatform).map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="m3-btn m3-btn-outlined"
                    style={link.note ? { opacity: 0.7 } : undefined}
                  >
                    {link.name}
                    {link.note && (
                      <span className="m3-body-small" style={{ color: "var(--m3-outline)" }}>
                        ({link.note})
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div
            className="mt-10 md:mt-14 pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-center gap-2"
            style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
          >
            <a
              href={`${RELEASES_REPO}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-btn m3-btn-text"
            >
              Архив всех релизов на GitHub
            </a>
            <a
              href={SOURCE_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-btn m3-btn-text"
            >
              Исходный код на GitHub
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            играбельное демо
          </h2>
          <DemoPlayer
            questId={demoQuest?.id ?? "722b40c5-0fab-4877-9a0b-20ea44eb7c67"}
            title={demoQuest?.title ?? "Добро пожаловать в Meander"}
            previewUrl={demoQuest?.preview_image_url ?? "/images/devices/clip-welcome.webp"}
          />
        </div>
      </section>

      <DeviceShowcase />

      {contestActive && <ContestCard />}

      <InfoCards />

      <section
        className="py-12 md:py-24 px-4 md:px-6"
        style={{ background: "var(--m3-surface-container-lowest)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <h2
              className="m3-headline-medium tracking-widest uppercase"
              style={{ color: "var(--m3-on-surface)", fontSize: "1.125rem" }}
            >
              топ квестов
            </h2>
            <Link href="/market" className="m3-btn m3-btn-text">
              Все на маркете <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {topQuests.length > 0 ? (
            <HeroCarousel quests={topQuests} />
          ) : (
            <div className="text-center py-12">
              <p className="m3-body-medium" style={{ color: "var(--m3-on-surface-variant)" }}>
                Пока нет квестов на маркете
              </p>
              <Link href="/market" className="m3-btn m3-btn-text mt-4">
                Станьте первым →
              </Link>
            </div>
          )}
        </div>
      </section>

      <ForDevelopers />

      <Publications />

      <section
        id="roadmap"
        className="py-12 md:py-24 px-4 md:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="m3-headline-medium mb-8 md:mb-12 text-center tracking-widest uppercase"
            style={{ color: "var(--m3-on-surface-variant)", fontSize: "1.125rem" }}
          >
            roadmap
          </h2>
          <div className="space-y-3 md:space-y-4">
            {roadmapItems.map((item, index) => (
              <div key={index} className="m3-card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <h3
                      className="m3-title-large mb-1.5"
                      style={{ color: "var(--m3-on-surface)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="m3-body-medium"
                      style={{ color: "var(--m3-on-surface-variant)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                  <span
                    className={`m3-badge self-start ${
                      item.status === "planned" ? "" : "m3-badge-primary"
                    }`}
                  >
                    {item.status === "planned" ? "Запланировано" : "В работе"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
