import { OrderData } from "@/types";

interface CounterBarcodeModalProps {
  order: OrderData | null;
  onClose: () => void;
}

export function CounterBarcodeModal({ order, onClose }: CounterBarcodeModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
        <div className="text-xs uppercase font-bold text-orange-400 tracking-wider mb-1">
          KITCHEN COUNTER SCAN TARGET
        </div>
        <h3 className="text-2xl font-black text-white mb-1">
          Order #{order.id.slice(-6).toUpperCase()}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Customer: {order.buyerName || "Alice Customer"} • {order.items.length} items
        </p>

        {/* High-Contrast Scannable Barcode Display */}
        <div className="bg-white p-6 rounded-2xl border-4 border-orange-500 mb-6 inline-block w-full">
          <div className="h-24 flex items-center justify-center gap-1 bg-white mb-3">
            {[4, 2, 6, 2, 4, 8, 3, 5, 2, 6, 3, 5, 2, 8, 4, 2, 6, 3, 5, 2, 8, 4, 3, 6, 2, 4].map(
              (w, idx) => (
                <div key={idx} className="bg-black h-full" style={{ width: `${w * 2}px` }} />
              )
            )}
          </div>
          <div className="text-2xl font-mono font-black text-slate-950 tracking-widest">
            {order.pickupBarcode}
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Courier points camera at this barcode to verify counter pickup and trigger transit state.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
        >
          Close Counter Barcode
        </button>
      </div>
    </div>
  );
}
