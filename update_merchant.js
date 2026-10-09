const fs = require('fs');
const file = 'src/app/merchant/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const RESTAURANT_ID = "user_restaurant";/g, 'const RESTAURANT_ID = typeof window !== "undefined" ? localStorage.getItem("oengo_user_id") || "user_restaurant" : "user_restaurant";');

fs.writeFileSync(file, code);
console.log('Updated merchant page successfully.');
