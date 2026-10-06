export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/+$/, "").endsWith("/api")
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/+$/, "")
  : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/+$/, "")}/api`;

export const OEN_EUR_EXCHANGE_RATE = 13.60;

export const DEFAULT_COMMISSION_PCT = 5;

export const DEFAULT_DELIVERY_ADDRESS = "Piazza del Plebiscito 1, Napoli";

export const CUISINE_FILTERS = [
  { key: "ALL", label: "All Cuisines" },
  { key: "Italian", label: "🍕 Pizza & Italian" },
  { key: "Burgers", label: "🍔 Gourmet Burgers" },
  { key: "Asian", label: "🍣 Japanese & Sushi" },
  { key: "Healthy", label: "🥗 Healthy & Vegan" }
];
