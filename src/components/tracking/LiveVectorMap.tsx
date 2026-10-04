import { OrderStatus } from "@/types";

interface LiveVectorMapProps {
  status: OrderStatus;
  restaurantName?: string;
  restaurantAddress?: string;
  customerAddress?: string;
}

export function LiveVectorMap({
  status,
  restaurantName = "Napoli Woodfire Pizza",
  restaurantAddress = "Via Toledo 42",
  customerAddress = "Piazza del Plebiscito 1, Napoli"
}: LiveVectorMapProps) {
  const getCourierPosition = () => {
    switch (status) {
      case "AWAITING_RESTAURANT":
      case "PREPARING":
        return { left: "17%", top: "50%" };
      case "READY_FOR_PICKUP":
        return { left: "20%", top: "50%" };
      case "IN_TRANSIT":
        return { left: "55%", top: "42%" };
      case "DELIVERED":
        return { left: "82%", top: "50%" };
      default:
        return { left: "17%", top: "50%" };
    }
  };

  const pos = getCourierPosition();

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 mb-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <div>
            <h3 className="text-sm font-bold text-white">Live Courier Route &amp; Map</h3>
            <p className="text-xs text-slate-400">
              {restaurantAddress} ➔ {customerAddress}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-orange-400">
          {status === "DELIVERED" ? "Arrived" : "ETA: ~12 mins"}
        </div>
      </div>

      {/* Vector Graphic Dark Map */}
      <div className="relative w-full h-48 bg-slate-900/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* City street grid graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Street Route Polyline */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 120 130 Q 300 80 500 110 T 800 90"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeDasharray="8 6"
            className="animate-pulse"
          />
        </svg>

        {/* Marker 1: Restaurant */}
        <div className="absolute left-[15%] top-[55%] flex flex-col items-center">
          <span className="text-2xl animate-bounce">🍕</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-white border border-slate-700 mt-1">
            {restaurantName.split(" ")[0]}
          </span>
        </div>

        {/* Marker 2: Moving Courier */}
        <div
          className="absolute transition-all duration-1000 flex flex-col items-center"
          style={{ left: pos.left, top: pos.top }}
        >
          <span className="text-3xl">🛵</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 whitespace-nowrap">
            Bob Rider (0.4 km)
          </span>
        </div>

        {/* Marker 3: Destination Customer */}
        <div className="absolute right-[15%] top-[40%] flex flex-col items-center">
          <span className="text-2xl">📍</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-700 mt-1">
            Your Doorstep
          </span>
        </div>
      </div>

      {/* Courier Profile Pill */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚴</span>
          <span>Courier: <strong className="text-white">Bob Delivery Rider</strong> (Electric Bike • ⭐ 4.95)</span>
        </div>
        <div className="text-emerald-400 font-semibold">📞 Verified Courier</div>
      </div>
    </div>
  );
}
