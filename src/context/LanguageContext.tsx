"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLocale, SUPPORTED_LOCALES, translations, LocaleDefinition } from "@/lib/i18n";

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (loc: SupportedLocale) => void;
  t: (key: string, fallback?: string) => string;
  locales: LocaleDefinition[];
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  locales: SUPPORTED_LOCALES
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oengo_locale") as SupportedLocale;
      if (saved && translations[saved]) {
        setLocaleState(saved);
      } else {
        // Auto-detect browser language if available
        const navLang = navigator.language.slice(0, 2) as SupportedLocale;
        if (translations[navLang]) {
          setLocaleState(navLang);
        }
      }
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("oengo_locale", newLocale);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[locale] || translations.en;
    if (dict[key]) return dict[key];
    if (translations.en[key]) return translations.en[key];
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, locales: SUPPORTED_LOCALES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
