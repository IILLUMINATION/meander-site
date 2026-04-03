"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Rocket,
  FolderOpen,
  FileText,
  Image,
  Music,
  Code,
  GitBranch,
  Save,
  Upload,
  Download,
  Settings,
  ChevronRight,
  Menu,
  X,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

const docSections = [
  {
    id: "getting-started",
    title: "Начало работы",
    icon: Rocket,
    items: [
      { id: "installation", title: "Установка и запуск" },
      { id: "interface", title: "Обзор интерфейса" },
      { id: "first-quest", title: "Первый квест за 5 минут" },
    ],
  },
  {
    id: "editor",
    title: "Редактор скриптов",
    icon: Code,
    items: [
      { id: "nodes", title: "Узлы и связи" },
      { id: "conditions", title: "Условия и выборы" },
      { id: "variables", title: "Переменные" },
      { id: "scripts", title: "Скрипты и логика" },
    ],
  },
  {
    id: "media",
    title: "Мультимедиа",
    icon: Image,
    items: [
      { id: "images", title: "Изображения" },
      { id: "audio", title: "Аудио и музыка" },
      { id: "fonts", title: "Кастомные шрифты" },
    ],
  },
  {
    id: "market",
    title: "Маркет",
    icon: FolderOpen,
    items: [
      { id: "publish", title: "Публикация квеста" },
      { id: "reviews", title: "Отзывы и рейтинги" },
      { id: "subscriptions", title: "Подписки" },
    ],
  },
  {
    id: "advanced",
    title: "Продвинутое",
    icon: Settings,
    items: [
      { id: "export", title: "Экспорт и импорт" },
      { id: "format", title: "Формат .mnd" },
      { id: "lua", title: "Поддержка Lua (скоро)" },
    ],
  },
];

