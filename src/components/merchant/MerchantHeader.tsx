import Link from "next/link";
import { RestaurantProfile } from "@/types";

interface MerchantHeaderProps {
  profile: RestaurantProfile | null;
  soundAlert: boolean;
  onToggleSound: () => void;
  onToggleStoreOpen: () => void;
}

export function MerchantHeader({
  profile,
  soundAlert,
  onToggleSound,
  onToggleStoreOpen
}: MerchantHeaderProps) {
  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">👨‍🍳</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                {profile?.name || "Napoli Woodfire Pizza"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-800">
                Partner Portal
              </span>
              <button
                onClick={onToggleStoreOpen}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  profile?.isOpen
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                    : "bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    profile?.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                  }`}
                />
                {profile?.isOpen ? "OPEN & ACCEPTING" : "STORE CLOSED"}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {profile?.address || "Via Toledo 42, Napoli"} • ⭐ {profile?.rating || 4.9} (342 reviews) • 95% Merchant Revenue Retained
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-3">
        <button
          onClick={onToggleSound}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
            soundAlert
              ? "bg-slate-900 text-orange-400 border-orange-800/80"
              : "bg-slate-900 text-slate-500 border-slate-800"
          }`}
        >
          <span>{soundAlert ? "🔔 Chime Active" : "🔕 Chime Muted"}</span>
        </button>

        <Link
          href="/"
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-lg shadow-orange-500/10 cursor-pointer"
        >
          <span>🍔 Customer App</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </header>
  );
}
