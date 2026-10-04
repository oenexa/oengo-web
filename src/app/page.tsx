"use client";

import { useState, useEffect } from "react";

interface WalletData {
  digital: {
    fiatEUR: number;
    loyaltyPoints: number;
    type: string;
  };
  crypto: {
    address: string;
    balanceOEN: string;
    type: string;
  };
}

interface OrderData {
  id: string;
  status: string;
  amount: number;
  deliveryFee: number;
  tip: number;
  total: number;
  pickupBarcode: string;
  deliveryPin: string;
  restaurantPayout?: number;
  courierPayout?: number;
  escrowLocked: boolean;
}

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [logMessage, setLogMessage] = useState<string>("Ready to order");

  // Fetch initial wallet balance
  const fetchWallet = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/wallet/user_customer");
      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallets);
      }
    } catch {
      // Local fallback for offline display
      setWallet({
        digital: { fiatEUR: 50.00, loyaltyPoints: 120, type: "OFF_CHAIN_CREDITS" },
        crypto: { address: "0xAlice_Customer_MLDSA65", balanceOEN: "100.00000000", type: "NON_CUSTODIAL_ML_DSA_65" }
      });
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Step 1: Customer Places Order
  const handlePlaceOrder = async (paymentMethod: "CRYPTO_OEN" | "DIGITAL_WALLET") => {
    setLoading(true);
    setLogMessage("Submitting order to smart contract escrow...");
    try {
      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: "user_customer",
          restaurantId: "user_restaurant",
          amount: 28.50,
          deliveryFee: 3.50,
          tip: 2.00,
          paymentMethod,
          items: [
            { name: "Artisanal Margherita Pizza", qty: 1, price: 16.50 },
            { name: "Truffle Arancini", qty: 1, price: 12.00 }
          ]
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.order);
        setLogMessage(`Order ${data.order.id} placed! Funds locked in WASM Escrow.`);
      }
    } catch {
      setLogMessage("Error connecting to Oengo API gateway");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Restaurant Accepts & Starts Cooking
  const handleRestaurantAccept = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${activeOrder.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prepEtaMinutes: 15 })
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.order);
        setLogMessage("Restaurant accepted order! Kitchen preparing meal (ETA: 15m).");
      }
    } catch {
      setLogMessage("Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Courier Proximity Assign & Pickup Barcode Scan
  const handleCourierPickup = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      // 1. Assign courier
      await fetch(`http://localhost:3001/api/orders/${activeOrder.id}/assign-courier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courierId: "user_courier" })
      });

      // 2. Scan pickup barcode
      const res = await fetch(`http://localhost:3001/api/orders/${activeOrder.id}/confirm-pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scannedBarcode: activeOrder.pickupBarcode })
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.order);
        setLogMessage(`Pickup barcode verified (${activeOrder.pickupBarcode})! Order is now IN_TRANSIT with courier.`);
      }
    } catch {
      setLogMessage("Failed to verify pickup barcode");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Doorstep Delivery Handover & Autonomous Escrow Settlement
  const handleConfirmDelivery = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${activeOrder.id}/confirm-delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofCode: activeOrder.deliveryPin })
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.order);
        setLogMessage(`PIN ${activeOrder.deliveryPin} verified! Escrow settled: 95% to Restaurant, 5%+tip to Courier!`);
        fetchWallet(); // Refresh customer cashback
      }
    } catch {
      setLogMessage("Failed to confirm delivery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍔</span>
            <h1 className="text-3xl font-black tracking-tight text-white">
              OENGO <span className="text-orange-500 text-lg font-bold tracking-normal px-2.5 py-0.5 rounded-full bg-orange-950/80 border border-orange-800">Decentralized Delivery</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">Powered by OENEXA Layer-1 • Zero 30% Aggregator Tax • Autonomous Escrow</p>
        </div>

        {/* Dual-Wallet Balance Card */}
        {wallet && (
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            {/* Digital Wallet Tier */}
            <div className="pr-4 border-r border-slate-800">
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Digital Wallet</div>
              <div className="text-xl font-black text-emerald-400">€{wallet.digital.fiatEUR.toFixed(2)}</div>
              <div className="text-xs text-slate-400">⭐ {wallet.digital.loyaltyPoints} Cashback Pts</div>
            </div>

            {/* Web3 Crypto Tier */}
            <div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Web3 Crypto (OEN)</div>
              <div className="text-xl font-black text-amber-400">{parseFloat(wallet.crypto.balanceOEN).toFixed(2)} OEN</div>
              <div className="text-xs font-mono text-slate-500 truncate max-w-[130px]">{wallet.crypto.address}</div>
            </div>
          </div>
        )}
      </header>

      {/* Main Order Pipeline Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Restaurant Storefront & Menu */}
        <div className="lg:col-span-1 bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🍕</span> Napoli Woodfire Pizza
            </h2>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">Open</span>
          </div>
          <p className="text-xs text-slate-400 mb-6">Italian • Woodfired Pizza • 4.9 ★ (1.2k) • 15–25 min</p>

          <div className="space-y-4 mb-8">
            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 flex justify-between items-center">
              <div>
                <div className="font-semibold text-sm text-slate-200">Artisanal Margherita</div>
                <div className="text-xs text-slate-400">San Marzano tomatoes, buffalo mozzarella</div>
              </div>
              <div className="text-sm font-bold text-amber-400">€16.50</div>
            </div>

            <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 flex justify-between items-center">
              <div>
                <div className="font-semibold text-sm text-slate-200">Truffle Arancini</div>
                <div className="text-xs text-slate-400">Crispy risotto balls with black truffle aioli</div>
              </div>
              <div className="text-sm font-bold text-amber-400">€12.00</div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 mb-6 text-sm">
            <div className="flex justify-between text-slate-400"><span>Food Subtotal</span><span>€28.50</span></div>
            <div className="flex justify-between text-slate-400"><span>Delivery Fee (Direct to Courier)</span><span>€3.50</span></div>
            <div className="flex justify-between text-slate-400"><span>Courier Tip</span><span>€2.00</span></div>
            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-slate-800">
              <span>Total in Escrow</span>
              <span className="text-orange-400">€34.00</span>
            </div>
          </div>

          {/* Checkout Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handlePlaceOrder("CRYPTO_OEN")}
              disabled={loading || !!activeOrder}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              <span>⚡ Pay with Web3 Crypto (OEN)</span>
            </button>
            <button
              onClick={() => handlePlaceOrder("DIGITAL_WALLET")}
              disabled={loading || !!activeOrder}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition disabled:opacity-50 cursor-pointer"
            >
              Pay with Digital Wallet Balance
            </button>
          </div>
        </div>

        {/* Right Columns: Live Multi-Party Escrow Lifecycle */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Order Card */}
          {activeOrder ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs font-mono text-slate-500">Order ID</span>
                  <div className="text-xl font-black text-white">{activeOrder.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider text-emerald-400 border border-slate-700">
                    {activeOrder.status}
                  </span>
                </div>
              </div>

              {/* Delivery Verification Credentials Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                {/* Package Barcode for Pickup */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">1. Restaurant Pickup Barcode</div>
                  <div className="text-2xl font-mono font-black text-orange-400 tracking-widest">{activeOrder.pickupBarcode}</div>
                  <p className="text-xs text-slate-500 mt-1">Scanned by courier at restaurant counter to confirm food pickup.</p>
                </div>

                {/* Secret Customer Delivery PIN / Barcode */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">2. Customer Doorstep Delivery PIN</div>
                  <div className="text-3xl font-mono font-black text-emerald-400 tracking-widest">{activeOrder.deliveryPin}</div>
                  <p className="text-xs text-slate-500 mt-1">Given to courier at doorstep to unlock on-chain escrow payout.</p>
                </div>
              </div>

              {/* Multi-Party Action Stepper (Simulate Full Delivery Pipeline) */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Interactive Simulation Steps:</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Step A: Kitchen Accept */}
                  <button
                    onClick={handleRestaurantAccept}
                    disabled={loading || activeOrder.status !== "AWAITING_RESTAURANT"}
                    className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
                  >
                    <div className="text-xs text-orange-400 font-bold">Step 1 (Restaurant)</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Accept & Cook 👨‍🍳</div>
                  </button>

                  {/* Step B: Courier Pickup */}
                  <button
                    onClick={handleCourierPickup}
                    disabled={loading || activeOrder.status !== "PREPARING"}
                    className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
                  >
                    <div className="text-xs text-orange-400 font-bold">Step 2 (Courier)</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Scan Pickup Barcode 🛵</div>
                  </button>

                  {/* Step C: Handover & Escrow Release */}
                  <button
                    onClick={handleConfirmDelivery}
                    disabled={loading || activeOrder.status !== "IN_TRANSIT"}
                    className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-30 rounded-xl text-left text-white transition shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <div className="text-xs text-emerald-200 font-bold">Step 3 (Handover)</div>
                    <div className="text-sm font-black mt-0.5">Verify PIN & Settle 🔓</div>
                  </button>
                </div>
              </div>

              {/* Settlement Results if Delivered */}
              {activeOrder.status === "DELIVERED" && (
                <div className="mt-6 p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl">
                  <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <span>🎉</span> On-Chain Escrow Autonomously Settled!
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-900/80 rounded-lg">
                      <div className="text-slate-400">Restaurant Payout (95%)</div>
                      <div className="text-base font-bold text-emerald-300">€{activeOrder.restaurantPayout?.toFixed(2)}</div>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-lg">
                      <div className="text-slate-400">Courier Payout (5% + Tip)</div>
                      <div className="text-base font-bold text-amber-300">€{activeOrder.courierPayout?.toFixed(2)}</div>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded-lg">
                      <div className="text-slate-400">Customer 5% Cashback</div>
                      <div className="text-base font-bold text-cyan-300">+€{(activeOrder.amount * 0.05).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <span className="text-5xl mb-3">🛍️</span>
              <h3 className="text-lg font-bold text-slate-300">No Active Order in Escrow</h3>
              <p className="text-sm text-slate-500 max-w-md mt-1">Select meals from the menu on the left and choose a payment method to lock funds in the smart contract.</p>
            </div>
          )}

          {/* Live Activity Terminal */}
          <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl font-mono text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">●</span>
              <span>System Status: <span className="text-slate-200">{logMessage}</span></span>
            </div>
            <span className="text-slate-600">L1 RPC: localhost:8545</span>
          </div>

        </div>
      </div>
    </div>
  );
}
