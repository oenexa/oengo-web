import { detectCardBrand } from "@/lib/utils";

interface CardPaymentFormProps {
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
  loading: boolean;
  disabled: boolean;
  orderTotal: number;
  onPay: () => void;
}

export function CardPaymentForm({
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
  loading,
  disabled,
  orderTotal,
  onPay
}: CardPaymentFormProps) {
  const brand = detectCardBrand(cardNumber);

  return (
    <div className="space-y-3 pt-1">
      {/* Preset Card Quick-Fill */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Presets:</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => {
              setCardNumber("4242 4242 4242 4242");
              setCardCvc("888");
            }}
            className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] cursor-pointer"
          >
            Visa
          </button>
          <button
            type="button"
            onClick={() => {
              setCardNumber("5555 5555 5555 4444");
              setCardCvc("777");
            }}
            className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] cursor-pointer"
          >
            MC
          </button>
          <button
            type="button"
            onClick={() => {
              setCardNumber("3782 822463 10005");
              setCardCvc("1234");
            }}
            className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] cursor-pointer"
          >
            Amex
          </button>
        </div>
      </div>

      {/* Card Number */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span>Card Number</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-orange-400 border border-slate-800">
            {brand.toUpperCase()}
          </span>
        </div>
        <input
          type="text"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
          disabled={loading || disabled}
          placeholder="4242 4242 4242 4242"
          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Cardholder Name */}
      <div>
        <div className="text-[11px] text-slate-400 mb-1">Cardholder Name</div>
        <input
          type="text"
          value={cardHolder}
          onChange={e => setCardHolder(e.target.value)}
          disabled={loading || disabled}
          placeholder="Alice Customer"
          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Expiry & CVC */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[11px] text-slate-400 mb-1">Expires (MM/YY)</div>
          <input
            type="text"
            value={cardExp}
            onChange={e => setCardExp(e.target.value)}
            disabled={loading || disabled}
            placeholder="12/28"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 mb-1">CVC / CVV</div>
          <input
            type="password"
            maxLength={4}
            value={cardCvc}
            onChange={e => setCardCvc(e.target.value)}
            disabled={loading || disabled}
            placeholder="888"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Save card checkbox */}
      <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={e => setSaveCard(e.target.checked)}
          disabled={loading || disabled}
          className="rounded bg-slate-900 border-slate-700 text-orange-500"
        />
        <span>Save tokenized card for 1-click reorder</span>
      </label>

      {/* Action button */}
      <button
        type="button"
        onClick={onPay}
        disabled={loading || disabled}
        className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition duration-200 disabled:opacity-50 shadow-lg shadow-orange-500/10 cursor-pointer"
      >
        <span>💳 Pay €{orderTotal.toFixed(2)} Instantly</span>
      </button>
    </div>
  );
}
