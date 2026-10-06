import { API_BASE_URL } from "./constants";
import { 
  WalletData, 
  CoinProfile,
  Restaurant, 
  RestaurantProfile, 
  MenuItem, 
  OrderData, 
  CardPaymentData 
} from "@/types";

// ── Wallet & Coin APIs ───────────────────────────────────────────────────────
export async function getWallet(userId = "user_customer"): Promise<WalletData> {
  const res = await fetch(`${API_BASE_URL}/wallet/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch wallet");
  const data = await res.json();
  return data.wallets;
}

export async function depositWallet(userId = "user_customer", amount: number): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/wallet/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount })
  });
  if (!res.ok) throw new Error("Failed to deposit to wallet");
  const data = await res.json();
  return data.newBalanceEUR;
}

export async function getCoinProfile(userId = "user_customer"): Promise<CoinProfile> {
  const res = await fetch(`${API_BASE_URL}/coins/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch coins");
  return await res.json();
}

export async function redeemCoins(userId = "user_customer", coins: number, subtotal: number): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/coins/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, coins, subtotal })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to redeem coins");
  return data.discountEUR;
}

// ── Commission APIs ─────────────────────────────────────────────────────────
export async function getCommission(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`);
  if (!res.ok) return 5.0;
  const data = await res.json();
  return data.stats?.defaultCommissionPct ?? 5.0;
}

export async function updateCommission(ratePct: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/commission`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ratePct })
  });
  if (!res.ok) throw new Error("Failed to update commission");
}

// ── Restaurant & Menu APIs ──────────────────────────────────────────────────
export async function getRestaurants(cuisine?: string, search?: string): Promise<Restaurant[]> {
  const params = new URLSearchParams();
  if (cuisine && cuisine !== "ALL") params.append("cuisine", cuisine);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE_URL}/restaurants?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch restaurants");
  const data = await res.json();
  return data.restaurants || [];
}

export async function getRestaurantProfile(restaurantId: string): Promise<RestaurantProfile> {
  const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`);
  if (!res.ok) throw new Error("Failed to fetch restaurant profile");
  const data = await res.json();
  return data.restaurant;
}

export async function updateRestaurantProfile(
  restaurantId: string, 
  updates: Partial<Restaurant>
): Promise<Restaurant> {
  const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error("Failed to update restaurant profile");
  const data = await res.json();
  return data.restaurant;
}

export async function getRestaurantMenu(restaurantId: string): Promise<MenuItem[]> {
  const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  const data = await res.json();
  return data.menu || [];
}

export async function addDish(
  restaurantId: string, 
  dishData: Omit<MenuItem, "id" | "priceOEN">
): Promise<MenuItem> {
  const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dishData)
  });
  if (!res.ok) throw new Error("Failed to add dish");
  const data = await res.json();
  return data.item;
}

export async function updateDish(
  restaurantId: string, 
  itemId: string, 
  updates: Partial<MenuItem>
): Promise<MenuItem> {
  const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error("Failed to update dish");
  const data = await res.json();
  return data.item;
}

export async function deleteDish(restaurantId: string, itemId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu/${itemId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete dish");
}

export async function getRestaurantOrders(restaurantId: string, status?: string): Promise<OrderData[]> {
  const url = status 
    ? `${API_BASE_URL}/orders?restaurantId=${restaurantId}&status=${status}` 
    : `${API_BASE_URL}/orders?restaurantId=${restaurantId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.orders || [];
}

// ── Payment APIs ────────────────────────────────────────────────────────────
export interface ConfirmCardPayload {
  cardNumber: string;
  cardHolderName: string;
  cardExpMonth: string;
  cardExpYear: string;
  cardCvc: string;
  saveCard?: boolean;
}

export async function confirmCardPayment(payload: ConfirmCardPayload): Promise<CardPaymentData> {
  const res = await fetch(`${API_BASE_URL}/payments/confirm-card`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Card payment confirmation failed");
  }
  return {
    transactionId: data.transactionId,
    brand: data.cardPayment?.brand || data.brand || "Visa",
    last4: data.cardPayment?.last4 || data.last4 || "4242"
  };
}

export async function instantPay(userId: string, method: string, amount: number): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/payments/instant-pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, method, amount })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Instant pay failed");
  return data;
}

// ── Order & Tracking Lifecycle APIs ─────────────────────────────────────────
export interface CreateOrderPayload {
  buyerId?: string;
  restaurantId: string;
  amount: number;
  deliveryFee: number;
  tip: number;
  commissionPct: number;
  paymentMethod: string;
  cardPayment?: CardPaymentData | null;
  items: any[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      buyerId: payload.buyerId || "user_customer",
      ...payload
    })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create order");
  }
  return data.order;
}

export async function acceptOrder(orderId: string, etaMinutes?: number): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ etaMinutes: etaMinutes ?? 15 })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to accept order");
  return data.order;
}

export async function readyOrder(orderId: string): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/ready`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to mark order ready");
  return data.order;
}

export async function declineOrder(orderId: string, reason?: string): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/decline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to decline order");
  return data.order;
}

export async function assignCourier(orderId: string, courierId = "user_courier"): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/assign-courier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courierId })
  });
  if (!res.ok) {
    return { id: orderId, courierId, status: "READY_FOR_PICKUP" } as any;
  }
  const data = await res.json();
  return data.order || ({ id: orderId, courierId, status: "READY_FOR_PICKUP" } as any);
}

export async function confirmPickup(orderId: string, barcode: string): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm-pickup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ barcode })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to confirm pickup");
  return data.order;
}

export async function confirmDelivery(orderId: string, code: string): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm-delivery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to confirm delivery");
  return data.order;
}

// ── Rider APIs ──────────────────────────────────────────────────────────────
export async function getRiderProfile(riderId = "user_courier"): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/rider/profile?riderId=${riderId}`);
  if (!res.ok) throw new Error("Failed to fetch rider profile");
  const data = await res.json();
  return data.rider;
}

export async function toggleRiderStatus(riderId = "user_courier", isOnline: boolean): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/rider/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ riderId, isOnline })
  });
  if (!res.ok) throw new Error("Failed to toggle rider status");
  const data = await res.json();
  return data.rider;
}

export async function getRiderJobs(riderId = "user_courier"): Promise<OrderData[]> {
  const res = await fetch(`${API_BASE_URL}/rider/jobs?riderId=${riderId}`);
  if (!res.ok) throw new Error("Failed to fetch rider jobs");
  const data = await res.json();
  return data.jobs || [];
}

// ── Admin APIs ──────────────────────────────────────────────────────────────
export async function getAdminDashboard(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch admin dashboard");
  const data = await res.json();
  return data.stats;
}

// ── Customer Profile & Recommendations ──────────────────────────────────────
export async function getCustomerProfile(userId = "user_customer"): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/customer/profile?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  const data = await res.json();
  return data.profile;
}

export async function getRecommendations(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/recommendations`);
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  const data = await res.json();
  return data.recommendations;
}
