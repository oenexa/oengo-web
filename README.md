# 🍔 OENGO-WEB — Enterprise Frontend UI Portal

The official, pure frontend web application for the **OENGO** on-demand delivery ecosystem, built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.

---

## 🏛️ Architecture & Separation of Concerns

* **Pure Frontend Mandate**: Omnichannel UI for Customers, Restaurant Merchants, Couriers, and Administrators. Zero direct database queries or private financial key operations.
* **Backend Companion**: Connects to the backend REST & WebSocket API at [`oengo-api`](../oengo-api) via `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`).

For in-depth architectural patterns, directory standards, and developer instructions, see **[FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)**.

---

## 📱 Portals & Routes

1. **Customer Marketplace (`/`)**: Multi-restaurant discovery, dish modifier customization, sticky cart, tri-rail checkout (Card, Digital Wallet, Web3 Crypto), and live vector map order tracking with doorstep PIN verification.
2. **Kitchen Display System (`/merchant`)**: Operational controls (Open/Closed), live menu catalog manager (In Stock / Sold Out toggle), real-time ticket queue with audio chimes, and courier counter pickup barcode station.
3. **Delivery Partner Hub (`/rider`)**: Online/Offline toggle, proximity dispatch acceptance, camera barcode scanner, and doorstep PIN completion.
4. **Platform Administration (`/admin`)**: Merchant approvals, commission overrides (0%–30%), and transaction dispute overview.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 24.21.0+ (LTS)
- Running instance of `oengo-api` on port 3001

### Local Development
```bash
# Install dependencies
npm install

# Run frontend development server (Port 3000)
npm run dev

# Verify production build & TypeScript validation
npm run build
```
