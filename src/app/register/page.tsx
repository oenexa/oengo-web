"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, oauthLogin } from "@/lib/api";

export default function CustomerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSocialAuth = async (provider: "GOOGLE" | "PASSKEY" | "WEB3") => {
    setError("");
    setSocialLoading(provider);

    try {
      const mockName = name || (provider === "GOOGLE" ? "Google Customer" : provider === "PASSKEY" ? "Biometric User" : "Web3 Customer");
      const mockEmail = email && email.includes("@") ? email : `customer.${Date.now().toString(36)}@${provider === "GOOGLE" ? "gmail.com" : "oengo.eu"}`;

      const data = await oauthLogin(mockName, mockEmail, provider);
      if (typeof window !== "undefined") {
        localStorage.setItem("oengo_user_id", data.user.id);
        localStorage.setItem("oengo_user_role", data.user.role);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || `Failed to sign up with ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!gdprConsent) {
      setError("EU GDPR compliance consent is required to create your account.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: "CUSTOMER",
        country: "IT",
        gdprConsent: true,
      };

      const data = await registerUser(payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("oengo_user_id", data.user.id);
        localStorage.setItem("oengo_user_role", data.user.role);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Customer registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-950">
      {/* Left Panel: Pure Customer Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10 py-12 overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              🍔
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              OEN<span className="text-orange-500">GO</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
              🛒 Customer Account
            </span>
          </Link>

          <div>
            <h2 className="text-3xl font-extrabold text-white mt-2">Create your account</h2>
            <p className="text-slate-400 mt-1 text-xs leading-relaxed">
              Order from authentic local kitchens with instant 1-click Google or Passkey signup.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* 1-Click Instant Customer Registration */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Instant 1-Click Signup</span>
              <span className="text-[10px] text-emerald-400 font-semibold">No Password Needed</span>
            </div>

            <button
              type="button"
              disabled={!!socialLoading || loading}
              onClick={() => handleSocialAuth("GOOGLE")}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-3 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{socialLoading === "GOOGLE" ? "Connecting to Google..." : "Sign up with Google / Gmail"}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!!socialLoading || loading}
                onClick={() => handleSocialAuth("PASSKEY")}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <span>🔑</span>
                <span>Passkey</span>
              </button>

              <button
                type="button"
                disabled={!!socialLoading || loading}
                onClick={() => handleSocialAuth("WEB3")}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <span>🦊</span>
                <span>Web3 Wallet</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Or Sign Up With Email
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                placeholder="Sofia Conti"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                  placeholder="sofia@gmail.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 transition"
                  placeholder="+39 333 1234567"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Password (min 8 chars) *</label>
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

            <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={gdprConsent}
                  onChange={e => setGdprConsent(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>
                  I agree to the processing of my personal data in compliance with <strong>EU GDPR Regulation 2016/679</strong>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Customer Account →"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-bold underline">
              Sign in here
            </Link>
          </p>

          {/* Dedicated Partner & Courier Onboarding Portals */}
          <div className="pt-5 border-t border-slate-900 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
              Business &amp; Fleet Portals (Separate Registration)
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/register/restaurant"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-orange-950/30 border border-slate-800 hover:border-orange-500/40 flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-orange-300 transition"
              >
                <span>👨‍🍳</span>
                <span>Restaurant Partner</span>
              </Link>
              <Link
                href="/register/courier"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-cyan-300 transition"
              >
                <span>🚴</span>
                <span>Become a Courier</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Customer Experience Highlights */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center border-l border-slate-800 p-8">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/15 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-orange-600/15 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 max-w-md p-8 backdrop-blur-md bg-slate-950/60 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">OENGO Consumer</span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              Tier 0 Instant Access
            </span>
          </div>

          <h3 className="text-2xl font-black text-white leading-tight">
            Fair food delivery that supports local chefs &amp; riders.
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">🍕</span>
              <div>
                <h4 className="text-xs font-bold text-white">Direct Restaurant Pricing</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">No inflated menu markups—restaurants keep 95% of your order total.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">🪙</span>
              <div>
                <h4 className="text-xs font-bold text-white">OEN Cashback &amp; Multi-Currency Wallet</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Pay seamlessly with EUR Card, Apple/Google Pay, or unlock OEN Crypto rewards when you verify your wallet.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">🔐</span>
              <div>
                <h4 className="text-xs font-bold text-white">PIN-Protected Handshake</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Your payment stays safely in escrow until your food arrives and you share your 4-digit delivery PIN.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
