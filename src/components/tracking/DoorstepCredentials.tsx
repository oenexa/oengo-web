interface DoorstepCredentialsProps {
  pickupBarcode: string;
  deliveryPin: string;
}

export function DoorstepCredentials({
  pickupBarcode,
  deliveryPin
}: DoorstepCredentialsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
        <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">
          1. Restaurant Pickup Barcode
        </div>
        <div className="text-2xl font-mono font-black text-orange-400 tracking-widest">
          {pickupBarcode}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Scanned by courier at restaurant counter to confirm food pickup.
        </p>
      </div>

      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
        <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">
          2. Customer Doorstep Delivery PIN
        </div>
        <div className="text-3xl font-mono font-black text-emerald-400 tracking-widest">
          {deliveryPin}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Give this 4-digit PIN to courier at your door to unlock food and release smart escrow.
        </p>
      </div>
    </div>
  );
}
