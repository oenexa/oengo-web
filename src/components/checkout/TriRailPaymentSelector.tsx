"use client";

import { useState } from "react";
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
  const [mixedCoinAmount, setMixedCoinAmount] = useState<number>(300); // 300 coins = €3.00
  const coinValueEUR = mixedCoinAmount / 100;
  const walletNeeded = Math.max(0, orderTotal - coinValueEUR);

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Payment Options</span>
        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
          <span>🔒</span> Banking-Grade Escrow
        </span>
      </div>

      {/* Grid of payment methods */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-900 rounded-xl mb-4 border border-slate-800">
        <button
          type="button"
          onClick={() => onSelectMethod("CREDIT_CARD")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
            selectedMethod === "CREDIT_CARD" || selectedMethod === "DEBIT_CARD"
              ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>💳 Card</span>
          <span className="text-[10px] font-normal text-slate-500">Credit/Debit</span>
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
          onClick={() => onSelectMethod("OENGO_COIN")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
            selectedMethod === "OENGO_COIN"
              ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🪙 Coins</span>
          <span className="text-[10px] font-normal text-slate-500">Loyalty</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("MIXED_WALLET_COIN")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
            selectedMethod === "MIXED_WALLET_COIN"
              ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🔀 Mixed</span>
          <span className="text-[10px] font-normal text-slate-500">Wallet+Coin</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("INSTANT_PAY")}
          className={`py-2 px-1 text-xs font-bold rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
            selectedMethod === "INSTANT_PAY"
              ? "bg-slate-800 text-orange-400 shadow border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>⚡ 1-Click</span>
          <span className="text-[10px] font-normal text-slate-500">Instant</span>
        </button>
      </div>

      {/* Secondary digital rails */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/60 rounded-xl mb-4 border border-slate-800/80">
        <button
          type="button"
          onClick={() => onSelectMethod("APPLE_PAY")}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
            selectedMethod === "APPLE_PAY"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🍏 Apple Pay</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("GOOGLE_PAY")}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
            selectedMethod === "GOOGLE_PAY"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🌐 GPay</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("BANK_TRANSFER")}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
            selectedMethod === "BANK_TRANSFER"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🏦 Bank (SEPA)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("CRYPTO_OEN")}
          className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
            selectedMethod === "CRYPTO_OEN"
              ? "bg-slate-800 text-orange-400 border border-slate-700"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>⚡ OEN L1</span>
        </button>
      </div>

      {/* Credit / Debit Card */}
      {(selectedMethod === "CREDIT_CARD" || selectedMethod === "DEBIT_CARD") && (
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

      {/* Digital Wallet */}
      {selectedMethod === "DIGITAL_WALLET" && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Available Wallet Balance:</span>
              <span className="text-white font-bold">{formatEUR(wallet?.digital.fiatEUR ?? 50.00)}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Loyalty Cashback:</span>
              <span className="text-emerald-400 font-bold">+5% on this order</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPlaceOrder("DIGITAL_WALLET")}
            disabled={loading || disabled}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl transition disabled:opacity-50 cursor-pointer border border-slate-700"
          >
            Pay {formatEUR(orderTotal)} from Digital Wallet
          </button>
        </div>
      )}

      {/* OENGO Coins */}
      {selectedMethod === "OENGO_COIN" && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Your OENGO Coins:</span>
              <span className="text-amber-400 font-bold">1,250 Coins (€12.50)</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Redemption Rate:</span>
              <span className="text-slate-300">100 Coins = €1.00 (Max 20% order subtotal)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPlaceOrder("OENGO_COIN")}
            disabled={loading || disabled}
            className="w-full py-3 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl transition disabled:opacity-50 cursor-pointer border border-amber-500/40"
          >
            Apply OENGO Coins to Order
          </button>
        </div>
      )}

      {/* Mixed: Wallet + Coin */}
      {selectedMethod === "MIXED_WALLET_COIN" && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Coins to redeem:</span>
              <span className="text-amber-400 font-bold">{mixedCoinAmount} Coins ({formatEUR(coinValueEUR)})</span>
            </div>
            <input
              type="range"
              min={100}
              max={600}
              step={50}
              value={mixedCoinAmount}
              onChange={(e) => setMixedCoinAmount(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
              <span>Remaining from Wallet:</span>
              <span className="text-emerald-400 font-bold">{formatEUR(walletNeeded)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPlaceOrder("MIXED_WALLET_COIN")}
            disabled={loading || disabled}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            Pay Mixed: {formatEUR(coinValueEUR)} Coins + {formatEUR(walletNeeded)} Wallet
          </button>
        </div>
      )}

      {/* Instant Pay / Apple Pay / GPay / Bank */}
      {(selectedMethod === "INSTANT_PAY" || selectedMethod === "APPLE_PAY" || selectedMethod === "GOOGLE_PAY" || selectedMethod === "BANK_TRANSFER") && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
            <span>Fast, biometric 1-tap checkout via </span>
            <span className="text-white font-bold">
              {selectedMethod === "APPLE_PAY" ? "Apple Pay" : selectedMethod === "GOOGLE_PAY" ? "Google Pay" : selectedMethod === "BANK_TRANSFER" ? "SEPA Instant Bank Transfer" : "OENGO Instant Pay (QR / NFC)"}
            </span>
            . Zero card details stored on merchant servers.
          </div>
          <button
            type="button"
            onClick={() => onPlaceOrder(selectedMethod)}
            disabled={loading || disabled}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            Confirm & Pay {formatEUR(orderTotal)} Instantly
          </button>
        </div>
      )}

      {/* Crypto OEN */}
      {selectedMethod === "CRYPTO_OEN" && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>L1 Account:</span>
              <span className="text-white font-mono text-[10px]">0xAlice_Customer_MLDSA65</span>
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
            <span>⚡ Pay {formatOEN(orderTotal)} via L1 Post-Quantum Escrow</span>
          </button>
        </div>
      )}
    </div>
  );
}
