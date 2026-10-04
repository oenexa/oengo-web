import { MenuItem, Restaurant } from "@/types";
import { StorefrontBanner } from "./StorefrontBanner";
import { DishCard } from "./DishCard";

interface MenuCatalogProps {
  restaurant: Restaurant | null;
  menuItems: MenuItem[];
  onAddToCart: (dish: MenuItem) => void;
}

export function MenuCatalog({
  restaurant,
  menuItems,
  onAddToCart
}: MenuCatalogProps) {
  if (!restaurant) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
        Select a restaurant above to view its menu.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <StorefrontBanner restaurant={restaurant} />

      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
        Menu Catalog ({menuItems.length} Dishes Available)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map(dish => (
          <DishCard
            key={dish.id}
            dish={dish}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
