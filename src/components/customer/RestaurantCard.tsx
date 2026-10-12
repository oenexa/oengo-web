"use client";

import { useState, useEffect } from "react";
import { Restaurant, MenuItem } from "@/types";
import { formatEUR } from "@/lib/utils";
import { getRestaurantMenu } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected: boolean;
  onSelect: (restaurant: Restaurant) => void;
  onAddToCart?: (dish: MenuItem) => void;
  onCustomize?: (dish: MenuItem) => void;
}

export function RestaurantCard({
  restaurant,
  isSelected,
  onSelect,
  onAddToCart,
  onCustomize
}: RestaurantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isSelected && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isSelected]);

  const handleToggleExpand = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(restaurant);
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);

    if (nextExpanded && menu.length === 0) {
      setLoadingMenu(true);
      try {
        const items = await getRestaurantMenu(restaurant.id);
        setMenu(items);
      } catch {
        setMenu([]);
      } finally {
        setLoadingMenu(false);
      }
    }
  };

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className={`rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? "bg-slate-900/90 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/40"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
      }`}
    >
      {/* 1. Header Frame Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
            {restaurant.icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center gap-1 shadow-sm">
              <span>⭐</span> {restaurant.rating} ({restaurant.reviewCount})
            </span>
            <span className="text-[10px] font-mono text-orange-400/90 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-900/40">
              {t("directory.payoutGuaranteed", "95% Payout")}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-black text-white tracking-tight leading-snug group-hover:text-orange-400 transition">
          {restaurant.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {restaurant.tagline}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span>⏱️</span> {restaurant.prepEtaMinutes + 10} mins
          </span>
          <span className="flex items-center gap-1">
            <span>🛵</span> {formatEUR(restaurant.deliveryFeeEUR)}
          </span>
        </div>
      </div>

      {/* 2. Interactive Trigger Frame Pill */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={handleToggleExpand}
          className={`w-full py-2.5 px-3 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            isExpanded
              ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
              : "bg-slate-950/80 hover:bg-slate-800 text-orange-400 border border-orange-500/20 hover:border-orange-500/40"
          }`}
        >
          <span>{isExpanded ? t("directory.closeMenu", "📖 Close Interactive Menu") : t("directory.openMenu", "⚡ Open Menu Frame")}</span>
          <span className={`text-[10px] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
      </div>

      {/* 3. Animated Interior Menu Frame Container */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden border-t ${
          isExpanded
            ? "max-h-[520px] opacity-100 border-slate-800 bg-slate-950/80"
            : "max-h-0 opacity-0 border-transparent bg-transparent"
        }`}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {t("directory.openMenu", "Interactive Menu Frame")}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              {t("directory.liveSync", "Live Kitchen Sync")}
            </span>
          </div>

          {loadingMenu ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{t("directory.loadingDishes", "Loading kitchen specialties...")}</span>
            </div>
          ) : menu.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              {t("directory.noDishes", "Click on the restaurant to load active menu items.")}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {menu.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-orange-500/40 transition group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-300 transition">
                        {item.name}
                      </h4>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-950 text-orange-400 border border-orange-900/50">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {formatEUR(item.priceEUR)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.priceOEN} OEN
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.customizations && item.customizations.length > 0 && onCustomize && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCustomize(item);
                        }}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
                        title="Customize item"
                      >
                        ⚙️
                      </button>
                    )}

                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.customizations && item.customizations.length > 0 && onCustomize) {
                            onCustomize(item);
                          } else {
                            onAddToCart(item);
                          }
                        }}
                        disabled={!item.inStock}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs transition shadow-sm cursor-pointer"
                      >
                        {item.inStock ? t("directory.addToCart", "Add +") : t("directory.soldOut", "Sold Out")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
