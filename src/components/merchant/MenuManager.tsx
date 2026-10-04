import { MenuItem } from "@/types";
import { formatEUR } from "@/lib/utils";

interface MenuManagerProps {
  menu: MenuItem[];
  onToggleStock: (itemId: string, currentStock: boolean) => void;
  onDeleteDish: (itemId: string) => void;
  onOpenAddModal: () => void;
}

export function MenuManager({
  menu,
  onToggleStock,
  onDeleteDish,
  onOpenAddModal
}: MenuManagerProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Catalog &amp; Live Availability</h2>
          <p className="text-xs text-slate-400">
            Toggle sold-out items instantly so customers cannot order unavailable ingredients.
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/10"
        >
          <span>➕ Add New Dish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
              item.inStock
                ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                : "bg-slate-950/60 border-rose-900/40 opacity-70"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-950 text-orange-400 border border-orange-800/80">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-white">{item.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-black text-emerald-400">{formatEUR(item.priceEUR)}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.priceOEN} OEN</div>
                </div>

                {/* Live In-Stock Toggle */}
                <button
                  onClick={() => onToggleStock(item.id, item.inStock)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    item.inStock
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                      : "bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.inStock ? "bg-emerald-400" : "bg-rose-400"}`} />
                  {item.inStock ? "In Stock" : "Sold Out"}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Prep: {item.prepMinutes}m</span>
                <button
                  onClick={() => onDeleteDish(item.id)}
                  className="text-rose-400 hover:text-rose-300 text-xs transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
