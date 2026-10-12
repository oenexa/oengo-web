"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      if (typeof window !== "undefined") {
        localStorage.setItem("oengo_user_id", data.user.id);
        localStorage.setItem("oengo_user_role", data.user.role);
        
        // If restaurant or courier account has pending KYC, prompt them to complete verification
        if ((data.user.role === "RESTAURANT" || data.user.role === "COURIER") && data.user.kycStatus === "PENDING") {
          router.push("/kyc");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-950">
      {/* Left Panel: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10 py-12">
        <div className="w-full max-w-sm mx-auto space-y-7">
          
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              🍔
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              OEN<span className="text-orange-500">GO</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
              🇪🇺 Banking Auth
            </span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-white mt-4">Welcome back</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Log in to your secure OENGO banking &amp; delivery portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                <span className="text-[11px] text-slate-500 hover:text-slate-400 cursor-pointer">Forgot?</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-sm"
                placeholder="••••••••••••"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PSD2 Strong Customer Authentication (SCA)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">256-bit TLS</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {loading ? "Verifying Credentials..." : "Sign In to Portal →"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 pt-2">
            Don't have an enterprise or customer account?{" "}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-bold underline decoration-orange-400/30 underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Value Prop Graphic */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center border-l border-slate-800 p-8">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 max-w-md p-8 backdrop-blur-md bg-slate-950/60 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              🇪🇺 EU Single Market
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white leading-tight">
              Banking-Grade Merchant Portal
            </h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Real-world delivery network engineered to comply with European financial regulatory frameworks.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">💳</span>
              <div>
                <h4 className="text-xs font-bold text-white">Direct SEPA Escrow Settlement</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated daily ledger payouts to merchant IBANs with 0% hidden intermediary markups.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <span className="text-xl">📋</span>
              <div>
                <h4 className="text-xs font-bold text-white">Full Regulatory KYC &amp; AMLD5</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Verified restaurant ownership and legal business registration safeguards the ecosystem against fraud.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Security Rating</span>
            <span className="font-mono text-emerald-400 font-bold">A+ PCI-DSS Level 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
