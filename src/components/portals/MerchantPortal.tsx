"use client";

import { useState, useEffect, useCallback } from "react";
import { RestaurantProfile, OrderData, MenuItem } from "@/types";
import { 
  getRestaurantProfile, 
  updateRestaurantProfile, 
  getRestaurantOrders, 
  getRestaurantMenu, 
  acceptOrder, 
  readyOrder, 
  declineOrder, 
  updateDish, 
  addDish, 
  deleteDish 
} from "@/lib/api";
import { MerchantHeader } from "@/components/merchant/MerchantHeader";
import { FinancialRibbon } from "@/components/merchant/FinancialRibbon";
import { KdsTicketCard } from "@/components/merchant/KdsTicketCard";
import { MenuManager } from "@/components/merchant/MenuManager";
import { AddDishModal } from "@/components/merchant/AddDishModal";
import { CounterBarcodeModal } from "@/components/merchant/CounterBarcodeModal";
import { VaultAnalytics } from "@/components/merchant/VaultAnalytics";

export default function MerchantPortal() {
  const [activeTab, setActiveTab] = useState<"KDS" | "MENU" | "ANALYTICS" | "PICKUP">("KDS");
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [logMessage, setLogMessage] = useState<string>("Kitchen Display System Connected");
  const [barcodeModalOrder, setBarcodeModalOrder] = useState<OrderData | null>(null);
  const [showAddDishModal, setShowAddDishModal] = useState<boolean>(false);

  const RESTAURANT_ID = typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_restaurant" : "user_restaurant";

  const fetchAllData = useCallback(async () => {
    try {
      const [prof, ords, menuList] = await Promise.all([
        getRestaurantProfile(RESTAURANT_ID),
        getRestaurantOrders(RESTAURANT_ID),
        getRestaurantMenu(RESTAURANT_ID)
      ]);
      setProfile(prof);
      setOrders(ords);
      setMenu(menuList);
    } catch {
      // Local fallback
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 6000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Actions
  const handleToggleStoreOpen = async () => {
    if (!profile) return;
    const nextStatus = !profile.isOpen;
    try {
      await updateRestaurantProfile(RESTAURANT_ID, { isOpen: nextStatus });
      setProfile({ ...profile, isOpen: nextStatus });
      setLogMessage(`Store status switched to ${nextStatus ? "OPEN (Taking Orders)" : "CLOSED"}`);
    } catch {
      setProfile({ ...profile, isOpen: nextStatus });
    }
  };

  const handleAcceptOrder = async (orderId: string, etaMinutes = 15) => {
    setLoading(true);
    try {
      const updated = await acceptOrder(orderId, etaMinutes);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      setLogMessage(`Order ${orderId} accepted! Kitchen timer set to ${etaMinutes} mins.`);
    } catch {
      setLogMessage("Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    setLoading(true);
    try {
      const updated = await readyOrder(orderId);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      setBarcodeModalOrder(updated);
      setLogMessage(`Order ${orderId} is packed and ready for courier pickup!`);
    } catch {
      setLogMessage("Failed to mark order ready");
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to decline this order? Customer will be 100% refunded immediately.")) return;
    setLoading(true);
    try {
      const updated = await declineOrder(orderId, "Kitchen at maximum oven capacity");
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      setLogMessage(`Order ${orderId} declined. Escrow refunded to customer.`);
    } catch {
      setLogMessage("Failed to decline order");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (itemId: string, currentStock: boolean) => {
    const nextStock = !currentStock;
    try {
      await updateDish(RESTAURANT_ID, itemId, { inStock: nextStock });
      setMenu(prev => prev.map(i => (i.id === itemId ? { ...i, inStock: nextStock } : i)));
      setLogMessage(`Item availability updated to: ${nextStock ? "IN STOCK" : "SOLD OUT"}`);
    } catch {
      setMenu(prev => prev.map(i => (i.id === itemId ? { ...i, inStock: nextStock } : i)));
    }
  };

  const handleAddDish = async (dishData: Omit<MenuItem, "id" | "priceOEN">) => {
    setLoading(true);
    try {
      const newItem = await addDish(RESTAURANT_ID, dishData);
      setMenu(prev => [...prev, newItem]);
      setShowAddDishModal(false);
      setLogMessage(`Dish "${newItem.name}" added to menu catalog!`);
    } catch {
      setLogMessage("Failed to add dish");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (itemId: string) => {
    if (!confirm("Delete this dish from catalog?")) return;
    try {
      await deleteDish(RESTAURANT_ID, itemId);
      setMenu(prev => prev.filter(i => i.id !== itemId));
      setLogMessage("Dish removed from catalog");
    } catch {
      setMenu(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const activePipelineCount = orders.filter(o => 
    ["AWAITING_RESTAURANT", "PREPARING", "READY_FOR_PICKUP"].includes(o.status)
  ).length;

  const filteredOrders = orders.filter(o => {
    if (filterStatus === "ALL") return true;
    return o.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-7xl mx-auto">
      {/* 1. Header Bar */}
      <MerchantHeader
        profile={profile}
        soundAlert={soundAlert}
        onToggleSound={() => setSoundAlert(!soundAlert)}
        onToggleStoreOpen={handleToggleStoreOpen}
      />

      {/* 2. Financial Ribbon */}
      <FinancialRibbon
        profile={profile}
        activeCount={activePipelineCount}
      />

      {/* 3. Navigation Tabs */}
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
            {activePipelineCount}
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

      {/* System Status Log */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-400 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>System Log: {logMessage}</span>
        </div>
        <span className="text-slate-500">Auto-refresh: 6s</span>
      </div>

      {activeTab === "KDS" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-[calc(100vh-250px)] overflow-hidden">
          
          {/* Column 1: New Orders */}
          <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="bg-red-500/10 border-b border-red-500/20 p-4 flex items-center justify-between">
              <h3 className="text-red-400 font-black flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> NEW TICKETS
              </h3>
              <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {orders.filter(o => o.status === "AWAITING_RESTAURANT").length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {orders.filter(o => o.status === "AWAITING_RESTAURANT").length === 0 && (
                <p className="text-slate-500 text-sm text-center mt-10">No new orders.</p>
              )}
              {orders.filter(o => o.status === "AWAITING_RESTAURANT").map(order => (
                <KdsTicketCard
                  key={order.id}
                  order={order}
                  loading={loading}
                  onAccept={handleAcceptOrder}
                  onMarkReady={handleMarkReady}
                  onDecline={handleDeclineOrder}
                  onShowBarcode={setBarcodeModalOrder}
                />
              ))}
            </div>
          </div>

          {/* Column 2: Preparing */}
          <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="bg-amber-500/10 border-b border-amber-500/20 p-4 flex items-center justify-between">
              <h3 className="text-amber-400 font-black flex items-center gap-2">
                👨‍🍳 PREPARING
              </h3>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {orders.filter(o => o.status === "PREPARING").length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {orders.filter(o => o.status === "PREPARING").length === 0 && (
                <p className="text-slate-500 text-sm text-center mt-10">Kitchen is clear.</p>
              )}
              {orders.filter(o => o.status === "PREPARING").map(order => (
                <KdsTicketCard
                  key={order.id}
                  order={order}
                  loading={loading}
                  onAccept={handleAcceptOrder}
                  onMarkReady={handleMarkReady}
                  onDecline={handleDeclineOrder}
                  onShowBarcode={setBarcodeModalOrder}
                />
              ))}
            </div>
          </div>

          {/* Column 3: Ready for Pickup */}
          <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-4 flex items-center justify-between">
              <h3 className="text-emerald-400 font-black flex items-center gap-2">
                📦 READY AT COUNTER
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {orders.filter(o => o.status === "READY_FOR_PICKUP").length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {orders.filter(o => o.status === "READY_FOR_PICKUP").length === 0 && (
                <p className="text-slate-500 text-sm text-center mt-10">No orders waiting for couriers.</p>
              )}
              {orders.filter(o => o.status === "READY_FOR_PICKUP").map(order => (
                <KdsTicketCard
                  key={order.id}
                  order={order}
                  loading={loading}
                  onAccept={handleAcceptOrder}
                  onMarkReady={handleMarkReady}
                  onDecline={handleDeclineOrder}
                  onShowBarcode={setBarcodeModalOrder}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. Tab 2: Menu Manager */}
      {activeTab === "MENU" && (
        <MenuManager
          menu={menu}
          onToggleStock={handleToggleStock}
          onDeleteDish={handleDeleteDish}
          onOpenAddModal={() => setShowAddDishModal(true)}
        />
      )}

      {/* 6. Tab 3: Courier Barcode Station */}
      {activeTab === "PICKUP" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-5xl block mb-3">🏷️</span>
            <h2 className="text-2xl font-black text-white">Courier Counter Barcode Station</h2>
            <p className="text-sm text-slate-400 mt-1">
              Couriers arriving at the kitchen counter scan this scannable token to confirm food handover.
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

      {/* 7. Tab 4: Financial Analytics */}
      {activeTab === "ANALYTICS" && (
        <VaultAnalytics profile={profile} />
      )}

      {/* Modals */}
      <AddDishModal
        isOpen={showAddDishModal}
        loading={loading}
        onClose={() => setShowAddDishModal(false)}
        onAddDish={handleAddDish}
      />

      <CounterBarcodeModal
        order={barcodeModalOrder}
        onClose={() => setBarcodeModalOrder(null)}
      />
    </div>
  );
}
