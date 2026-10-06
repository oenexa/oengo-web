export type PaymentMethodOption =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "DIGITAL_WALLET"
  | "OENGO_COIN"
  | "MIXED_WALLET_COIN"
  | "INSTANT_PAY"
  | "APPLE_PAY"
  | "GOOGLE_PAY"
  | "BANK_TRANSFER"
  | "CRYPTO_OEN";

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
