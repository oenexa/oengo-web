import { OrderData } from "@/types";
import { formatEUR } from "@/lib/utils";

interface KdsTicketCardProps {
  order: OrderData;
  loading: boolean;
  onAccept: (orderId: string, mins: number) => void;
  onMarkReady: (orderId: string) => void;
  onDecline: (orderId: string) => void;
  onShowBarcode: (order: OrderData) => void;
}

export function KdsTicketCard({
  order,
  loading,
  onAccept,
  onMarkReady,
  onDecline,
  onShowBarcode
}: KdsTicketCardProps) {
  const isNew = order.status === "AWAITING_RESTAURANT";
  const isCooking = order.status === "PREPARING";
  const isReady = order.status === "READY_FOR_PICKUP";
  const isDelivered = order.status === "DELIVERED";

  return (
    <div
      className={`rounded-2xl border transition shadow-xl p-5 flex flex-col justify-between ${
        isNew
          ? "bg-orange-950/20 border-orange-500/60 shadow-orange-500/5 ring-1 ring-orange-500/30"
          : isCooking
          ? "bg-slate-900 border-amber-500/40"
          : isReady
          ? "bg-slate-900 border-emerald-500/40"
          : "bg-slate-900/60 border-slate-800 opacity-80"
      }`}
    >
      <div>
        {/* Ticket Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div>
            <div className="text-[11px] font-mono text-slate-500">
              TICKET #{order.id.slice(-6).toUpperCase()}
            </div>
            <div className="text-base font-black text-white">{order.buyerName || "Alice Customer"}</div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
              isNew
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                : isCooking
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : isReady
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Payment Rail Badge */}
        <div className="mb-3">
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono border border-slate-800 flex items-center gap-1.5 w-fit">
            {order.paymentMethod === "CREDIT_CARD" ? (
              <>
                <span>💳</span>
                <span>Direct Card ({order.cardPayment?.brand || "Visa"} •••• {order.cardPayment?.last4 || "4242"})</span>
              </>
            ) : order.paymentMethod === "DIGITAL_WALLET" ? (
              <>
                <span>👛</span>
                <span>In-App Digital Wallet</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Web3 Crypto (OEN L1 Escrow)</span>
              </>
            )}
            <span className="text-emerald-400 font-bold ml-1">PAID</span>
          </span>
        </div>

        {/* Order Items List */}
        <div className="space-y-1.5 mb-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">
                <span className="text-orange-400 font-mono mr-1.5">{item.qty}x</span>
                {item.name}
              </span>
              <span className="text-slate-400 font-mono">{formatEUR(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        {/* Payout Breakdown */}
        <div className="text-xs text-slate-400 flex justify-between border-t border-slate-800/80 pt-2 mb-4">
          <span>Order Total: <strong>{formatEUR(order.total)}</strong></span>
          <span className="text-emerald-400 font-bold">
            Merchant Payout (95%): {formatEUR(order.amount * 0.95)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        {isNew && (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 font-semibold">Select Kitchen Prep ETA:</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[10, 15, 25].map(mins => (
                <button
                  key={mins}
                  onClick={() => onAccept(order.id, mins)}
                  disabled={loading}
                  className="py-2 px-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-lg text-xs transition cursor-pointer disabled:opacity-50 text-center"
                >
                  Accept ({mins}m)
                </button>
              ))}
            </div>
            <button
              onClick={() => onDecline(order.id)}
              disabled={loading}
              className="w-full py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition border border-rose-900/60 cursor-pointer"
            >
              Decline &amp; Refund Customer
            </button>
          </div>
        )}

        {isCooking && (
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs text-amber-300 flex items-center justify-between">
              <span>👨‍🍳 Chef cooking meal...</span>
              <span className="font-mono font-bold">{order.prepEtaMinutes || 15} mins ETA</span>
            </div>
            <button
              onClick={() => onMarkReady(order.id)}
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <span>📦 Mark Ready for Courier Pickup</span>
            </button>
          </div>
        )}

        {isReady && (
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Counter Pickup Barcode</div>
              <div className="text-xl font-mono font-black text-orange-400 tracking-widest my-1">
                {order.pickupBarcode}
              </div>
              <p className="text-[10px] text-slate-500">Awaiting courier camera scan at counter</p>
            </div>
            <button
              onClick={() => onShowBarcode(order)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <span>📲 Enlarge Barcode for Courier</span>
            </button>
          </div>
        )}

        {isDelivered && (
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span>✅</span> Escrow Released
            </span>
            <span className="font-mono text-white">{formatEUR(order.amount * 0.95)} Paid</span>
          </div>
        )}
      </div>
    </div>
  );
}
