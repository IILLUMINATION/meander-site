"use client";

import { Terminal, Copy, CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ForDevelopers() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("pip install MeanderAPI");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-12 md:py-20 relative">
      <div className="m3-container">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "var(--m3-primary-container)" }}
          >
            <Terminal
              size={24}
              style={{ color: "var(--m3-on-primary-container)" }}
            />
          </div>
          <h2
            className="m3-display-small"
            style={{ color: "var(--m3-on-surface)" }}
          >
            Для разработчиков
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="space-y-6">
            <div className="m3-card h-full">
              <h3 className="m3-title-large mb-4 text-white">Python API</h3>
              <p className="m3-body-medium mb-6 text-gray-300">
                Один из участников нашего сообщества (<strong>HashtagCode</strong>)
                создал удобную библиотеку для работы с API Meander на Python 🐍
              </p>

              <div
                className="flex items-center justify-between p-4 rounded-xl mb-6"
                style={{ backgroundColor: "var(--m3-surface-container-high)" }}
              >
                <code className="text-sm text-green-400 font-mono">pip install MeanderAPI</code>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copied ? (
                    <CheckCircle size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/elitrycraft/MeanderAPI"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  Репозиторий GitHub
                </a>
                <a
                  href="https://pypi.org/project/MeanderAPI/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  PyPI Пакет
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="m3-card h-full flex flex-col justify-center items-center text-center p-10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Terminal size={32} className="text-green-400" />
              </div>
              <h3 className="m3-title-large mb-4 text-white">
                Документация API
              </h3>
              <p className="m3-body-medium mb-8 text-gray-400 max-w-sm">
                Полная документация по REST API Meander: аутентификация, квесты, облачные сохранения, уведомления и ИИ.
              </p>
              <Link 
                href="/api-docs" 
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: "var(--m3-primary)", 
                  color: "black" 
                }}
              >
                Читать документацию
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
