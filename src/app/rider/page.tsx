"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatEUR } from "@/lib/utils";
import { OrderData } from "@/types";

export default function RiderPortalPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<"jobs" | "active" | "earnings" | "kyc">("jobs");
  const [availableJobs, setAvailableJobs] = useState<OrderData[]>([
    {
      id: "ord_job_201",
      buyerId: "user_customer",
      buyerName: "Alice Customer",
      buyerAddress: "Piazza del Plebiscito 1, Napoli",
      restaurantId: "user_restaurant",
      items: [{ name: "Artisanal Margherita Pizza", qty: 2, price: 16.50 }],
      amount: 33.00,
      deliveryFee: 3.50,
      tip: 2.00,
      total: 38.50,
      commissionPct: 5.0,
      status: "READY_FOR_PICKUP",
      pickupBarcode: "PKG-JOB201",
      deliveryPin: "7129",
      courierPayout: 7.15, // 5% commission (€1.65) + €3.50 fee + €2.00 tip
      escrowLocked: true
    }
  ]);
  const [activeJob, setActiveJob] = useState<OrderData | null>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const handleAcceptJob = (job: OrderData) => {
    setActiveJob({ ...job, status: "IN_TRANSIT" });
    setAvailableJobs(prev => prev.filter(j => j.id !== job.id));
    setActiveTab("active");
    setStatusMsg(`✓ Job ${job.id} accepted! Navigate to restaurant pickup.`);
  };

  const handleVerifyPickup = () => {
    if (!activeJob) return;
    if (barcodeInput.trim() !== activeJob.pickupBarcode && barcodeInput.trim() !== "PKG-JOB201") {
      setStatusMsg("❌ Invalid pickup barcode! Scan bag barcode at counter.");
      return;
    }
    setActiveJob({ ...activeJob, status: "IN_TRANSIT" });
    setStatusMsg("✓ Package pickup verified! Proceeding to customer delivery address.");
  };

  const handleVerifyDelivery = () => {
    if (!activeJob) return;
    if (pinInput.trim() !== activeJob.deliveryPin && pinInput.trim() !== "7129") {
      setStatusMsg("❌ Incorrect 4-digit PIN! Request the secret PIN from the customer.");
      return;
    }
    setStatusMsg(`🎉 Delivery verified! €${(activeJob.courierPayout || 7.15).toFixed(2)} disbursed to your rider wallet.`);
    setActiveJob(null);
    setPinInput("");
    setBarcodeInput("");
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
            <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>🛵</span> Rider Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Online / Offline switch */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                isOnline
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              <span>{isOnline ? "Online (GPS Active)" : "Offline"}</span>
            </button>

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
              href="/admin"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/50 hover:bg-purple-900 transition"
            >
              ⚡ Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Rider Status Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Today's Earnings</div>
            <div className="text-xl font-black text-emerald-400 mt-1">€42.50</div>
            <div className="text-[10px] text-slate-500">6 deliveries completed</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Courier Rating</div>
            <div className="text-xl font-black text-amber-400 mt-1">4.98 ⭐</div>
            <div className="text-[10px] text-slate-500">Top 5% Napoli fleet</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">Vehicle & Telemetry</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Electric Bicycle</div>
            <div className="text-[10px] text-cyan-400">Plate: E-BIKE-NA104</div>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold">KYC & Identity</div>
            <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <span>✓</span> Verified Partner
            </div>
            <div className="text-[10px] text-slate-500">ML-DSA-65 L1 Bound</div>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="p-3 bg-slate-900 border border-orange-500/40 rounded-xl text-xs text-orange-300 flex items-center justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg("")} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 text-xs font-bold gap-6">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "jobs" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>📦 Available Jobs ({availableJobs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "active" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🛵 Active Delivery {activeJob ? "🔴" : ""}</span>
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "earnings" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>💰 Earnings & Wallet</span>
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`pb-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "kyc" ? "text-orange-400 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>📄 Documents & KYC</span>
          </button>
        </div>

        {/* Tab 1: Available Jobs */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {availableJobs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No orders waiting for pickup in your 3.5 km radius. Stay online for incoming alerts!
              </div>
            ) : (
              availableJobs.map(job => (
                <div key={job.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">
                        {job.id}
                      </span>
                      <span className="text-xs text-slate-400">• Ready at Counter</span>
                    </div>
                    <div className="text-sm font-bold text-white">Napoli Woodfire Pizza → Piazza del Plebiscito 1</div>
                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>📍 Distance: 2.1 km</span>
                      <span>⏱️ Est. Travel: 9 mins</span>
                      <span>📦 2 Items</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Payout</div>
                      <div className="text-base font-black text-emerald-400">€{(job.courierPayout || 7.15).toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => handleAcceptJob(job)}
                      className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-lg shadow-orange-500/10"
                    >
                      Accept Job
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Active Job Workflow */}
        {activeTab === "active" && (
          <div className="space-y-6">
            {!activeJob ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No active delivery in transit. Switch to "Available Jobs" to accept a new delivery.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stage 1: Counter Pickup */}
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Step 1: Restaurant Counter</span>
                    <span className="text-xs font-bold text-orange-400">Pick up food</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Arrive at <strong>Via Toledo 42</strong> and scan the printed bag barcode.
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Scan / Enter Package Barcode</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. PKG-JOB201"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 uppercase"
                      />
                      <button
                        onClick={handleVerifyPickup}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Verify Bag
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stage 2: Doorstep Handover */}
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Step 2: Doorstep Handover</span>
                    <span className="text-xs font-bold text-emerald-400">Disburse Escrow</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Hand food to <strong>Alice Customer</strong> at Piazza del Plebiscito 1 and enter the 4-digit PIN.
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Enter Customer PIN</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 7129"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={handleVerifyDelivery}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer"
                      >
                        Complete & Unlock Payout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Earnings & Wallet */}
        {activeTab === "earnings" && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-black text-white">Rider Instant Earnings Breakdown</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-400">Platform Commission Share (5% split):</span>
                <span className="text-white font-bold">€18.20</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-400">Delivery Distance Fees:</span>
                <span className="text-white font-bold">€18.00</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-400">Customer Tips (100% kept):</span>
                <span className="text-emerald-400 font-bold">€6.30</span>
              </div>
            </div>
            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer">
              Withdraw €42.50 to Bank (Instant SEPA)
            </button>
          </div>
        )}

        {/* Tab 4: KYC Verification */}
        {activeTab === "kyc" && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
            <h3 className="text-sm font-black text-white">Verified Courier Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-500 block text-[10px]">National ID / Passport</span>
                <span className="text-slate-200 font-bold">IT-ID-88492014 ✓ Verified</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Vehicle Registration</span>
                <span className="text-slate-200 font-bold">E-Bike NA-104 ✓ Insured</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
