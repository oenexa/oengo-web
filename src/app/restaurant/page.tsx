"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MerchantPortalPage from "@/components/portals/MerchantPortal";

export default function RestaurantDashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("oengo_user_role");
      if (!userRole) {
        router.push("/login");
      } else if (userRole !== "RESTAURANT" && userRole !== "ADMIN") {
        router.push("/dashboard");
      } else {
        setRole(userRole);
      }
    }
  }, [router]);

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold text-sm">Loading Kitchen Display System (KDS)...</p>
      </div>
    );
  }

  return <MerchantPortalPage />;
}
