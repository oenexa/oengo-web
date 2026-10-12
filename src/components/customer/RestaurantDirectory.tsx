import { Restaurant, MenuItem } from "@/types";
import { RestaurantCard } from "./RestaurantCard";

interface RestaurantDirectoryProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onAddToCart?: (dish: MenuItem) => void;
  onCustomize?: (dish: MenuItem) => void;
}

export function RestaurantDirectory({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
  onAddToCart,
  onCustomize
}: RestaurantDirectoryProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase font-extrabold text-orange-400 tracking-wider flex items-center gap-2">
            <span>🍕</span>
            <span>Featured Partner Restaurants (Interactive Frames)</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any restaurant frame to expand and inspect dishes directly inside the card.
          </p>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
          {restaurants.length} kitchens active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {restaurants.map(r => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            isSelected={selectedRestaurant?.id === r.id}
            onSelect={onSelectRestaurant}
            onAddToCart={onAddToCart}
            onCustomize={onCustomize}
          />
        ))}
      </div>
    </div>
  );
}
