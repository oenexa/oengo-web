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
        router.push("/dashboard");
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
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="w-full max-w-sm mx-auto space-y-8">
          
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
            <h2 className="text-3xl font-bold text-white mt-6">Welcome back</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Log in to your account to continue your decentralized journey.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to Oengo"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-bold underline decoration-orange-400/30 underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Value Prop Graphic */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center border-l border-slate-800">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        {/* Pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-grid)" className="text-white" />
        </svg>

        <div className="relative z-10 max-w-md p-8 backdrop-blur-sm bg-slate-950/40 border border-slate-800/50 rounded-3xl shadow-2xl">
          <div className="flex gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight mb-4">
            Fairness baked into the code.
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Oengo replaces greedy middlemen with immutable smart contracts. Restaurants keep 95% of revenue. Riders earn fair tips. Customers pay less.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs">👨‍🍳</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs">🚴</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs">🛒</div>
            </div>
            <span className="text-xs font-bold text-slate-300">Join 10,000+ local users</span>
          </div>
        </div>
      </div>
    </div>
  );
}
