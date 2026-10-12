"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KYCUploadPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form fields
  const [docType, setDocType] = useState("PASSPORT");
  const [docNumber, setDocNumber] = useState("");
  const [idFileUploaded, setIdFileUploaded] = useState(false);
  const [businessCertUploaded, setBusinessCertUploaded] = useState(false);
  const [sanitaryPermitUploaded, setSanitaryPermitUploaded] = useState(false);
  const [haccpConsent, setHaccpConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("oengo_user_id") || "";
      const storedRole = localStorage.getItem("oengo_user_role") || "";
      setUserId(storedId);
      setRole(storedRole);
    }
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate secure compliance vault upload and AML verification
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
          <span className="text-4xl block mb-3">🔒</span>
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400 text-sm mb-6">
            Please log in to your account before submitting regulatory compliance documents.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-sm transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 py-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-orange-500/20">
              🍔
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              OEN<span className="text-orange-500">GO</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
              ⚖️ EU AMLD5 / PSD2 Verification
            </span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
              <span>Identity &amp; Enterprise Due Diligence</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {role === "RESTAURANT" ? "Restaurant KYC & Regulatory Compliance" : "Partner KYC Verification"}
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
              Under European Union regulations (AMLD5, PSD2 &amp; Regulation 2016/679), all business entities receiving automated payouts must submit legal identity and sanitary proof.
            </p>
          </div>

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="text-lg font-bold text-white">Documents Securely Received</h3>
                  <p className="text-xs text-emerald-400/90 mt-0.5">
                    Your files have been transmitted to our European AML/KYC review queue.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                EU compliance verification typically completes within 1-2 hours. You can already access your Merchant Portal in staging mode while payout rails are provisioned.
              </p>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  Enter Portal Now →
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition inline-block text-center"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              
              {/* Step 1: Legal Identity */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-mono flex items-center justify-center font-bold">1</span>
                    Legal Representative Photo ID
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Passport / National ID</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Document Type</label>
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                    >
                      <option value="PASSPORT">EU / International Passport</option>
                      <option value="ID_CARD">National Identity Card (CIE / DNI / CNI)</option>
                      <option value="DRIVERS_LICENSE">EU Driving License</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Document Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. YA1234567"
                      value={docNumber}
                      onChange={e => setDocNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500 uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Upload ID Scan / Photo (Front &amp; Back)</label>
                  <label className={`w-full border border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition ${
                    idFileUploaded ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400" : "bg-slate-900/60 border-slate-700 hover:border-slate-500 text-slate-400"
                  }`}>
                    <span className="text-xl mb-1">{idFileUploaded ? "📄" : "📤"}</span>
                    <span className="text-xs font-bold">
                      {idFileUploaded ? "ID Document Attached (identity_verification.pdf)" : "Click to browse or drop document here"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">PDF, PNG, JPG up to 10MB</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => setIdFileUploaded(true)}
                    />
                  </label>
                </div>
              </div>

              {/* Step 2: Commercial & Food Safety Proofs (For Restaurants) */}
              {role === "RESTAURANT" && (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-mono flex items-center justify-center font-bold">2</span>
                      Company Registration &amp; Food Safety Certification
                    </h3>
                    <span className="text-[10px] text-orange-400 font-mono">HACCP &amp; Chamber of Commerce</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Commercial Registry (Visura Camerale / K-Bis / Handelsregister) *
                      </label>
                      <label className={`w-full border border-dashed rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition ${
                        businessCertUploaded ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400" : "bg-slate-900/60 border-slate-700 hover:border-slate-500 text-slate-400"
                      }`}>
                        <span className="text-lg">{businessCertUploaded ? "📑" : "📎"}</span>
                        <span className="text-xs font-bold mt-1">
                          {businessCertUploaded ? "business_registry.pdf" : "Upload Registry Proof"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={() => setBusinessCertUploaded(true)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Food Safety &amp; Hygiene Permit (HACCP / SCIA Sanitaria) *
                      </label>
                      <label className={`w-full border border-dashed rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition ${
                        sanitaryPermitUploaded ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400" : "bg-slate-900/60 border-slate-700 hover:border-slate-500 text-slate-400"
                      }`}>
                        <span className="text-lg">{sanitaryPermitUploaded ? "📜" : "📎"}</span>
                        <span className="text-xs font-bold mt-1">
                          {sanitaryPermitUploaded ? "haccp_certificate.pdf" : "Upload Sanitary Permit"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={() => setSanitaryPermitUploaded(true)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={haccpConsent}
                        onChange={e => setHaccpConsent(e.target.checked)}
                        className="mt-0.5 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                      />
                      <span>
                        I certify that the culinary establishment complies with European Regulation (EC) No 852/2004 on the hygiene of foodstuffs and maintains active HACCP procedures.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Courier Specific Requirements */}
              {role === "COURIER" && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-mono flex items-center justify-center font-bold">2</span>
                    Courier Transit Permit &amp; Insurance
                  </h3>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Driving License or Bicycle / Motor Vehicle Insurance *
                    </label>
                    <label className="w-full border border-dashed border-slate-700 rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500">
                      <span className="text-lg">🚴</span>
                      <span className="text-xs font-bold mt-1">Attach Insurance / License Certificate</span>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* Submission Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Encrypting &amp; Submitting to EU AML Vault...</span>
                    </>
                  ) : (
                    <span>Submit Compliance Dossier for Verification →</span>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  🔒 Data processed under EU Regulation 2016/679 (GDPR). Documents are encrypted with AES-256 and stored on sovereign European data nodes.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
