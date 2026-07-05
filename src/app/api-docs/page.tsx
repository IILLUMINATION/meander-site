import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Footer from "@/components/Footer";

export default async function ApiDocsPage() {
  const filePath = path.join(process.cwd(), "public", "api-docs.md");
  const content = fs.readFileSync(filePath, "utf8");

  return (
    <div className="min-h-screen bg-[#0C0F11] text-white flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-[#0C0F11]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>На главную</span>
          </Link>
          
          <a
            href="/api-docs.md"
            download="Meander_API_Docs.md"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Скачать .md</span>
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="bg-[#1A1D1F] border border-white/5 rounded-2xl p-6 md:p-12 shadow-xl">
          <MarkdownRenderer content={content} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
