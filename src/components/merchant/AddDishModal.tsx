import { useState } from "react";
import { MenuItem } from "@/types";

interface AddDishModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onAddDish: (dish: Omit<MenuItem, "id" | "priceOEN">) => void;
}

export function AddDishModal({
  isOpen,
  loading,
  onClose,
  onAddDish
}: AddDishModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Pizza & Mains");
  const [price, setPrice] = useState("17.50");
  const [prep, setPrep] = useState("15");
  const [desc, setDesc] = useState("");
  const [badge, setBadge] = useState("Chef Special");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    onAddDish({
      name,
      category,
      priceEUR: parseFloat(price),
      prepMinutes: parseInt(prep, 10),
      description: desc,
      badge,
      inStock: true
    });
    setName("");
    setDesc("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-white">Add Dish to Menu</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-lg font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Dish Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Quattro Formaggi Pizza"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Pizza & Mains">Pizza &amp; Mains</option>
                <option value="Burgers">Burgers</option>
                <option value="Starters">Starters</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Price (EUR)</label>
              <input
                type="number"
                step="0.10"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Prep Time (mins)</label>
              <input
                type="number"
                value={prep}
                onChange={e => setPrep(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Badge Tag</label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="Chef Special, Organic"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Description &amp; Ingredients</label>
            <textarea
              rows={2}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Artisan ingredients, allergens, preparation notes..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
            >
              Save Dish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
