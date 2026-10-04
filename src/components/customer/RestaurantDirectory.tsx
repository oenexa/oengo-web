import { Restaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";

interface RestaurantDirectoryProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export function RestaurantDirectory({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant
}: RestaurantDirectoryProps) {
  return (
    <div>
      <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
        Featured Partner Restaurants (95% Payout Guaranteed)
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {restaurants.map(r => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            isSelected={selectedRestaurant?.id === r.id}
            onSelect={onSelectRestaurant}
          />
        ))}
      </div>
    </div>
  );
}
