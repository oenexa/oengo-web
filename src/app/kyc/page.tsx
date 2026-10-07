"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KYCUploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("oengo_user_id") || "");
    setRole(localStorage.getItem("oengo_user_role") || "");
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate upload delay
    setTimeout(() => {
      setMessage("KYC documents uploaded successfully! Pending Admin approval.");
      setLoading(false);
    }, 1500);
  };

  if (!userId) {
    return <div style={{ padding: "2rem" }}>Please login first.</div>;
  }

  if (role !== "RESTAURANT" && role !== "COURIER") {
    return <div style={{ padding: "2rem" }}>KYC is only required for Restaurants and Couriers.</div>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "4rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Submit KYC Documents</h2>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Please upload your identification and business documents to get verified on OENGO.
      </p>
      
      {message && <div style={{ color: "green", marginBottom: "1rem", padding: "1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "4px" }}>{message}</div>}
      
      <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Government ID (Passport/ID Card)</label>
          <input type="file" required style={{ width: "100%" }} />
        </div>
        
        {role === "RESTAURANT" && (
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Business Registration Certificate</label>
            <input type="file" required style={{ width: "100%" }} />
          </div>
        )}

        {role === "COURIER" && (
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Driving License / Vehicle Registration</label>
            <input type="file" required style={{ width: "100%" }} />
          </div>
        )}

        <button type="submit" disabled={loading} style={{ padding: "0.75rem", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", marginTop: "1rem", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Uploading..." : "Submit Documents"}
        </button>
      </form>
    </div>
  );
}
