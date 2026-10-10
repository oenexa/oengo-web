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
import { DEFAULT_DELIVERY_ADDRESS } from "@/lib/constants";

export function useStorefront() {
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
        web3: { usdcBalance: 0, oenBalance: 0, address: "0x..." },
        userId: "user_customer",
        isActive: true
      });
    }
  }, []);

  useEffect(() => {
    refreshWallet();
    getCommission().then(c => setCommissionPct(c.ratePct)).catch(() => {});
    getRestaurants().then(setRestaurants).catch(() => {});
  }, [refreshWallet]);

  const handleSelectRestaurant = async (r: Restaurant) => {
    setSelectedRestaurant(r);
    setCart([]); // Reset cart on restaurant switch
    setLogMessage(`Browsing menu for ${r.name}`);
    try {
      const menu = await getRestaurantMenu(r.id);
      setMenuItems(menu);
    } catch {
      setMenuItems([]);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { item, qty: 1 }];
    });
    setLogMessage(`Added ${item.name} to cart.`);
  };

  const handleAddToCartWithCustomizations = (item: MenuItem, choices: CustomizationChoice[]) => {
    setCart(prev => [...prev, { item, qty: 1, customizations: choices }]);
    setCustomizingDish(null);
    setLogMessage(`Added customized ${item.name} to cart.`);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === itemId);
      if (!existing) return prev;
      const newQty = existing.qty + delta;
      if (newQty <= 0) return prev.filter(c => c.item.id !== itemId);
      return prev.map(c => c.item.id === itemId ? { ...c, qty: newQty } : c);
    });
  };

  const handleUpdateCommission = async (newPct: number) => {
    setCommissionPct(newPct);
    setLogMessage(`Platform Commission Rate proposed to adjust to ${newPct}%!`);
    try {
      await updateCommission(newPct);
      setLogMessage(`Platform Commission successfully updated to ${newPct}%!`);
    } catch {
      setLogMessage("Failed to update commission on server.");
    }
  };

  // Derived financials
  const foodSubtotal = cart.reduce((acc, curr) => acc + (curr.item.priceEUR * curr.qty), 0);
  const deliveryFee = 3.50; // Flat test fee
  const orderTotal = foodSubtotal + deliveryFee + tipEUR;

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

  const filteredRestaurants = restaurants.filter(r => {
    const matchesCuisine = selectedCuisine === "ALL" || r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
    const matchesSearch = searchQuery === "" || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCuisine && matchesSearch;
  });

  return {
    wallet,
    deliveryAddress,
    isEditingAddress,
    setIsEditingAddress,
    setDeliveryAddress,
    selectedCuisine,
    setSelectedCuisine,
    searchQuery,
    setSearchQuery,
    filteredRestaurants,
    selectedRestaurant,
    handleSelectRestaurant,
    menuItems,
    handleAddToCart,
    setCustomizingDish,
    customizingDish,
    handleAddToCartWithCustomizations,
    cart,
    handleUpdateQty,
    foodSubtotal,
    deliveryFee,
    tipEUR,
    setTipEUR,
    carbonNeutral,
    setCarbonNeutral,
    orderTotal,
    commissionPct,
    handleUpdateCommission,
    loading,
    logMessage,
    selectedMethod,
    setSelectedMethod,
    cardNumber,
    setCardNumber,
    cardHolder,
    setCardHolder,
    cardExp,
    setCardExp,
    cardCvc,
    setCardCvc,
    saveCard,
    setSaveCard,
    handlePlaceOrder,
    activeOrder,
    setActiveOrder,
    setLogMessage,
    handleRestaurantAccept,
    handleCourierPickup,
    handleConfirmDelivery,
    isProfileOpen,
    setIsProfileOpen,
  };
}
