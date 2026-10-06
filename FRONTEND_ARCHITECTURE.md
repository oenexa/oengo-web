# 🎨 OENGO-WEB — Frontend Architecture & Engineering Guidelines
> **Repository Mandate: Pure Frontend Omnichannel UI (Customer, Merchant KDS, Rider & Admin)**  
> **Framework: Next.js 16 (App Router, Turbopack, Standalone SSR) • Styling: Tailwind CSS v4 • Icons: Lucide React**  
> **Strict Isolation Boundary: ZERO direct database connections, ZERO private secrets, ZERO backend ledger math**

---

## 1. Architectural Persona & Scope

`oengo-web` is the **Pure Frontend UI Application** for the OENGO ecosystem. It delivers responsive, frictionless user experiences across 4 distinct user roles:

1. 🍔 **Customer Storefront (`/`)**: Multi-restaurant discovery, menu customization, multi-rail checkout, and real-time live vector tracking.
2. 👨‍🍳 **Restaurant Partner Portal & Kitchen Display System (`/merchant`)**: Operating toggles, live menu catalog management, real-time ticket stream with audio chimes, and counter courier barcode station.
3. 🛵 **Delivery Partner Portal (`/rider`)**: Online/Offline status, proximity job acceptance, camera barcode scanner, and doorstep PIN verification.
4. 🛡️ **Enterprise Admin Dashboard (`/admin`)**: Merchant approvals, commission configuration (0%–30%), ledger dispute review, and platform analytics.

### Strict Boundary Rules
* **No Direct Database Access**: Never connect directly to PostgreSQL or Redis from this repository.
* **Pure API Client**: All mutations and queries must communicate with the backend API (`oengo-api`) via `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`).
* **Zero Secret Storage**: Never store private keys, payment gateway secret keys, or database credentials in client code.
* **Zero Client Financial Math**: Financial splits, ledger debits/credits, and commission calculations are computed exclusively by `oengo-api`. The UI only displays authorized backend results.

---

## 2. Directory Structure & Modular Component Design

The codebase strictly follows the **Feature-Driven Modular Architecture**:

```
oengo-web/
├── public/                         # Static assets, branding, audio chime sounds
├── src/
│   ├── app/                        # Next.js 16 App Router pages
│   │   ├── layout.tsx              # Root HTML, navigation shell, font providers
│   │   ├── page.tsx                # Customer storefront & tracking portal
│   │   ├── merchant/
│   │   │   └── page.tsx            # Restaurant management & Kitchen Display System
│   │   ├── rider/
│   │   │   └── page.tsx            # Delivery partner dispatch & scanner portal
│   │   └── admin/
│   │       └── page.tsx            # Platform oversight & commission controls
│   ├── components/                 # Atomic & compound UI components
│   │   ├── common/                 # Header, Footer, Modal, Button, Badge, LoadingSpinner
│   │   ├── cart/                   # Sticky cart drawer, quantity selectors, tip buttons
│   │   ├── checkout/               # Multi-rail payment modal (Card, Wallet, Web3 Crypto)
│   │   ├── map/                    # High-contrast vector map, courier marker, polyline
│   │   ├── kds/                    # Kitchen ticket cards, prep time ETA pills, audio chime
│   │   └── scanner/                # HTML5 camera barcode/QR scanner integration
│   ├── features/                   # Domain state & workflows
│   │   ├── cart/                   # Cart state management (items, modifiers, totals)
│   │   ├── orders/                 # Order placement, active order status polling / WS
│   │   ├── restaurants/            # Restaurant listings, category filters, search
│   │   └── wallet/                 # User wallet balance, coins, payment intents
│   ├── hooks/                      # Custom reusable React hooks
│   │   ├── useOrderTracking.ts     # Real-time order progress & courier telemetry
│   │   ├── useAudioChime.ts        # KDS incoming order sound player
│   │   └── useGeolocation.ts       # Browser GPS location hook
│   ├── services/                   # Typed HTTP API client
│   │   ├── apiClient.ts            # Fetch wrapper with error handling & base URL
│   │   ├── orderService.ts         # Orders, tracking, confirmation endpoints
│   │   ├── paymentService.ts       # Card intent creation & authorization
│   │   └── restaurantService.ts    # Merchant menu queries & stock toggles
│   └── types/                      # TypeScript domain models & DTO contracts
│       ├── order.ts
│       ├── payment.ts
│       └── restaurant.ts
├── Dockerfile                      # Standalone multi-stage Next.js production build
├── next.config.ts                  # Standalone output configuration
├── package.json
└── tsconfig.json
```

---

## 3. UI/UX Principles & Standards

### A. Frictionless Multi-Rail Checkout
* Supports 3 distinct payment options in a single modal:
  1. 💳 **Instant Credit / Debit Card**: Form with real-time brand detection (Visa, Mastercard, Amex), expiry formatting, CVV validation, and tokenized payment intents.
  2. 💶 **In-App Digital Wallet**: 1-click debit from user's preloaded fiat balance or accumulated cashback.
  3. ⚡ **Web3 Crypto (OEN)**: Non-custodial transaction signed with post-quantum ML-DSA-65 keys.

### B. High-Conversion Customer Storefront
* **Dynamic Geolocation**: Top bar allowing instant delivery address changes.
* **Cuisine Pills**: Fast filtering (`All Cuisines`, `🍕 Pizza`, `🍔 Burgers`, `🍣 Sushi`, `🥗 Healthy`).
* **Live Vector Map Tracking**: Dark theme vector route map displaying restaurant origin, moving courier pin, and customer destination with 5-stage progress stepper.
* **Doorstep Verification Box**: Clear display of the secret 4-digit PIN and pickup barcode token to prevent delivery theft.

### C. Kitchen Display System (KDS)
* High-contrast ticket cards with color-coded urgency states.
* Audio chime notifications on new tickets.
* 1-tap prep ETA selection (`10m`, `15m`, `25m`).
* Instant "In Stock / Sold Out" menu item toggles.

---

## 4. Instructions for Future AI Agents & Developers

1. **Maintain Pure Frontend Isolation**: Never place database drivers, server-side secret keys, or backend financial calculation logic in `oengo-web`.
2. **Mandatory Build Verification**:
   * Always run `npm run build` (`next build`) before any commit.
   * Zero TypeScript errors, zero ESLint warnings, and zero broken routes allowed.
   * Pushing failing code to `main` is strictly forbidden.
3. **Single Responsibility Principle (SRP)**:
   * Keep components focused on a single UI responsibility.
   * Do not write monolithic 1000-line components; decompose complex interfaces into clean sub-components under `src/components/` and `src/features/`.
4. **API Interaction Standards**:
   * All API calls must go through `src/services/apiClient.ts`.
   * Always handle network errors and offline states gracefully with visual user feedback.
