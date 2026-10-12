"use client";

import { useLanguage } from "@/context/LanguageContext";

export function StorefrontHero() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-[360px] bg-gradient-to-r from-orange-600 via-amber-500 to-rose-600 overflow-hidden mb-12">
      {/* Abstract Background Patterns */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 150%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% -50%, #000000 0%, transparent 50%)' 
        }}
      />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-10 -right-20 w-80 h-80 bg-black/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-start z-10">
        <span className="px-3.5 py-1 mb-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest shadow-xl">
          {t("hero.badge", "🚀 Zero-Fee Decentralized Delivery")}
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl leading-tight">
          {t("hero.title1", "Crave it?")} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-100">
            {t("hero.title2", "OENGO it.")}
          </span>
        </h1>
        <p className="mt-4 text-white/85 font-medium max-w-lg text-lg drop-shadow-md leading-relaxed">
          {t("hero.subtitle", "Experience ultra-fast delivery powered by transparent blockchain escrows. No hidden service fees.")}
        </p>
      </div>

      {/* Gradient Fade to Page Content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  );
}
