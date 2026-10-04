import { WalletData } from "@/types";
import { formatEUR, truncateAddress } from "@/lib/utils";

interface WalletBadgeProps {
  wallet: WalletData | null;
}

export function WalletBadge({ wallet }: WalletBadgeProps) {
  if (!wallet) return null;

  return (
    <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl">
      <div className="pr-4 border-r border-slate-800">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Digital Wallet</div>
        <div className="text-lg font-black text-emerald-400">{formatEUR(wallet.digital.fiatEUR)}</div>
        <div className="text-[10px] text-slate-400">⭐ {wallet.digital.loyaltyPoints} Cashback Pts</div>
      </div>

      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Web3 Crypto (OEN)</div>
        <div className="text-lg font-black text-amber-400">{parseFloat(wallet.crypto.balanceOEN).toFixed(2)} OEN</div>
        <div className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">
          {truncateAddress(wallet.crypto.address)}
        </div>
      </div>
    </div>
  );
}
