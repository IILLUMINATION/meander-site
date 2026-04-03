"use client";

import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { Copy, Check, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

// Компонент для YouTube видео
function YouTubeEmbed({ url }: { url: string }) {
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )?.[1];

  if (!videoId) return null;

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
  const [copied, setCopied] = useState(false);

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

// Извлечение YouTube URL из текста
function extractYouTubeUrls(text: string): { text: string; videos: string[] } {
  const ytRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}(?:[^\s]*)?/g;
  const videos = text.match(ytRegex) || [];
  const cleanedText = text.replace(ytRegex, "").trim();
  return { text: cleanedText, videos };
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Мемоизируем обработку контента
  const processedContent = useMemo(() => {
    return content;
  }, [content]);

  // Кастомные компоненты для рендеринга
  const components = {
    // Заголовки
    h1: ({ children, ...props }: any) => (
      <h1 className="text-2xl md:text-4xl font-light tracking-wider mt-8 md:mt-12 mb-4 md:mb-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl md:text-2xl font-light mt-8 md:mt-10 mb-3 md:mb-4" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-base md:text-lg font-medium mt-6 mb-2" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 className="text-sm md:text-base font-medium mt-4 mb-2" {...props}>
        {children}
      </h4>
    ),

    // Параграфы с обработкой YouTube
    p: ({ children, ...props }: any) => {
      const textContent = typeof children === "string" ? children : "";
      const { text, videos } = extractYouTubeUrls(textContent);

      return (
        <>
          {text && (
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4" {...props}>
              {text}
            </p>
          )}
          {videos.map((url, i) => (
            <YouTubeEmbed key={i} url={url} />
          ))}
          {!text && videos.length === 0 && (
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4" {...props}>
              {children}
            </p>
          )}
        </>
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
      <figure className="my-6 md:my-8">
        <img
          src={src}
          alt={alt || ""}
          className="w-full rounded-xl border border-neutral-800"
          loading="lazy"
          {...props}
        />
        {alt && (
          <figcaption className="text-center text-xs text-neutral-600 mt-2 italic">
            {alt}
          </figcaption>
        )}
      </figure>
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
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
}
