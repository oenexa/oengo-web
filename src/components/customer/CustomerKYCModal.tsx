"use client";

import { useState } from "react";
import { verifyCustomerKYC } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface CustomerKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerKYCModal({ isOpen, onClose, onSuccess }: CustomerKYCModalProps) {
  const [tier, setTier] = useState<number>(2);
  const [docType, setDocType] = useState<string>("PASSPORT");
  const [docNumber, setDocNumber] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    try {
      await verifyCustomerKYC(undefined, tier, docType, docNumber);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to verify KYC.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
            ⚖️
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
              EU AMLD5 &amp; MiCA Compliant
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              Unlock Wallet &amp; OEN Crypto Holdings
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          Under European financial frameworks, holding crypto tokens or stored balances above €150 requires basic identity verification to safeguard against financial crime and chargeback fraud.
        </p>

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <span className="text-3xl block">🎉</span>
            <h4 className="text-sm font-bold text-white">Tier 2 Verification Complete!</h4>
            <p className="text-xs text-emerald-400/90">
              Your digital wallet and OEN token holdings are now fully unlocked for deposits and P2P payments.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            {/* Tier Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Compliance Tier
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTier(1)}
                  className={`p-3 rounded-xl border text-left transition ${
                    tier === 1 
                      ? "bg-orange-500/10 border-orange-500/50 text-orange-400" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-xs text-white">Tier 1: Basic Wallet</div>
                  <div className="text-[10px] text-slate-400 mt-1">EUR balance up to €150 limit</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier(2)}
                  className={`p-3 rounded-xl border text-left transition ${
                    tier === 2 
                      ? "bg-amber-500/10 border-amber-500/50 text-amber-400 ring-1 ring-amber-500/30" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-xs text-white">Tier 2: Full Crypto &amp; OEN</div>
                  <div className="text-[10px] text-slate-400 mt-1">Unlimited EUR &amp; OEN tokens</div>
                </button>
              </div>
            </div>

            {/* Document Type & Number */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="PASSPORT">EU / World Passport</option>
                  <option value="ID_CARD">National ID (CIE/DNI)</option>
                  <option value="DRIVERS_LICENSE">EU Driving License</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Document Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YA881923"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs uppercase font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Document Photo Upload Simulation */}
            <div className="p-3 border border-dashed border-slate-700 rounded-xl bg-slate-950/60 text-center">
              <span className="text-lg block mb-1">📷</span>
              <span className="text-xs font-bold text-slate-300">Fast Document Scan Attached</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Automated visual check • Encrypted 256-bit AES</span>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? "Verifying with AML Registry..." : "Unlock Wallet & Activate OEN Holdings →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
