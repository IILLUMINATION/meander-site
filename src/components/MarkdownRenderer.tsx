"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Copy, Check, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

function preprocessContent(content: string): string {
  const ytRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})[^\s]*/g;
  content = content.replace(ytRegex, (match) => {
    const videoId = match.match(/([a-zA-Z0-9_-]{11})/)?.[1];
    if (videoId) {
      return `\n\n[YOUTUBE:${videoId}]\n\n`;
    }
    return match;
  });

  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (!src.startsWith("http") && /[^\x00-\x7F]/.test(src)) {
      const encoded = src.split("/").map((part: string) => encodeURIComponent(part)).join("/");
      return `![${alt}](${encoded})`;
    }
    return match;
  });

  return content;
}

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="m3-md-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="m3-md-code">
      <div className="m3-md-code-bar">
        <div className="m3-md-code-dots">
          <span style={{ background: "rgba(239,68,68,0.6)" }} />
          <span style={{ background: "rgba(234,179,8,0.6)" }} />
          <span style={{ background: "rgba(34,197,94,0.6)" }} />
          {language && <span className="m3-md-code-lang">{language}</span>}
        </div>
        <button onClick={handleCopy} className="m3-md-code-copy">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <pre className="m3-md-code-pre">
        <code className="m3-md-code-code">{code}</code>
      </pre>
    </div>
  );
}

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

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\sа-яё-]/gi, "").replace(/\s+/g, "-");
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = useMemo(() => preprocessContent(content), [content]);

  const components = {
    h1: ({ children, ...props }: any) => (
      <h1 id={slugify(extractText(children))} className="m3-md-h1" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 id={slugify(extractText(children))} className="m3-md-h2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 id={slugify(extractText(children))} className="m3-md-h3" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 id={slugify(extractText(children))} className="m3-md-h4" {...props}>
        {children}
      </h4>
    ),

    p: ({ children, ...props }: any) => {
      const text = extractText(children);

      const ytMatch = text.match(/\[YOUTUBE:([a-zA-Z0-9_-]{11})\]/);
      if (ytMatch) {
        return <YouTubeEmbed videoId={ytMatch[1]} />;
      }

      const ytRegex = /\[YOUTUBE:([a-zA-Z0-9_-]{11})\]/g;
      const matches = [...text.matchAll(ytRegex)];

      if (matches.length > 0) {
        const cleanText = text.replace(ytRegex, "").trim();
        const videoIds = matches.map((m) => m[1]);

        return (
          <>
            {cleanText && (
              <p className="m3-md-p" {...props}>
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
        <p className="m3-md-p" {...props}>
          {children}
        </p>
      );
    },

    a: ({ href, children, ...props }: any) => {
      const isExternal = href?.startsWith("http");
      if (href?.startsWith("/")) {
        return (
          <Link href={href} className="m3-md-link" {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="m3-md-link m3-md-link-ext"
          {...props}
        >
          {children}
          {isExternal && <ExternalLink className="w-3 h-3 inline" />}
        </a>
      );
    },

    code: ({ className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");

      if (match || code.includes("\n")) {
        return <CodeBlock code={code} language={match?.[1]} />;
      }

      return (
        <code className="m3-md-inline-code" {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => <>{children}</>,

    blockquote: ({ children, ...props }: any) => (
      <blockquote className="m3-md-quote" {...props}>
        {children}
      </blockquote>
    ),

    img: ({ src, alt, ...props }: any) => (
      <span className="m3-md-img">
        <img src={src} alt={alt || ""} loading="lazy" {...props} />
        {alt && <span className="m3-md-img-caption">{alt}</span>}
      </span>
    ),

    ul: ({ children, ...props }: any) => (
      <ul className="m3-md-ul" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="m3-md-ol" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="m3-md-li" {...props}>
        {children}
      </li>
    ),

    table: ({ children, ...props }: any) => (
      <div className="m3-md-table-wrap">
        <table className="m3-md-table" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    td: ({ children, ...props }: any) => <td {...props}>{children}</td>,

    hr: ({ ...props }: any) => <hr className="m3-md-hr" {...props} />,

    strong: ({ children, ...props }: any) => (
      <strong className="m3-md-strong" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em className="m3-md-em" {...props}>
        {children}
      </em>
    ),
  };

  return (
    <article className="m3-md">
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