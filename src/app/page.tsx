"use client";

import { useState } from "react";

export default function Home() {
  const [orderStatus, setOrderStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleBuy = async () => {
    try {
      setOrderStatus("Creating Order...");

      // 1. Off-chain: create order in backend
      const createRes = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: "0x123Buyer",
          seller: "0x456Seller",
          amount: 1000,
        }),
      });
      const orderData = await createRes.json();

      setOrderStatus("Simulating User Wallet Signature...");

      // 2. Simulate User signing the transaction in wallet
      const mockSignedTx = "0x0000mock_signed_tx_hex_string_from_wallet";

      setOrderStatus("Broadcasting to OENEXA Layer-1...");

      // 3. Gateway: Broadcast via off-chain proxy
      const broadcastRes = await fetch("http://localhost:3001/api/rpc/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedTxHex: mockSignedTx,
        }),
      });

      const txData = await broadcastRes.json();
      if (txData.result && txData.result.tx_hash) {
        setTxHash(txData.result.tx_hash);
        setOrderStatus(`Order Paid! OENEXA Hash: ${txData.result.tx_hash}`);
      } else {
        setOrderStatus("Failed to broadcast transaction");
      }
    } catch (err) {
      console.error(err);
      setOrderStatus("Error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-orange-400 mb-4">Oengo Food Delivery</h1>
        <p className="text-xl text-gray-300">Fast, secure, and decentralized food delivery powered by OENEXA Layer-1</p>
      </header>

      <main className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Gourmet Burger & Fries</h2>
          <p className="text-orange-300 text-xl font-mono">1,000 OEN</p>
        </div>

        <button
          onClick={handleBuy}
          className="w-full bg-orange-500 hover:bg-orange-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-orange-500/50"
        >
          Pay with OENEXA Wallet
        </button>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center space-y-4">
          <p className="text-gray-400 font-medium h-6">{orderStatus}</p>
          {txHash && (
            <div className="bg-gray-900 p-4 rounded-lg break-all">
              <span className="block text-xs text-gray-500 mb-1">Transaction Hash:</span>
              <code className="text-cyan-400 text-sm">{txHash}</code>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
