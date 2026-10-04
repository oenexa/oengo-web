import { API_BASE_URL } from "./constants";
import { 
  WalletData, 
  Restaurant, 
  RestaurantProfile, 
  MenuItem, 
  OrderData, 
  CardPaymentData 
} from "@/types";

// ── Wallet APIs ─────────────────────────────────────────────────────────────
export async function getWallet(userId = "user_customer"): Promise<WalletData> {
  const res = await fetch(`${API_BASE_URL}/wallet/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch wallet");
  const data = await res.json();
  return data.wallets;
}

// ── Commission APIs ─────────────────────────────────────────────────────────
export async function getCommission(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/admin/commission`);
  if (!res.ok) throw new Error("Failed to fetch commission");
  const data = await res.json();
  return data.commissionPct;
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
    ? `${API_BASE_URL}/restaurants/${restaurantId}/orders?status=${status}` 
    : `${API_BASE_URL}/restaurants/${restaurantId}/orders`;
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
    brand: data.brand,
    last4: data.last4
  };
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
  items: { name: string; qty: number; price: number }[];
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

export async function acceptOrder(orderId: string, prepEtaMinutes = 15): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prepEtaMinutes })
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
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to assign courier");
  return data.order;
}

export async function confirmPickup(orderId: string, scannedBarcode: string): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm-pickup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scannedBarcode })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to confirm pickup");
  return data.order;
}

export async function confirmDelivery(orderId: string, proofCode: string): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm-delivery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proofCode })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Failed to confirm delivery");
  return data.order;
}
