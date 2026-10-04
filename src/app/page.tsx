"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  address: string;
  icon: string;
  isOpen: boolean;
  prepEtaMinutes: number;
  deliveryFeeEUR: number;
  minOrderEUR: number;
  deliveryRadiusKm: number;
  cryptoWalletAddress: string;
}

interface CartItem {
  item: MenuItem;
  qty: number;
  options?: string[];
}

interface OrderData {
  id: string;
  buyerId: string;
  buyerAddress?: string;
  restaurantId?: string;
  items: { name: string; qty: number; price: number }[];
  amount: number;
  deliveryFee: number;
  tip: number;
  total: number;
  commissionPct: number;
  paymentMethod?: string;
  cardPayment?: {
    brand: string;
    last4: string;
    transactionId: string;
  } | null;
  status: "AWAITING_RESTAURANT" | "PREPARING" | "READY_FOR_PICKUP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED_BY_RESTAURANT";
  pickupBarcode: string;
  deliveryPin: string;
  restaurantPayout?: number;
  courierPayout?: number;
  escrowLocked: boolean;
  createdAt?: string;
}

type PaymentMethodOption = "CREDIT_CARD" | "DIGITAL_WALLET" | "CRYPTO_OEN";

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("Piazza del Plebiscito 1, Napoli");
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tipEUR, setTipEUR] = useState<number>(2.00);
  const [carbonNeutral, setCarbonNeutral] = useState<boolean>(true);
  const [commissionPct, setCommissionPct] = useState<number>(5); // Default 5%

  // Payment Form State
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodOption>("CREDIT_CARD");
  const [cardNumber, setCardNumber] = useState<string>("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = useState<string>("Alice Customer");
  const [cardExp, setCardExp] = useState<string>("12/28");
  const [cardCvc, setCardCvc] = useState<string>("888");
  const [saveCard, setSaveCard] = useState<boolean>(true);

  // Active Order & Tracking State
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [logMessage, setLogMessage] = useState<string>("Ready to explore restaurants");

  // Fetch initial wallet balance, commission, and restaurant directory
  const fetchWallet = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/wallet/user_customer");
      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallets);
      }
    } catch {
      setWallet({
        digital: { fiatEUR: 50.00, loyaltyPoints: 120, type: "OFF_CHAIN_CREDITS" },
        crypto: { address: "0xAlice_Customer_MLDSA65", balanceOEN: "100.00000000", type: "NON_CUSTODIAL_ML_DSA_65" }
      });
    }
  };

  const fetchCommission = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/admin/commission");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.commissionPct === "number") {
          setCommissionPct(data.commissionPct);
        }
      }
    } catch {
      // default 5%
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/restaurants");
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data.restaurants || []);
        if (data.restaurants && data.restaurants.length > 0) {
          const first = data.restaurants[0];
          setSelectedRestaurant(first);
          fetchMenuForRestaurant(first.id);
        }
      }
    } catch {
      // Fallback data
      const mock: Restaurant[] = [
        {
          id: "user_restaurant",
          name: "Napoli Woodfire Pizza",
          tagline: "Authentic Neapolitan Pizza & Artisan Italian Delicacies",
          cuisine: "Italian, Pizza, Artisan",
          rating: 4.9,
          reviewCount: 342,
          address: "Via Toledo 42, Napoli",
          icon: "🍕",
          isOpen: true,
          prepEtaMinutes: 15,
          deliveryFeeEUR: 2.50,
          minOrderEUR: 15.00,
          deliveryRadiusKm: 5.5,
          cryptoWalletAddress: "0xNapoli_Restaurant_MLDSA65"
        },
        {
          id: "rest_burger",
          name: "Smash & Co. Gourmet Burgers",
          tagline: "Double Smashed Dry-Aged Angus & Loaded Brioche",
          cuisine: "American, Burgers, Craft",
          rating: 4.8,
          reviewCount: 218,
          address: "Corso Umberto I 118, Napoli",
          icon: "🍔",
          isOpen: true,
          prepEtaMinutes: 20,
          deliveryFeeEUR: 2.99,
          minOrderEUR: 12.00,
          deliveryRadiusKm: 6.0,
          cryptoWalletAddress: "0xSmashBurger_MLDSA65"
        }
      ];
      setRestaurants(mock);
      setSelectedRestaurant(mock[0]);
    }
  };

  const fetchMenuForRestaurant = async (restId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/restaurants/${restId}/menu`);
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data.menu || []);
        // Seed default cart with 2 items from this restaurant if cart is empty
        if (cart.length === 0 && data.menu && data.menu.length >= 2) {
          setCart([
            { item: data.menu[0], qty: 1 },
            { item: data.menu[1], qty: 1 }
          ]);
        }
      }
    } catch {
      // Offline fallback menu
      setMenuItems([
        {
          id: "menu_margherita",
          category: "Pizza & Mains",
          name: "Artisanal Margherita Pizza",
          description: "San Marzano D.O.P. tomatoes, buffalo mozzarella, fresh basil",
          priceEUR: 16.50,
          priceOEN: "1.21",
          inStock: true,
          prepMinutes: 12,
          badge: "Bestseller"
        },
        {
          id: "menu_arancini",
          category: "Starters",
          name: "Truffle & Porcini Arancini",
          description: "Crispy saffron risotto balls with black truffle aioli",
          priceEUR: 12.00,
          priceOEN: "0.88",
          inStock: true,
          prepMinutes: 8,
          badge: "Vegetarian"
        }
      ]);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchCommission();
    fetchRestaurants();
  }, []);

  // Handle switching active restaurant
  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurant(r);
    fetchMenuForRestaurant(r.id);
    setCart([]); // reset cart for new restaurant
    setLogMessage(`Switched to ${r.name}`);
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      setCart(cart.map(c => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { item, qty: 1 }]);
    }
    setLogMessage(`Added "${item.name}" to cart`);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart(
      cart
        .map(c => {
          if (c.item.id === itemId) {
            const nextQty = c.qty + delta;
            return nextQty > 0 ? { ...c, qty: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Calculations
  const foodSubtotal = cart.reduce((sum, c) => sum + c.item.priceEUR * c.qty, 0);
  const deliveryFee = selectedRestaurant?.deliveryFeeEUR || 2.50;
  const orderTotal = foodSubtotal > 0 ? foodSubtotal + deliveryFee + tipEUR : 0;
  const foodSubtotalOEN = (foodSubtotal / 13.60).toFixed(2);

  // Update commission rate
  const handleUpdateCommission = async (rate: number) => {
    setCommissionPct(rate);
    try {
      await fetch("http://localhost:3001/api/admin/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratePct: rate })
      });
      setLogMessage(`Platform commission set to ${rate}% (Merchant keeps ${100 - rate}%)`);
    } catch {
      setLogMessage(`Commission updated locally to ${rate}%`);
    }
  };

  // Step 1: Customer Places Order
  const handlePlaceOrder = async (method: PaymentMethodOption = selectedMethod) => {
    if (cart.length === 0) {
      alert("Please add items to your cart before checking out.");
      return;
    }
    setLoading(true);
    setLogMessage("Authorizing payment and securing order in smart escrow...");
    try {
      let cardPaymentData = null;

      if (method === "CREDIT_CARD") {
        setLogMessage("Processing instant credit card authorization...");
        const cardRes = await fetch("http://localhost:3001/api/payments/confirm-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardNumber,
            cardHolderName: cardHolder,
            cardExpMonth: cardExp.split("/")[0] || "12",
            cardExpYear: cardExp.split("/")[1] ? `20${cardExp.split("/")[1]}` : "2028",
            cardCvc,
            saveCard
          })
        });
        const cardJson = await cardRes.json();
        if (!cardRes.ok || !cardJson.success) {
          throw new Error(cardJson.error || "Credit card authorization failed");
        }
        cardPaymentData = {
          transactionId: cardJson.transactionId,
          brand: cardJson.brand,
          last4: cardJson.last4
        };
      }

      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: "user_customer",
          restaurantId: selectedRestaurant?.id || "user_restaurant",
          amount: parseFloat(foodSubtotal.toFixed(2)),
          deliveryFee: parseFloat(deliveryFee.toFixed(2)),
          tip: parseFloat(tipEUR.toFixed(2)),
          commissionPct,
          paymentMethod: method,
          cardPayment: cardPaymentData,
          items: cart.map(c => ({
            name: c.item.name,
            qty: c.qty,
            price: c.item.priceEUR
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrder(data.order);
        const label = method === "CREDIT_CARD" && cardPaymentData
          ? `Credit Card (${cardPaymentData.brand} •••• ${cardPaymentData.last4})`
          : method;
        setLogMessage(`Order ${data.order.id} paid instantly via ${label}! Locked in Escrow.`);
      } else {
        setLogMessage(data.error || "Failed to create order");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to Oengo API gateway";
      setLogMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Simulation - Restaurant Kitchen Accept
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

  // Step 3: Simulation - Courier Pickup Scan
  const handleCourierPickup = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:3001/api/orders/${activeOrder.id}/assign-courier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courierId: "user_courier" })
      });

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

  // Step 4: Simulation - Doorstep PIN Delivery Verification
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
        const comm = data.order.commissionPct ?? commissionPct;
        setLogMessage(`PIN ${activeOrder.deliveryPin} verified! Escrow settled: ${100 - comm}% to Restaurant, ${comm}%+tip to Courier!`);
        fetchWallet();
      }
    } catch {
      setLogMessage("Failed to confirm delivery");
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants by cuisine and search query
  const filteredRestaurants = restaurants.filter(r => {
    const matchesCuisine = selectedCuisine === "ALL" || r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
    const matchesSearch = searchQuery === "" || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-7xl mx-auto">
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & DELIVERY ADDRESS BAR */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
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
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                />
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="px-2 py-0.5 bg-orange-500 text-slate-950 rounded font-bold text-[11px]"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">{deliveryAddress}</span>
                <button
                  onClick={() => setIsEditingAddress(true)}
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
          {wallet && (
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl">
              <div className="pr-4 border-r border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Digital Wallet</div>
                <div className="text-lg font-black text-emerald-400">€{wallet.digital.fiatEUR.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400">⭐ {wallet.digital.loyaltyPoints} Cashback Pts</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Web3 Crypto (OEN)</div>
                <div className="text-lg font-black text-amber-400">{parseFloat(wallet.crypto.balanceOEN).toFixed(2)} OEN</div>
                <div className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">{wallet.crypto.address}</div>
              </div>
            </div>
          )}

          <Link
            href="/merchant"
            className="px-4 py-3 rounded-2xl bg-orange-950/70 hover:bg-orange-900 border border-orange-700/60 text-orange-300 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-orange-500/5 hover:border-orange-500 cursor-pointer"
          >
            <span>👨‍🍳</span>
            <span>Kitchen Portal (KDS) &rarr;</span>
          </Link>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* 2. MODE A: ACTIVE ORDER & LIVE COURIER TRACKING MAP */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeOrder ? (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            {/* Top Bar of Active Order */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-slate-500">Order ID: {activeOrder.id}</span>
                <h2 className="text-2xl font-black text-white mt-0.5">Live Delivery Tracking</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 font-mono flex items-center gap-1.5 border border-slate-800">
                    {activeOrder.paymentMethod === "CREDIT_CARD" ? (
                      <>
                        <span>💳</span>
                        <span>Instant Card: <strong className="text-white">{activeOrder.cardPayment?.brand || "Visa"} •••• {activeOrder.cardPayment?.last4 || "4242"}</strong></span>
                        <span className="text-emerald-400 font-semibold text-[10px] ml-1 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/80">ESCROW LOCKED</span>
                      </>
                    ) : activeOrder.paymentMethod === "DIGITAL_WALLET" ? (
                      <>
                        <span>👛</span>
                        <span>Digital Wallet (Fiat Escrow Locked)</span>
                      </>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>Web3 OENEXA L1 (WASM Escrow Locked)</span>
                      </>
                    )}
                  </span>
                </div>
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

            {/* Stepper Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className={activeOrder.status !== "AWAITING_RESTAURANT" ? "text-emerald-400" : "text-orange-400"}>
                  1. Order Placed 🔒
                </span>
                <span className={["PREPARING", "READY_FOR_PICKUP", "IN_TRANSIT", "DELIVERED"].includes(activeOrder.status) ? "text-emerald-400" : "text-slate-600"}>
                  2. Cooking 👨‍🍳
                </span>
                <span className={["READY_FOR_PICKUP", "IN_TRANSIT", "DELIVERED"].includes(activeOrder.status) ? "text-emerald-400" : "text-slate-600"}>
                  3. Packed 📦
                </span>
                <span className={["IN_TRANSIT", "DELIVERED"].includes(activeOrder.status) ? "text-emerald-400" : "text-slate-600"}>
                  4. On the Way 🛵
                </span>
                <span className={activeOrder.status === "DELIVERED" ? "text-emerald-400" : "text-slate-600"}>
                  5. Delivered 🎉
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-orange-500 to-emerald-400 h-full transition-all duration-500"
                  style={{
                    width:
                      activeOrder.status === "AWAITING_RESTAURANT"
                        ? "20%"
                        : activeOrder.status === "PREPARING"
                        ? "45%"
                        : activeOrder.status === "READY_FOR_PICKUP"
                        ? "65%"
                        : activeOrder.status === "IN_TRANSIT"
                        ? "85%"
                        : "100%"
                  }}
                />
              </div>
            </div>

            {/* Interactive Vector Route Map Widget */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Courier Route &amp; Map</h3>
                    <p className="text-xs text-slate-400">Via Toledo 42 ➔ Piazza del Plebiscito 1, Napoli</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-orange-400">
                  {activeOrder.status === "DELIVERED" ? "Arrived" : "ETA: ~12 mins"}
                </div>
              </div>

              {/* Vector Graphic Dark Map */}
              <div className="relative w-full h-48 bg-slate-900/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                {/* City street grid graphic */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Simulated Street Polyline */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 120 130 Q 300 80 500 110 T 800 90"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Marker 1: Restaurant */}
                <div className="absolute left-[15%] top-[55%] flex flex-col items-center">
                  <span className="text-2xl animate-bounce">🍕</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-white border border-slate-700 mt-1">
                    Napoli Pizza
                  </span>
                </div>

                {/* Marker 2: Moving Courier */}
                <div
                  className="absolute transition-all duration-1000 flex flex-col items-center"
                  style={{
                    left:
                      activeOrder.status === "AWAITING_RESTAURANT" || activeOrder.status === "PREPARING"
                        ? "17%"
                        : activeOrder.status === "READY_FOR_PICKUP"
                        ? "20%"
                        : activeOrder.status === "IN_TRANSIT"
                        ? "55%"
                        : "82%",
                    top:
                      activeOrder.status === "IN_TRANSIT" ? "42%" : "50%"
                  }}
                >
                  <span className="text-3xl">🛵</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                    Bob Rider (0.4 km)
                  </span>
                </div>

                {/* Marker 3: Destination Customer */}
                <div className="absolute right-[15%] top-[40%] flex flex-col items-center">
                  <span className="text-2xl">📍</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-700 mt-1">
                    Your Doorstep
                  </span>
                </div>
              </div>

              {/* Courier Profile Pill */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚴</span>
                  <span>Courier: <strong className="text-white">Bob Delivery Rider</strong> (Electric Bike • ⭐ 4.95)</span>
                </div>
                <div className="text-emerald-400 font-semibold">📞 Verified Courier</div>
              </div>
            </div>

            {/* Handover Verification Credentials Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">1. Restaurant Pickup Barcode</div>
                <div className="text-2xl font-mono font-black text-orange-400 tracking-widest">{activeOrder.pickupBarcode}</div>
                <p className="text-xs text-slate-500 mt-1">Scanned by courier at restaurant counter to confirm food pickup.</p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">2. Customer Doorstep Delivery PIN</div>
                <div className="text-3xl font-mono font-black text-emerald-400 tracking-widest">{activeOrder.deliveryPin}</div>
                <p className="text-xs text-slate-500 mt-1">Give this 4-digit PIN to courier at your door to unlock food and release smart escrow.</p>
              </div>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Interactive Simulation Steps:</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={handleRestaurantAccept}
                  disabled={loading || activeOrder.status !== "AWAITING_RESTAURANT"}
                  className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
                >
                  <div className="text-xs text-orange-400 font-bold">Step 1 (Restaurant)</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Accept &amp; Cook 👨‍🍳</div>
                </button>

                <button
                  onClick={handleCourierPickup}
                  disabled={loading || !["PREPARING", "READY_FOR_PICKUP"].includes(activeOrder.status)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
                >
                  <div className="text-xs text-orange-400 font-bold">Step 2 (Courier)</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Scan Pickup Barcode 🛵</div>
                </button>

                <button
                  onClick={handleConfirmDelivery}
                  disabled={loading || activeOrder.status !== "IN_TRANSIT"}
                  className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
                >
                  <div className="text-xs text-emerald-400 font-bold">Step 3 (Doorstep)</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Verify PIN &amp; Release Escrow 🔓</div>
                </button>
              </div>

              {activeOrder.status === "DELIVERED" && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl flex items-center justify-between">
                  <div className="text-xs text-emerald-300">
                    🎉 <strong>Delivery Complete!</strong> 95% revenue disbursed to merchant, courier fee+tip paid, and 5% cashback added to your wallet!
                  </div>
                  <button
                    onClick={() => {
                      setActiveOrder(null);
                      setLogMessage("Ready for next order");
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
                  >
                    Order Another Meal 🍔
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────────────────────── */
        /* 3. MODE B: RESTAURANT DISCOVERY, MENU BROWSING & CHECKOUT */
        /* ────────────────────────────────────────────────────────────────────────── */
        <div className="space-y-8">
          {/* Cuisine Filter Pills & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Cuisine Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
              {[
                { key: "ALL", label: "All Cuisines" },
                { key: "Italian", label: "🍕 Pizza & Italian" },
                { key: "Burgers", label: "🍔 Gourmet Burgers" },
                { key: "Asian", label: "🍣 Japanese & Sushi" },
                { key: "Healthy", label: "🥗 Healthy & Vegan" }
              ].map(c => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCuisine(c.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCuisine === c.key
                      ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dishes, tacos, pizza..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Restaurant Cards Carousel */}
          <div>
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
              Featured Partner Restaurants (95% Payout Guaranteed)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredRestaurants.map(r => {
                const isSelected = selectedRestaurant?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRestaurant(r)}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-slate-900 border-orange-500 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/40"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{r.icon}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ⭐ {r.rating} ({r.reviewCount})
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white">{r.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{r.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
                      <span>⏱️ {r.prepEtaMinutes + 10}m</span>
                      <span>🛵 €{r.deliveryFeeEUR.toFixed(2)} delivery</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Workspace: Menu Catalog & Sticky Cart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Selected Restaurant Storefront & Menu */}
            <div className="lg:col-span-2 space-y-6">
              {selectedRestaurant && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  {/* Banner */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selectedRestaurant.icon}</span>
                        <h2 className="text-xl font-black text-white">{selectedRestaurant.name}</h2>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          OPEN
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{selectedRestaurant.tagline}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedRestaurant.address} • Delivery: ~{selectedRestaurant.prepEtaMinutes + 12} mins</p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60 inline-block">
                        95% Revenue to Chef
                      </div>
                    </div>
                  </div>

                  {/* Menu Dishes Grid */}
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Menu Catalog ({menuItems.length} Dishes Available)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menuItems.map(dish => (
                        <div
                          key={dish.id}
                          className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-white">{dish.name}</span>
                              {dish.badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-950 text-orange-400 border border-orange-800/80 whitespace-nowrap">
                                  {dish.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">{dish.description}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                            <div>
                              <span className="text-sm font-black text-emerald-400">€{dish.priceEUR.toFixed(2)}</span>
                              <span className="text-[10px] text-slate-500 font-mono ml-1.5">{dish.priceOEN} OEN</span>
                            </div>

                            <button
                              onClick={() => handleAddToCart(dish)}
                              disabled={!dish.inStock}
                              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md"
                            >
                              {dish.inStock ? "Add + " : "Sold Out"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Cart & Tri-Rail Checkout */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>🛒</span> Your Order
                  </h3>
                  <span className="text-xs text-slate-400">{cart.length} items</span>
                </div>

                {/* Cart Items List */}
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    Your cart is empty. Click <strong>Add +</strong> on any dish to begin.
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {cart.map(c => (
                      <div key={c.item.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div className="pr-2">
                          <div className="text-xs font-bold text-white line-clamp-1">{c.item.name}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">€{(c.item.priceEUR * c.qty).toFixed(2)}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQty(c.item.id, -1)}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-white">{c.qty}</span>
                          <button
                            onClick={() => handleUpdateQty(c.item.id, 1)}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tip Selector */}
                <div className="mb-4 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Courier Tip (100% to Rider):</span>
                    <span className="text-white font-bold">€{tipEUR.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[0, 1.00, 2.00, 3.50].map(tip => (
                      <button
                        key={tip}
                        type="button"
                        onClick={() => setTipEUR(tip)}
                        className={`py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          tipEUR === tip
                            ? "bg-orange-500 text-slate-950 font-black shadow"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {tip === 0 ? "None" : `€${tip.toFixed(2)}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Carbon Neutral Delivery Toggle */}
                <label className="flex items-center justify-between text-xs text-slate-400 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-1.5">
                    <span>🌱</span>
                    <span>Carbon-Neutral Bicycle Delivery</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={carbonNeutral}
                    onChange={e => setCarbonNeutral(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                  />
                </label>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-400 mb-4 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Food Subtotal:</span>
                    <span className="text-white font-mono">€{foodSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="text-white font-mono">€{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier Tip:</span>
                    <span className="text-white font-mono">€{tipEUR.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                    <span>Total in Escrow:</span>
                    <span className="text-orange-400 font-mono">€{orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="text-[10px] text-right text-slate-500 font-mono">
                    ≈ {((orderTotal) / 13.60).toFixed(2)} OEN
                  </div>
                </div>

                {/* Configurable Platform Commission Selector */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Commission Setup</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-800/80">
                      {commissionPct}% {commissionPct === 5 ? "(Default)" : "(Custom)"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[0, 3, 5, 10].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleUpdateCommission(rate)}
                        className={`py-1 px-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          commissionPct === rate
                            ? "bg-orange-500 text-slate-950 font-black"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Chef Payout (95%):</span>
                    <span className="text-emerald-400 font-semibold">€{(foodSubtotal * (1 - commissionPct / 100)).toFixed(2)}</span>
                  </div>
                </div>

                {/* Tri-Rail Payment Gateway Selector */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Payment Rail</span>
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <span>🔒</span> Instant Escrow
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl mb-4 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("CREDIT_CARD")}
                      className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
                        selectedMethod === "CREDIT_CARD"
                          ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>💳 Card</span>
                      <span className="text-[10px] font-normal text-slate-500">Instant</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("DIGITAL_WALLET")}
                      className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
                        selectedMethod === "DIGITAL_WALLET"
                          ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>👛 Wallet</span>
                      <span className="text-[10px] font-normal text-slate-500">Fiat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("CRYPTO_OEN")}
                      className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
                        selectedMethod === "CRYPTO_OEN"
                          ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>⚡ Crypto</span>
                      <span className="text-[10px] font-normal text-slate-500">Layer-1</span>
                    </button>
                  </div>

                  {/* Rail 1: Credit Card Form */}
                  {selectedMethod === "CREDIT_CARD" && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Presets:</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setCardNumber("4242 4242 4242 4242");
                              setCardCvc("888");
                            }}
                            className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]"
                          >
                            Visa
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCardNumber("5555 5555 5555 4444");
                              setCardCvc("777");
                            }}
                            className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]"
                          >
                            MC
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCardNumber("3782 822463 10005");
                              setCardCvc("1234");
                            }}
                            className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]"
                          >
                            Amex
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-400 mb-1">Card Number</div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] text-slate-400 mb-1">Expires</div>
                          <input
                            type="text"
                            value={cardExp}
                            onChange={e => setCardExp(e.target.value)}
                            placeholder="12/28"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-400 mb-1">CVC</div>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvc}
                            onChange={e => setCardCvc(e.target.value)}
                            placeholder="888"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlaceOrder("CREDIT_CARD")}
                        disabled={loading || cart.length === 0}
                        className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition duration-200 disabled:opacity-50 shadow-lg shadow-orange-500/10 cursor-pointer"
                      >
                        <span>💳 Pay €{orderTotal.toFixed(2)} Instantly</span>
                      </button>
                    </div>
                  )}

                  {/* Rail 2: Digital Wallet */}
                  {selectedMethod === "DIGITAL_WALLET" && (
                    <div className="space-y-3 pt-2">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 flex justify-between">
                          <span>Balance:</span>
                          <span className="text-white font-bold">€{wallet?.digital.fiatEUR.toFixed(2) ?? "50.00"} EUR</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlaceOrder("DIGITAL_WALLET")}
                        disabled={loading || cart.length === 0}
                        className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl transition disabled:opacity-50 cursor-pointer border border-slate-700"
                      >
                        Pay €{orderTotal.toFixed(2)} from Wallet
                      </button>
                    </div>
                  )}

                  {/* Rail 3: Crypto OEN */}
                  {selectedMethod === "CRYPTO_OEN" && (
                    <div className="space-y-3 pt-2">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 flex justify-between">
                          <span>OEN Balance:</span>
                          <span className="text-orange-400 font-bold font-mono">{wallet?.crypto.balanceOEN ?? "100.00"} OEN</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlaceOrder("CRYPTO_OEN")}
                        disabled={loading || cart.length === 0}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition disabled:opacity-50 shadow-lg shadow-orange-500/10 cursor-pointer"
                      >
                        <span>⚡ Pay {((orderTotal) / 13.60).toFixed(2)} OEN via L1 Escrow</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 text-center font-mono">
                  {logMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
