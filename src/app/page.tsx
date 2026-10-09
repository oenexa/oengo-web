"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  WalletData, 
  Restaurant, 
  MenuItem, 
  CartItem, 
  OrderData, 
  PaymentMethodOption,
  CustomizationChoice 
} from "@/types";
import { 
  getWallet, 
  getCommission, 
  updateCommission, 
  getRestaurants, 
  getRestaurantMenu, 
  createOrder, 
  confirmCardPayment, 
  acceptOrder, 
  assignCourier, 
  confirmPickup, 
  confirmDelivery 
} from "@/lib/api";
import { Header } from "@/components/common/Header";
import { CuisineFilter } from "@/components/customer/CuisineFilter";
import { RestaurantDirectory } from "@/components/customer/RestaurantDirectory";
import { MenuCatalog } from "@/components/customer/MenuCatalog";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { DishCustomizationModal } from "@/components/customer/DishCustomizationModal";
import { CustomerProfileDrawer } from "@/components/customer/CustomerProfileDrawer";
import { ActiveOrderTrackingView } from "@/components/tracking/ActiveOrderTrackingView";
import { DEFAULT_DELIVERY_ADDRESS } from "@/lib/constants";

export default function Home() {
  // State: Financial & User Context
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [commissionPct, setCommissionPct] = useState<number>(5);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(DEFAULT_DELIVERY_ADDRESS);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);

  // State: Directory & Storefront
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State: Cart & Options
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tipEUR, setTipEUR] = useState<number>(2.00);
  const [carbonNeutral, setCarbonNeutral] = useState<boolean>(true);

  // State: Checkout Form
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodOption>("CREDIT_CARD");
  const [cardNumber, setCardNumber] = useState<string>("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = useState<string>("Alice Customer");
  const [cardExp, setCardExp] = useState<string>("12/28");
  const [cardCvc, setCardCvc] = useState<string>("888");
  const [saveCard, setSaveCard] = useState<boolean>(true);

  // State: Active Order & Status
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [logMessage, setLogMessage] = useState<string>("Ready to explore restaurants");

  // State: Modals & Portals
  const [customizingDish, setCustomizingDish] = useState<MenuItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Load initial context
  const refreshWallet = useCallback(async () => {
    try {
      const data = await getWallet();
      setWallet(data);
    } catch {
      // Local fallback
      setWallet({
        digital: { fiatEUR: 50.00, loyaltyPoints: 120, type: "OFF_CHAIN_CREDITS" },
        crypto: { address: "0xAlice_Customer_MLDSA65", balanceOEN: "100.00000000", type: "NON_CUSTODIAL_ML_DSA_65" }
      });
    }
  }, []);

  const loadMenu = useCallback(async (restId: string) => {
    try {
      const items = await getRestaurantMenu(restId);
      setMenuItems(items);
      // Seed default items in cart if empty
      setCart(prev => {
        if (prev.length === 0 && items.length >= 2) {
          return [
            { item: items[0], qty: 1 },
            { item: items[1], qty: 1 }
          ];
        }
        return prev;
      });
    } catch {
      setMenuItems([]);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    await refreshWallet();
    try {
      const comm = await getCommission();
      if (typeof comm === "number") setCommissionPct(comm);
    } catch {
      // default 5%
    }
    try {
      const restList = await getRestaurants();
      setRestaurants(restList);
      if (restList.length > 0) {
        setSelectedRestaurant(restList[0]);
        await loadMenu(restList[0].id);
      }
    } catch {
      setRestaurants([]);
    }
  }, [refreshWallet, loadMenu]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Restaurant Selection
  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurant(r);
    loadMenu(r.id);
    setCart([]);
    setLogMessage(`Switched to ${r.name}`);
  };

  // Cart Operations
  const handleAddToCart = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setCustomizingDish(item);
      return;
    }
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id && (!c.customizations || c.customizations.length === 0));
      if (existing) {
        return prev.map(c => (c === existing ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { item, qty: 1 }];
    });
    setLogMessage(`Added "${item.name}" to cart`);
  };

  const handleAddToCartWithCustomizations = (item: MenuItem, qty: number, choices: CustomizationChoice[]) => {
    const extrasTotal = choices.reduce((sum, c) => sum + c.extraEUR, 0);
    const adjustedItem: MenuItem = {
      ...item,
      priceEUR: parseFloat((item.priceEUR + extrasTotal).toFixed(2)),
    };
    setCart(prev => [...prev, { item: adjustedItem, qty, customizations: choices }]);
    const desc = choices.length > 0 ? ` (${choices.map(c => c.optionName).join(", ")})` : "";
    setLogMessage(`Added ${qty}x "${item.name}"${desc} to cart`);
  };

  const handleUpdateQty = (index: number, delta: number) => {
    setCart(prev =>
      prev
        .map((c, i) => {
          if (i === index) {
            const nextQty = c.qty + delta;
            return nextQty > 0 ? { ...c, qty: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Commission Adjustment
  const handleUpdateCommission = async (rate: number) => {
    setCommissionPct(rate);
    try {
      await updateCommission(rate);
      setLogMessage(`Commission updated to ${rate}% (Merchant retains ${100 - rate}%)`);
    } catch {
      setLogMessage(`Commission set locally to ${rate}%`);
    }
  };

  // Calculations
  const foodSubtotal = cart.reduce((sum, c) => sum + c.item.priceEUR * c.qty, 0);
  const deliveryFee = selectedRestaurant?.deliveryFeeEUR || 2.50;
  const orderTotal = foodSubtotal > 0 ? foodSubtotal + deliveryFee + tipEUR : 0;

  // Order Placement
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
        const expMonth = cardExp.split("/")[0] || "12";
        const expYear = cardExp.split("/")[1] ? `20${cardExp.split("/")[1]}` : "2028";
        cardPaymentData = await confirmCardPayment({
          cardNumber,
          cardHolderName: cardHolder,
          cardExpMonth: expMonth,
          cardExpYear: expYear,
          cardCvc,
          saveCard
        });
      }

      const newOrder = await createOrder({
        buyerId: typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_customer" : "user_customer",
        restaurantId: selectedRestaurant?.id || (typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_restaurant" : "user_restaurant"),
        amount: parseFloat(foodSubtotal.toFixed(2)),
        deliveryFee: parseFloat(deliveryFee.toFixed(2)),
        tip: parseFloat(tipEUR.toFixed(2)),
        commissionPct,
        paymentMethod: method,
        cardPayment: cardPaymentData,
        items: cart.map(c => ({
          name: c.customizations && c.customizations.length > 0
            ? `${c.item.name} (${c.customizations.map(x => x.optionName).join(", ")})`
            : c.item.name,
          qty: c.qty,
          price: c.item.priceEUR
        }))
      });

      setActiveOrder(newOrder);
      const label = method === "CREDIT_CARD" && cardPaymentData
        ? `Credit Card (${cardPaymentData.brand} •••• ${cardPaymentData.last4})`
        : method;
      setLogMessage(`Order ${newOrder.id} paid instantly via ${label}! Locked in Escrow.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to Oengo API gateway";
      setLogMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Simulation Steps
  const handleRestaurantAccept = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      const order = await acceptOrder(activeOrder.id, 15);
      setActiveOrder(order);
      setLogMessage("Restaurant accepted order! Kitchen preparing meal (ETA: 15m).");
    } catch {
      setLogMessage("Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  const handleCourierPickup = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      await assignCourier(activeOrder.id, typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_courier" : "user_courier");
      const order = await confirmPickup(activeOrder.id, activeOrder.pickupBarcode);
      setActiveOrder(order);
      setLogMessage(`Pickup barcode verified (${activeOrder.pickupBarcode})! Order is now IN_TRANSIT.`);
    } catch {
      setLogMessage("Failed to verify pickup barcode");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      const order = await confirmDelivery(activeOrder.id, activeOrder.deliveryPin);
      setActiveOrder(order);
      const comm = order.commissionPct ?? commissionPct;
      setLogMessage(`PIN ${activeOrder.deliveryPin} verified! Escrow settled: ${100 - comm}% to Restaurant, ${comm}%+tip to Courier!`);
      await refreshWallet();
    } catch {
      setLogMessage("Failed to confirm delivery");
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants by cuisine and search
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
      {/* 1. Top Header */}
      <Header
        wallet={wallet}
        deliveryAddress={deliveryAddress}
        isEditingAddress={isEditingAddress}
        onToggleEditAddress={() => setIsEditingAddress(!isEditingAddress)}
        onSaveAddress={addr => {
          setDeliveryAddress(addr);
          setIsEditingAddress(false);
        }}
        onAddressChange={setDeliveryAddress}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 2. Main Content Area */}
      {activeOrder ? (
        <ActiveOrderTrackingView
          order={activeOrder}
          loading={loading}
          onRestaurantAccept={handleRestaurantAccept}
          onCourierPickup={handleCourierPickup}
          onConfirmDelivery={handleConfirmDelivery}
          onResetOrder={() => {
            setActiveOrder(null);
            setLogMessage("Ready for next order");
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Cuisine Filter Carousel & Search */}
          <CuisineFilter
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Restaurant Discovery Directory */}
          <RestaurantDirectory
            restaurants={filteredRestaurants}
            selectedRestaurant={selectedRestaurant}
            onSelectRestaurant={handleSelectRestaurant}
          />

          {/* Workspace: Menu Catalog & Sticky Cart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <MenuCatalog
                restaurant={selectedRestaurant}
                menuItems={menuItems}
                onAddToCart={handleAddToCart}
                onCustomize={dish => setCustomizingDish(dish)}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <CartDrawer
                cart={cart}
                onUpdateQty={handleUpdateQty}
                foodSubtotal={foodSubtotal}
                deliveryFee={deliveryFee}
                tipEUR={tipEUR}
                setTipEUR={setTipEUR}
                carbonNeutral={carbonNeutral}
                setCarbonNeutral={setCarbonNeutral}
                orderTotal={orderTotal}
                commissionPct={commissionPct}
                onUpdateCommission={handleUpdateCommission}
                loading={loading}
                logMessage={logMessage}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
                wallet={wallet}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardHolder={cardHolder}
                setCardHolder={setCardHolder}
                cardExp={cardExp}
                setCardExp={setCardExp}
                cardCvc={cardCvc}
                setCardCvc={setCardCvc}
                saveCard={saveCard}
                setSaveCard={setSaveCard}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Dialogs */}
      <DishCustomizationModal
        item={customizingDish}
        isOpen={!!customizingDish}
        onClose={() => setCustomizingDish(null)}
        onAddToCart={handleAddToCartWithCustomizations}
      />

      <CustomerProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
