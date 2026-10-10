"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardPage from "@/components/portals/AdminPortal";
import MerchantPortalPage from "@/components/portals/MerchantPortal";
import RiderPortalPage from "@/components/portals/RiderPortal";
import CustomerPage from "@/app/page";

export default function DashboardHub() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("oengo_user_role");
    if (!userRole) {
      router.push("/login");
    } else {
      setRole(userRole);
    }
  }, [router]);

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold text-sm">Authenticating Secure Portal...</p>
      </div>
    );
  }

  // Unified Role-Based Routing (RP - Routing Pattern / Render Pattern)
  switch (role) {
    case "ADMIN":
      return <AdminDashboardPage />;
    case "RESTAURANT":
      return <MerchantPortalPage />;
    case "COURIER":
      return <RiderPortalPage />;
    case "CUSTOMER":
      router.push("/");
      return null;
    default:
      router.push("/login");
      return null;
  }
}
