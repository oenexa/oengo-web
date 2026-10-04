import { MenuItem } from "@/types";
import { formatEUR } from "@/lib/utils";

interface DishCardProps {
  dish: MenuItem;
  onAddToCart: (dish: MenuItem) => void;
}

export function DishCard({ dish, onAddToCart }: DishCardProps) {
  return (
    <div className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-white">{dish.name}</span>
          {dish.badge && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-950 text-orange-400 border border-orange-800/80 whitespace-nowrap">
              {dish.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">{dish.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <div>
          <span className="text-sm font-black text-emerald-400">{formatEUR(dish.priceEUR)}</span>
          <span className="text-[10px] text-slate-500 font-mono ml-1.5">{dish.priceOEN} OEN</span>
        </div>

        <button
          onClick={() => onAddToCart(dish)}
          disabled={!dish.inStock}
          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md"
        >
          {dish.inStock ? "Add +" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
