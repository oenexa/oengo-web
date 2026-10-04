import { OrderStatus } from "@/types";

interface OrderTrackingStepperProps {
  status: OrderStatus;
}

export function OrderTrackingStepper({ status }: OrderTrackingStepperProps) {
  const getProgressWidth = () => {
    switch (status) {
      case "AWAITING_RESTAURANT": return "20%";
      case "PREPARING": return "45%";
      case "READY_FOR_PICKUP": return "65%";
      case "IN_TRANSIT": return "85%";
      case "DELIVERED": return "100%";
      default: return "0%";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs font-bold mb-2">
        <span className={status !== "AWAITING_RESTAURANT" ? "text-emerald-400" : "text-orange-400"}>
          1. Order Placed 🔒
        </span>
        <span className={["PREPARING", "READY_FOR_PICKUP", "IN_TRANSIT", "DELIVERED"].includes(status) ? "text-emerald-400" : "text-slate-600"}>
          2. Cooking 👨‍🍳
        </span>
        <span className={["READY_FOR_PICKUP", "IN_TRANSIT", "DELIVERED"].includes(status) ? "text-emerald-400" : "text-slate-600"}>
          3. Packed 📦
        </span>
        <span className={["IN_TRANSIT", "DELIVERED"].includes(status) ? "text-emerald-400" : "text-slate-600"}>
          4. On the Way 🛵
        </span>
        <span className={status === "DELIVERED" ? "text-emerald-400" : "text-slate-600"}>
          5. Delivered 🎉
        </span>
      </div>

      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-orange-500 to-emerald-400 h-full transition-all duration-500"
          style={{ width: getProgressWidth() }}
        />
      </div>
    </div>
  );
}
