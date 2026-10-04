import { OEN_EUR_EXCHANGE_RATE } from "./constants";

export function formatEUR(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

export function formatOEN(amountEUR: number): string {
  return `${(amountEUR / OEN_EUR_EXCHANGE_RATE).toFixed(2)} OEN`;
}

export function detectCardBrand(number: string): string {
  const cleaned = (number || "").replace(/\D/g, "");
  if (/^4/.test(cleaned)) return "Visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^6(?:011|5)/.test(cleaned)) return "Discover";
  return "Card";
}

export function truncateAddress(address: string, maxLen = 14): string {
  if (!address) return "";
  if (address.length <= maxLen) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
