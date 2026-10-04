export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  priceEUR: number;
  priceOEN: string;
  inStock: boolean;
  prepMinutes: number;
  badge?: string;
}

export interface CartItem {
  item: MenuItem;
  qty: number;
  options?: string[];
}
