"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SupportedLocale } from "@/lib/i18n";

export function LanguageSelector() {
  const { locale, setLocale, locales } = useLanguage();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as SupportedLocale)}
        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer transition appearance-none pr-7 shadow-sm"
        title="Select European Language"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code} className="bg-slate-950 text-white">
            {l.flag} {l.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[10px] text-slate-400">
        ▼
      </span>
    </div>
  );
}
