import { CUISINE_FILTERS } from "@/lib/constants";

interface CuisineFilterProps {
  selectedCuisine: string;
  onSelectCuisine: (cuisineKey: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CuisineFilter({
  selectedCuisine,
  onSelectCuisine,
  searchQuery,
  onSearchChange
}: CuisineFilterProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Cuisine Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
        {CUISINE_FILTERS.map(c => (
          <button
            key={c.key}
            onClick={() => onSelectCuisine(c.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCuisine === c.key
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="w-full md:w-72">
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search dishes, tacos, pizza..."
          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
        />
      </div>
    </div>
  );
}
