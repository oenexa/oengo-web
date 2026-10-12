"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RiderPortalPage from "@/components/portals/RiderPortal";

export default function CourierDashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("oengo_user_role");
      if (!userRole) {
        router.push("/login");
      } else if (userRole !== "COURIER" && userRole !== "ADMIN") {
        router.push("/dashboard");
      } else {
        setRole(userRole);
      }
    }
  }, [router]);

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold text-sm">Connecting to Dispatch Radar...</p>
      </div>
    );
  }

  return <RiderPortalPage />;
}
