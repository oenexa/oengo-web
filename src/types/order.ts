import { CardPaymentData } from "./payment";

export type OrderStatus = 
  | "AWAITING_RESTAURANT" 
  | "PREPARING" 
  | "READY_FOR_PICKUP" 
  | "IN_TRANSIT" 
  | "DELIVERED" 
  | "CANCELLED_BY_RESTAURANT";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface OrderData {
  id: string;
  buyerId: string;
  buyerName?: string;
  buyerAddress?: string;
  restaurantId?: string;
  items: OrderItem[];
  amount: number;
  deliveryFee: number;
  tip: number;
  total: number;
  commissionPct: number;
  paymentMethod?: string;
  cardPayment?: CardPaymentData | null;
  status: OrderStatus;
  pickupBarcode: string;
  deliveryPin: string;
  restaurantPayout?: number;
  courierPayout?: number;
  escrowLocked: boolean;
  createdAt?: string;
  prepEtaMinutes?: number;
}
