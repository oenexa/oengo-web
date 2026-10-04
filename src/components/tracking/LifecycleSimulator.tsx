import { OrderStatus } from "@/types";

interface LifecycleSimulatorProps {
  status: OrderStatus;
  loading: boolean;
  onRestaurantAccept: () => void;
  onCourierPickup: () => void;
  onConfirmDelivery: () => void;
  onResetOrder: () => void;
}

export function LifecycleSimulator({
  status,
  loading,
  onRestaurantAccept,
  onCourierPickup,
  onConfirmDelivery,
  onResetOrder
}: LifecycleSimulatorProps) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Interactive Simulation Steps:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={onRestaurantAccept}
          disabled={loading || status !== "AWAITING_RESTAURANT"}
          className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
        >
          <div className="text-xs text-orange-400 font-bold">Step 1 (Restaurant)</div>
          <div className="text-sm font-semibold text-white mt-0.5">Accept &amp; Cook 👨‍🍳</div>
        </button>

        <button
          onClick={onCourierPickup}
          disabled={loading || !["PREPARING", "READY_FOR_PICKUP"].includes(status)}
          className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
        >
          <div className="text-xs text-orange-400 font-bold">Step 2 (Courier)</div>
          <div className="text-sm font-semibold text-white mt-0.5">Scan Pickup Barcode 🛵</div>
        </button>

        <button
          onClick={onConfirmDelivery}
          disabled={loading || status !== "IN_TRANSIT"}
          className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-left border border-slate-700 transition cursor-pointer"
        >
          <div className="text-xs text-emerald-400 font-bold">Step 3 (Doorstep)</div>
          <div className="text-sm font-semibold text-white mt-0.5">Verify PIN &amp; Release Escrow 🔓</div>
        </button>
      </div>

      {status === "DELIVERED" && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl flex items-center justify-between">
          <div className="text-xs text-emerald-300">
            🎉 <strong>Delivery Complete!</strong> 95% revenue disbursed to merchant, courier fee+tip paid, and 5% cashback added to your wallet!
          </div>
          <button
            onClick={onResetOrder}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
          >
            Order Another Meal 🍔
          </button>
        </div>
      )}
    </div>
  );
}
