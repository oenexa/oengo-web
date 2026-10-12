"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export default function CourierRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleType, setVehicleType] = useState<"EBIKE" | "SCOOTER" | "EV_CAR">("EBIKE");
  const [cityZone, setCityZone] = useState("Milano / Napoli Center");
  const [country, setCountry] = useState("IT");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [courierSafetyConsent, setCourierSafetyConsent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!gdprConsent || !courierSafetyConsent) {
      setError("Please accept both EU GDPR and Courier Fleet Safety & Payout terms.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: "COURIER",
        businessName: `${vehicleType} Rider (${cityZone})`,
        businessAddress: cityZone,
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
      setError(err.message || "Courier registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-950">
      {/* Left Panel: Courier Fleet Onboarding Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10 py-12 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto space-y-6">
          
          {/* Top Navigation & Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                🚴
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                OEN<span className="text-cyan-400">GO</span>{" "}
                <span className="text-xs font-bold text-cyan-400">FLEET</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold mb-2">
              <span>🇪🇺 EU Logistics &amp; Instant Rider Settlement</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Ride with OENGO</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Earn 100% of delivery fees and customer tips with instant EUR &amp; OEN wallet payouts after every drop-off.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* 1. Vehicle Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Select Your Delivery Vehicle</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setVehicleType("EBIKE")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    vehicleType === "EBIKE"
                      ? "bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-2xl">🚲</span>
                  <span className="text-xs font-bold">E-Bike / Cycle</span>
                  <span className="text-[10px] text-emerald-400">Zero Emission Bonus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType("SCOOTER")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    vehicleType === "SCOOTER"
                      ? "bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-2xl">🛵</span>
                  <span className="text-xs font-bold">Scooter / Moto</span>
                  <span className="text-[10px] text-slate-500">Fast Urban Range</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType("EV_CAR")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    vehicleType === "EV_CAR"
                      ? "bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-2xl">🚗</span>
                  <span className="text-xs font-bold">Electric Car</span>
                  <span className="text-[10px] text-slate-500">Large Batch Orders</span>
                </button>
              </div>
            </div>

            {/* 2. Rider Personal & Dispatch Details */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>2. Rider Identity &amp; Zone</span>
                <span className="text-[10px] text-cyan-400">GPS Dispatch Ready</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition"
                    placeholder="Luca Bianchi"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Mobile Phone (SMS Dispatch) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition"
                    placeholder="+39 340 9876543"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Operating City / Zone *</label>
                  <input
                    type="text"
                    required
                    value={cityZone}
                    onChange={e => setCityZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition"
                    placeholder="Napoli Centro / Milano Navigli"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">EU Country</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="IT">Italy (IT)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="ES">Spain (ES)</option>
                    <option value="NL">Netherlands (NL)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition"
                    placeholder="rider@oengo.eu"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Password (min 8 chars) *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {/* 3. Mandatory Consents */}
            <div className="space-y-3 bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={courierSafetyConsent}
                  onChange={e => setCourierSafetyConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>
                  <strong>EU Platform Work &amp; Safety Charter:</strong> I hold a valid EU right-to-work permit, road safety insurance, and thermal food-grade delivery bag.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={gdprConsent}
                  onChange={e => setGdprConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>
                  <strong>EU GDPR &amp; KYC Identity Consent:</strong> I consent to identity verification and encrypted GPS telemetry during active delivery dispatches.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Courier Account..." : "Register as Courier & Verify Identity →"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              Already an active courier?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold underline">
                Rider Login
              </Link>
            </span>
            <Link href="/register/restaurant" className="text-orange-400 hover:text-orange-300 font-semibold">
              👨‍🍳 Registering a Restaurant instead?
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Courier Fleet Highlights */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center border-l border-slate-800 p-8">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="relative z-10 max-w-md p-8 backdrop-blur-md bg-slate-950/70 border border-cyan-500/20 rounded-3xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">OENGO Dispatch Radar</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              Instant Payout
            </span>
          </div>

          <h3 className="text-2xl font-black text-white leading-tight">
            Built for independent couriers. Instant settlement per drop.
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="text-xs font-bold text-white">Zero Waiting for Weekly Paychecks</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">The moment you enter the customer&apos;s 4-digit delivery PIN, your fee + 100% of tips settle straight into your wallet.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">📡</span>
              <div>
                <h4 className="text-xs font-bold text-white">Smart Barcode &amp; PIN Handshake</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Cryptographic package verification eliminates disputes and protects riders from false non-delivery claims.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">🌱</span>
              <div>
                <h4 className="text-xs font-bold text-white">Green Fleet OEN Rewards</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Earn bonus OEN governance tokens when completing deliveries on E-Bikes or zero-emission EVs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
