import { Restaurant } from "@/types";
import { formatEUR } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected: boolean;
  onSelect: (restaurant: Restaurant) => void;
}

export function RestaurantCard({
  restaurant,
  isSelected,
  onSelect
}: RestaurantCardProps) {
  return (
    <button
      onClick={() => onSelect(restaurant)}
      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
        isSelected
          ? "bg-slate-900 border-orange-500 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/40"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{restaurant.icon}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            ⭐ {restaurant.rating} ({restaurant.reviewCount})
          </span>
        </div>
        <h3 className="text-base font-black text-white">{restaurant.name}</h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{restaurant.tagline}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
        <span>⏱️ {restaurant.prepEtaMinutes + 10}m</span>
        <span>🛵 {formatEUR(restaurant.deliveryFeeEUR)} delivery</span>
      </div>
    </button>
  );
}
