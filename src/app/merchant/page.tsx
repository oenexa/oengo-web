"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  priceEUR: number;
  priceOEN: string;
  inStock: boolean;
  prepMinutes: number;
  badge?: string;
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderData {
  id: string;
  buyerId: string;
  buyerName?: string;
  buyerAddress?: string;
  items: OrderItem[];
  amount: number;
  deliveryFee: number;
  tip: number;
  total: number;
  commissionPct: number;
  paymentMethod: string;
  cardPayment?: {
    brand: string;
    last4: string;
    transactionId: string;
  } | null;
  status: "AWAITING_RESTAURANT" | "PREPARING" | "READY_FOR_PICKUP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED_BY_RESTAURANT";
  pickupBarcode: string;
  deliveryPin: string;
  createdAt: string;
  prepEtaMinutes?: number;
  restaurantPayout?: number;
}

interface RestaurantProfile {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  address: string;
  isOpen: boolean;
  prepEtaMinutes: number;
  deliveryRadiusKm: number;
  cryptoWalletAddress: string;
  fiatBalanceEUR: number;
  stats: {
    totalOrdersCount: number;
    activeOrdersCount: number;
    deliveredOrdersCount: number;
    grossRevenueTodayEUR: number;
    fiatBalanceEUR: number;
    commissionRetainedPct: number;
    platformCommissionPct: number;
    legacyLostRevenueEUR: number;
    avgPrepTimeMinutes: number;
  };
}