const codeExample = `// Пример узла квеста
{
  "id": "node_1",
  "type": "dialog",
  "text": "Вы стоите перед развилкой.",
  "image": "forest.jpg",
  "choices": [
    {
      "text": "Пойти налево",
      "target": "node_left",
      "condition": "has_key == true"
    },
    {
      "text": "Пойти направо",
      "target": "node_right"
    }
  ]
}`;

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("getting-started");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-neutral-900">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/лого свг без фона.svg"
              alt="Meander"
              className="h-7 md:h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-neutral-400 hover:text-foreground transition-colors">
              Главная
            </Link>
            <Link href="/market" className="text-sm text-neutral-400 hover:text-foreground transition-colors">
              Маркет
            </Link>
            <Link href="/branding" className="text-sm text-neutral-400 hover:text-foreground transition-colors">
              Брендинг
            </Link>
            <span className="text-sm text-accent">Документация</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-neutral-900 ${
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center py-6 px-6 space-y-4 bg-background">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-neutral-300 hover:text-accent transition-colors py-2"
            >
              Главная
            </Link>
            <Link
              href="/market"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-neutral-300 hover:text-accent transition-colors py-2"
            >
              Маркет
            </Link>
            <Link
              href="/branding"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-neutral-300 hover:text-accent transition-colors py-2"
            >
              Брендинг
            </Link>
            <span className="text-base text-accent py-2">Документация</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 md:pt-20 pb-8 md:pb-12 px-4 md:px-6 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-accent" strokeWidth={1.5} />
            <span className="text-sm text-neutral-500 uppercase tracking-widest">Документация</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-wider mb-4">
            Всё о <span className="text-accent">Meander</span>
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Полное руководство по созданию и публикации текстовых квестов.
            От установки до продвинутых техник.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r border-neutral-900">
          <div className="py-6 px-4">
            {docSections.map((section) => (
              <div key={section.id} className="mb-6">
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? "" : section.id)}
                  className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 hover:text-accent transition-colors w-full text-left"
                >
                  <section.icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  <span>{section.title}</span>
                  <ChevronRight
                    className={`w-3 h-3 ml-auto text-neutral-600 transition-transform ${
                      activeSection === section.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {activeSection === section.id && (
                  <ul className="ml-6 space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors py-1 block"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] z-40 bg-background/95 backdrop-blur-xl">
            <div className="py-6 px-4 h-full overflow-y-auto">
              {docSections.map((section) => (
                <div key={section.id} className="mb-6">
                  <button
                    onClick={() => setActiveSection(activeSection === section.id ? "" : section.id)}
                    className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 hover:text-accent transition-colors w-full text-left"
                  >
                    <section.icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                    <span>{section.title}</span>
                    <ChevronRight
                      className={`w-3 h-3 ml-auto text-neutral-600 transition-transform ${
                        activeSection === section.id ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {activeSection === section.id && (
                    <ul className="ml-6 space-y-1">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors py-1 block"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 py-8 md:py-12 px-4 md:px-12">
          {/* Test Article Banner */}
          <Link
            href="/docs/test-article"
            className="block mb-12 p-5 md:p-6 bg-accent/5 hover:bg-accent/10 rounded-xl border border-accent/20 hover:border-accent/40 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-accent/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-accent" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-accent uppercase tracking-wider font-medium">Тест</span>
                  <span className="text-xs text-neutral-600">~5 мин чтения</span>
                </div>
                <h3 className="text-base md:text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-1">
                  Создание первого квеста
                </h3>
                <p className="text-neutral-500 text-sm">
                  Полное руководство с картинками, видео, кодом и таблицами — демо всех возможностей рендерера
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-accent group-hover:translate-x-1 transition-all mt-2" />
            </div>
          </Link>

          {/* Quick Start Card */}
          <div className="mb-12 p-6 md:p-8 bg-neutral-900/50 rounded-xl border border-neutral-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Rocket className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-light mb-2">Быстрый старт</h2>
                <p className="text-neutral-400 text-sm md:text-base">
                  Создайте свой первый квест за 5 минут
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
                  1
                </span>
                <div>
                  <p className="text-sm text-neutral-300 font-medium">Создайте новый проект</p>
                  <p className="text-sm text-neutral-500">Откройте Meander и нажмите «Новый квест»</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
                  2
                </span>
                <div>
                  <p className="text-sm text-neutral-300 font-medium">Добавьте первый узел</p>
                  <p className="text-sm text-neutral-500">Напишите текст и добавьте изображение</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
                  3
                </span>
                <div>
                  <p className="text-sm text-neutral-300 font-medium">Создайте ветвление</p>
                  <p className="text-sm text-neutral-500">Добавьте варианты выбора и связи между узлами</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
                  4
                </span>
                <div>
                  <p className="text-sm text-neutral-300 font-medium">Опубликуйте на маркете</p>
                  <p className="text-sm text-neutral-500">Поделитесь квестом с сообществом</p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-light">Формат квеста</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-foreground bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Скопировано" : "Копировать"}
              </button>
            </div>
            <div className="relative bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-neutral-600">quest.mnd</span>
              </div>
              <pre className="p-4 md:p-6 text-sm text-neutral-300 overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12">
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
              <GitBranch className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium mb-2">Ветвящиеся сюжеты</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Создавайте сложные нелинейные истории с условиями, переменными и множественными концовками.
                Визуальный редактор делает процесс интуитивным.
              </p>
              <a href="#conditions" className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover mt-4 transition-colors">
                Подробнее <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
              <Image className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium mb-2">Мультимедиа</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Добавляйте фоны, спрайты персонажей, фоновую музыку и звуковые эффекты.
                Поддержка кастомных шрифтов для уникальной атмосферы.
              </p>
              <a href="#images" className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover mt-4 transition-colors">
                Подробнее <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
              <Save className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium mb-2">Сохранения</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Автосохранение при каждом действии. Несколько слотов сохранений для разных прохождений.
                Экспорт сохранений в файл.
              </p>
              <a href="#export" className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover mt-4 transition-colors">
                Подробнее <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
              <Upload className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium mb-2">Маркет</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Публикуйте квесты, получайте отзывы, набирайте подписчиков.
                Встроенный рейтинг и система рекомендаций.
              </p>
              <a href="#publish" className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover mt-4 transition-colors">
                Подробнее <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* File Format Section */}
          <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-light mb-6">Формат файла .mnd</h2>
            <div className="space-y-4 text-neutral-400 text-sm leading-relaxed">
              <p>
                Файлы квестов Meander используют формат <code className="px-1.5 py-0.5 bg-neutral-900 rounded text-accent text-xs">.mnd</code> — 
                это обычный JSON с дополнительной структурой. Вы можете редактировать его вручную в любом текстовом редакторе.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-900/50 rounded-lg">
                  <FileText className="w-4 h-4 text-accent mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-neutral-300 font-medium">Текст</p>
                  <p className="text-xs text-neutral-600 mt-1">Диалоги и описания</p>
                </div>
                <div className="p-3 bg-neutral-900/50 rounded-lg">
                  <Image className="w-4 h-4 text-accent mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-neutral-300 font-medium">Изображения</p>
                  <p className="text-xs text-neutral-600 mt-1">Фоны и спрайты</p>
                </div>
                <div className="p-3 bg-neutral-900/50 rounded-lg">
                  <Music className="w-4 h-4 text-accent mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-neutral-300 font-medium">Аудио</p>
                  <p className="text-xs text-neutral-600 mt-1">Музыка и звуки</p>
                </div>
                <div className="p-3 bg-neutral-900/50 rounded-lg">
                  <GitBranch className="w-4 h-4 text-accent mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-neutral-300 font-medium">Логика</p>
                  <p className="text-xs text-neutral-600 mt-1">Условия и переменные</p>
                </div>
                <div className="p-3 bg-neutral-900/50 rounded-lg">
                  <Download className="w-4 h-4 text-accent mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-neutral-300 font-medium">Экспорт</p>
                  <p className="text-xs text-neutral-600 mt-1">Импорт/экспорт</p>
                </div>
                <div className="p-3 bg-neutral-900/50 rounded-lg">
                  <Settings className="w-4 h-4 text-accent mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-neutral-300 font-medium">Настройки</p>
                  <p className="text-xs text-neutral-600 mt-1">Тема и шрифты</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 md:p-8 bg-neutral-900/30 rounded-xl border border-neutral-800 text-center">
            <h3 className="text-lg md:text-xl font-light mb-3">Не нашли что искали?</h3>
            <p className="text-neutral-400 text-sm mb-6">
              Задайте вопрос в сообществе или напишите нам напрямую
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://t.me/meanderRU"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors text-sm"
              >
                Telegram канал
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://t.me/mndForum"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-700 hover:border-neutral-500 transition-colors rounded-lg text-sm"
              >
                Форум
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-12 pt-8 border-t border-neutral-900">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться на главную
            </Link>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 md:px-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto text-center text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} IILLUMINAT. Meander. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
