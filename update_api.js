const fs = require('fs');
const file = 'src/lib/api.ts';
let code = fs.readFileSync(file, 'utf8');

const helper = `
// ── Authentication & Auth State ─────────────────────────────────────────────
export function getActiveUserId(fallback: string): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("oengo_user_id") || fallback;
  }
  return fallback;
}
`;

code = code.replace(/import { API_BASE_URL } from "\.\/constants";/, "import { API_BASE_URL } from \"./constants\";\n" + helper);
code = code.replace(/userId = "user_customer"/g, 'userId = getActiveUserId("user_customer")');
code = code.replace(/buyerId: payload\.buyerId \|\| "user_customer"/g, 'buyerId: payload.buyerId || getActiveUserId("user_customer")');
code = code.replace(/restaurantId = "user_restaurant"/g, 'restaurantId = getActiveUserId("user_restaurant")');
code = code.replace(/courierId = "user_courier"/g, 'courierId = getActiveUserId("user_courier")');
code = code.replace(/riderId = "user_courier"/g, 'riderId = getActiveUserId("user_courier")');

fs.writeFileSync(file, code);
console.log('Updated api.ts successfully.');
