"use client";

import { useState } from "react";

interface CustomerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerProfileDrawer({ isOpen, onClose }: CustomerProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "favorites">("profile");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-2xl">
              👩‍💼
            </div>
            <div>
              <h3 className="text-base font-black text-white">Alice Customer</h3>
              <p className="text-xs text-slate-400">alice@oengo.delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl my-4 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 rounded-lg transition ${
              activeTab === "profile" ? "bg-slate-800 text-orange-400 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`py-2 rounded-lg transition ${
              activeTab === "addresses" ? "bg-slate-800 text-orange-400 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Addresses
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`py-2 rounded-lg transition ${
              activeTab === "favorites" ? "bg-slate-800 text-orange-400 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Favorites
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === "profile" && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Full Name</label>
              <input
                type="text"
                defaultValue="Alice Customer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Email Address</label>
              <input
                type="email"
                defaultValue="alice@oengo.delivery"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Mobile Phone</label>
              <input
                type="tel"
                defaultValue="+39 081 555 0192"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>🛡️</span> Security & Verification
              </div>
              <div className="text-[11px] text-slate-300">
                Connected to Post-Quantum L1 Wallet: <code className="text-white">0xAlice_Customer_MLDSA65</code>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950/60 border border-orange-500/40 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>🏠</span> Home (Default)
                </span>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Piazza del Plebiscito 1, Napoli</p>
              <p className="text-[11px] text-slate-500">Note: Ring buzzer #4</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>🏢</span> Work Office
                </span>
              </div>
              <p className="text-xs text-slate-400">Via Toledo 156, Napoli</p>
              <p className="text-[11px] text-slate-500">Note: Reception on 2nd floor</p>
            </div>

            <button className="w-full py-3 border border-dashed border-slate-700 hover:border-orange-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
              <span>+ Add New Address</span>
            </button>
          </div>
        )}

        {/* Tab 3: Favorites */}
        {activeTab === "favorites" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Favorite Restaurants</span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍕</span>
                  <div>
                    <div className="text-xs font-bold text-white">Napoli Woodfire Pizza</div>
                    <div className="text-[10px] text-slate-400">Italian, Pizza • 4.9 ⭐</div>
                  </div>
                </div>
                <span className="text-orange-400 text-sm">❤️</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍔</span>
                  <div>
                    <div className="text-xs font-bold text-white">Smash & Co. Burgers</div>
                    <div className="text-[10px] text-slate-400">American, Angus • 4.8 ⭐</div>
                  </div>
                </div>
                <span className="text-orange-400 text-sm">❤️</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Favorite Foods</span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="text-xs font-bold text-white">Artisanal Margherita Pizza</div>
                <span className="text-orange-400 font-bold">€16.50</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="text-xs font-bold text-white">Double Truffle Smash Burger</div>
                <span className="text-orange-400 font-bold">€15.50</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
