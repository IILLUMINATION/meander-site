"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import ScrollToTop from "../../../components/ScrollToTop";
import Footer from "../../../components/Footer";
import { getPrevArticle, getNextArticle } from "../../../lib/docs-registry";
import {
  Menu,
  X,
  ArrowLeft,
  Clock,
  Calendar,
  ChevronRight,
  TableOfContents,
} from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(content: string): Heading[] {
  const regex = /^(#{1,4})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[`*]/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^\w\sа-яё-]/gi, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}

interface MetaData {
  date?: string;
  readTime?: string;
  title?: string;
  description?: string;
}

function extractMetaData(content: string): MetaData {
  const meta: MetaData = {};

  const dateMatch = content.match(/последнее обновление:\s*(.+)/i);
  if (dateMatch) meta.date = dateMatch[1].trim();

  const wordCount = content.split(/\s+/).length;
  meta.readTime = `${Math.max(1, Math.ceil(wordCount / 200))} мин`;

  const titleMatch = content.match(/^#\s+(.+)/m);
  if (titleMatch) meta.title = titleMatch[1].trim();

  const descMatch = content.match(/^>\s+(.+)/m);
  if (descMatch) meta.description = descMatch[1].trim();

  return meta;
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [meta, setMeta] = useState<MetaData>({});

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const response = await fetch(`/docs/${slug}.md`);
        if (!response.ok) {
          throw new Error("Статья не найдена");
        }
        const text = await response.text();
        setContent(text);
        setHeadings(extractHeadings(text));
        setMeta(extractMetaData(text));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen m3-surface flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-8 h-8 rounded-full animate-spin mx-auto mb-4"
            style={{
              border: "2px solid var(--m3-outline-variant)",
              borderTopColor: "var(--m3-primary)",
            }}
          />
          <p className="m3-body-small m3-text-secondary">Загрузка статьи...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen m3-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="m3-headline-large mb-4">Статья не найдена</h1>
          <p className="m3-body-medium m3-text-secondary mb-6">{error}</p>
          <Link href="/docs" className="m3-btn m3-btn-filled">
            <ArrowLeft className="w-4 h-4" />
            К документации
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen m3-surface">
      <header className="m3-top-app-bar">
        <div className="m3-top-app-bar-inner">
          <Link href="/docs" className="m3-icon-button" aria-label="К документации">
            <ArrowLeft className="w-5 h-5" />
          </Link>
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

      <section
        className="pt-8 pb-6 md:pb-8 px-4 md:px-6"
        style={{ borderBottom: "1px solid var(--m3-outline-variant)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 m3-body-small mb-4 m3-text-secondary">
            <Link href="/docs" className="hover:underline">
              Документация
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span>{meta.title || slug}</span>
          </div>

          <h1 className="m3-display-medium mb-4">{meta.title || slug}</h1>

          {meta.description && (
            <p className="m3-body-large m3-text-secondary mb-4">
              {meta.description}
            </p>
          )}

          <div className="flex items-center gap-4 m3-body-small m3-text-secondary">
            {meta.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {meta.date}
              </span>
            )}
            {meta.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {meta.readTime} чтения
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        <aside
          className="hidden lg:block w-56 flex-shrink-0 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto"
          style={{ borderRight: "1px solid var(--m3-outline-variant)" }}
        >
          <div className="py-6 px-4">
            <div className="flex items-center gap-2 m3-label-large uppercase tracking-wider mb-4 m3-text-secondary">
              <TableOfContents className="w-3.5 h-3.5" />
              Содержание
            </div>
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="block py-1 m3-body-small m3-text-secondary truncate hover:underline"
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div
          className="lg:hidden sticky top-[64px] z-30 px-4 py-2"
          style={{
            background: "rgba(15, 20, 17, 0.9)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid var(--m3-outline-variant)",
          }}
        >
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-2 m3-body-small m3-text-secondary w-full"
          >
            <TableOfContents className="w-3.5 h-3.5" />
            Содержание
            <ChevronRight
              className="w-3 h-3 ml-auto transition-transform"
              style={{ transform: tocOpen ? "rotate(90deg)" : "none" }}
            />
          </button>
          {tocOpen && (
            <ul
              className="py-3 space-y-1 mt-2"
              style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
            >
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setTocOpen(false)}
                    className="block py-1.5 m3-body-small m3-text-secondary"
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <main className="flex-1 py-8 md:py-12 px-4 md:px-8 lg:px-12 max-w-4xl">
          <MarkdownRenderer content={content} />

          <div
            className="mt-12 md:mt-16 pt-8"
            style={{ borderTop: "1px solid var(--m3-outline-variant)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                const prev = getPrevArticle(slug);
                const next = getNextArticle(slug);
                return (
                  <>
                    {prev ? (
                      <Link href={`/docs/${prev.slug}`} className="m3-card group">
                        <div className="flex items-center gap-2 m3-body-small m3-text-secondary mb-1">
                          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                          Предыдущая
                        </div>
                        <p className="m3-title-medium truncate">{prev.title}</p>
                      </Link>
                    ) : (
                      <Link href="/docs" className="m3-card group">
                        <div className="flex items-center gap-2 m3-body-small m3-text-secondary mb-1">
                          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                          Документация
                        </div>
                        <p className="m3-title-medium">Все статьи</p>
                      </Link>
                    )}
                    {next && (
                      <Link
                        href={`/docs/${next.slug}`}
                        className="m3-card group md:text-right"
                      >
                        <div className="flex items-center gap-2 m3-body-small m3-text-secondary mb-1 md:justify-end">
                          Следующая
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="m3-title-medium truncate">{next.title}</p>
                      </Link>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      <ScrollToTop />
    </div>
  );
}