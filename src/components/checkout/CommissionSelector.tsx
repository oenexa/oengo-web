import { formatEUR } from "@/lib/utils";

interface CommissionSelectorProps {
  commissionPct: number;
  foodSubtotal: number;
  disabled?: boolean;
  onUpdateCommission: (rate: number) => void;
}

export function CommissionSelector({
  commissionPct,
  foodSubtotal,
  disabled,
  onUpdateCommission
}: CommissionSelectorProps) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Commission Setup</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-800/80">
          {commissionPct}% {commissionPct === 5 ? "(Default)" : "(Custom)"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1 mb-2">
        {[0, 3, 5, 10].map(rate => (
          <button
            key={rate}
            type="button"
            disabled={disabled}
            onClick={() => onUpdateCommission(rate)}
            className={`py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer disabled:opacity-50 ${
              commissionPct === rate
                ? "bg-orange-500 text-slate-950 font-black shadow"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {rate}%
          </button>
        ))}
      </div>
      <div className="text-[10px] text-slate-400 flex justify-between">
        <span>Chef Payout ({100 - commissionPct}%):</span>
        <span className="text-emerald-400 font-semibold">
          {formatEUR(foodSubtotal * (1 - commissionPct / 100))}
        </span>
      </div>
    </div>
  );
}
