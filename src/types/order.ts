import { CardPaymentData } from "./payment";
import { CustomizationChoice } from "./menu";

export type OrderStatus =
  | "AWAITING_RESTAURANT"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED_BY_RESTAURANT"
  | "REFUNDED";

export interface OrderItem {
  id?: string;
  name: string;
  qty: number;
  price: number;
  customizations?: CustomizationChoice[];
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
  discountEUR?: number;
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
