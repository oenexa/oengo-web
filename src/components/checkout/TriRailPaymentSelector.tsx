import { PaymentMethodOption, WalletData } from "@/types";
import { formatEUR, formatOEN } from "@/lib/utils";
import { CardPaymentForm } from "./CardPaymentForm";

interface TriRailPaymentSelectorProps {
  selectedMethod: PaymentMethodOption;
  onSelectMethod: (method: PaymentMethodOption) => void;
  wallet: WalletData | null;
  orderTotal: number;
  loading: boolean;
  disabled: boolean;
  // Card form props
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

export function TriRailPaymentSelector({
  selectedMethod,
  onSelectMethod,
  wallet,
  orderTotal,
  loading,
  disabled,
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
}: TriRailPaymentSelectorProps) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Payment Rail</span>
        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
          <span>🔒</span> Instant Escrow
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl mb-4 border border-slate-800">
        <button
          type="button"
          onClick={() => onSelectMethod("CREDIT_CARD")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
            selectedMethod === "CREDIT_CARD"
              ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>💳 Card</span>
          <span className="text-[10px] font-normal text-slate-500">Instant</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("DIGITAL_WALLET")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
            selectedMethod === "DIGITAL_WALLET"
              ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>👛 Wallet</span>
          <span className="text-[10px] font-normal text-slate-500">Fiat</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("CRYPTO_OEN")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
            selectedMethod === "CRYPTO_OEN"
              ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>⚡ Crypto</span>
          <span className="text-[10px] font-normal text-slate-500">Layer-1</span>
        </button>
      </div>

      {/* Rail 1: Credit Card */}
      {selectedMethod === "CREDIT_CARD" && (
        <CardPaymentForm
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
          loading={loading}
          disabled={disabled}
          orderTotal={orderTotal}
          onPay={() => onPlaceOrder("CREDIT_CARD")}
        />
      )}

      {/* Rail 2: Digital Wallet */}
      {selectedMethod === "DIGITAL_WALLET" && (
        <div className="space-y-3 pt-2">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Available Balance:</span>
              <span className="text-white font-bold">{formatEUR(wallet?.digital.fiatEUR ?? 50.00)}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Loyalty Points:</span>
              <span className="text-orange-400 font-bold">{wallet?.digital.loyaltyPoints ?? 120} pts</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPlaceOrder("DIGITAL_WALLET")}
            disabled={loading || disabled}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl transition disabled:opacity-50 cursor-pointer border border-slate-700"
          >
            Pay {formatEUR(orderTotal)} from Wallet Balance
          </button>
        </div>
      )}

      {/* Rail 3: Crypto OEN */}
      {selectedMethod === "CRYPTO_OEN" && (
        <div className="space-y-3 pt-2">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>L1 Account:</span>
              <span className="text-white font-mono text-[10px]">0xAlice_Customer...</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>OEN Balance:</span>
              <span className="text-orange-400 font-bold font-mono">{wallet?.crypto.balanceOEN ?? "100.00"} OEN</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPlaceOrder("CRYPTO_OEN")}
            disabled={loading || disabled}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition disabled:opacity-50 shadow-lg shadow-orange-500/10 cursor-pointer"
          >
            <span>⚡ Pay {formatOEN(orderTotal)} via L1 Escrow</span>
          </button>
        </div>
      )}
    </div>
  );
}
