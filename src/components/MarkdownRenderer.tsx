"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Copy, Check, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

// Препроцессинг MD контента
function preprocessContent(content: string): string {
  // Заменяем YouTube ссылки на специальный маркер
  const ytRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})[^\s]*/g;
  content = content.replace(ytRegex, (match) => {
    const videoId = match.match(/([a-zA-Z0-9_-]{11})/)?.[1];
    if (videoId) {
      return `\n\n[YOUTUBE:${videoId}]\n\n`;
    }
    return match;
  });

  // Кодируем пути к изображениям с кириллицей
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    // Если путь относительный и содержит кириллицу — кодируем
    if (!src.startsWith('http') && /[^\x00-\x7F]/.test(src)) {
      const encoded = src.split('/').map((part: string) => encodeURIComponent(part)).join('/');
      return `![${alt}](${encoded})`;
    }
    return match;
  });

  return content;
}

// Компонент для YouTube видео
function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="my-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

// Компонент блока кода с кнопкой копирования
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          {language && (
            <span className="ml-2 text-xs text-neutral-600 font-mono">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-500 hover:text-foreground bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <pre className="p-4 md:p-5 overflow-x-auto">
        <code className="text-sm text-neutral-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// Рекурсивное извлечение текста из React элементов
function extractText(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    return extractText(children.props.children);
  }
  return String(children || "");
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = useMemo(() => preprocessContent(content), [content]);

  const components = {
    // Заголовки с id для якорей
    h1: ({ children, ...props }: any) => {
      const text = extractText(children);
      const id = text.toLowerCase().replace(/[^\w\sа-яё-]/gi, "").replace(/\s+/g, "-");
      return (
        <h1 id={id} className="text-2xl md:text-4xl font-light tracking-wider mt-8 md:mt-12 mb-4 md:mb-6" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: any) => {
      const text = extractText(children);
      const id = text.toLowerCase().replace(/[^\w\sа-яё-]/gi, "").replace(/\s+/g, "-");
      return (
        <h2 id={id} className="text-xl md:text-2xl font-light mt-8 md:mt-10 mb-3 md:mb-4" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const text = extractText(children);
      const id = text.toLowerCase().replace(/[^\w\sа-яё-]/gi, "").replace(/\s+/g, "-");
      return (
        <h3 id={id} className="text-base md:text-lg font-medium mt-6 mb-2" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }: any) => {
      const text = extractText(children);
      const id = text.toLowerCase().replace(/[^\w\sа-яё-]/gi, "").replace(/\s+/g, "-");
      return (
        <h4 id={id} className="text-sm md:text-base font-medium mt-4 mb-2" {...props}>
          {children}
        </h4>
      );
    },

    // Параграфы с обработкой YouTube маркеров
    p: ({ children, ...props }: any) => {
      const text = extractText(children);

      // Проверяем на YouTube маркер
      const ytMatch = text.match(/\[YOUTUBE:([a-zA-Z0-9_-]{11})\]/);
      if (ytMatch) {
        return <YouTubeEmbed videoId={ytMatch[1]} />;
      }

      // Проверяем содержит ли текст YouTube маркер вместе с другим текстом
      const ytRegex = /\[YOUTUBE:([a-zA-Z0-9_-]{11})\]/g;
      const matches = [...text.matchAll(ytRegex)];

      if (matches.length > 0) {
        const cleanText = text.replace(ytRegex, "").trim();
        const videoIds = matches.map(m => m[1]);

        return (
          <>
            {cleanText && (
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4" {...props}>
                {children}
              </p>
            )}
            {videoIds.map((id, i) => (
              <YouTubeEmbed key={i} videoId={id} />
            ))}
          </>
        );
      }

      return (
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4" {...props}>
          {children}
        </p>
      );
    },

    // Ссылки
    a: ({ href, children, ...props }: any) => {
      const isExternal = href?.startsWith("http");
      if (href?.startsWith("/")) {
        return (
          <Link href={href} className="text-accent hover:text-accent-hover transition-colors" {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
          {...props}
        >
          {children}
          {isExternal && <ExternalLink className="w-3 h-3 inline" />}
        </a>
      );
    },

    // Код
    code: ({ className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");

      // Блочный код
      if (match || code.includes("\n")) {
        return <CodeBlock code={code} language={match?.[1]} />;
      }

      // Инлайн код
      return (
        <code className="px-1.5 py-0.5 bg-neutral-900 rounded text-accent text-xs font-mono" {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => <>{children}</>,

    // Цитаты
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        className="pl-4 md:pl-5 py-3 md:py-4 my-4 md:my-6 border-l-2 border-accent/40 bg-neutral-900/30 rounded-r-lg text-neutral-300 text-sm md:text-base"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Изображения
    img: ({ src, alt, ...props }: any) => (
      <span className="block my-6 md:my-8">
        <img
          src={src}
          alt={alt || ""}
          className="max-w-full max-h-[70vh] w-auto h-auto rounded-xl border border-neutral-800 mx-auto block"
          loading="lazy"
          {...props}
        />
        {alt && (
          <span className="block text-center text-xs text-neutral-600 mt-2 italic">
            {alt}
          </span>
        )}
      </span>
    ),

    // Списки
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside space-y-1.5 mb-4 text-neutral-400 text-sm md:text-base" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside space-y-1.5 mb-4 text-neutral-400 text-sm md:text-base" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="pl-1 leading-relaxed" {...props}>
        {children}
      </li>
    ),

    // Таблицы
    table: ({ children, ...props }: any) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-neutral-900" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-4 py-3 text-left text-neutral-300 font-medium border-b border-neutral-800" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-4 py-2.5 text-neutral-400 border-b border-neutral-800/50" {...props}>
        {children}
      </td>
    ),

    // Горизонтальная линия
    hr: ({ ...props }: any) => (
      <hr className="my-8 border-neutral-800" {...props} />
    ),

    // Жирный и курсив
    strong: ({ children, ...props }: any) => (
      <strong className="text-neutral-200 font-medium" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em className="text-neutral-300 italic" {...props}>
        {children}
      </em>
    ),
  };

  return (
    <article className="prose-docs">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        urlTransform={(url) => url}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
}
