import { RestaurantProfile } from "@/types";
import { formatEUR } from "@/lib/utils";

interface VaultAnalyticsProps {
  profile: RestaurantProfile | null;
}

export function VaultAnalytics({ profile }: VaultAnalyticsProps) {
  const fiatBal = profile?.fiatBalanceEUR || 1250.00;
  const cryptoAddr = profile?.cryptoWalletAddress || "0xNapoli_Restaurant_MLDSA65";
  const savings = profile?.stats.legacyLostRevenueEUR || 187.12;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-xl font-black text-white mb-2">Automated Smart Contract Settlements</h2>
        <p className="text-xs text-slate-400 mb-6">
          OENGO settles payouts instantly upon customer delivery PIN verification. No waiting weeks for aggregator payouts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Fiat Payout Balance (Instant Bank Transfer)
              </div>
              <div className="text-3xl font-black text-emerald-400">{formatEUR(fiatBal)} EUR</div>
              <div className="text-xs text-slate-500 mt-1">Direct SEPA / Instant Card payout enabled</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Web3 Escrow Vault (Non-Custodial)
              </div>
              <div className="text-xl font-mono font-bold text-amber-400 break-all">{cryptoAddr}</div>
              <div className="text-xs text-slate-500 mt-1">Post-quantum ML-DSA-65 signature verified on Oenexa L1</div>
            </div>
          </div>

          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-white mb-3">Fair Commission Comparison</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">OENGO Platform Take Rate:</span>
                  <span className="text-emerald-400 font-bold">5.0% (Merchant Keeps 95.0%)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Legacy Aggregator Take Rate:</span>
                  <span className="text-rose-400 font-bold">30.0% (Merchant Keeps 70.0%)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Merchant Margin Protection:</span>
                  <span className="text-white font-bold">+25.0% higher profit per dish</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs text-emerald-300">
              🎉 By using OENGO, your restaurant retains <strong>{formatEUR(savings)}</strong> more in profits for every 20 orders!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
