# Oengo Web Storefront Developer & AI Agent Strict Enforcement Policy 🛡️

> **MANDATORY POLICY FOR ALL HUMAN DEVELOPERS AND AI AGENTS (Antigravity, Cursor, Copilot, Claude, etc.)**  
> **EFFECTIVE DATE: IMMEDIATE — ZERO TOLERANCE FOR UNVERIFIED CODE**

This document defines the non-negotiable rules and quality gates for contributing to **`oengo-web`**. Every developer and AI assistant operating in this codebase is strictly bound by these rules.

---

## 1. The Zero-Bug & 100% Verification Mandate

1. **No Code Without Verification**: Code must be cleanly styled, defensively written, and verified locally before submission.
2. **100% Build & Type Passing Rate**:
   - Zero Next.js / TypeScript compilation errors.
   - Zero build warnings.
   - All shopping cart, order creation, and payment components must handle loading states, wallet rejections, and network errors gracefully.
3. **Production Build Readiness**:
   - The production build (`npm run build`) must pass without errors and generate optimized static/serverless routes.

---

## 2. Mandatory Security & Web3 Wallet Safety

Before modifying or adding code that interacts with user wallets or the `oengo-api` gateway:

1. **Transaction Confirmation**: Users must always receive an explicit summary and confirmation prompt before a transaction payload is submitted for wallet signing.
2. **Client-Side Secret Isolation**: Never store or hardcode private keys, mnemonic phrases, or administrative passwords in the client application.
3. **XSS & Injection Sanitization**: Sanitize all merchant data, food titles, prices, and transaction hashes before displaying them in the UI.

---

## 3. Strict Main Branch Gate (Pre-Push Enforcement)

**NO CODE MAY BE PUSHED TO THE `main` BRANCH WITHOUT PASSING THE VERIFICATION CHECKLIST:**

### Pre-Push Verification Commands:
```bash
# Must pass with 0 errors and compile all routes cleanly
npm run build
```

**AI Agent Rule**: If you are an AI assistant executing commands or proposing commits, you **MUST** run `npm run build` and verify a `0` exit code before executing `git push origin main`. Pushing failing code or skipping tests is a critical protocol violation.
