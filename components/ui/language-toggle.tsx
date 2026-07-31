"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-white rounded-full shadow-md border border-slate-200 p-1">
      <button
        type="button"
        onClick={() => setLanguage("es")}
        className={`text-xs cursor-pointer font-semibold px-3 py-1.5 rounded-full transition-colors ${
          language === "es"
            ? "bg-orange-500 text-white"
            : "text-slate-400 hover:text-slate-600"
        }`}
        aria-label="Español"
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`text-xs cursor-pointer font-semibold px-3 py-1.5 rounded-full transition-colors ${
          language === "en"
            ? "bg-orange-500 text-white"
            : "text-slate-400 hover:text-slate-600"
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}