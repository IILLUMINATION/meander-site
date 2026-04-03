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
  Search,
} from "lucide-react";
import ScrollToTop from "../../components/ScrollToTop";
import { docArticles, getArticlesByCategory, searchArticles, DocArticle } from "../../lib/docs-registry";

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
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getArticlesByCategory();
  const searchResults = searchQuery.length > 0 ? searchArticles(searchQuery) : [];

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
      <div className="max-w-4xl mx-auto">
        {/* Content */}
        <main className="py-8 md:py-12 px-4 md:px-6">
          {/* Search */}
          <div className="relative mb-8 md:mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по документации..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-sm text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm text-neutral-500 mb-3">
                {searchResults.length > 0
                  ? `Найдено: ${searchResults.length}`
                  : "Ничего не найдено"}
              </h3>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600 text-sm">
                    Попробуйте изменить запрос
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Articles Catalog */}
          {searchQuery.length === 0 && (
            <>
              {/* Featured Article */}
              {docArticles.length > 0 && (
                <div className="mb-10">
                  <ArticleCard article={docArticles[0]} featured />
                </div>
              )}

              {/* Categories */}
              {Array.from(categories.entries()).map(([category, articles]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5" />
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {articles.map((article) => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Coming Soon */}
              <div className="mt-12 p-6 border border-neutral-800 border-dashed rounded-xl text-center">
                <p className="text-neutral-600 text-sm">
                  Новые статьи скоро появятся
                </p>
                <p className="text-neutral-700 text-xs mt-1">
                  Есть вопрос? Напишите нам в{" "}
                  <a
                    href="https://t.me/meanderRU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-accent transition-colors"
                  >
                    Telegram
                  </a>
                </p>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="py-6 md:py-8 px-4 md:px-6 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} IILLUMINAT. Meander. Все права защищены.</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}

// Article Card Component
function ArticleCard({ article, featured = false }: { article: DocArticle; featured?: boolean }) {
  return (
    <Link
      href={`/docs/${article.slug}`}
      className={`block group rounded-xl transition-all ${
        featured
          ? "p-5 md:p-6 bg-accent/5 hover:bg-accent/10 border border-accent/20 hover:border-accent/40"
          : "p-4 bg-neutral-900/30 hover:bg-neutral-900/60 border border-neutral-800/50 hover:border-neutral-700"
      }`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className={`flex-shrink-0 rounded-lg ${
          featured ? "p-2.5 bg-accent/10" : "p-2 bg-neutral-800/50"
        }`}>
          <BookOpen className={`w-4 h-4 md:w-5 md:h-5 ${featured ? "text-accent" : "text-neutral-500"}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 group-hover:text-accent transition-colors truncate ${
            featured ? "text-base md:text-lg" : "text-sm"
          }`}>
            {article.title}
          </h3>
          <p className={`leading-relaxed ${
            featured
              ? "text-neutral-500 text-sm md:text-base line-clamp-2"
              : "text-neutral-600 text-xs md:text-sm line-clamp-1"
          }`}>
            {article.description}
          </p>
          {!featured && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-neutral-800/50 rounded text-[10px] text-neutral-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-neutral-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all ${
          featured ? "" : ""
        }`} />
      </div>
    </Link>
  );
}
