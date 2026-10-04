import Link from "next/link";
import { WalletData } from "@/types";
import { WalletBadge } from "./WalletBadge";

interface HeaderProps {
  wallet: WalletData | null;
  deliveryAddress: string;
  isEditingAddress: boolean;
  onToggleEditAddress: () => void;
  onSaveAddress: (address: string) => void;
  onAddressChange: (address: string) => void;
}

export function Header({
  wallet,
  deliveryAddress,
  isEditingAddress,
  onToggleEditAddress,
  onSaveAddress,
  onAddressChange
}: HeaderProps) {
  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍔</span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            OENGO <span className="text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-950/80 border border-orange-800">Decentralized Delivery</span>
          </h1>
        </div>

        {/* Geolocation Address Line */}
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>📍 Delivering to:</span>
          {isEditingAddress ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={deliveryAddress}
                onChange={e => onAddressChange(e.target.value)}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
              />
              <button
                onClick={() => onSaveAddress(deliveryAddress)}
                className="px-2 py-0.5 bg-orange-500 text-slate-950 rounded font-bold text-[11px] cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{deliveryAddress}</span>
              <button
                onClick={onToggleEditAddress}
                className="text-orange-400 hover:text-orange-300 underline text-[11px] cursor-pointer"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header Right: Wallet & Merchant Switcher */}
      <div className="flex items-center gap-3 flex-wrap">
        <WalletBadge wallet={wallet} />

        <Link
          href="/merchant"
          className="px-4 py-3 rounded-2xl bg-orange-950/70 hover:bg-orange-900 border border-orange-700/60 text-orange-300 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-orange-500/5 hover:border-orange-500 cursor-pointer"
        >
          <span>👨‍🍳</span>
          <span>Kitchen Portal (KDS) &rarr;</span>
        </Link>
      </div>
    </header>
  );
}
