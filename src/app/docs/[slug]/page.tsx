"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import {
  Menu,
  X,
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  ChevronRight,
  TableOfContents,
} from "lucide-react";

// Извлечение заголовков для TOC
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

// Парсинг метаданных из MD
interface MetaData {
  date?: string;
  readTime?: string;
  title?: string;
  description?: string;
}

function extractMetaData(content: string): MetaData {
  const meta: MetaData = {};

  // Дата из последней строки
  const dateMatch = content.match(/последнее обновление:\s*(.+)/i);
  if (dateMatch) meta.date = dateMatch[1].trim();

  // Примерное время чтения
  const wordCount = content.split(/\s+/).length;
  meta.readTime = `${Math.max(1, Math.ceil(wordCount / 200))} мин`;

  // Заголовок из первого h1
  const titleMatch = content.match(/^#\s+(.+)/m);
  if (titleMatch) meta.title = titleMatch[1].trim();

  // Описание из первого blockquote
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Загрузка статьи...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-light mb-4">Статья не найдена</h1>
          <p className="text-neutral-500 text-sm mb-6">{error}</p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            К документации
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-neutral-900">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-neutral-500 hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/лого свг без фона.svg"
                alt="Meander"
                className="h-7 md:h-8 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-neutral-400 hover:text-foreground transition-colors">
              Главная
            </Link>
            <Link href="/market" className="text-sm text-neutral-400 hover:text-foreground transition-colors">
              Маркет
            </Link>
            <Link href="/docs" className="text-sm text-accent">
              Документация
            </Link>
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
            mobileMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
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
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-accent py-2"
            >
              Документация
            </Link>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <section className="pt-24 md:pt-20 pb-6 md:pb-8 px-4 md:px-6 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-4">
            <Link href="/docs" className="hover:text-neutral-400 transition-colors">
              Документация
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-500">{meta.title || slug}</span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wider mb-4">
            {meta.title || slug}
          </h1>

          {meta.description && (
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-4">
              {meta.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-neutral-600">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* TOC Sidebar (Desktop) */}
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r border-neutral-900">
          <div className="py-6 px-4">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              <TableOfContents className="w-3.5 h-3.5" />
              Содержание
            </div>
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className="block py-1 text-sm text-neutral-600 hover:text-neutral-300 transition-colors truncate"
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Mobile TOC Toggle */}
        <div className="lg:hidden sticky top-[73px] z-30 bg-background/90 backdrop-blur-sm border-b border-neutral-900 px-4 py-2">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-2 text-xs text-neutral-500 hover:text-foreground transition-colors"
          >
            <TableOfContents className="w-3.5 h-3.5" />
            Содержание
            <ChevronRight
              className={`w-3 h-3 ml-auto transition-transform ${tocOpen ? "rotate-90" : ""}`}
            />
          </button>
          {tocOpen && (
            <ul className="py-3 space-y-1 border-t border-neutral-900 mt-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setTocOpen(false)}
                    className="block py-1.5 text-sm text-neutral-600 hover:text-neutral-300 transition-colors"
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Article Content */}
        <main className="flex-1 py-8 md:py-12 px-4 md:px-8 lg:px-12 max-w-4xl">
          <MarkdownRenderer content={content} />

          {/* Back to docs */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-neutral-900">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к документации
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
