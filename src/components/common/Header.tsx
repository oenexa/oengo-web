import Link from "next/link";
import { useEffect, useState } from "react";
import { WalletData } from "@/types";
import { WalletBadge } from "./WalletBadge";
import { useRouter } from "next/navigation";

interface HeaderProps {
  wallet: WalletData | null;
  deliveryAddress: string;
  isEditingAddress: boolean;
  onToggleEditAddress: () => void;
  onSaveAddress: (address: string) => void;
  onAddressChange: (address: string) => void;
  onOpenProfile?: () => void;
}

export function Header({
  wallet,
  deliveryAddress,
  isEditingAddress,
  onToggleEditAddress,
  onSaveAddress,
  onAddressChange,
  onOpenProfile
}: HeaderProps) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("oengo_user_role"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("oengo_user_id");
    localStorage.removeItem("oengo_user_role");
    setRole(null);
    router.push("/login");
  };

  const getPortalLink = () => {
    switch (role) {
      case "ADMIN":
        return { href: "/dashboard", text: "⚡ Admin Console", color: "purple" };
      case "RESTAURANT":
        return { href: "/dashboard", text: "👨‍🍳 Kitchen Portal", color: "orange" };
      case "COURIER":
        return { href: "/dashboard", text: "🚴 Rider App", color: "cyan" };
      case "CUSTOMER":
        return { href: "/", text: "🛒 Storefront", color: "emerald" };
      default:
        return null;
    }
  };

  const portal = getPortalLink();

  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍔</span>
          <Link href="/">
            <h1 className="text-2xl font-black tracking-tight text-white hover:text-slate-200 transition">
              OENGO <span className="text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-950/80 border border-orange-800">Decentralized Delivery</span>
            </h1>
          </Link>
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

      {/* Header Right: Portals & Navigation */}
      <div className="flex items-center gap-2 flex-wrap">
        {role && <WalletBadge wallet={wallet} />}

        {onOpenProfile && role === "CUSTOMER" && (
          <button
            onClick={onOpenProfile}
            className="px-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>👤</span>
            <span>Profile</span>
          </button>
        )}

        {!role ? (
          <>
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {portal && portal.href !== "/" && (
              <Link
                href={portal.href}
                className={`px-3 py-2.5 rounded-2xl bg-${portal.color}-950/70 hover:bg-${portal.color}-900 border border-${portal.color}-700/60 text-${portal.color}-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer`}
              >
                {portal.text}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-red-950 border border-slate-800 hover:border-red-900 text-slate-400 hover:text-red-400 font-bold text-xs transition cursor-pointer"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
