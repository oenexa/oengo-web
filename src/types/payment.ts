export type PaymentMethodOption = "CREDIT_CARD" | "DIGITAL_WALLET" | "CRYPTO_OEN";

export interface CardPaymentData {
  transactionId: string;
  brand: string;
  last4: string;
}

export interface CardIntentResponse {
  success: boolean;
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}
