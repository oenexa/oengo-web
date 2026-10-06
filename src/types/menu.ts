export interface CustomizationOption {
  name: string;
  extraEUR: number;
}

export interface CustomizationGroup {
  name: string;
  isMulti?: boolean;
  options: CustomizationOption[];
}

export interface CustomizationChoice {
  groupName: string;
  optionName: string;
  extraEUR: number;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  priceEUR: number;
  priceOEN: string;
  inStock: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  prepMinutes: number;
  badge?: string;
  calories?: number;
  ingredients?: string;
  customizations?: CustomizationGroup[];
}

export interface CartItem {
  item: MenuItem;
  qty: number;
  customizations?: CustomizationChoice[];
}
