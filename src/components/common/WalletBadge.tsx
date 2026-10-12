"use client";

import { WalletData } from "@/types";
import { formatEUR, truncateAddress } from "@/lib/utils";

interface WalletBadgeProps {
  wallet: WalletData | null;
  onOpenKYC?: () => void;
  isKYCVerified?: boolean;
}

export function WalletBadge({ wallet, onOpenKYC, isKYCVerified = false }: WalletBadgeProps) {
  if (!wallet) return null;

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-xl">
      {/* Digital Fiat Balance */}
      <div className="pr-3 border-r border-slate-800">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">EUR Wallet</span>
          {isKYCVerified ? (
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
              ✓ Tier 2
            </span>
          ) : (
            <span className="text-[9px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800">
              Tier 0
            </span>
          )}
        </div>
        <div className="text-base font-black text-emerald-400">{formatEUR(wallet.digital.fiatEUR)}</div>
        <div className="text-[10px] text-slate-400">⭐ {wallet.digital.loyaltyPoints} Pts</div>
      </div>

      {/* Crypto OEN Token Section with KYC Lock Indicator */}
      <div className="pl-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Web3 (OEN)</span>
          {!isKYCVerified && onOpenKYC && (
            <button
              onClick={onOpenKYC}
              className="text-[9px] font-mono text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/40 px-1.5 py-0.5 rounded border border-amber-500/40 cursor-pointer flex items-center gap-1 transition"
              title="Verify KYC to unlock high-balance holdings and P2P transfers"
            >
              <span>🔒 Verify KYC</span>
            </button>
          )}
        </div>
        <div className="text-base font-black text-amber-400">
          {parseFloat(wallet.crypto.balanceOEN).toFixed(2)} OEN
        </div>
        <div className="text-[10px] font-mono text-slate-500 truncate max-w-[110px]">
          {truncateAddress(wallet.crypto.address)}
        </div>
      </div>
    </div>
  );
}
