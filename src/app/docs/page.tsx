"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Menu,
  X,
  Search,
  Sparkles,
} from "lucide-react";
import ScrollToTop from "../../components/ScrollToTop";
import Footer from "../../components/Footer";
import {
  docArticles,
  getArticlesByCategory,
  searchArticles,
  DocArticle,
} from "../../lib/docs-registry";

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const categories = getArticlesByCategory();
  const searchResults = searchQuery.length > 0 ? searchArticles(searchQuery) : [];

  return (
    <div className="min-h-screen m3-surface">
      <header className="m3-top-app-bar">
        <div className="m3-top-app-bar-inner">
          <Link href="/" className="m3-logo">
            <img
              src="/images/logo.svg"
              alt="Meander"
              className="h-7 md:h-8 w-auto"
            />
          </Link>

          <nav className="m3-nav-desktop">
            <Link href="/">Главная</Link>
            <Link href="/market">Маркет</Link>
            <Link href="/branding">Брендинг</Link>
            <Link href="/docs" style={{ color: "var(--m3-primary)" }}>
              Документация
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="m3-icon-button m3-nav-toggle"
            aria-label="Меню"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

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
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="m3-drawer-list">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">Главная</Link>
          <Link href="/market" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">Маркет</Link>
          <Link href="/branding" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item">Брендинг</Link>
          <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="m3-drawer-item m3-drawer-item-active">Документация</Link>
        </nav>
      </aside>

      <section className="m3-docs-hero">
        <div className="m3-docs-hero-inner">
          <div className="m3-docs-eyebrow">
            <BookOpen className="w-4 h-4" strokeWidth={2} />
            <span>Документация</span>
          </div>
          <h1 className="m3-display-medium m3-docs-hero-title">
            Всё о <span style={{ color: "var(--m3-primary)" }}>Meander</span>
          </h1>
          <p className="m3-body-large m3-text-secondary m3-docs-hero-subtitle">
            Полное руководство по созданию и публикации текстовых квестов.
            От установки до продвинутых техник.
          </p>

          <div
            className={`m3-search-bar ${searchFocused ? "m3-search-bar-focused" : ""}`}
          >
            <Search className="w-5 h-5 m3-search-icon" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Поиск по документации"
              className="m3-search-input"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="m3-icon-button m3-search-clear"
                aria-label="Очистить"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="m3-docs-main">
        {searchQuery.length > 0 && (
          <div className="m3-docs-section">
            <h3 className="m3-docs-section-title">
              {searchResults.length > 0
                ? `Найдено результатов: ${searchResults.length}`
                : "Ничего не найдено"}
            </h3>
            {searchResults.length > 0 ? (
              <div className="m3-docs-list">
                {searchResults.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <p className="m3-body-medium m3-text-secondary m3-docs-empty">
                Попробуйте изменить запрос
              </p>
            )}
          </div>
        )}

        {searchQuery.length === 0 && (
          <>
            {docArticles.length > 0 && (
              <div className="m3-docs-featured-wrap">
                <FeaturedCard article={docArticles[0]} />
              </div>
            )}

            {Array.from(categories.entries()).map(([category, articles]) => (
              <div key={category} className="m3-docs-section">
                <h3 className="m3-docs-section-title">{category}</h3>
                <div className="m3-docs-list">
                  {articles.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            ))}

            <div className="m3-docs-coming-soon">
              <Sparkles className="w-5 h-5" strokeWidth={1.75} style={{ color: "var(--m3-primary)" }} />
              <div>
                <p className="m3-body-medium" style={{ color: "var(--m3-on-surface)" }}>
                  Новые статьи скоро появятся
                </p>
                <p className="m3-body-small m3-text-secondary">
                  Есть вопрос? Напишите нам в{" "}
                  <a
                    href="https://t.me/meanderRU"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--m3-primary)" }}
                    className="hover:underline"
                  >
                    Telegram
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      <ScrollToTop />
    </div>
  );
}

function FeaturedCard({ article }: { article: DocArticle }) {
  return (
    <Link href={`/docs/${article.slug}`} className="m3-docs-featured">
      <div className="m3-docs-featured-icon">
        <BookOpen className="w-6 h-6" strokeWidth={1.75} />
      </div>
      <div className="m3-docs-featured-body">
        <div className="m3-docs-featured-label">Начни отсюда</div>
        <h3 className="m3-headline-small m3-docs-featured-title">{article.title}</h3>
        <p className="m3-body-medium m3-docs-featured-desc">{article.description}</p>
      </div>
      <ChevronRight className="w-5 h-5 m3-docs-featured-chevron" strokeWidth={2} />
    </Link>
  );
}

function ArticleCard({ article }: { article: DocArticle }) {
  return (
    <Link href={`/docs/${article.slug}`} className="m3-docs-card">
      <div className="m3-docs-card-icon">
        <BookOpen className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <div className="m3-docs-card-body">
        <h3 className="m3-title-medium m3-docs-card-title">{article.title}</h3>
        <p className="m3-body-small m3-docs-card-desc">{article.description}</p>
        {article.tags.length > 0 && (
          <div className="m3-docs-card-tags">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="m3-chip m3-chip-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="w-5 h-5 m3-docs-card-chevron" strokeWidth={2} />
    </Link>
  );
}