import { OrderData } from "@/types";
import { OrderTrackingStepper } from "./OrderTrackingStepper";
import { LiveVectorMap } from "./LiveVectorMap";
import { DoorstepCredentials } from "./DoorstepCredentials";
import { LifecycleSimulator } from "./LifecycleSimulator";

interface ActiveOrderTrackingViewProps {
  order: OrderData;
  loading: boolean;
  onRestaurantAccept: () => void;
  onCourierPickup: () => void;
  onConfirmDelivery: () => void;
  onResetOrder: () => void;
}

export function ActiveOrderTrackingView({
  order,
  loading,
  onRestaurantAccept,
  onCourierPickup,
  onConfirmDelivery,
  onResetOrder
}: ActiveOrderTrackingViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {/* Top Header of Active Order */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono text-slate-500">Order ID: {order.id}</span>
            <h2 className="text-2xl font-black text-white mt-0.5">Live Delivery Tracking</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 font-mono flex items-center gap-1.5 border border-slate-800">
                {order.paymentMethod === "CREDIT_CARD" ? (
                  <>
                    <span>💳</span>
                    <span>
                      Instant Card:{" "}
                      <strong className="text-white">
                        {order.cardPayment?.brand || "Visa"} •••• {order.cardPayment?.last4 || "4242"}
                      </strong>
                    </span>
                    <span className="text-emerald-400 font-semibold text-[10px] ml-1 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/80">
                      ESCROW LOCKED
                    </span>
                  </>
                ) : order.paymentMethod === "DIGITAL_WALLET" ? (
                  <>
                    <span>👛</span>
                    <span>Digital Wallet (Fiat Escrow Locked)</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Web3 OENEXA L1 (WASM Escrow Locked)</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider text-emerald-400 border border-slate-700">
              {order.status}
            </span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <OrderTrackingStepper status={order.status} />

        {/* Live Vector Graphic Map */}
        <LiveVectorMap status={order.status} />

        {/* Doorstep Handover Credentials Box */}
        <DoorstepCredentials
          pickupBarcode={order.pickupBarcode}
          deliveryPin={order.deliveryPin}
        />

        {/* Interactive Simulation Controls */}
        <LifecycleSimulator
          status={order.status}
          loading={loading}
          onRestaurantAccept={onRestaurantAccept}
          onCourierPickup={onCourierPickup}
          onConfirmDelivery={onConfirmDelivery}
          onResetOrder={onResetOrder}
        />
      </div>
    </div>
  );
}
