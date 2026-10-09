import React, { useState, useEffect } from "react";

interface CourierNode {
  id: string;
  name: string;
  status: "ONLINE" | "DELIVERING" | "OFFLINE";
  lat: number;
  lng: number;
  vehicle: string;
}

export function FleetMap() {
  const [couriers, setCouriers] = useState<CourierNode[]>([]);

  useEffect(() => {
    // Simulated fleet
    const mockFleet: CourierNode[] = [
      { id: "c1", name: "Bob Speed", status: "DELIVERING", lat: 35, lng: 45, vehicle: "🛵" },
      { id: "c2", name: "Alice Wheels", status: "ONLINE", lat: 55, lng: 20, vehicle: "🚴" },
      { id: "c3", name: "Charlie Dash", status: "DELIVERING", lat: 70, lng: 80, vehicle: "🛵" },
      { id: "c4", name: "Dave Ev", status: "ONLINE", lat: 25, lng: 70, vehicle: "🚴" },
    ];
    setCouriers(mockFleet);

    // Simulate movement
    const interval = setInterval(() => {
      setCouriers(prev => prev.map(c => {
        if (c.status === "OFFLINE") return c;
        return {
          ...c,
          lat: Math.max(10, Math.min(90, c.lat + (Math.random() * 2 - 1))),
          lng: Math.max(10, Math.min(90, c.lng + (Math.random() * 2 - 1)))
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white">Live Courier Fleet & Telemetry</h3>
          <p className="text-xs text-slate-400">Global dispatch oversight mapping.</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">2 Delivering</span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">2 Online (Idle)</span>
        </div>
      </div>

      <div className="relative w-full h-80 bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
        {/* City grid graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="admin-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>

        {/* Dispatch Hubs */}
        <div className="absolute left-[20%] top-[30%] flex flex-col items-center">
          <span className="text-3xl opacity-50">🏢</span>
          <span className="text-[9px] font-bold text-slate-500 mt-1">HQ Central</span>
        </div>

        {/* Dynamic Couriers */}
        {couriers.map(c => (
          <div
            key={c.id}
            className="absolute flex flex-col items-center transition-all duration-1000 ease-linear"
            style={{ left: `${c.lng}%`, top: `${c.lat}%` }}
          >
            <span className="text-2xl">{c.vehicle}</span>
            <div className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap border ${c.status === 'DELIVERING' ? 'bg-orange-950/80 text-orange-400 border-orange-800' : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'}`}>
              {c.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