export default function MerchantPortal() {
  const [activeTab, setActiveTab] = useState<"KDS" | "MENU" | "ANALYTICS" | "PICKUP">("KDS");
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [soundAlert, setSoundAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [logMessage, setLogMessage] = useState<string>("Kitchen Display System Connected");
  const [barcodeModalOrder, setBarcodeModalOrder] = useState<OrderData | null>(null);

  // Add Dish State
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishName, setNewDishName] = useState("");
  const [newDishCategory, setNewDishCategory] = useState("Pizza & Mains");
  const [newDishPrice, setNewDishPrice] = useState("17.50");
  const [newDishPrep, setNewDishPrep] = useState("15");
  const [newDishDesc, setNewDishDesc] = useState("");
  const [newDishBadge, setNewDishBadge] = useState("Chef Special");

  const RESTAURANT_ID = "user_restaurant";

  // Fetch initial restaurant data
  const fetchRestaurantData = async () => {
    try {
      // 1. Fetch Profile & Stats
      const profRes = await fetch(`http://localhost:3001/api/restaurants/${RESTAURANT_ID}`);
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData.restaurant);
      }

      // 2. Fetch Orders
      const ordRes = await fetch(`http://localhost:3001/api/restaurants/${RESTAURANT_ID}/orders`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.orders);
      }

      // 3. Fetch Menu
      const menuRes = await fetch(`http://localhost:3001/api/restaurants/${RESTAURANT_ID}/menu`);
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenu(menuData.menu);
      }
    } catch {
      // Offline fallback mock
      setProfile({
        id: "user_restaurant",
        name: "Napoli Woodfire Pizza",
        tagline: "Authentic Neapolitan Pizza & Artisan Italian Delicacies",
        cuisine: "Italian, Woodfire Pizza, Artisan",
        rating: 4.9,
        reviewCount: 342,
        address: "Via Toledo 42, Napoli / Historic District",
        isOpen: true,
        prepEtaMinutes: 15,
        deliveryRadiusKm: 5.5,
        cryptoWalletAddress: "0xNapoli_Restaurant_MLDSA65",
        fiatBalanceEUR: 1250.0,
        stats: {
          totalOrdersCount: 24,
          activeOrdersCount: 2,
          deliveredOrdersCount: 22,
          grossRevenueTodayEUR: 748.5,
          fiatBalanceEUR: 1250.0,
          commissionRetainedPct: 95,
          platformCommissionPct: 5,
          legacyLostRevenueEUR: 187.12,
          avgPrepTimeMinutes: 14
        }
      });
    }
  };

  useEffect(() => {
    fetchRestaurantData();
    const interval = setInterval(fetchRestaurantData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Action: Toggle Open / Closed
  const handleToggleStoreOpen = async () => {
    if (!profile) return;
    const nextStatus = !profile.isOpen;
    try {
      const res = await fetch(`http://localhost:3001/api/restaurants/${RESTAURANT_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: nextStatus })
      });
      if (res.ok) {
        setProfile({ ...profile, isOpen: nextStatus });
        setLogMessage(`Store status switched to ${nextStatus ? "OPEN (Taking Orders)" : "CLOSED"}`);
      }
    } catch {
      setProfile({ ...profile, isOpen: nextStatus });
    }
  };

  // Action: Accept & Cook Order
  const handleAcceptOrder = async (orderId: string, etaMinutes: number = 15) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prepEtaMinutes: etaMinutes })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => (o.id === orderId ? data.order : o)));
        setLogMessage(`Order ${orderId} accepted! Kitchen timer set to ${etaMinutes} mins.`);
      }
    } catch {
      setLogMessage("Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  // Action: Mark Ready for Courier Pickup
  const handleMarkReady = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}/ready`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => (o.id === orderId ? data.order : o)));
        setBarcodeModalOrder(data.order);
        setLogMessage(`Order ${orderId} is packed and ready for courier pickup!`);
      }
    } catch {
      setLogMessage("Failed to mark order ready");
    } finally {
      setLoading(false);
    }
  };

  // Action: Decline Order
  const handleDeclineOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to decline this order? Customer will be 100% refunded immediately.")) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Kitchen at maximum oven capacity" })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => (o.id === orderId ? data.order : o)));
        setLogMessage(`Order ${orderId} declined. Escrow refunded to customer.`);
      }
    } catch {
      setLogMessage("Failed to decline order");
    } finally {
      setLoading(false);
    }
  };

  // Action: Toggle Menu Item Stock
  const handleToggleStock = async (itemId: string, currentStock: boolean) => {
    const nextStock = !currentStock;
    try {
      const res = await fetch(`http://localhost:3001/api/restaurants/${RESTAURANT_ID}/menu/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: nextStock })
      });
      if (res.ok) {
        setMenu(menu.map(i => (i.id === itemId ? { ...i, inStock: nextStock } : i)));
        setLogMessage(`Item availability updated to: ${nextStock ? "IN STOCK" : "SOLD OUT"}`);
      }
    } catch {
      setMenu(menu.map(i => (i.id === itemId ? { ...i, inStock: nextStock } : i)));
    }
  };

  // Action: Add Dish
  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName || !newDishPrice) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/restaurants/${RESTAURANT_ID}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDishName,
          category: newDishCategory,
          priceEUR: parseFloat(newDishPrice),
          prepMinutes: parseInt(newDishPrep, 10),
          description: newDishDesc,
          badge: newDishBadge
        })
      });
      const data = await res.json();
      if (data.success) {
        setMenu([...menu, data.item]);
        setShowAddDishModal(false);
        setNewDishName("");
        setNewDishDesc("");
        setLogMessage(`Dish "${data.item.name}" added to menu catalog!`);
      }
    } catch {
      setLogMessage("Failed to add dish");
    } finally {
      setLoading(false);
    }
  };

  // Action: Delete Dish
  const handleDeleteDish = async (itemId: string) => {
    if (!confirm("Delete this dish from catalog?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/restaurants/${RESTAURANT_ID}/menu/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMenu(menu.filter(i => i.id !== itemId));
        setLogMessage("Dish removed from catalog");
      }
    } catch {
      setMenu(menu.filter(i => i.id !== itemId));
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filterStatus === "ALL") return true;
    return o.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-7xl mx-auto">
      {/* Top Header & Store Control Bar */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">👨‍🍳</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {profile?.name || "Napoli Woodfire Pizza"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-800">
                  Partner Portal
                </span>
                <button
                  onClick={handleToggleStoreOpen}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    profile?.isOpen
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                      : "bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${profile?.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                  {profile?.isOpen ? "OPEN & ACCEPTING" : "STORE CLOSED"}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {profile?.address || "Via Toledo 42, Napoli"} • ⭐ {profile?.rating || 4.9} (342 reviews) • 95% Merchant Revenue Retained
              </p>
            </div>
          </div>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundAlert(!soundAlert)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
              soundAlert
                ? "bg-slate-900 text-orange-400 border-orange-800/80"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            <span>{soundAlert ? "🔔 Chime Active" : "🔕 Chime Muted"}</span>
          </button>

          {/* Switch to Customer Ordering Link */}
          <Link
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-lg shadow-orange-500/10"
          >
            <span>🍔 Customer App</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </header>

      {/* Financial Health Ribbon: OENGO 95% vs Legacy 70% */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Today&apos;s Revenue</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            €{profile?.stats.grossRevenueTodayEUR.toFixed(2) || "748.50"}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            +{( (profile?.stats.grossRevenueTodayEUR || 748.50) / 13.60 ).toFixed(2)} OEN
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Revenue Retained</div>
          <div className="text-2xl font-black text-white mt-1">
            {profile?.stats.commissionRetainedPct || 95}%
          </div>
          <div className="text-[11px] text-orange-400 font-semibold mt-0.5">
            Only 5% platform cut vs 30% legacy
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Legacy Tax Saved</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            +€{profile?.stats.legacyLostRevenueEUR.toFixed(2) || "187.12"}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
            Kept directly in merchant pocket
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Active Pipeline</div>
          <div className="text-2xl font-black text-orange-400 mt-1">
            {orders.filter(o => ["AWAITING_RESTAURANT", "PREPARING", "READY_FOR_PICKUP"].includes(o.status)).length} Orders
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Avg prep: {profile?.stats.avgPrepTimeMinutes || 14} mins
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("KDS")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "KDS"
              ? "bg-orange-500 text-slate-950 shadow-md font-black"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <span>👨‍🍳 Live Kitchen Display (KDS)</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
            activeTab === "KDS" ? "bg-slate-950 text-orange-400" : "bg-slate-800 text-slate-400"
          }`}>
            {orders.filter(o => ["AWAITING_RESTAURANT", "PREPARING", "READY_FOR_PICKUP"].includes(o.status)).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("MENU")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "MENU"
              ? "bg-orange-500 text-slate-950 shadow-md font-black"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <span>📜 Menu &amp; Catalog Manager</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
            activeTab === "MENU" ? "bg-slate-950 text-orange-400" : "bg-slate-800 text-slate-400"
          }`}>
            {menu.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("PICKUP")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "PICKUP"
              ? "bg-orange-500 text-slate-950 shadow-md font-black"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <span>🏷️ Courier Counter Barcode Station</span>
        </button>

        <button
          onClick={() => setActiveTab("ANALYTICS")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "ANALYTICS"
              ? "bg-orange-500 text-slate-950 shadow-md font-black"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <span>📊 Financial Vault &amp; Payouts</span>
        </button>
      </div>

      {/* Status Bar / Log Message */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-400 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>System Log: {logMessage}</span>
        </div>
        <span className="text-slate-500">Auto-refresh: 6s</span>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: KITCHEN DISPLAY SYSTEM (KDS) */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "KDS" && (
        <div>
          {/* Subfilter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
              {[
                { key: "ALL", label: "All Active" },
                { key: "AWAITING_RESTAURANT", label: "New Orders 🔴" },
                { key: "PREPARING", label: "Cooking 👨‍🍳" },
                { key: "READY_FOR_PICKUP", label: "Ready at Counter 📦" },
                { key: "DELIVERED", label: "Past Delivered" }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    filterStatus === tab.key
                      ? "bg-slate-800 text-orange-400 shadow border border-slate-700 font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredOrders.length}</strong> kitchen tickets
            </div>
          </div>

          {/* Kitchen Tickets Grid */}
          {filteredOrders.length === 0 ? (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500">
              <span className="text-4xl block mb-2">🍽️</span>
              <p className="text-base font-bold text-slate-400">No tickets matching this status filter.</p>
              <p className="text-xs text-slate-500 mt-1">Orders placed by customers will chime and appear instantly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrders.map(order => {
                const isNew = order.status === "AWAITING_RESTAURANT";
                const isCooking = order.status === "PREPARING";
                const isReady = order.status === "READY_FOR_PICKUP";
                const isDelivered = order.status === "DELIVERED";

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border transition shadow-xl p-5 flex flex-col justify-between ${
                      isNew
                        ? "bg-orange-950/20 border-orange-500/60 shadow-orange-500/5 ring-1 ring-orange-500/30"
                        : isCooking
                        ? "bg-slate-900 border-amber-500/40"
                        : isReady
                        ? "bg-slate-900 border-emerald-500/40"
                        : "bg-slate-900/60 border-slate-800 opacity-80"
                    }`}
                  >
                    <div>
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                        <div>
                          <div className="text-[11px] font-mono text-slate-500">TICKET #{order.id.slice(-6).toUpperCase()}</div>
                          <div className="text-base font-black text-white">{order.buyerName || "Alice Customer"}</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                            isNew
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                              : isCooking
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : isReady
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Payment Rail Badge */}
                      <div className="mb-3">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono border border-slate-800 flex items-center gap-1.5 w-fit">
                          {order.paymentMethod === "CREDIT_CARD" ? (
                            <>
                              <span>💳</span>
                              <span>Direct Card ({order.cardPayment?.brand || "Visa"} •••• {order.cardPayment?.last4 || "4242"})</span>
                            </>
                          ) : order.paymentMethod === "DIGITAL_WALLET" ? (
                            <>
                              <span>👛</span>
                              <span>In-App Digital Wallet</span>
                            </>
                          ) : (
                            <>
                              <span>⚡</span>
                              <span>Web3 Crypto (OEN L1 Escrow)</span>
                            </>
                          )}
                          <span className="text-emerald-400 font-bold ml-1">PAID</span>
                        </span>
                      </div>

                      {/* Order Items List */}
                      <div className="space-y-1.5 mb-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-bold text-white">
                              <span className="text-orange-400 font-mono mr-1.5">{item.qty}x</span>
                              {item.name}
                            </span>
                            <span className="text-slate-400 font-mono">€{(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Payout Breakdown */}
                      <div className="text-xs text-slate-400 flex justify-between border-t border-slate-800/80 pt-2 mb-4">
                        <span>Order Total: <strong>€{order.total.toFixed(2)}</strong></span>
                        <span className="text-emerald-400 font-bold">
                          Merchant Payout (95%): €{(order.amount * 0.95).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Depending on State */}
                    <div className="pt-2">
                      {isNew && (
                        <div className="space-y-2">
                          <div className="text-[11px] text-slate-400 font-semibold">Select Kitchen Prep ETA:</div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[10, 15, 25].map(mins => (
                              <button
                                key={mins}
                                onClick={() => handleAcceptOrder(order.id, mins)}
                                disabled={loading}
                                className="py-2 px-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-lg text-xs transition cursor-pointer disabled:opacity-50 text-center"
                              >
                                Accept ({mins}m)
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => handleDeclineOrder(order.id)}
                            disabled={loading}
                            className="w-full py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition border border-rose-900/60 cursor-pointer"
                          >
                            Decline &amp; Refund Customer
                          </button>
                        </div>
                      )}

                      {isCooking && (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs text-amber-300 flex items-center justify-between">
                            <span>👨‍🍳 Chef cooking meal...</span>
                            <span className="font-mono font-bold">{order.prepEtaMinutes || 15} mins ETA</span>
                          </div>
                          <button
                            onClick={() => handleMarkReady(order.id)}
                            disabled={loading}
                            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                          >
                            <span>📦 Mark Ready for Courier Pickup</span>
                          </button>
                        </div>
                      )}

                      {isReady && (
                        <div className="space-y-2">
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Counter Pickup Barcode</div>
                            <div className="text-xl font-mono font-black text-orange-400 tracking-widest my-1">
                              {order.pickupBarcode}
                            </div>
                            <p className="text-[10px] text-slate-500">Awaiting courier camera scan at counter</p>
                          </div>
                          <button
                            onClick={() => setBarcodeModalOrder(order)}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer border border-slate-700 flex items-center justify-center gap-1.5"
                          >
                            <span>📲 Enlarge Barcode for Courier</span>
                          </button>
                        </div>
                      )}

                      {isDelivered && (
                        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span>✅</span> Escrow Released
                          </span>
                          <span className="font-mono text-white">€{(order.amount * 0.95).toFixed(2)} Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: MENU & CATALOG MANAGER */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "MENU" && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-white">Catalog &amp; Live Availability</h2>
              <p className="text-xs text-slate-400">Toggle sold-out items instantly so customers cannot order unavailable ingredients.</p>
            </div>
            <button
              onClick={() => setShowAddDishModal(true)}
              className="py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/10"
            >
              <span>➕ Add New Dish</span>
            </button>
          </div>

          {/* Dishes Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  item.inStock
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                    : "bg-slate-950/60 border-rose-900/40 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-950 text-orange-400 border border-orange-800/80">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-lg font-black text-emerald-400">€{item.priceEUR.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.priceOEN} OEN</div>
                    </div>

                    {/* Live In-Stock Toggle */}
                    <button
                      onClick={() => handleToggleStock(item.id, item.inStock)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        item.inStock
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                          : "bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.inStock ? "bg-emerald-400" : "bg-rose-400"}`} />
                      {item.inStock ? "In Stock" : "Sold Out"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Prep: {item.prepMinutes}m</span>
                    <button
                      onClick={() => handleDeleteDish(item.id)}
                      className="text-rose-400 hover:text-rose-300 text-xs transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Dish Modal */}
          {showAddDishModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-white">Add Dish to Menu</h3>
                  <button
                    onClick={() => setShowAddDishModal(false)}
                    className="text-slate-500 hover:text-white text-lg font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleAddDish} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={newDishName}
                      onChange={e => setNewDishName(e.target.value)}
                      placeholder="e.g. Quattro Formaggi Pizza"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Category</label>
                      <select
                        value={newDishCategory}
                        onChange={e => setNewDishCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="Pizza & Mains">Pizza &amp; Mains</option>
                        <option value="Starters">Starters</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Price (EUR)</label>
                      <input
                        type="number"
                        step="0.10"
                        required
                        value={newDishPrice}
                        onChange={e => setNewDishPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Prep Time (mins)</label>
                      <input
                        type="number"
                        value={newDishPrep}
                        onChange={e => setNewDishPrep(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={newDishBadge}
                        onChange={e => setNewDishBadge(e.target.value)}
                        placeholder="Chef Special, Organic"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Description &amp; Ingredients</label>
                    <textarea
                      rows={2}
                      value={newDishDesc}
                      onChange={e => setNewDishDesc(e.target.value)}
                      placeholder="Artisan ingredients, allergens, preparation notes..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDishModal(false)}
                      className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-1/2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-xl text-xs"
                    >
                      Save Dish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: COURIER COUNTER BARCODE STATION */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "PICKUP" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-5xl block mb-3">🏷️</span>
            <h2 className="text-2xl font-black text-white">Courier Counter Barcode Station</h2>
            <p className="text-sm text-slate-400 mt-1">
              Couriers arriving at the kitchen counter scan this scannable token to confirm food handover and transition the order to <strong className="text-orange-400">IN_TRANSIT</strong>.
            </p>

            <div className="mt-8 space-y-4">
              {orders
                .filter(o => ["PREPARING", "READY_FOR_PICKUP"].includes(o.status))
                .map(order => (
                  <div
                    key={order.id}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs text-slate-500 font-mono">ORDER #{order.id.slice(-6).toUpperCase()}</div>
                      <div className="text-lg font-black text-white">{order.buyerName || "Alice Customer"}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {order.items.map(i => `${i.qty}x ${i.name}`).join(", ")}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-700 text-center font-mono">
                        <div className="text-[10px] text-slate-500">PACKAGE BARCODE</div>
                        <div className="text-xl font-black text-orange-400 tracking-widest">{order.pickupBarcode}</div>
                      </div>
                      <button
                        onClick={() => setBarcodeModalOrder(order)}
                        className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
                      >
                        Enlarge 📲
                      </button>
                    </div>
                  </div>
                ))}

              {orders.filter(o => ["PREPARING", "READY_FOR_PICKUP"].includes(o.status)).length === 0 && (
                <div className="text-slate-500 py-8">
                  No orders currently awaiting pickup. Completed or dispatched orders are in transit.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: FINANCIAL VAULT & PAYOUT ANALYTICS */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "ANALYTICS" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xl font-black text-white mb-2">Automated Smart Contract Settlements</h2>
            <p className="text-xs text-slate-400 mb-6">
              OENGO disembarks from traditional aggregators that hold merchant funds for weeks. Smart contract escrow settles payouts instantly upon customer delivery PIN verification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Accounts */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Fiat Payout Balance (Instant Bank Transfer)
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    €{profile?.fiatBalanceEUR.toFixed(2) || "1250.00"} EUR
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Direct SEPA / Instant Card payout enabled</div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Web3 Escrow Vault (Non-Custodial)
                  </div>
                  <div className="text-xl font-mono font-bold text-amber-400 break-all">
                    {profile?.cryptoWalletAddress || "0xNapoli_Restaurant_MLDSA65"}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Post-quantum ML-DSA-65 signature verified on Oenexa L1</div>
                </div>
              </div>

              {/* Right Column: Comparison Table */}
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
                  🎉 By using OENGO, your restaurant retains <strong>€{profile?.stats.legacyLostRevenueEUR.toFixed(2) || "187.12"}</strong> more in profits for every 20 orders!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* COURIER BARCODE ENLARGED MODAL */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {barcodeModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
            <div className="text-xs uppercase font-bold text-orange-400 tracking-wider mb-1">
              KITCHEN COUNTER SCAN TARGET
            </div>
            <h3 className="text-2xl font-black text-white mb-1">
              Order #{barcodeModalOrder.id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Customer: {barcodeModalOrder.buyerName || "Alice Customer"} • {barcodeModalOrder.items.length} items
            </p>

            {/* High-Contrast Scannable Barcode Display */}
            <div className="bg-white p-6 rounded-2xl border-4 border-orange-500 mb-6 inline-block w-full">
              {/* Simulated visual high-contrast barcode bars */}
              <div className="h-24 flex items-center justify-center gap-1 bg-white mb-3">
                {[4, 2, 6, 2, 4, 8, 3, 5, 2, 6, 3, 5, 2, 8, 4, 2, 6, 3, 5, 2, 8, 4, 3, 6, 2, 4].map((w, idx) => (
                  <div key={idx} className="bg-black h-full" style={{ width: `${w * 2}px` }} />
                ))}
              </div>
              <div className="text-2xl font-mono font-black text-slate-950 tracking-widest">
                {barcodeModalOrder.pickupBarcode}
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Courier points camera at this barcode to verify counter pickup and trigger transit state.
            </p>

            <button
              onClick={() => setBarcodeModalOrder(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition"
            >
              Close Counter Barcode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
