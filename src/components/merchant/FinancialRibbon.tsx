import { RestaurantProfile } from "@/types";
import { formatEUR, formatOEN } from "@/lib/utils";

interface FinancialRibbonProps {
  profile: RestaurantProfile | null;
  activeCount: number;
}

export function FinancialRibbon({ profile, activeCount }: FinancialRibbonProps) {
  const grossRev = profile?.stats.grossRevenueTodayEUR || 748.50;
  const retainedPct = profile?.stats.commissionRetainedPct || 95;
  const savings = profile?.stats.legacyLostRevenueEUR || 187.12;
  const avgPrep = profile?.stats.avgPrepTimeMinutes || 14;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Today&apos;s Revenue</div>
        <div className="text-2xl font-black text-emerald-400 mt-1">{formatEUR(grossRev)}</div>
        <div className="text-[11px] text-slate-500 mt-0.5">+{formatOEN(grossRev)}</div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Revenue Retained</div>
        <div className="text-2xl font-black text-white mt-1">{retainedPct}%</div>
        <div className="text-[11px] text-orange-400 font-semibold mt-0.5">
          Only 5% platform cut vs 30% legacy
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Legacy Tax Saved</div>
        <div className="text-2xl font-black text-amber-400 mt-1">+{formatEUR(savings)}</div>
        <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
          Kept directly in merchant pocket
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Active Pipeline</div>
        <div className="text-2xl font-black text-orange-400 mt-1">{activeCount} Orders</div>
        <div className="text-[11px] text-slate-500 mt-0.5">Avg prep: {avgPrep} mins</div>
      </div>
    </div>
  );
}
