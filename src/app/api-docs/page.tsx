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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--m3-surface)" }}>
      <header className="m3-top-app-bar">
        <nav className="m3-top-app-bar-inner justify-between">
          <Link href="/#developers" className="m3-logo flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" style={{ color: "var(--m3-on-surface)" }} />
            </div>
            <span className="font-bold text-lg" style={{ color: "var(--m3-on-surface)" }}>На главную</span>
          </Link>
          
          <a
            href="/api-docs.md"
            download="Meander_API_Docs.md"
            className="m3-btn m3-btn-filled"
          >
            <Download className="w-4 h-4 md:mr-2" />
            <span className="hidden sm:inline">Скачать .md</span>
          </a>
        </nav>
      </header>

      <main className="flex-1 w-full pt-[80px] pb-12 flex justify-center">
        <div className="w-full max-w-4xl px-4 md:px-8 mt-8">
          <div className="m3-card p-6 md:p-12">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
