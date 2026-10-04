import { CartItem, PaymentMethodOption, WalletData } from "@/types";
import { formatEUR, formatOEN } from "@/lib/utils";
import { CommissionSelector } from "../checkout/CommissionSelector";
import { TriRailPaymentSelector } from "../checkout/TriRailPaymentSelector";

interface CartDrawerProps {
  cart: CartItem[];
  onUpdateQty: (itemId: string, delta: number) => void;
  foodSubtotal: number;
  deliveryFee: number;
  tipEUR: number;
  setTipEUR: (val: number) => void;
  carbonNeutral: boolean;
  setCarbonNeutral: (val: boolean) => void;
  orderTotal: number;
  commissionPct: number;
  onUpdateCommission: (rate: number) => void;
  loading: boolean;
  logMessage: string;
  // Payment props
  selectedMethod: PaymentMethodOption;
  onSelectMethod: (method: PaymentMethodOption) => void;
  wallet: WalletData | null;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardHolder: string;
  setCardHolder: (val: string) => void;
  cardExp: string;
  setCardExp: (val: string) => void;
  cardCvc: string;
  setCardCvc: (val: string) => void;
  saveCard: boolean;
  setSaveCard: (val: boolean) => void;
  onPlaceOrder: (method: PaymentMethodOption) => void;
}

export function CartDrawer({
  cart,
  onUpdateQty,
  foodSubtotal,
  deliveryFee,
  tipEUR,
  setTipEUR,
  carbonNeutral,
  setCarbonNeutral,
  orderTotal,
  commissionPct,
  onUpdateCommission,
  loading,
  logMessage,
  selectedMethod,
  onSelectMethod,
  wallet,
  cardNumber,
  setCardNumber,
  cardHolder,
  setCardHolder,
  cardExp,
  setCardExp,
  cardCvc,
  setCardCvc,
  saveCard,
  setSaveCard,
  onPlaceOrder
}: CartDrawerProps) {
  const isCartEmpty = cart.length === 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <span>🛒</span> Your Order
        </h3>
        <span className="text-xs text-slate-400">{cart.length} items</span>
      </div>

      {/* Cart Items List */}
      {isCartEmpty ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          Your cart is empty. Click <strong>Add +</strong> on any dish to begin.
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {cart.map(c => (
            <div
              key={c.item.id}
              className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between"
            >
              <div className="pr-2">
                <div className="text-xs font-bold text-white line-clamp-1">{c.item.name}</div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  {formatEUR(c.item.priceEUR * c.qty)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQty(c.item.id, -1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-white">{c.qty}</span>
                <button
                  onClick={() => onUpdateQty(c.item.id, 1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip Selector */}
      <div className="mb-4 pt-2 border-t border-slate-800">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Courier Tip (100% to Rider):</span>
          <span className="text-white font-bold">{formatEUR(tipEUR)}</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[0, 1.00, 2.00, 3.50].map(tip => (
            <button
              key={tip}
              type="button"
              onClick={() => setTipEUR(tip)}
              className={`py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                tipEUR === tip
                  ? "bg-orange-500 text-slate-950 font-black shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tip === 0 ? "None" : formatEUR(tip)}
            </button>
          ))}
        </div>
      </div>

      {/* Carbon Neutral Delivery Toggle */}
      <label className="flex items-center justify-between text-xs text-slate-400 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 cursor-pointer">
        <div className="flex items-center gap-1.5">
          <span>🌱</span>
          <span>Carbon-Neutral Bicycle Delivery</span>
        </div>
        <input
          type="checkbox"
          checked={carbonNeutral}
          onChange={e => setCarbonNeutral(e.target.checked)}
          className="rounded bg-slate-900 border-slate-700 text-emerald-500"
        />
      </label>

      {/* Price Breakdown */}
      <div className="space-y-1.5 text-xs text-slate-400 mb-4 pt-2 border-t border-slate-800">
        <div className="flex justify-between">
          <span>Food Subtotal:</span>
          <span className="text-white font-mono">{formatEUR(foodSubtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee:</span>
          <span className="text-white font-mono">{formatEUR(deliveryFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>Courier Tip:</span>
          <span className="text-white font-mono">{formatEUR(tipEUR)}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
          <span>Total in Escrow:</span>
          <span className="text-orange-400 font-mono">{formatEUR(orderTotal)}</span>
        </div>
        <div className="text-[10px] text-right text-slate-500 font-mono">
          ≈ {formatOEN(orderTotal)}
        </div>
      </div>

      {/* Platform Commission Selector */}
      <CommissionSelector
        commissionPct={commissionPct}
        foodSubtotal={foodSubtotal}
        disabled={loading}
        onUpdateCommission={onUpdateCommission}
      />

      {/* Tri-Rail Payment Selector & Form */}
      <TriRailPaymentSelector
        selectedMethod={selectedMethod}
        onSelectMethod={onSelectMethod}
        wallet={wallet}
        orderTotal={orderTotal}
        loading={loading}
        disabled={isCartEmpty}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardHolder={cardHolder}
        setCardHolder={setCardHolder}
        cardExp={cardExp}
        setCardExp={setCardExp}
        cardCvc={cardCvc}
        setCardCvc={setCardCvc}
        saveCard={saveCard}
        setSaveCard={setSaveCard}
        onPlaceOrder={onPlaceOrder}
      />

      <div className="text-[10px] text-slate-500 text-center font-mono">
        {logMessage}
      </div>
    </div>
  );
}
