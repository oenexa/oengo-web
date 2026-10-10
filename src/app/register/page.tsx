"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

type RoleOption = "CUSTOMER" | "RESTAURANT" | "COURIER";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleOption>("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(name, email, password, role);
      if (typeof window !== "undefined") {
        localStorage.setItem("oengo_user_id", data.user.id);
        localStorage.setItem("oengo_user_role", data.user.role);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-950">
      {/* Left Panel: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10 py-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              🍔
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              OEN<span className="text-orange-500">GO</span>
            </span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-white mt-6">Create your account</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Join the decentralized delivery revolution today.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Role Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">I want to...</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                    role === "CUSTOMER" 
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span className="text-2xl">🛒</span>
                  <span className="text-[10px] font-bold">Order Food</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("RESTAURANT")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                    role === "RESTAURANT" 
                      ? "bg-orange-500/10 border-orange-500/50 text-orange-400" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span className="text-2xl">👨‍🍳</span>
                  <span className="text-[10px] font-bold">Sell Food</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("COURIER")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                    role === "COURIER" 
                      ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span className="text-2xl">🚴</span>
                  <span className="text-[10px] font-bold">Deliver Food</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  placeholder="Alice Wonderland"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  placeholder="alice@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Sign Up Securely"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-bold underline decoration-orange-400/30 underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Value Prop Graphic */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center border-l border-slate-800">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="register-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#register-grid)" className="text-white" />
        </svg>

        <div className="relative z-10 max-w-md p-8 backdrop-blur-sm bg-slate-950/40 border border-slate-800/50 rounded-3xl shadow-2xl">
          <div className="flex gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight mb-4">
            Join the ecosystem today.
          </h3>
          <ul className="space-y-4 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <p className="text-sm text-slate-300"><strong>Customers:</strong> Pay 20% less with 0% markup guarantees.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 mt-0.5">✓</span>
              <p className="text-sm text-slate-300"><strong>Merchants:</strong> Keep 95% of your revenue. No hidden fees.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <p className="text-sm text-slate-300"><strong>Couriers:</strong> Earn 100% of your tips, paid instantly.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
