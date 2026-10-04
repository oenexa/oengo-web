import { Restaurant } from "@/types";

interface StorefrontBannerProps {
  restaurant: Restaurant;
}

export function StorefrontBanner({ restaurant }: StorefrontBannerProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{restaurant.icon}</span>
          <h2 className="text-xl font-black text-white">{restaurant.name}</h2>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            {restaurant.isOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{restaurant.tagline}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {restaurant.address} • Delivery: ~{restaurant.prepEtaMinutes + 12} mins
        </p>
      </div>

      <div className="text-right">
        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60 inline-block">
          95% Revenue to Chef
        </div>
      </div>
    </div>
  );
}
