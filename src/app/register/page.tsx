"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "CUSTOMER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to register");
      }

      const data = await res.json();
      localStorage.setItem("oengo_user_id", data.user.id);
      localStorage.setItem("oengo_user_role", data.user.role);
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Create an Account</h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input 
          type="text" 
          placeholder="Name" 
          required 
          value={form.name} 
          onChange={e => setForm({ ...form, name: e.target.value })} 
          style={{ padding: "0.5rem" }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={form.email} 
          onChange={e => setForm({ ...form, email: e.target.value })} 
          style={{ padding: "0.5rem" }}
        />
        <input 
          type="text" 
          placeholder="Phone" 
          required 
          value={form.phone} 
          onChange={e => setForm({ ...form, phone: e.target.value })} 
          style={{ padding: "0.5rem" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={form.password} 
          onChange={e => setForm({ ...form, password: e.target.value })} 
          style={{ padding: "0.5rem" }}
        />
        <select 
          value={form.role} 
          onChange={e => setForm({ ...form, role: e.target.value })}
          style={{ padding: "0.5rem" }}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="RESTAURANT">Restaurant Partner</option>
          <option value="COURIER">Delivery Rider</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: "0.5rem", background: "#f97316", color: "white", border: "none", borderRadius: "4px" }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
        Already have an account? <a href="/login" style={{ color: "#f97316" }}>Login</a>
      </p>
    </div>
  );
}
