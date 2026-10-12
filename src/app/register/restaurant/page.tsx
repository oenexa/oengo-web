"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export default function RestaurantRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // EU Restaurant Banking & Business fields
  const [businessName, setBusinessName] = useState("");
  const [vatId, setVatId] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [country, setCountry] = useState("IT");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [bankingTermsConsent, setBankingTermsConsent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!gdprConsent) {
      setError("EU GDPR compliance consent is mandatory to onboard a merchant account.");
      return;
    }

    if (!bankingTermsConsent) {
      setError("Acceptance of EU SEPA & PSD2 Merchant Payout Terms is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: "RESTAURANT",
        businessName,
        vatId,
        iban,
        bic,
        businessAddress,
        country,
        gdprConsent: true,
      };

      const data = await registerUser(payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("oengo_user_id", data.user.id);
        localStorage.setItem("oengo_user_role", data.user.role);
        router.push("/kyc");
      }
    } catch (err: any) {
      setError(err.message || "Merchant registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-950">
      {/* Left Panel: Restaurant Merchant Onboarding Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10 py-12 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto space-y-6">
          
          {/* Top Navigation & Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                👨‍🍳
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                OEN<span className="text-orange-500">GO</span>{" "}
                <span className="text-xs font-bold text-orange-400">MERCHANTS</span>
              </span>
            </Link>

            <Link
              href="/register"
              className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition"
            >
              ← Customer Signup
            </Link>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-bold mb-2">
              <span>🇪🇺 EU PSD2 &amp; SEPA Merchant Onboarding</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Partner your Restaurant</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Keep 95% of every order with automated daily SEPA settlement directly to your business IBAN.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* 1. Authorized Representative Credentials */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>1. Authorized Owner / Representative</span>
                <span className="text-[10px] text-slate-500">AMLD5 Identity Record</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Owner Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                    placeholder="Marco Rossi"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Business Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                    placeholder="+39 081 1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                    placeholder="owner@ristorante.it"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Merchant Portal Password *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {/* 2. EU Merchant Banking & Settlement Rail */}
            <div className="bg-gradient-to-br from-orange-950/20 to-slate-900 border border-orange-500/30 p-4 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-orange-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏦</span>
                  <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                    2. EU Corporate Banking &amp; Payout Settlement
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  SEPA / VIES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Registered Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                    placeholder="Pizzeria Bella Napoli S.r.l."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">EU VAT / Tax ID (Partita IVA) *</label>
                  <input
                    type="text"
                    required
                    value={vatId}
                    onChange={e => setVatId(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-orange-500 transition"
                    placeholder="IT12345678901"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Corporate Bank IBAN (SEPA Direct) *</label>
                  <input
                    type="text"
                    required
                    value={iban}
                    onChange={e => setIban(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-orange-500 transition"
                    placeholder="IT60X0542811101000000123456"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">BIC / SWIFT *</label>
                  <input
                    type="text"
                    required
                    value={bic}
                    onChange={e => setBic(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-orange-500 transition"
                    placeholder="UNCRITM1XXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Operating Kitchen Address *</label>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={e => setBusinessAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                    placeholder="Via Toledo 42, 80134 Napoli"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">EU Country</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500 transition"
                  >
                    <option value="IT">Italy (IT)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="ES">Spain (ES)</option>
                    <option value="NL">Netherlands (NL)</option>
                    <option value="AT">Austria (AT)</option>
                    <option value="BE">Belgium (BE)</option>
                    <option value="PT">Portugal (PT)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Mandatory EU Banking & GDPR Consents */}
            <div className="space-y-3 bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bankingTermsConsent}
                  onChange={e => setBankingTermsConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>
                  <strong>SEPA &amp; PSD2 Escrow Mandate:</strong> I certify that I am the legal representative of this restaurant and authorize automated daily SEPA settlement (Directive 2015/2366/EU).
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={gdprConsent}
                  onChange={e => setGdprConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>
                  <strong>EU GDPR &amp; KYB Verification Consent:</strong> I consent to corporate identity and beneficial ownership verification under EU AMLD5 and GDPR Regulation 2016/679.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Registering Merchant on EU Banking Rail..." : "Register Restaurant & Proceed to KYB Verification →"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              Already an approved partner?{" "}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-bold underline">
                Merchant Login
              </Link>
            </span>
            <Link href="/register/courier" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              🚴 Looking to become a Courier instead?
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Restaurant Value Proposition */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center border-l border-slate-800 p-8">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="relative z-10 max-w-md p-8 backdrop-blur-md bg-slate-950/70 border border-orange-500/20 rounded-3xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">OENGO Kitchen KDS</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              95% Payout Share
            </span>
          </div>

          <h3 className="text-2xl font-black text-white leading-tight">
            Stop losing 30% to legacy delivery monopolies.
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">💶</span>
              <div>
                <h4 className="text-xs font-bold text-white">Flat 5% Protocol Fee</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Keep 95% of your menu revenue. Instant double-entry escrow split upon customer PIN confirmation.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">🖥️</span>
              <div>
                <h4 className="text-xs font-bold text-white">Real-Time Kitchen Display System (KDS)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Dedicated Kanban prep board, live ticket timers, and 1-click dish stock toggles.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">🏦</span>
              <div>
                <h4 className="text-xs font-bold text-white">Direct SEPA IBAN Settlement</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Regulated European payment rails with automated VAT invoicing and zero hidden fees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
