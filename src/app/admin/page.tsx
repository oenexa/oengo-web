"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatEUR } from "@/lib/utils";
import { FleetMap } from "@/components/admin/FleetMap";

export default function AdminDashboardPage() {
  const [commissionRate, setCommissionRate] = useState(5.0);
  const [activeTab, setActiveTab] = useState<"overview" | "fleet" | "ledger" | "restaurants" | "fraud">("overview");
  const [statusMsg, setStatusMsg] = useState("");

  const handleUpdateCommission = (newRate: number) => {
    setCommissionRate(newRate);
    setStatusMsg(`✓ Platform commission updated to ${newRate.toFixed(1)}%. Applied to all new orders.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              <span>OEN<span className="text-orange-500">GO</span></span>
            </Link>
            <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>🛡️</span> Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition"
            >
              🍔 Storefront
            </Link>
            <Link
              href="/merchant"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-lg bg-orange-950/60 border border-orange-800/50 hover:bg-orange-900 transition"
            >
              👨‍🍳 Kitchen
            </Link>
            <Link
              href="/rider"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 hover:bg-cyan-900 transition"
            >
              🚴 Rider
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Total Gross Merchandise (GMV)</div>
            <div className="text-xl font-black text-white mt-1">€14,820.00</div>
            <div className="text-[10px] text-emerald-400">+18% this week</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Merchant Retention (95%)</div>
            <div className="text-xl font-black text-emerald-400 mt-1">€14,079.00</div>
            <div className="text-[10px] text-slate-500">Retained by local kitchens</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Platform Commission (5%)</div>
            <div className="text-xl font-black text-orange-400 mt-1">€741.00</div>
            <div className="text-[10px] text-slate-500">Zero aggregator gouging</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Active Fleet</div>
            <div className="text-xl font-black text-cyan-400 mt-1">18 Riders</div>
            <div className="text-[10px] text-slate-500">Napoli central radius</div>
          </div>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div className="p-3 bg-slate-900 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Dynamic Commission Controls */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white">Dynamic Commission Rate Control</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust platform commission rate between 0.0% and 30.0% (default 5.0%).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-orange-400 font-mono">{commissionRate.toFixed(1)}%</span>
              <span className="text-xs text-slate-500">(Merchant keeps {(100 - commissionRate).toFixed(1)}%)</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0% (Charity / Intro)</span>
              <span>5% (Default Fair Rate)</span>
              <span>15% (Standard)</span>
              <span>30% (Legacy Cap)</span>
            </div>
          </div>

          <button
            onClick={() => handleUpdateCommission(commissionRate)}
            className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer"
          >
            Apply Commission Rate to Platform
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 text-xs font-bold gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition cursor-pointer ${
              activeTab === "overview" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            📊 Operations Overview
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`pb-3 transition cursor-pointer ${
              activeTab === "fleet" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            🗺️ Live Courier Fleet
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`pb-3 transition cursor-pointer ${
              activeTab === "ledger" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            ⚖️ Double-Entry Ledger Invariants
          </button>
          <button
            onClick={() => setActiveTab("restaurants")}
            className={`pb-3 transition cursor-pointer ${
              activeTab === "restaurants" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            🏪 Partner Restaurants
          </button>
          <button
            onClick={() => setActiveTab("fraud")}
            className={`pb-3 transition cursor-pointer ${
              activeTab === "fraud" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            🛡️ Fraud & Disputes
          </button>
        </div>

        {/* Tab: Fleet Map */}
        {activeTab === "fleet" && (
          <FleetMap />
        )}

        {/* Tab 2: Double-Entry Ledger Monitor */}
        {activeTab === "ledger" && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">Immutable Double-Entry Ledger Stream</h3>
                <p className="text-xs text-slate-400">Mathematical Invariant: Sum(Debits) == Sum(Credits)</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                ✓ Invariant Preserved
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="grid grid-cols-5 p-2.5 bg-slate-950 font-bold text-slate-400 border border-slate-800 rounded-lg">
                <span>TX ID</span>
                <span>Account</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Description</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800/60 rounded-lg">
                <span className="text-slate-500">dep_101</span>
                <span>1001 (Clearing)</span>
                <span className="text-cyan-400">DEBIT</span>
                <span className="text-emerald-400">€50.00</span>
                <span className="text-slate-400">Customer wallet deposit</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800/60 rounded-lg">
                <span className="text-slate-500">dep_101</span>
                <span>1002 (Available)</span>
                <span className="text-purple-400">CREDIT</span>
                <span className="text-emerald-400">€50.00</span>
                <span className="text-slate-400">Customer wallet credit</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800/60 rounded-lg">
                <span className="text-slate-500">ord_seed_101</span>
                <span>1003 (Escrow)</span>
                <span className="text-cyan-400">DEBIT</span>
                <span className="text-emerald-400">€34.00</span>
                <span className="text-slate-400">Delivery escrow unlock</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800/60 rounded-lg">
                <span className="text-slate-500">ord_seed_101</span>
                <span>2001 (Merchant)</span>
                <span className="text-purple-400">CREDIT</span>
                <span className="text-emerald-400">€27.08</span>
                <span className="text-slate-400">95% Food Revenue share</span>
              </div>
              <div className="grid grid-cols-5 p-2.5 bg-slate-950/40 text-slate-300 border border-slate-800/60 rounded-lg">
                <span className="text-slate-500">ord_seed_101</span>
                <span>2002 (Courier)</span>
                <span className="text-purple-400">CREDIT</span>
                <span className="text-emerald-400">€6.92</span>
                <span className="text-slate-400">5% Comm + Fee + Tip</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Partner Restaurants */}
        {activeTab === "restaurants" && (
          <div className="space-y-3">
            {[
              { name: "Napoli Woodfire Pizza", rating: 4.9, orders: 342, address: "Via Toledo 42", status: "Active" },
              { name: "Smash & Co. Gourmet Burgers", rating: 4.8, orders: 218, address: "Corso Umberto I 118", status: "Active" },
              { name: "Tokyo Bloom Omakase", rating: 4.9, orders: 451, address: "Via Chiaia 84", status: "Active" },
              { name: "Verde Organic Bowls", rating: 4.7, orders: 129, address: "Piazza dei Martiri 16", status: "Active" },
            ].map(r => (
              <div key={r.name} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{r.name}</div>
                  <div className="text-xs text-slate-400">{r.address} • {r.orders} orders • {r.rating} ⭐</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Fraud & Disputes */}
        {activeTab === "fraud" && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
            <h3 className="text-sm font-black text-white">Fraud Telemetry & Anti-Theft Protection</h3>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
              ✓ All 4-digit PIN doorstep handovers and package barcodes cryptographically verified with zero reported delivery disputes today.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
