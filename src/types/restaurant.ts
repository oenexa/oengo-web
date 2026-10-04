export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  address: string;
  icon: string;
  isOpen: boolean;
  prepEtaMinutes: number;
  deliveryFeeEUR: number;
  minOrderEUR: number;
  deliveryRadiusKm: number;
  cryptoWalletAddress: string;
  fiatBalanceEUR?: number;
}

export interface RestaurantStats {
  totalOrdersCount: number;
  activeOrdersCount: number;
  deliveredOrdersCount: number;
  grossRevenueTodayEUR: number;
  fiatBalanceEUR: number;
  commissionRetainedPct: number;
  platformCommissionPct: number;
  legacyLostRevenueEUR: number;
  avgPrepTimeMinutes: number;
}

export interface RestaurantProfile extends Restaurant {
  stats: RestaurantStats;
}
